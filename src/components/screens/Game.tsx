"use client";

import Image from "next/image";
import { useEffect, useState, useCallback, useRef } from "react";
import { useUser } from "@/context/UserContext";
import { useSound } from "@/context/SoundContext";
import PopupOverlay from "@/components/common/PopupOverlay";
import PopupMatchOver from "@/components/popups/PopupMatchOver";
import { api, usdtToNum, formatUsdt, BoardCell, Match, MatchResponse, MoveResponse, MeResponse } from "@/lib/api";

const HOW_TO_PLAY_URL =
  "https://www.notion.so/StarFlip-How-to-Play-36e95daac839807aab01ccbc1bc3d8a5?pvs=28";

type CellStatus = "closed" | 1 | 2 | 3 | 4;

interface Cell {
  id: number;
  status: CellStatus;
  value: number;
}

interface GameProps {
  currentTurn: string;
  initialTurnStartedAt?: number; // Unix ms from backend
  playerName: string;
  opponentName: string;
  initialCells?: Cell[];
  onPlayAgain?: () => void;
  onExit?: () => void;      // close match-over → return to StartPage
  matchId?: string;
  myPlayerId?: string;
}

const ASTRA_COMMENTS = [
  "text11.png",
  "text12.png",
  "text13.png",
  "text14.png",
  "text15.png",
  "text16.png",
  "text17.png",
  "text18.png",
  "text19.png",
  "text20.png",
];

// Layout constants — all in cqw (container query width) or svh
const SCALE_FACTOR = 0.95;
const CELL_PCT = 20.15 * SCALE_FACTOR;
const GAP_X_PCT = 3.48 * SCALE_FACTOR;
const GAP_Y_PCT = 0.8 * SCALE_FACTOR;
const BOXES_TOP_PCT = 17.04;

const ASTRA_H = "clamp(120px, 45svh, 700px)";
const ASTRA_W = "clamp(80px, 35.7svh, 452px)";
const ASTRA_R = "clamp(-150px, -25.68vw, -50px)";

const CHEST_W = "clamp(150px, 66vw, 305px)";
const CHEST_H = "clamp(162px, 60.9vw, 328px)";
const CHEST_L = "clamp(-40px, -15.98vw, -120px)";

const AFK_TIMEOUT_MS = 5 * 60 * 1000; // must match backend afk.service.ts

function getTimeLeft(turnStartedAt: number): number {
  return Math.max(0, Math.round((AFK_TIMEOUT_MS - (Date.now() - turnStartedAt)) / 1000));
}

function GameTimer({ turnStartedAt }: { turnStartedAt: number }) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(turnStartedAt));

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(getTimeLeft(turnStartedAt)), 1000);
    return () => clearInterval(interval);
  }, [turnStartedAt]);

  const m = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const s = String(timeLeft % 60).padStart(2, "0");
  const isUrgent = timeLeft <= 60;

  return (
    <span
      style={{
        fontFamily: "'Tektur', sans-serif",
        fontSize: "clamp(14px, 4vw, 20px)",
        fontVariationSettings: "'wdth' 100",
        fontWeight: 500,
        color: isUrgent ? "#ff5100" : "#00e3b9",
        lineHeight: 1,
        textShadow: isUrgent
          ? "0px 0px 13px rgba(255, 81, 0, 0.6)"
          : "0px 0px 13px rgba(0, 255, 179, 0.57)",
      }}
    >
      {m}:{s}
    </span>
  );
}

export default function Game({
  currentTurn,
  initialTurnStartedAt,
  playerName,
  opponentName,
  initialCells,
  onPlayAgain,
  onExit,
  matchId,
  myPlayerId,
}: GameProps) {
  const { user, setUser } = useUser();
  // Stable ref prevents fetchResult closure from capturing a stale user
  const userRef = useRef(user);
  useEffect(() => { userRef.current = user; }, [user]);
  const resultFetchedRef = useRef(false);
  const { isMuted, toggleMute, playCellSound, playWinSound } = useSound();
  const effectiveMyPlayerId = myPlayerId || user.accId;

  const [currentTurnState, setCurrentTurnState] = useState(currentTurn);
  const [turnStartedAt, setTurnStartedAt] = useState<number>(
    () => initialTurnStartedAt ?? Date.now(),
  );
  const isMyTurn = matchId
    ? currentTurnState === effectiveMyPlayerId
    : currentTurnState === playerName;

  const headerRef = useRef<HTMLDivElement>(null);
  const [gameTop, setGameTop] = useState(0);
  const [gameH, setGameH] = useState(0);
  const [scoresTop, setScoresTop] = useState(0);

  useEffect(() => {
    const calc = () => {
      const vw = Math.min(window.innerWidth, 505);
      const vh = window.innerHeight;
      const pt = Math.min(Math.max(16, vh * 0.04), 32);
      const pb = Math.min(Math.max(8, vh * 0.015), 14);
      const hH = Math.min(Math.max(38, vh * 0.0526), 46);
      const headerBottom = pt + hH + pb;
      const turnH = 28;
      const turnMb = Math.min(Math.max(4, vh * 0.01), 10);
      const turnBottom = headerBottom + turnH + turnMb;
      const gH = vw * (496 / 402);
      setGameTop(turnBottom);
      setGameH(gH);
      const scoresMt = Math.min(Math.max(8, vh * 0.015), 16);
      setScoresTop(turnBottom + gH + scoresMt);
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  const [cells, setCells] = useState<Cell[]>(
    () =>
      initialCells ??
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        status: "closed" as CellStatus,
        value: Math.floor(Math.random() * 8) + 1,
      })),
  );

  const [myTotal, setMyTotal] = useState(0);
  const [opponentTotal, setOpponentTotal] = useState(0);
  const [showMatchOver, setShowMatchOver] = useState(false);
  const [matchResultData, setMatchResultData] = useState<{
    result: string;
    profit: string;
    points: string;
    title: string;
  } | null>(null);

  const [youGot, setYouGot] = useState<{
    visible: boolean;
    amount: number;
    commentFile: string;
  }>({ visible: false, amount: 0, commentFile: "" });

  // Visual variant assigned once per cell so it doesn't change on re-render
  const cellVariantsRef = useRef<Map<number, 1 | 2 | 3 | 4>>(new Map());

  const fmtUsdt = (n: number) => `${formatUsdt(n)} USDT`;

  const fmtCell = (n: number): string => {
    return formatUsdt(n);
  };

  const updateFromBoard = useCallback(
    (board: BoardCell[], myPid: string) => {
      const newCells = board.map((bc) => {
        if (bc.openedBy === null) {
          return { id: bc.id, status: "closed" as CellStatus, value: usdtToNum(bc.value) };
        }
        if (!cellVariantsRef.current.has(bc.id)) {
          const isMe = bc.openedBy === myPid;
          const variant = isMe
            ? ((bc.id % 2 === 0 ? 1 : 2) as 1 | 2)
            : ((bc.id % 2 === 0 ? 3 : 4) as 3 | 4);
          cellVariantsRef.current.set(bc.id, variant);
        }
        return {
          id: bc.id,
          status: cellVariantsRef.current.get(bc.id)!,
          value: usdtToNum(bc.value),
        };
      });
      setCells(newCells);
      const myTot = board
        .filter((bc) => bc.openedBy === myPid)
        .reduce((sum, bc) => sum + usdtToNum(bc.value), 0);
      const oppTot = board
        .filter((bc) => bc.openedBy !== null && bc.openedBy !== myPid)
        .reduce((sum, bc) => sum + usdtToNum(bc.value), 0);
      setMyTotal(myTot);
      setOpponentTotal(oppTot);
    },
    [],
  );

  const fetchResult = useCallback(
    async (mId: string, myPid: string) => {
      if (resultFetchedRef.current) return;
      resultFetchedRef.current = true;
      try {
        const data = await api.get<{ token: string; match: Match }>(
          `/game/result/${mId}`,
        );
        const board = data.match.board;
        updateFromBoard(board, myPid);
        const myTot = board
          .filter((bc) => bc.openedBy === myPid)
          .reduce((sum, bc) => sum + usdtToNum(bc.value), 0);
        const bid = usdtToNum(data.match.bid);
        const profitAbs = myTot - bid;
        const isProfitable = profitAbs > 0;
        const profitPct = bid > 0
          ? Math.round(((profitAbs / bid) * 100) * 10) / 10
          : 0;
        const profitPctText = Math.abs(profitPct)
          .toFixed(1)
          .replace(/\.0$/, "")
          .replace(".", ",");
        const profitStr = profitPct > 0
          ? `+ ${profitPctText} %`
          : profitPct < 0
            ? `- ${profitPctText} %`
            : "0 %";

        try {
          const prevPts = parseInt(userRef.current.pts) || 0;
          const me = await api.get<MeResponse>("/game/me");
          const newPts = me.player.points;
          const ptsDiff = newPts - prevPts;
          const ptsStr = ptsDiff >= 0 ? `+ ${ptsDiff} PTS` : `${ptsDiff} PTS`;
          setUser({
            ...userRef.current,
            usdtBalance: `${formatUsdt(me.player.balance)} USDT`,
            pts: `${newPts} PTS`,
          });
          setMatchResultData({
            result: fmtUsdt(myTot),
            profit: profitStr,
            points: ptsStr,
            title: isProfitable ? "You Won!" : "Nice try!",
          });
        } catch {
          // /game/me failed — fall back to static point estimates
          setMatchResultData({
            result: fmtUsdt(myTot),
            profit: profitStr,
            points: isProfitable ? "+ 30 PTS" : "+ 10 PTS",
            title: isProfitable ? "You Won!" : "Nice try!",
          });
        }
      } catch (err) {
        console.error("Result fetch error:", err);
      } finally {
        setTimeout(() => {
          playWinSound();
          setShowMatchOver(true);
        }, 1000);
      }
    },
    [updateFromBoard, playWinSound, setUser],
  );

  useEffect(() => {
    if (!matchId) return;
    const pid = effectiveMyPlayerId;
    const interval = setInterval(async () => {
      try {
        const data = await api.get<MatchResponse>("/game/match");
        updateFromBoard(data.match.board, pid);
        setCurrentTurnState(data.match.currentTurn ?? "");
        setTurnStartedAt(data.match.turnStartedAt ?? Date.now());
        if (data.match.status === "finished") {
          clearInterval(interval);
          fetchResult(matchId, pid);
        }
      } catch (err) {
        console.error("Match poll error:", err);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [matchId, effectiveMyPlayerId, updateFromBoard, fetchResult]);

  const handleCellClick = useCallback(
    async (id: number) => {
      if (!isMyTurn) return;
      const cell = cells.find((c) => c.id === id);
      if (!cell || cell.status !== "closed") return;

      if (!matchId) {
        // Demo mode — no backend
        const randomStatus = (Math.floor(Math.random() * 4) + 1) as 1 | 2 | 3 | 4;
        const randomComment =
          ASTRA_COMMENTS[Math.floor(Math.random() * ASTRA_COMMENTS.length)];
        const newCells = cells.map((c) =>
          c.id === id ? { ...c, status: randomStatus } : c,
        );
        setCells(newCells);
        setMyTotal((prev) => prev + cell.value);
        playCellSound();
        setYouGot({
          visible: true,
          amount: cell.value,
          commentFile: randomComment,
        });
        setTimeout(
          () => setYouGot({ visible: false, amount: 0, commentFile: "" }),
          3000,
        );
        if (newCells.filter((c) => c.status !== "closed").length === 12) {
          setTimeout(() => setShowMatchOver(true), 3500);
        }
        return;
      }

      try {
        const clientMoveId = `${Date.now()}-${id}`;
        const data = await api.post<MoveResponse>("/game/move", {
          matchId,
          boxId: id,
          clientMoveId,
        });
        updateFromBoard(data.match.board, effectiveMyPlayerId);
        setCurrentTurnState(data.match.currentTurn ?? "");
        setTurnStartedAt(data.match.turnStartedAt ?? Date.now());

        const openedCell = data.match.board.find((bc) => bc.id === id);
        if (openedCell && openedCell.value !== undefined) {
          playCellSound();
          const randomComment =
            ASTRA_COMMENTS[Math.floor(Math.random() * ASTRA_COMMENTS.length)];
          setYouGot({
            visible: true,
            amount: usdtToNum(openedCell.value),
            commentFile: randomComment,
          });
          setTimeout(
            () => setYouGot({ visible: false, amount: 0, commentFile: "" }),
            3000,
          );
        }

        if (data.match.status === "finished") {
          fetchResult(matchId, effectiveMyPlayerId);
        }
      } catch (err) {
        console.error("Move error:", err);
      }
    },
    [cells, isMyTurn, matchId, effectiveMyPlayerId, updateFromBoard, fetchResult, playCellSound],
  );

  const cellSize = `${CELL_PCT}cqw`;
  const gapX = `${GAP_X_PCT}cqw`;
  const gapY = `${GAP_Y_PCT}cqw`;

  const gameHeight =
    gameH > 0 ? `${gameH}px` : `calc(min(100vw, 505px) * 496 / 402)`;

  const gameTopVal =
    gameTop > 0
      ? `${gameTop}px`
      : `calc(clamp(16px, 4svh, 32px) + clamp(38px, 5.26svh, 46px) + clamp(8px, 1.5svh, 14px) + 28px + clamp(4px, 1svh, 10px))`;

  return (
    <div
      className="relative w-full"
      style={{
        height: "100svh",
        overflow: "hidden",
        backgroundColor: "#0d0d0d",
      }}
    >

      <div
        className="absolute inset-0 pointer-events-none select-none overflow-hidden"
        style={{ zIndex: 1 }}
      >
        <Image
          src="/assets/game/bg.png"
          alt=""
          fill
          priority
          className="object-cover object-top-left"
          sizes="100vw"
        />
      </div>

      <div
        className="absolute w-full overflow-hidden"
        style={{
          top: gameTopVal,
          height: gameHeight,
          containerType: "inline-size",
          zIndex: 2,
        }}
      >
        <img
          src="/assets/game/game-background.png"
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "fill",
            pointerEvents: "none",
          }}
        />

        <div
          className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap"
          style={{ top: "1.6%", zIndex: 3 }}
        >
          <GameTimer key={currentTurnState} turnStartedAt={turnStartedAt} />
        </div>

        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            top: `${BOXES_TOP_PCT}%`,
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            gap: gapY,
          }}
        >
          {[0, 1, 2, 3].map((row) => (
            <div key={row} style={{ display: "flex", gap: gapX }}>
              {[0, 1, 2].map((col) => {
                const cell = cells[row * 3 + col];
                return (
                  <div
                    key={cell.id}
                    style={{
                      position: "relative",
                      width: cellSize,
                      height: cellSize,
                      cursor:
                        isMyTurn && cell.status === "closed"
                          ? "pointer"
                          : "default",
                      flexShrink: 0,
                    }}
                    onClick={() => handleCellClick(cell.id)}
                  >
                    <Image
                      src={
                        cell.status !== "closed"
                          ? `/assets/game/box-open${cell.status}.png`
                          : "/assets/game/box-close.png"
                      }
                      alt={cell.status !== "closed" ? "open" : "closed"}
                      fill
                      className="object-contain"
                      sizes="20vw"
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {youGot.visible && (
          <div
            className="absolute"
            style={{
              left: "8.96%",
              top: "19.15%",
              width: "44.03%",
              zIndex: 10,
              animation: "fadeIn 0.15s ease",
            }}
          >
            <div
              style={{
                background: "linear-gradient(180deg, #ffae00 0%, #ff5100 100%)",
                border: "1.5px solid #ffae00",
                borderRadius: "clamp(6px, 2vw, 12px) clamp(6px, 2vw, 12px) 0 0",
                padding: "clamp(3px, 0.8vw, 5px) clamp(8px, 4vw, 16px)",
                textAlign: "center",
              }}
            >
              <span
                className="uppercase whitespace-nowrap"
                style={{
                  fontFamily: "'Tektur', sans-serif",
                  fontSize: "clamp(12px, 5vw, 22px)",
                  fontVariationSettings: "'wdth' 100",
                  fontWeight: 700,
                  color: "#ffffff",
                  lineHeight: 1,
                }}
              >
                YOU GOT
              </span>
            </div>
            <div
              style={{
                background: "rgba(0,0,0,0.75)",
                border: "1.5px solid #ffae00",
                borderTop: "none",
                borderRadius: `0 0 clamp(6px, 2vw, 12px) clamp(6px, 2vw, 12px)`,
                padding: "clamp(4px, 1.2vw, 8px) clamp(8px, 3vw, 14px)",
                textAlign: "center",
              }}
            >
              <span
                className="uppercase whitespace-nowrap"
                style={{
                  fontFamily: "'Tektur', sans-serif",
                  fontSize: "clamp(10px, 3.8vw, 16px)",
                  fontVariationSettings: "'wdth' 100",
                  fontWeight: 500,
                  color: "#ffae00",
                  lineHeight: 1,
                }}
              >
                + {fmtCell(youGot.amount)} USDT
              </span>
            </div>
          </div>
        )}
      </div>

      <div
        className="absolute pointer-events-none"
        style={{
          left: CHEST_L,
          bottom: "calc(-30px)",
          width: CHEST_W,
          height: CHEST_H,
          zIndex: 3,
        }}
      >
        <Image
          src="/assets/game/chest.png"
          alt=""
          fill
          className="object-cover object-top"
          sizes="205px"
        />
      </div>

      <div
        className="absolute pointer-events-none"
        style={{
          right: ASTRA_R,
          bottom: 0,
          height: ASTRA_H,
          width: ASTRA_W,
          zIndex: 3,
        }}
      >
        <Image
          src="/assets/game/astra-playing.png"
          alt="Astra"
          fill
          className="object-cover object-top"
          sizes="196px"
        />
      </div>

      <div
        ref={headerRef}
        className="absolute flex items-center justify-between w-full"
        style={{
          top: 0,
          paddingLeft: "clamp(12px, 3.73vw, 15px)",
          paddingRight: "clamp(12px, 3.73vw, 15px)",
          paddingTop: "clamp(16px, 4svh, 32px)",
          paddingBottom: "clamp(8px, 1.5svh, 14px)",
          zIndex: 4,
        }}
      >
        <a
          href="#"
          style={{
            fontFamily: "'Wix Madefor Display', sans-serif",
            fontSize: "clamp(10px, 3.23vw, 13px)",
            color: "#545454",
            textDecoration: "underline",
            lineHeight: 1.3,
            cursor: "pointer",
            maxWidth: "clamp(110px, 38vw, 170px)",
          }}
        >
          Found a bug? Write a report
        </a>
        <div className="flex items-center" style={{ gap: "clamp(10px, 3.73vw, 15px)" }}>
          <button
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute" : "Mute"}
            style={{
              position: "relative",
              width: "clamp(22px, 6.72vw, 27px)",
              height: "clamp(22px, 6.72vw, 27px)",
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <Image
              src={isMuted ? "/assets/icons/sound-min-svgrepo-com.svg" : "/assets/icons/sound-max-svgrepo-com.svg"}
              alt={isMuted ? "Sound off" : "Sound on"}
              fill
              sizes="27px"
              className="object-contain"
            />
          </button>

          <button
            onClick={() => window.open(HOW_TO_PLAY_URL, "_blank")}
            style={{
              fontFamily: "'Wix Madefor Display', sans-serif",
              fontSize: "clamp(12px, 3.73vw, 15px)",
              fontWeight: 700,
              color: "#00e3b9",
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              whiteSpace: "nowrap",
              textShadow: "0px 0px 8px rgba(0, 227, 185, 0.4)",
            }}
          >
            How to play
          </button>
        </div>
      </div>

      <div
        className="absolute flex items-center justify-center w-full"
        style={{
          top: `calc(clamp(16px, 4svh, 32px) + clamp(38px, 5.26svh, 46px) + clamp(8px, 1.5svh, 14px))`,
          zIndex: 4,
        }}
      >
        <span
          className="uppercase text-center"
          style={{
            fontFamily: "'Tektur', sans-serif",
            fontSize: "clamp(14px, 6.97vw, 28px)",
            fontVariationSettings: "'wdth' 100",
            fontWeight: 500,
            lineHeight: 1,
            color: isMyTurn ? "#00e3b9" : "#545454",
            textShadow: isMyTurn
              ? "0px 0px 27px rgba(0, 255, 179, 0.57)"
              : "none",
          }}
        >
          {isMyTurn ? "Your Turn" : "Waiting..."}
        </span>
      </div>

      {youGot.visible && youGot.commentFile && (
        <div
          className="absolute pointer-events-none"
          style={{
            right: `calc(${ASTRA_W} + ${ASTRA_R} - 100px)`,
            bottom: `calc(${ASTRA_H} * 0.72)`,
            width: `calc(${ASTRA_W} * 0.246)`,
            height: `calc(${ASTRA_W} * 0.406 * 1.166)`,
            zIndex: 5,
            animation: "fadeIn 0.15s ease",
          }}
        >
          <Image
            src={`/assets/game/${youGot.commentFile}`}
            alt="Astra comment"
            fill
            className="object-contain object-left"
            sizes="146px"
          />
        </div>
      )}

      {scoresTop > 0 && (
        <div
          className="absolute flex items-center justify-between w-full"
          style={{
            top: scoresTop,
            paddingLeft: "clamp(12px, 3vw, 15px)",
            paddingRight: "clamp(12px, 3vw, 15px)",
            zIndex: 5,
          }}
        >
          <div
            className="relative overflow-hidden shrink-0"
            style={{
              width: "clamp(140px, 44.03vw, 177px)",
              height: "clamp(50px, 7.3svh, 64px)",
            }}
          >
            <Image
              src="/assets/game/background-score1.png"
              alt=""
              fill
              className="object-cover"
              sizes="177px"
            />
            <div
              className="absolute flex flex-col items-start justify-center"
              style={{
                left: "clamp(12px, 4.97vw, 20px)",
                top: 0,
                bottom: 0,
                gap: "1.5px",
                zIndex: 1,
              }}
            >
              <span
                style={{
                  fontFamily: "'Tektur', sans-serif",
                  fontSize: "clamp(11px, 3.98vw, 16px)",
                  fontVariationSettings: "'wdth' 100",
                  fontWeight: 500,
                  color: "#00e3b9",
                  textShadow: "0px 0px 13.537px rgba(0, 255, 179, 0.57)",
                  lineHeight: 1,
                }}
              >
                You
              </span>
              <span
                style={{
                  fontFamily: "'Tektur', sans-serif",
                  fontSize: "clamp(8px, 3.23vw, 13px)",
                  fontVariationSettings: "'wdth' 100",
                  fontWeight: 500,
                  color: "#ffffff",
                  textShadow: "0px 0px 4.986px #00e3b9",
                  lineHeight: 1.3,
                  whiteSpace: "pre-line",
                }}
              >{`Total:\n${fmtUsdt(myTotal)}`}</span>
            </div>
          </div>
          <div
            className="relative overflow-hidden shrink-0"
            style={{
              width: "clamp(140px, 44.03vw, 177px)",
              height: "clamp(50px, 7.3svh, 64px)",
            }}
          >
            <Image
              src="/assets/game/background-score2.png"
              alt=""
              fill
              className="object-cover"
              sizes="177px"
            />
            <div
              className="absolute flex flex-col items-end justify-center"
              style={{
                right: "clamp(12px, 4.97vw, 20px)",
                top: 0,
                bottom: 0,
                gap: "1.5px",
                zIndex: 1,
              }}
            >
              <span
                style={{
                  fontFamily: "'Tektur', sans-serif",
                  fontSize: "clamp(11px, 3.98vw, 16px)",
                  fontVariationSettings: "'wdth' 100",
                  fontWeight: 500,
                  color: "#00e3b9",
                  textShadow: "0px 0px 13.537px rgba(0, 255, 179, 0.57)",
                  lineHeight: 1,
                  textAlign: "right",
                  whiteSpace: "pre-line",
                }}
              >
                {opponentName.slice(-5)}
              </span>
              <span
                style={{
                  fontFamily: "'Tektur', sans-serif",
                  fontSize: "clamp(8px, 3.23vw, 13px)",
                  fontVariationSettings: "'wdth' 100",
                  fontWeight: 500,
                  color: "#ffffff",
                  textShadow: "0px 0px 4.986px #00e3b9",
                  lineHeight: 1.3,
                  textAlign: "right",
                  whiteSpace: "pre-line",
                }}
              >{`Total:\n${fmtUsdt(opponentTotal)}`}</span>
            </div>
          </div>
        </div>
      )}

      {showMatchOver && (
        <div className="absolute inset-0" style={{ zIndex: 20 }}>
          <PopupOverlay onClose={() => { setShowMatchOver(false); onExit?.(); }}>
            <PopupMatchOver
              onClose={() => { setShowMatchOver(false); onExit?.(); }}
              onPlayAgain={() => {
                setShowMatchOver(false);
                onPlayAgain?.();
              }}
              result={matchResultData?.result ?? fmtUsdt(myTotal)}
              profit={matchResultData?.profit ?? "+ 20 %"}
              points={matchResultData?.points ?? "+ 10 PTS"}
              title={matchResultData?.title ?? "Nice try!"}
            />
          </PopupOverlay>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
