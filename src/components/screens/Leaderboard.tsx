"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { api, LeaderboardResponse, LeaderboardPlayer } from "@/lib/api";

interface LeaderboardProps {
  onClose: () => void;
  onPlay: () => void;
}

function shortId(id: string): string {
  if (id.length <= 14) return id;
  return `${id.slice(0, 7)}...${id.slice(-5)}`;
}

function PlayerRow({
  player,
  highlight,
}: {
  player: LeaderboardPlayer & { rank: number | null };
  highlight?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: highlight ? "rgba(0, 227, 185, 0.12)" : "#111111",
        border: highlight ? "1px solid rgba(0, 227, 185, 0.4)" : "1px solid rgba(255,255,255,0.05)",
        borderRadius: "clamp(8px, 2.91vw, 11px)",
        height: "clamp(44px, 6svh, 52px)",
        paddingLeft: "clamp(10px, 3.73vw, 14px)",
        paddingRight: "clamp(10px, 3.73vw, 14px)",
        gap: "8px",
      }}
    >
      <span
        style={{
          fontFamily: "'Tektur', sans-serif",
          fontVariationSettings: "'wdth' 100",
          fontSize: "clamp(12px, 3.73vw, 15px)",
          color: highlight ? "#00e3b9" : "rgba(255,255,255,0.4)",
          lineHeight: 1,
          minWidth: "28px",
          flexShrink: 0,
        }}
      >
        #{player.rank ?? "—"}
      </span>
      <span
        style={{
          fontFamily: "'Wix Madefor Display', sans-serif",
          fontSize: "clamp(12px, 3.73vw, 15px)",
          color: highlight ? "#ffffff" : "rgba(255,255,255,0.75)",
          lineHeight: 1,
          flex: 1,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {shortId(player.playerId)}
      </span>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "5px",
          flexShrink: 0,
        }}
      >
        <div style={{ width: "clamp(12px, 3.73vw, 15px)", height: "clamp(12px, 3.73vw, 15px)", position: "relative", flexShrink: 0 }}>
          <Image src="/assets/icons/pts.png" alt="PTS" fill sizes="15px" className="object-contain" />
        </div>
        <span
          style={{
            fontFamily: "'Tektur', sans-serif",
            fontVariationSettings: "'wdth' 100",
            fontSize: "clamp(12px, 3.73vw, 15px)",
            color: highlight ? "#00e3b9" : "#ffffff",
            lineHeight: 1,
            whiteSpace: "nowrap",
          }}
        >
          {player.points} PTS
        </span>
      </div>
    </div>
  );
}

export default function Leaderboard({ onClose, onPlay }: LeaderboardProps) {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<LeaderboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get<LeaderboardResponse>(`/game/leaderboard?page=${page}`)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page]);

  const totalPages = data ? Math.max(1, Math.ceil(data.total / (data.limit || 10))) : 1;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "#0d0d0d",
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
          paddingTop: "clamp(28px, 5.72svh, 50px)",
          paddingLeft: "clamp(12px, 3.73vw, 15px)",
          paddingRight: "clamp(12px, 3.73vw, 15px)",
          paddingBottom: "clamp(12px, 2svh, 20px)",
        }}
      >
        <h1
          style={{
            fontFamily: "'Tektur', sans-serif",
            fontVariationSettings: "'wdth' 100",
            fontSize: "clamp(22px, 7.46vw, 30px)",
            fontWeight: 400,
            color: "#00e3b9",
            textShadow: "0px 0px 27px rgba(0, 255, 179, 0.57)",
            lineHeight: 1,
            margin: 0,
          }}
        >
          LEADERBOARD
        </h1>
        <button
          onClick={onClose}
          style={{
            width: "clamp(28px, 8.96vw, 36px)",
            height: "clamp(28px, 8.96vw, 36px)",
            position: "relative",
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          <Image src="/assets/icons/x.svg" alt="Close" fill className="object-contain" />
        </button>
      </div>

      {/* My rank pinned */}
      {data?.myRank && (
        <div
          style={{
            flexShrink: 0,
            paddingLeft: "clamp(12px, 3.73vw, 15px)",
            paddingRight: "clamp(12px, 3.73vw, 15px)",
            paddingBottom: "clamp(8px, 1.5svh, 14px)",
          }}
        >
          <p
            style={{
              fontFamily: "'Wix Madefor Display', sans-serif",
              fontSize: "clamp(10px, 3vw, 12px)",
              color: "rgba(255,255,255,0.35)",
              marginBottom: "6px",
            }}
          >
            Your position
          </p>
          <PlayerRow player={data.myRank} highlight />
        </div>
      )}

      {/* Divider */}
      <div
        style={{
          height: "1px",
          backgroundColor: "rgba(255,255,255,0.07)",
          marginLeft: "clamp(12px, 3.73vw, 15px)",
          marginRight: "clamp(12px, 3.73vw, 15px)",
          flexShrink: 0,
          marginBottom: "clamp(8px, 1.5svh, 14px)",
        }}
      />

      {/* Table */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          paddingLeft: "clamp(12px, 3.73vw, 15px)",
          paddingRight: "clamp(12px, 3.73vw, 15px)",
          display: "flex",
          flexDirection: "column",
          gap: "clamp(6px, 1.2svh, 10px)",
        }}
      >
        {loading ? (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "'Wix Madefor Display', sans-serif", color: "rgba(255,255,255,0.3)", fontSize: "14px" }}>
              Loading...
            </span>
          </div>
        ) : data?.players.length === 0 ? (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "'Wix Madefor Display', sans-serif", color: "rgba(255,255,255,0.3)", fontSize: "14px" }}>
              No players yet
            </span>
          </div>
        ) : (
          data?.players.map((p) => <PlayerRow key={p.playerId} player={p} />)
        )}
      </div>

      {/* Pagination */}
      <div
        style={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "clamp(12px, 4vw, 20px)",
          paddingTop: "clamp(8px, 1.5svh, 14px)",
          paddingBottom: "clamp(8px, 1.5svh, 12px)",
        }}
      >
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page <= 1}
          style={{
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "none",
            border: "1px solid rgba(0,227,185,0.3)",
            borderRadius: "8px",
            cursor: page <= 1 ? "default" : "pointer",
            opacity: page <= 1 ? 0.3 : 1,
            color: "#00e3b9",
            fontSize: "18px",
            lineHeight: 1,
          }}
        >
          ‹
        </button>
        <span
          style={{
            fontFamily: "'Wix Madefor Display', sans-serif",
            fontSize: "clamp(13px, 3.73vw, 15px)",
            color: "rgba(255,255,255,0.6)",
          }}
        >
          {page} / {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page >= totalPages}
          style={{
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "none",
            border: "1px solid rgba(0,227,185,0.3)",
            borderRadius: "8px",
            cursor: page >= totalPages ? "default" : "pointer",
            opacity: page >= totalPages ? 0.3 : 1,
            color: "#00e3b9",
            fontSize: "18px",
            lineHeight: 1,
          }}
        >
          ›
        </button>
      </div>

      {/* Play button */}
      <div
        style={{
          flexShrink: 0,
          paddingLeft: "clamp(12px, 3.73vw, 15px)",
          paddingRight: "clamp(12px, 3.73vw, 15px)",
          paddingBottom: "clamp(24px, 5svh, 44px)",
        }}
      >
        <button
          onClick={onPlay}
          style={{
            width: "100%",
            background: "rgba(0, 227, 185, 0.3)",
            border: "1.168px solid #00e3b9",
            borderRadius: "clamp(8px, 2.91vw, 11.68px)",
            height: "clamp(46px, 6.41svh, 56px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <span
            style={{
              fontFamily: "'Tektur', sans-serif",
              fontVariationSettings: "'wdth' 100",
              fontSize: "clamp(13px, 5.23vw, 20px)",
              fontWeight: 500,
              color: "#00e3b9",
              letterSpacing: "0.04em",
            }}
          >
            PLAY AND EARN PTS
          </span>
        </button>
      </div>
    </div>
  );
}
