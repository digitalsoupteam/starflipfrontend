"use client";

import Image from "next/image";
import { useState } from "react";
import { useUser } from "@/context/UserContext";

interface MenuLoggedProps {
  onClose: () => void;
  accId?: string;
  onLogout?: () => void;
  onLeaderboard?: () => void;
  ethBalance?: string;
  pts?: string;
}

function detectTMA(): boolean {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return !!(window as any).Telegram?.WebApp?.initDataUnsafe?.user?.id;
  } catch {
    return false;
  }
}

export default function MenuLogged({
  onClose,
  accId = "Paramour",
  onLogout,
  onLeaderboard,
  ethBalance,
  pts,
}: MenuLoggedProps) {
  const { user } = useUser();
  const isTMA = detectTMA();

  const [showTooltip, setShowTooltip] = useState(false);
  const [showRefCopied, setShowRefCopied] = useState(false);

  const triggerTooltip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 2500);
  };

  const handleCopyRef = (e: React.MouseEvent) => {
    e.stopPropagation();
    const refLink = user.inviteLink || "https://t.me/StarFlipBot/StarFlipApp?startapp=ref_unknown";
    navigator.clipboard.writeText(refLink).catch(() => {});
    setShowRefCopied(true);
    setTimeout(() => setShowRefCopied(false), 2500);
  };

  const rowStyle = {
    backgroundColor: "#0d0d0d",
    borderRadius: "clamp(9px, 2.91vw, 11.679px)" as const,
    height: "clamp(48px, 6.41svh, 56px)",
    paddingLeft: "clamp(12px, 3.98vw, 16px)",
    paddingRight: "clamp(12px, 3.98vw, 16px)",
  };

  return (
    <div
      className="flex flex-col items-center justify-between w-full h-full"
      style={{
        paddingTop: "clamp(60px, 9svh, 80px)",
        paddingBottom: "clamp(60px, 9svh, 80px)",
        paddingLeft: "clamp(16px, 3.98vw, 16px)",
        paddingRight: "clamp(16px, 3.98vw, 16px)",
      }}
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        style={{
          position: "absolute",
          top: "clamp(32px, 5.72svh, 50px)",
          right: "clamp(12px, 3.73vw, 15px)",
          width: "clamp(28px, 8.96vw, 36px)",
          height: "clamp(28px, 8.96vw, 36px)",
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          zIndex: 12,
        }}
      >
        <Image src="/assets/icons/x.svg" alt="Close" fill className="object-contain" />
      </button>

      {(ethBalance || pts) && (
        <div
          className="flex flex-col items-center"
          style={{ gap: "4px" }}
          onClick={(e) => e.stopPropagation()}
        >
          {ethBalance && (
            <div className="flex items-center" style={{ gap: "clamp(4px, 0.8vw, 7px)" }}>
              <div className="relative shrink-0" style={{ width: "clamp(14px, 4.48vw, 18px)", height: "clamp(14px, 4.48vw, 18px)" }}>
                <Image src="/assets/icons/eth.png" alt="ETH" fill sizes="18px" className="object-contain" />
              </div>
              <span className="font-bold whitespace-nowrap" style={{ fontFamily: "'Wix Madefor Display', sans-serif", fontSize: "clamp(14px, 4.48vw, 18px)", color: "#ffffff", lineHeight: 1 }}>
                {ethBalance}
              </span>
            </div>
          )}
          {pts && (
            <div className="flex items-center" style={{ gap: "clamp(4px, 0.8vw, 7px)" }}>
              <div className="relative shrink-0" style={{ width: "clamp(14px, 4.48vw, 18px)", height: "clamp(14px, 4.48vw, 18px)" }}>
                <Image src="/assets/icons/pts.png" alt="PTS" fill sizes="18px" className="object-contain" />
              </div>
              <span className="font-bold whitespace-nowrap" style={{ fontFamily: "'Wix Madefor Display', sans-serif", fontSize: "clamp(14px, 4.48vw, 18px)", color: "#00e3b9", lineHeight: 1 }}>
                {pts}
              </span>
            </div>
          )}
        </div>
      )}

      <div
        className="flex flex-col items-center w-full"
        style={{ gap: "clamp(18px, 2.74svh, 24px)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center" style={{ gap: "4px" }}>
          <p style={{ fontFamily: "'Wix Madefor Display', sans-serif", fontSize: "clamp(16px, 4.48vw, 18px)", color: "#ffffff", fontWeight: 400, lineHeight: 1.4 }}>
            acc id:
          </p>
          <p className="uppercase" style={{ fontFamily: "'Tektur', sans-serif", fontSize: "clamp(22px, 7.46vw, 30px)", fontVariationSettings: "'wdth' 100", fontWeight: 500, color: "#00e3b9", lineHeight: 1, textShadow: "0px 0px 27px rgba(0, 255, 179, 0.57)" }}>
            {accId}
          </p>
        </div>

        <div className="relative w-full">
          {showTooltip && (
            <div style={{ position: "absolute", bottom: "calc(100% + 10px)", left: "50%", transform: "translateX(-50%)", backgroundColor: "#0f0b16", border: "1px solid #00e3b9", borderRadius: "clamp(6px, 2vw, 8px)", padding: "6px 12px", whiteSpace: "nowrap", fontFamily: "'Wix Madefor Display', sans-serif", fontSize: "clamp(11px, 3.2vw, 13px)", fontWeight: 500, color: "#00e3b9", zIndex: 20, pointerEvents: "none" }}>
              Testnet — deposit & withdrawal unavailable
              <span style={{ position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", width: 0, height: 0, borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: "6px solid #00e3b9" }} />
            </div>
          )}
          <div className="flex items-center w-full" style={{ gap: "clamp(8px, 2.99vw, 12px)" }}>
            <button onClick={triggerTooltip} className="flex items-center justify-center cursor-pointer" style={{ background: "rgba(0, 227, 185, 0.3)", border: "1.168px solid #00e3b9", borderRadius: "clamp(8px, 2.91vw, 11.679px)", height: "clamp(44px, 6.41svh, 56px)", flex: 1 }}>
              <span className="uppercase whitespace-nowrap" style={{ fontFamily: "'Tektur', sans-serif", fontSize: "clamp(13px, 5.23vw, 21px)", fontVariationSettings: "'wdth' 100", fontWeight: 500, color: "#00e3b9", lineHeight: 1 }}>Deposit</span>
            </button>
            <button onClick={triggerTooltip} className="flex items-center justify-center cursor-pointer" style={{ background: "rgba(15, 11, 22, 0.3)", border: "1.168px solid #00e3b9", borderRadius: "clamp(7px, 2.49vw, 10px)", height: "clamp(44px, 6.41svh, 56px)", flex: 1 }}>
              <span className="uppercase whitespace-nowrap" style={{ fontFamily: "'Tektur', sans-serif", fontSize: "clamp(11px, 4.23vw, 17px)", fontVariationSettings: "'wdth' 100", fontWeight: 500, color: "#00e3b9", lineHeight: 1 }}>Withdrawal</span>
            </button>
          </div>
        </div>
      </div>

      <div
        className="flex flex-col w-full"
        style={{ gap: "clamp(8px, 1.37svh, 12px)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* TMA: always connected; web: show Connect button */}
        <div className="flex items-center justify-between w-full" style={{ ...rowStyle, opacity: isTMA ? 0.5 : 1 }}>
          <div className="flex items-center" style={{ gap: "12px" }}>
            <div style={{ width: "24px", height: "24px", position: "relative", flexShrink: 0 }}>
              <Image src="/assets/icons/telegram.svg" alt="Telegram" fill className="object-contain" />
            </div>
            <span style={{ fontFamily: "'Wix Madefor Display', sans-serif", fontSize: "clamp(14px, 4.48vw, 18px)", fontWeight: 500, color: "#ffffff", whiteSpace: "nowrap" }}>
              Telegram
            </span>
          </div>
          {isTMA ? (
            <span style={{ fontFamily: "'Wix Madefor Display', sans-serif", fontSize: "clamp(12px, 3.48vw, 14px)", fontWeight: 500, color: "#ffffff", whiteSpace: "nowrap" }}>
              Connected
            </span>
          ) : (
            <button
              onClick={(e) => e.stopPropagation()}
              style={{ fontFamily: "'Wix Madefor Display', sans-serif", fontSize: "clamp(12px, 3.48vw, 14px)", fontWeight: 500, color: "#00e3b9", background: "none", border: "none", padding: 0, cursor: "pointer", whiteSpace: "nowrap" }}
            >
              Connect
            </button>
          )}
        </div>

        {!isTMA && (
          <div className="flex items-center justify-between w-full" style={{ ...rowStyle, opacity: 0.3 }}>
            <div className="flex items-center" style={{ gap: "12px" }}>
              <div style={{ width: "24px", height: "24px", position: "relative", flexShrink: 0 }}>
                <Image src="/assets/icons/google.svg" alt="Google" fill className="object-contain" />
              </div>
              <span style={{ fontFamily: "'Wix Madefor Display', sans-serif", fontSize: "clamp(14px, 4.48vw, 18px)", fontWeight: 500, color: "#ffffff", whiteSpace: "nowrap" }}>
                Google
              </span>
            </div>
            <span style={{ fontFamily: "'Wix Madefor Display', sans-serif", fontSize: "clamp(12px, 3.48vw, 14px)", fontWeight: 500, color: "#ffffff", whiteSpace: "nowrap" }}>
              Connected
            </span>
          </div>
        )}

        <div className="w-full flex flex-col" style={{ gap: "6px", paddingTop: "clamp(6px, 1.2svh, 10px)", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <p style={{ fontFamily: "'Wix Madefor Display', sans-serif", fontSize: "clamp(10px, 3vw, 12px)", fontWeight: 500, color: "rgba(255,255,255,0.4)", lineHeight: 1.4 }}>
            Ref.bonus: 50% service ETH fees + 5 pts per friend game
          </p>
          <div className="flex items-center w-full" style={{ gap: "8px" }}>
            <p style={{ fontFamily: "'Wix Madefor Display', sans-serif", fontSize: "clamp(10px, 3vw, 12px)", fontWeight: 500, color: "rgba(255,255,255,0.4)", lineHeight: 1, flexShrink: 0 }}>
              Ref.link:
            </p>
            <p style={{ fontFamily: "'Wix Madefor Display', sans-serif", fontSize: "clamp(10px, 3vw, 12px)", fontWeight: 400, color: "rgba(255,255,255,0.2)", lineHeight: 1, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user.inviteLink ? user.inviteLink.replace("https://", "") : "loading..."}
            </p>
            <div className="relative" style={{ flexShrink: 0 }}>
              {showRefCopied && (
                <div style={{ position: "absolute", bottom: "calc(100% + 8px)", right: 0, backgroundColor: "#0f0b16", border: "1px solid #00e3b9", borderRadius: "6px", padding: "5px 10px", whiteSpace: "nowrap", fontFamily: "'Wix Madefor Display', sans-serif", fontSize: "clamp(10px, 3vw, 12px)", fontWeight: 500, color: "#00e3b9", zIndex: 20, pointerEvents: "none" }}>
                  Your personal link has been copied — send it to your friends!
                  <span style={{ position: "absolute", top: "100%", right: "12px", width: 0, height: 0, borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: "6px solid #00e3b9" }} />
                </div>
              )}
              <button onClick={handleCopyRef} style={{ fontFamily: "'Wix Madefor Display', sans-serif", fontSize: "clamp(10px, 3vw, 12px)", fontWeight: 600, color: "#00e3b9", background: "none", border: "1px solid rgba(0,227,185,0.4)", borderRadius: "5px", padding: "3px 8px", cursor: "pointer", whiteSpace: "nowrap" }}>
                Copy link
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="flex flex-col items-center"
        style={{ gap: "clamp(18px, 2.74svh, 24px)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center" style={{ gap: "16px" }}>
          <button onClick={() => window.open("https://x.com/StarFlipGaming", "_blank")} style={{ width: "24px", height: "24px", position: "relative", background: "none", border: "none", padding: 0, cursor: "pointer", filter: "invert(71%) sepia(99%) saturate(362%) hue-rotate(118deg) brightness(98%) contrast(101%)" }}>
            <Image src="/assets/icons/twitter.svg" alt="Twitter" fill className="object-contain" />
          </button>
          <button onClick={() => window.open("https://t.me/StarFlipNews", "_blank")} style={{ width: "24px", height: "24px", position: "relative", background: "none", border: "none", padding: 0, cursor: "pointer", filter: "invert(71%) sepia(99%) saturate(362%) hue-rotate(118deg) brightness(98%) contrast(101%)" }}>
            <Image src="/assets/icons/telegram.svg" alt="Telegram" fill className="object-contain" />
          </button>
        </div>

        <button onClick={() => window.open("https://www.notion.so/StarFlip-How-to-Play-36e95daac839807aab01ccbc1bc3d8a5?pvs=28", "_blank")} style={{ fontFamily: "'Wix Madefor Display', sans-serif", fontSize: "clamp(16px, 4.97vw, 20px)", fontWeight: 700, color: "#00e3b9", background: "none", border: "none", padding: 0, cursor: "pointer", whiteSpace: "nowrap" }}>
          How to play
        </button>

        <button onClick={() => { onLeaderboard?.(); onClose(); }} style={{ fontFamily: "'Wix Madefor Display', sans-serif", fontSize: "clamp(16px, 4.97vw, 20px)", fontWeight: 700, color: "#00e3b9", background: "none", border: "none", padding: 0, cursor: "pointer", whiteSpace: "nowrap" }}>
          Leaderboard
        </button>

        <button onClick={() => window.open("https://t.me/unnamedDev0x", "_blank")} style={{ fontFamily: "'Wix Madefor Display', sans-serif", fontSize: "clamp(16px, 4.97vw, 20px)", fontWeight: 700, color: "#00e3b9", background: "none", border: "none", padding: 0, cursor: "pointer", whiteSpace: "nowrap" }}>
          Support
        </button>

        {/* TMA has no persistent session to log out of */}
        {!isTMA && (
          <button
            onClick={(e) => { e.stopPropagation(); onLogout?.(); onClose(); }}
            style={{ fontFamily: "'Wix Madefor Display', sans-serif", fontSize: "clamp(16px, 4.97vw, 20px)", fontWeight: 700, color: "#ffffff", background: "none", border: "none", padding: 0, cursor: "pointer", whiteSpace: "nowrap" }}
          >
            Log out
          </button>
        )}
      </div>
    </div>
  );
}
