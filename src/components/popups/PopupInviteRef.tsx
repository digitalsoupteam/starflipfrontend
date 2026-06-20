"use client";

import Image from "next/image";
import { useState } from "react";
import { useUser } from "@/context/UserContext";

interface PopupInviteRefProps {
  onClose: () => void;
}

export default function PopupInviteRef({ onClose }: PopupInviteRefProps) {
  const { user } = useUser();
  const [showCopied, setShowCopied] = useState(false);

  const handleInvite = () => {
    const refLink = user.inviteLink || "https://t.me/StarFlipBot/StarFlipApp?startapp=ref_unknown";
    navigator.clipboard.writeText(refLink).catch(() => {});
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2500);
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
          <Image
            src="/assets/game/astrainvite.png"
            alt="Astra invite"
            fill
            className="object-cover object-top"
            sizes="90vw"
          />
        </div>

        <div className="flex items-start justify-between relative" style={{ zIndex: 2 }}>
          <div style={{ flex: 1, marginRight: "12px" }}>
            <p
              style={{
                fontFamily: "'Tektur', sans-serif",
                fontSize: "clamp(26px, 9.95vw, 40px)",
                fontVariationSettings: "'wdth' 100",
                fontWeight: 400,
                color: "#00e3b9",
                textShadow: "0px 0px 27px rgba(0, 255, 179, 0.57)",
                lineHeight: 1.05,
                marginBottom: "clamp(10px, 3.73vw, 15px)",
              }}
            >
              Referral bonus
            </p>
            <p
              style={{
                fontFamily: "'Wix Madefor Display', sans-serif",
                fontSize: "clamp(14px, 4.48vw, 18px)",
                color: "#ffffff",
                lineHeight: 1.4,
                fontWeight: 400,
                maxWidth: "207px",
              }}
            >
              Invite your friends and earn 50% of the service fee in USDT + 5 points for every game they play.
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: "clamp(28px, 8.96vw, 36px)",
              height: "clamp(28px, 8.96vw, 36px)",
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              flexShrink: 0,
              position: "relative",
            }}
          >
            <Image src="/assets/icons/x.svg" alt="Close" fill className="object-contain" />
          </button>
        </div>

        <div className="relative flex flex-col" style={{ zIndex: 2, gap: "8px" }}>
          <div className="relative">
            {showCopied && (
              <div
                style={{
                  position: "absolute",
                  bottom: "calc(100% + 10px)",
                  left: "50%",
                  transform: "translateX(-50%)",
                  backgroundColor: "#0f0b16",
                  border: "1px solid #00e3b9",
                  borderRadius: "clamp(6px, 2vw, 8px)",
                  padding: "6px 14px",
                  whiteSpace: "normal",
                  maxWidth: "clamp(160px, 50vw, 200px)",
                  textAlign: "center",
                  fontFamily: "'Wix Madefor Display', sans-serif",
                  fontSize: "clamp(11px, 3.2vw, 13px)",
                  fontWeight: 500,
                  color: "#00e3b9",
                  zIndex: 10,
                  pointerEvents: "none",
                }}
              >
                Your personal link has been copied —<br />send it to your friends!
                <span style={{
                  position: "absolute",
                  top: "100%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 0, height: 0,
                  borderLeft: "6px solid transparent",
                  borderRight: "6px solid transparent",
                  borderTop: "6px solid #00e3b9",
                }} />
              </div>
            )}

            <button
              onClick={handleInvite}
              className="flex items-center justify-center w-full cursor-pointer"
              style={{
                backgroundColor: "#00e3b9",
                border: "none",
                borderRadius: "clamp(9px, 2.91vw, 11.679px)",
                height: "clamp(48px, 6.41svh, 56px)",
                gap: "clamp(8px, 2.99vw, 12px)",
                boxShadow: "0px 4px 4px 0px rgba(0,0,0,0.25)",
              }}
            >
              <span
                className="uppercase whitespace-nowrap"
                style={{
                  fontFamily: "'Tektur', sans-serif",
                  fontSize: "clamp(14px, 4.48vw, 18px)",
                  fontVariationSettings: "'wdth' 100",
                  fontWeight: 500,
                  color: "#0d0d0d",
                  lineHeight: 1,
                }}
              >
                Invite friends
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
