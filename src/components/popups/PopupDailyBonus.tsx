"use client";

import Image from "next/image";
import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { api, ApiError, ClaimPointsResponse } from "@/lib/api";

interface PopupDailyBonusProps {
  onClose: () => void;
}

export default function PopupDailyBonus({ onClose }: PopupDailyBonusProps) {
  const { user, setUser } = useUser();
  const [claimError, setClaimError] = useState<string | null>(null);
  const [devMsg, setDevMsg] = useState<string | null>(null);

  const claimPoints = async (): Promise<{ ok: boolean; points?: number; error?: string }> => {
    try {
      const data = await api.post<ClaimPointsResponse>("/game/claim-points");
      return { ok: true, points: data.points };
    } catch (err) {
      if (err instanceof ApiError && err.status === 429) {
        return { ok: false, error: "Come back tomorrow" };
      }
      return { ok: false, error: "Connection error, try again" };
    }
  };

  const handleClaim = async () => {
    setClaimError(null);
    const result = await claimPoints();
    if (result.ok && result.points !== undefined) {
      setUser({ ...user, pts: `${result.points} PTS` });
      onClose();
    } else {
      setClaimError(result.error ?? "Connection error, try again");
    }
  };

  // TODO: remove before production
  const handleDevClaim = async () => {
    setDevMsg(null);
    const result = await claimPoints();
    if (result.ok && result.points !== undefined) {
      setUser({ ...user, pts: `${result.points} PTS` });
      setDevMsg(`✓ ${result.points} PTS`);
    } else {
      setDevMsg(result.error ?? "Connection error, try again");
    }
  };

  return (
    <div
      className="flex items-center justify-center w-full h-full"
      onClick={onClose}
    >
      <div
        className="relative overflow-hidden"
        style={{
          width: "clamp(300px, 90.05vw, 362px)",
          height: "clamp(500px, 72.31svh, 632px)",
          backgroundColor: "#0f0b16",
          border: "1px solid #0e1820",
          borderRadius: "clamp(14px, 4.48vw, 18px)",
          padding: "clamp(18px, 6.22vw, 25px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="absolute pointer-events-none"
          style={{
            left: 0, right: 0, bottom: 0,
            height: "75%",
            background: "radial-gradient(ellipse 120% 80% at 50% 100%, rgba(0, 200, 160, 0.7) 0%, rgba(0, 140, 110, 0.35) 45%, transparent 75%)",
            zIndex: 0,
          }}
        />

        <div
          className="absolute pointer-events-none"
          style={{
            left: "clamp(10px, 6.63vw, 24px)",
            top: "clamp(150px, 31.65svh, 200px)",
            width: "clamp(240px, 90.05vw, 326px)",
            height: "clamp(310px, 68.2svh, 431px)",
            zIndex: 1,
          }}
        >
          <Image src="/assets/game/astrawithcoin.png" alt="Astra with coin" fill className="object-cover object-top" sizes="90vw" />
        </div>

        <div className="flex items-start justify-between relative" style={{ zIndex: 2 }}>
          <div style={{ flex: 1, marginRight: "12px" }}>
            <p style={{ fontFamily: "'Tektur', sans-serif", fontSize: "clamp(26px, 9.95vw, 40px)", fontVariationSettings: "'wdth' 100", fontWeight: 400, color: "#00e3b9", textShadow: "0px 0px 27px rgba(0, 255, 179, 0.57)", lineHeight: 1.05, marginBottom: "clamp(10px, 3.73vw, 15px)" }}>
              Get 30 ranking points
            </p>
            <p style={{ fontFamily: "'Wix Madefor Display', sans-serif", fontSize: "clamp(14px, 4.48vw, 18px)", color: "#ffffff", lineHeight: 1.4, fontWeight: 400, maxWidth: "207px" }}>
              Play every day and claim your daily bonus:
            </p>
          </div>
          <button onClick={onClose} style={{ width: "clamp(28px, 8.96vw, 36px)", height: "clamp(28px, 8.96vw, 36px)", background: "none", border: "none", padding: 0, cursor: "pointer", flexShrink: 0, position: "relative" }}>
            <Image src="/assets/icons/x.svg" alt="Close" fill className="object-contain" />
          </button>
        </div>

        <div className="relative flex flex-col" style={{ zIndex: 2, gap: "8px" }}>
          <button
            onClick={handleClaim}
            className="flex items-center justify-center w-full cursor-pointer"
            style={{ backgroundColor: "#00e3b9", border: "none", borderRadius: "clamp(9px, 2.91vw, 11.679px)", height: "clamp(48px, 6.41svh, 56px)", gap: "clamp(8px, 2.99vw, 12px)", boxShadow: "0px 4px 4px 0px rgba(0,0,0,0.25)" }}
          >
            <div style={{ width: "24px", height: "24px", position: "relative", flexShrink: 0 }}>
              <Image src="/assets/icons/pts.png" alt="" fill className="object-contain" />
            </div>
            <span className="uppercase whitespace-nowrap" style={{ fontFamily: "'Tektur', sans-serif", fontSize: "clamp(14px, 4.48vw, 18px)", fontVariationSettings: "'wdth' 100", fontWeight: 500, color: "#0d0d0d", lineHeight: 1 }}>
              Claim 30 PTS
            </span>
          </button>

          {claimError && (
            <p style={{ fontFamily: "'Wix Madefor Display', sans-serif", fontSize: "clamp(12px, 3.73vw, 15px)", color: "#ff5100", textAlign: "center", lineHeight: 1.3 }}>
              {claimError}
            </p>
          )}

          {/* TODO: remove before production */}
          {process.env.NODE_ENV === "development" && (
            <>
              <button
                onClick={handleDevClaim}
                className="flex items-center justify-center w-full cursor-pointer"
                style={{ backgroundColor: "transparent", border: "1px dashed #545454", borderRadius: "clamp(9px, 2.91vw, 11.679px)", height: "clamp(40px, 5.5svh, 48px)", marginTop: "4px" }}
              >
                <span className="uppercase whitespace-nowrap" style={{ fontFamily: "'Tektur', sans-serif", fontSize: "clamp(12px, 3.73vw, 15px)", fontVariationSettings: "'wdth' 100", fontWeight: 500, color: "#545454", lineHeight: 1 }}>
                  DEV: Claim Points
                </span>
              </button>
              {devMsg && (
                <p style={{ fontFamily: "'Wix Madefor Display', sans-serif", fontSize: "clamp(12px, 3.73vw, 15px)", color: devMsg.startsWith("✓") ? "#00e3b9" : "#ff5100", textAlign: "center", lineHeight: 1.3 }}>
                  {devMsg}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
