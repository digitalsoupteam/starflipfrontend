"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import PopupOverlay from "../common/PopupOverlay";
import PopupWelcomeBonus from "@/components/popups/PopupWelcomeBonus";
import PopupDailyBonus from "@/components/popups/PopupDailyBonus";
import PopupAirdrop from "@/components/popups/PopupAirdrop";
import PopupInviteRef from "@/components/popups/PopupInviteRef";
import MenuLogged from "@/components/menus/MenuLogged";
import MenuUnlogged from "../menus/MenuUnlogged";
import SearchingMatch from "@/components/searching/SearchingMatch";
import CancelledMatch, { CancelReason } from "@/components/searching/CancelledMatch";
import Game from "@/components/screens/Game";
import Leaderboard from "@/components/screens/Leaderboard";
import { useUser } from "@/context/UserContext";
import { useSound } from "@/context/SoundContext";
import { api, ApiError, usdtToNum, formatUsdt, Match, MatchResponse, JoinResponse, ResumeResponse, BoardCell, AuthResponse, FaucetResponse } from "@/lib/api";

const HOW_TO_PLAY_URL =
  "https://www.notion.so/StarFlip-How-to-Play-36e95daac839807aab01ccbc1bc3d8a5?pvs=28";

type CellStatus = "closed" | 1 | 2 | 3 | 4;
interface Cell { id: number; status: CellStatus; value: number }

function boardToCells(board: BoardCell[], myPlayerId: string): Cell[] {
  return board.map((bc) => ({
    id: bc.id,
    status: (bc.openedBy === null
      ? "closed"
      : bc.openedBy === myPlayerId
        ? (bc.id % 2 === 0 ? 1 : 2)
        : (bc.id % 2 === 0 ? 3 : 4)) as CellStatus,
    value: usdtToNum(bc.value),
  }));
}

type OverlayType =
  | "welcome"
  | "daily"
  | "airdrop"
  | "inviteref"
  | "menu"
  | "searching"
  | "cancelled"
  | "game"
  | "leaderboard"
  | null;

// Auto-popups are suppressed while these screens are active
const POPUP_BLOCKED_DURING: OverlayType[] = ["game", "searching", "cancelled"];
const isPopupBlocked = (state: OverlayType) => POPUP_BLOCKED_DURING.includes(state);

const POPUP_TYPES = [
  "welcome",
  "daily",
  "airdrop",
  "inviteref",
  "menu",
  "searching",
  "cancelled",
] as const;
type PopupType = (typeof POPUP_TYPES)[number];

function isPopupType(v: OverlayType): v is PopupType {
  return POPUP_TYPES.includes(v as PopupType);
}

export default function StartPage() {
  const [active, setActive] = useState<OverlayType>(null);
  const [cancelReason, setCancelReason] = useState<CancelReason>("timeout");
  const [currentMatch, setCurrentMatch] = useState<Match | null>(null);
  const [showStartTooltip, setShowStartTooltip] = useState(false);
  const { user, setUser, logout } = useUser();
  useSound();

  // When welcome was opened from MenuUnlogged, closing it should go back to menu
  const welcomeFromMenuRef = useRef(false);

  const [isTMA] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return !!(window as any).Telegram?.WebApp?.initDataUnsafe?.user?.id;
    } catch {
      return false;
    }
  });

  // Restores the previous screen when an auto-popup is dismissed
  const popupPrevRef = useRef<OverlayType>(null);

  const close = () => setActive(null);

  const closeWelcome = () => {
    const goToMenu = welcomeFromMenuRef.current;
    welcomeFromMenuRef.current = false;
    setActive(goToMenu ? "menu" : null);
  };

  const closeAutoPopup = () => {
    const prev = popupPrevRef.current;
    popupPrevRef.current = null;
    setActive(prev);
  };

  // Daily bonus fires 30s after login — suppressed during active screens
  useEffect(() => {
    if (!user.isLoggedIn) return;
    const timer = setTimeout(() => {
      setActive((prev) => {
        if (isPopupBlocked(prev)) return prev;
        popupPrevRef.current = prev; // remember where the user was
        return "daily";
      });
    }, 30000);
    return () => clearTimeout(timer);
  }, [user.isLoggedIn]);

  // Airdrop popup fires 60s after mount if no other popup is open
  useEffect(() => {
    const timer = setTimeout(() => {
      setActive((prev) => {
        if (isPopupBlocked(prev) || prev !== null) return prev;
        popupPrevRef.current = null;
        return "airdrop";
      });
    }, 60000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => {
        if (isPopupBlocked(prev) || prev !== null) return prev;
        popupPrevRef.current = null;
        return "inviteref";
      });
    }, 180000);
    return () => clearInterval(interval);
  }, []);

  // Signal to Telegram that the app is ready and expand to full height
  useEffect(() => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const tg = (window as any).Telegram?.WebApp;
      tg?.ready();
      tg?.expand();
    } catch {}
  }, []);

  // TMA auto-login — fires once on mount if Telegram WebApp user data is present
  useEffect(() => {
    if (user.isLoggedIn) return;

    let telegramId: string | undefined;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      telegramId = (window as any).Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString();
    } catch {}
    if (!telegramId) return;

    const getReferralCode = (): string | undefined => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sp = (window as any).Telegram?.WebApp?.initDataUnsafe?.start_param as string | undefined;
        if (sp?.startsWith("ref_")) return sp;
      } catch {}
      try {
        const ref = new URLSearchParams(window.location.search).get("ref");
        if (ref) return ref.startsWith("ref_") ? ref : `ref_${ref}`;
      } catch {}
      return undefined;
    };

    (async () => {
      try {
        const data = await api.post<AuthResponse>("/auth/telegram", {
          telegramId,
          referralCode: getReferralCode(),
        });
        const p = data.player;
        const usdtBalance = `${formatUsdt(p.balance ?? "0")} USDT`;
        const baseUser = {
          accId: p.playerId,
          usdtBalance,
          pts: `${p.points} PTS`,
          isLoggedIn: true,
          inviteCode: p.inviteCode ?? "",
          inviteLink: p.inviteLink ?? "",
        };
        setUser(baseUser);

        try {
          const faucet = await api.post<FaucetResponse>("/game/faucet");
          setUser({
            ...baseUser,
            usdtBalance: `${formatUsdt(faucet.balance)} USDT`,
          });
          if (faucet.isFirstLogin && !localStorage.getItem("sf:welcome-seen")) {
            localStorage.setItem("sf:welcome-seen", "1");
            setTimeout(() => {
              setActive((prev) => (isPopupBlocked(prev) ? prev : "welcome"));
            }, 5000);
          }
        } catch {
          // non-critical — mainnet blocks faucet with 403
        }
      } catch (err) {
        console.error("TMA auto-login error:", err);
      }
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) return;
    const resume = async () => {
      try {
        const data = await api.post<ResumeResponse>("/game/resume");
        if (data.match.status === "active") {
          setCurrentMatch(data.match);
          setActive("game");
        }
      } catch {
        // no active session
      }
    };
    resume();
  }, []);

  useEffect(() => {
    if (active !== "searching") return;
    const interval = setInterval(async () => {
      try {
        const data = await api.get<MatchResponse>("/game/match");
        setCurrentMatch(data.match);
        if (data.match.status === "active") {
          setActive("game");
        } else if (data.match.status === "finished") {
          setCancelReason("afk");
          setActive("cancelled");
        }
      } catch (err) {
        // 404 on first tick is a normal Redis race during searching — keep polling
        if (err instanceof ApiError && err.status === 404) return;
        console.error("Match poll error:", err);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [active]);

  const handleStartGame = async () => {
    try {
      const data = await api.post<JoinResponse>("/game/join", { bid: "15", token: "USDT" });
      setCurrentMatch(data.match);
      if (data.match.status === "active") {
        setActive("game");
      } else {
        setActive("searching");
      }
    } catch (err) {
      console.error("Join error:", err);
      if (err instanceof ApiError && err.message.toLowerCase().includes("insufficient")) {
        setCancelReason("balance");
        setActive("cancelled");
      } else {
        setActive("searching");
      }
    }
  };

  const getOpponentId = (match: Match): string => {
    const opp = match.players.find((p) => p !== user.accId);
    return opp ?? "PlayerName";
  };

  if (active === "leaderboard") {
    return (
      <Leaderboard
        onClose={() => setActive(null)}
        onPlay={() => {
          setActive(null);
          handleStartGame();
        }}
      />
    );
  }

  if (active === "game") {
    return (
      <Game
        currentTurn={currentMatch?.currentTurn ?? "You"}
        initialTurnStartedAt={currentMatch?.turnStartedAt}
        playerName="You"
        opponentName={currentMatch ? getOpponentId(currentMatch) : "PlayerName"}
        initialCells={currentMatch ? boardToCells(currentMatch.board, user.accId) : undefined}
        matchId={currentMatch?.matchId}
        myPlayerId={user.accId}
        onPlayAgain={() => {
          setActive(null);
          handleStartGame();
        }}
        onExit={() => setActive(null)}
      />
    );
  }

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
        className="absolute top-0 left-0 pointer-events-none select-none overflow-hidden"
        style={{ width: "309%", height: "100%" }}
      >
        <Image
          src="/assets/game/bg.png"
          alt=""
          fill
          priority
          className="object-cover object-left-top"
          sizes="309vw"
        />
      </div>

      <div
        className="absolute pointer-events-none select-none"
        style={{
          left: 0,
          right: 0,
          bottom: 0,
          height: "200svh",
          zIndex: 1,
          background:
            "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(0, 180, 150, 0.45) 0%, rgba(0, 120, 100, 0.2) 40%, transparent 70%)",
        }}
      />

      <div
        className="relative flex flex-col w-full"
        style={{
          zIndex: 2,
          height: "100svh",
          paddingTop: "clamp(32px, 5.72svh, 50px)",
          gap: "clamp(16px, 3.43svh, 30px)",
        }}
      >
        <div
          className="flex items-center justify-between w-full shrink-0"
          style={{
            paddingLeft: "clamp(12px, 3.73vw, 15px)",
            paddingRight: "clamp(12px, 3.73vw, 15px)",
          }}
        >
          <div
            className="flex flex-col justify-center"
            style={{ height: "clamp(38px, 5.26svh, 46px)", gap: 0 }}
          >
            <div
              className="flex items-center"
              style={{
                height: "clamp(20px, 3.2svh, 28px)",
                gap: "clamp(10px, 1.71vw, 15px)",
              }}
            >
              <div
                className="flex items-center"
                style={{ gap: "clamp(4px, 0.8vw, 7px)" }}
              >
                <div
                  className="relative shrink-0"
                  style={{
                    width: "clamp(14px, 4.48vw, 18px)",
                    height: "clamp(14px, 4.48vw, 18px)",
                  }}
                >
                  <Image
                    src="/assets/icons/usdt.svg"
                    alt="USDT"
                    fill
                    sizes="18px"
                    className="object-contain"
                  />
                </div>
                <span
                  className="text-white font-bold whitespace-nowrap"
                  style={{
                    fontFamily: "'Wix Madefor Display', sans-serif",
                    fontSize: "clamp(14px, 4.48vw, 18px)",
                    lineHeight: 1,
                  }}
                >
                  {user.usdtBalance}
                </span>
              </div>
              <button
                onClick={() => setActive(user.isLoggedIn ? "menu" : "welcome")}
                style={{
                  fontFamily: "'Wix Madefor Display', sans-serif",
                  fontSize: "clamp(13px, 4.47vw, 18px)",
                  color: "#ffae00",
                  lineHeight: 1,
                  fontWeight: 500,
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {user.isLoggedIn ? "Deposit" : "Connect"}
              </button>
              {user.isLoggedIn && (
                <button
                  onClick={() => setActive("leaderboard")}
                  style={{
                    fontFamily: "'Wix Madefor Display', sans-serif",
                    fontSize: "clamp(13px, 4.47vw, 18px)",
                    color: "#00e3b9",
                    lineHeight: 1,
                    fontWeight: 500,
                    background: "none",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  Top
                </button>
              )}
            </div>
            <div
              className="flex items-center"
              style={{
                height: "clamp(20px, 3.2svh, 28px)",
                gap: "clamp(4px, 0.8vw, 7px)",
              }}
            >
              <div
                className="relative shrink-0"
                style={{
                  width: "clamp(14px, 4.48vw, 18px)",
                  height: "clamp(14px, 4.48vw, 18px)",
                }}
              >
                <Image
                  src="/assets/icons/pts.png"
                  alt="PTS"
                  fill
                  sizes="18px"
                  className="object-contain"
                />
              </div>
              <span
                className="font-bold whitespace-nowrap"
                style={{
                  fontFamily: "'Wix Madefor Display', sans-serif",
                  fontSize: "clamp(14px, 4.48vw, 18px)",
                  color: "#00e3b9",
                  lineHeight: 1,
                }}
              >
                {user.pts}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              if (user.isLoggedIn) {
                setActive(active === "menu" ? null : "menu");
              } else {
                welcomeFromMenuRef.current = true;
                setActive("welcome");
              }
            }}
            className="relative shrink-0 cursor-pointer"
            style={{
              width: "clamp(28px, 8.96vw, 36px)",
              height: "clamp(28px, 8.96vw, 36px)",
              background: "none",
              border: "none",
              padding: 0,
            }}
          >
            <Image
              src={
                active === "menu"
                  ? "/assets/icons/x.svg"
                  : "/assets/icons/menu.svg"
              }
              alt={active === "menu" ? "Close" : "Menu"}
              fill
              sizes="36px"
              className="object-contain"
            />
          </button>
        </div>

        <div
          className="flex flex-col w-full shrink-0"
          style={{
            paddingLeft: "clamp(12px, 3.73vw, 15px)",
            gap: "clamp(10px, 1.72svh, 15px)",
          }}
        >
          <div className="flex items-start justify-between w-full">
            <div
              className="flex flex-col shrink-0"
              style={{
                width: "clamp(180px, 64.68vw, 260px)",
                gap: "clamp(10px, 1.72svh, 15px)",
              }}
            >
              <div
                style={{
                  fontFamily: "'Tektur', sans-serif",
                  fontSize: "clamp(26px, 11.19vw, 45px)",
                  fontVariationSettings: "'wdth' 100",
                  fontWeight: 400,
                  color: "#00e3b9",
                  textShadow: "0px 0px 27px rgba(0, 255, 179, 0.57)",
                  lineHeight: 1.05,
                }}
              >
                <p>Greetings,</p>
                <p>Explorer!</p>
              </div>
              <p
                style={{
                  fontFamily: "'Wix Madefor Display', sans-serif",
                  fontSize: "clamp(12px, 4.48vw, 18px)",
                  color: "#ffffff",
                  lineHeight: 1.45,
                  fontWeight: 400,
                }}
              >
                Two players randomly distribute a stake across the game board
                and take turns revealing cells. Each player has an equal chance
                to collect the coins.
              </p>
            </div>
            <div
              className="relative shrink-0"
              style={{
                width: "clamp(72px, 26.87vw, 108px)",
                height: "clamp(136px, 50.50vw, 203px)",
              }}
            >
              <Image
                src="/assets/game/coins.png"
                alt="Coins"
                fill
                sizes="27vw"
                className="object-cover"
              />
            </div>
          </div>

          <div
            className="flex items-center"
            style={{ gap: "clamp(8px, 3.73vw, 15px)" }}
          >
            <div className="relative shrink-0">
              {showStartTooltip && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "calc(100% + 10px)",
                    left: "85%",
                    transform: "translateX(-50%)",
                    backgroundColor: "#0f0b16",
                    border: "1px solid #00e3b9",
                    borderRadius: "clamp(6px, 2vw, 8px)",
                    padding: "6px 12px",
                    whiteSpace: "nowrap",
                    fontFamily: "'Wix Madefor Display', sans-serif",
                    fontSize: "clamp(11px, 3.2vw, 13px)",
                    fontWeight: 500,
                    color: "#00e3b9",
                    zIndex: 10,
                    pointerEvents: "none",
                  }}
                >
                  Connect your account to start
                  <span style={{
                    position: "absolute",
                    top: "100%",
                    left: "50%",
                    transform: "translateX(-100%)",
                    width: 0,
                    height: 0,
                    borderLeft: "6px solid transparent",
                    borderRight: "6px solid transparent",
                    borderTop: "6px solid #00e3b9",
                  }} />
                </div>
              )}
            <button
              onClick={() => {
                if (!user.isLoggedIn) {
                  setShowStartTooltip(true);
                  setTimeout(() => setShowStartTooltip(false), 2500);
                  return;
                }
                handleStartGame();
              }}
              className="flex items-center justify-center shrink-0 cursor-pointer"
              style={{
                background: "rgba(0, 227, 185, 0.3)",
                border: "1.168px solid #00e3b9",
                borderRadius: "clamp(8px, 2.91vw, 11.68px)",
                height: "clamp(42px, 6.41svh, 56px)",
                paddingLeft: "clamp(10px, 4.07vw, 16.35px)",
                paddingRight: "clamp(10px, 4.07vw, 16.35px)",
                gap: "clamp(2px, 0.87vw, 3.5px)",
              }}
            >
              <span
                className="uppercase whitespace-nowrap font-medium"
                style={{
                  fontFamily: "'Tektur', sans-serif",
                  fontSize: "clamp(13px, 5.23vw, 21px)",
                  fontVariationSettings: "'wdth' 100",
                  color: "#00e3b9",
                  lineHeight: 1,
                }}
              >
                start!
              </span>
              <div
                className="relative shrink-0"
                style={{
                  width: "clamp(10px, 4.07vw, 16.35px)",
                  height: "clamp(16px, 6.39vw, 25.69px)",
                }}
              >
                <Image
                  src="/assets/icons/arrow.svg"
                  alt=""
                  fill
                  sizes="16px"
                  className="object-contain"
                />
              </div>
            </button>
            </div>

            <button
              className="flex items-center justify-center shrink-0 cursor-pointer"
              onClick={() => window.open(HOW_TO_PLAY_URL, "_blank")}
              style={{
                background: "rgba(15, 11, 22, 0.3)",
                border: "1.168px solid #00e3b9",
                borderRadius: "clamp(7px, 2.49vw, 10px)",
                height: "clamp(42px, 6.41svh, 56px)",
                paddingLeft: "clamp(10px, 4.07vw, 16.35px)",
                paddingRight: "clamp(10px, 4.07vw, 16.35px)",
              }}
            >
              <span
                className="uppercase whitespace-nowrap font-medium"
                style={{
                  fontFamily: "'Tektur', sans-serif",
                  fontSize: "clamp(11px, 4.23vw, 17px)",
                  fontVariationSettings: "'wdth' 100",
                  color: "#00e3b9",
                  lineHeight: 1,
                }}
              >
                HOW TO PLAY
              </span>
            </button>
          </div>

          <div className="relative w-full">
            <p
              style={{
                fontFamily: "'Wix Madefor Display', sans-serif",
                fontSize: "clamp(11px, 3.98vw, 16px)",
                color: "#7f7f7f",
                lineHeight: 1.4,
                fontWeight: 400,
              }}
            >
              When you start the game,
              <br />
              you agree to the{" "}
              <button
                onClick={() => window.open("https://www.notion.so/Terms-of-service-36d95daac83980369b15e8462fce6110", "_blank")}
                style={{
                  fontFamily: "'Wix Madefor Display', sans-serif",
                  fontSize: "clamp(11px, 3.98vw, 16px)",
                  color: "#7f7f7f",
                  textDecoration: "underline",
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                }}
              >
                terms of service
              </button>
            </p>
            <div
              className="absolute pointer-events-none"
              style={{
                right: 0,
                bottom: 0,
                width: "clamp(55px, 31.02vw, 124.7px)",
                height: "clamp(58px, 32.81vw, 131.9px)",
                transform: "translateY(clamp(0px, 8svh, 60px))",
              }}
            >
              <Image
                src="/assets/game/yougot.png"
                alt="You Got +100$"
                fill
                sizes="31vw"
                className="object-contain object-right-bottom"
              />
            </div>
          </div>
        </div>

        <div
          className="relative w-full shrink-0 overflow-visible mt-auto"
          style={{ height: "clamp(180px, 42.68svh, 373px)" }}
        >
          <div
            className="absolute"
            style={{
              width: "clamp(380px, 163.18vw, 656px)",
              height: "clamp(230px, 45.08svh, 391px)",
              left: "50%",
              bottom: 0,
              transform: "translateX(calc(-50% + clamp(4px, 1.99vw, 8px)))",
            }}
          >
            <Image
              src="/assets/game/game.png"
              alt="Game board"
              fill
              priority
              className="object-contain object-bottom"
              sizes="163vw"
            />
          </div>
        </div>
      </div>

      {isPopupType(active) && (
        <PopupOverlay onClose={active === "welcome" ? closeWelcome : close}>
          {active === "welcome" && <PopupWelcomeBonus onClose={closeWelcome} onLoginInstead={() => setActive("menu")} isTMA={isTMA} />}
          {active === "daily" && <PopupDailyBonus onClose={closeAutoPopup} />}
          {active === "airdrop" && <PopupAirdrop onClose={closeAutoPopup} />}
          {active === "inviteref" && <PopupInviteRef onClose={closeAutoPopup} />}
          {active === "searching" && (
            <SearchingMatch
              onStop={close}
              onOpenChat={() => {}}
              onCancel={() => { setCancelReason("timeout"); setActive("cancelled"); }}
            />
          )}
          {active === "cancelled" && (
            <CancelledMatch reason={cancelReason} onClose={() => setActive(null)} />
          )}
          {active === "menu" &&
            (user.isLoggedIn ? (
              <MenuLogged
                onClose={close}
                accId={user.accId}
                usdtBalance={user.usdtBalance}
                pts={user.pts}
                onLogout={logout}
                onLeaderboard={() => setActive("leaderboard")}
              />
            ) : (
              <MenuUnlogged
                onClose={close}
                onLogin={close}
              />
            ))}
        </PopupOverlay>
      )}
    </div>
  );
}
