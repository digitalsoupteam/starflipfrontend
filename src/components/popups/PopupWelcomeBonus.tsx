"use client";

import Image from "next/image";
import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { api, ApiError, formatUsdt, FaucetResponse } from "@/lib/api";

interface PopupWelcomeBonusProps {
  onClose: () => void;
  onLoginInstead?: () => void;
  /** True when shown after TMA auto-login — changes text and hides sign-in buttons */
  isTMA?: boolean;
}

export default function PopupWelcomeBonus({ onClose, onLoginInstead, isTMA = false }: PopupWelcomeBonusProps) {
  const { user, setUser } = useUser();
  const [devMsg, setDevMsg] = useState<string | null>(null);

  // TODO: remove before production
  const handleDevFaucet = async () => {
    setDevMsg(null);
    try {
      const data = await api.post<FaucetResponse>("/game/faucet");
      const usdtAmount = formatUsdt(data.balance);
      setUser({ ...user, usdtBalance: `${usdtAmount} USDT` });
      setDevMsg(`✓ ${usdtAmount} USDT`);
    } catch (err) {
      if (err instanceof ApiError && err.status === 429) {
        setDevMsg("Come back tomorrow");
      } else if (err instanceof ApiError && err.status === 403) {
        setDevMsg("Faucet disabled on mainnet");
      } else {
        setDevMsg("Connection error, try again");
      }
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
        <div className="flex items-start justify-between relative" style={{ zIndex: 2 }}>
          <div style={{ flex: 1, marginRight: "12px" }}>
            <div
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
              {isTMA ? (
                <p>Your welcome<br />bonus!</p>
              ) : (
                <>
                  <p>Connect and</p>
                  <p>take your bonus</p>
                </>
              )}
            </div>
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
              {isTMA
                ? "You've just received a welcome bonus! It has been credited to your account."
                : "2000 test USDT and 300 PTS for first login, and 30 PTS per everyday login"}
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

        <div className="relative flex flex-col" style={{ gap: "clamp(8px, 2.99vw, 12px)" }}>
          <div
            className="absolute pointer-events-none"
            style={{
              left: "clamp(-52px, -15.42vw, -70px)",
              top: "clamp(-274px, -90.82vw, -365px)",
              width: "clamp(339px, 112.44vw, 452px)",
              height: "clamp(351px, 116.42vw, 468px)",
              zIndex: 1,
            }}
          >
            <Image
              src="/assets/game/bonus.png"
              alt="Welcome bonus"
              fill
              className="object-cover"
              sizes="113vw"
            />
          </div>

          {isTMA ? (
            <button
              onClick={onClose}
              className="flex items-center justify-center w-full cursor-pointer"
              style={{
                backgroundColor: "#00e3b9",
                border: "none",
                borderRadius: "clamp(9px, 2.91vw, 11.679px)",
                height: "clamp(48px, 6.41svh, 56px)",
                boxShadow: "0px 4px 4px 0px rgba(0,0,0,0.25)",
                position: "relative",
                zIndex: 2,
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
                Okay!
              </span>
            </button>
          ) : (
            <>
              <button
                className="flex items-center justify-center w-full cursor-pointer"
                style={{
                  backgroundColor: "#00e3b9",
                  border: "none",
                  borderRadius: "clamp(9px, 2.91vw, 11.679px)",
                  height: "clamp(48px, 6.41svh, 56px)",
                  gap: "clamp(8px, 2.99vw, 12px)",
                  boxShadow: "0px 4px 4px 0px rgba(0,0,0,0.25)",
                  position: "relative",
                  zIndex: 2,
                }}
              >
                <div style={{ width: "24px", height: "24px", position: "relative", flexShrink: 0 }}>
                  <Image src="/assets/icons/google.svg" alt="Google" fill className="object-contain" />
                </div>
                <span className="uppercase whitespace-nowrap" style={{ fontFamily: "'Tektur', sans-serif", fontSize: "clamp(14px, 4.48vw, 18px)", fontVariationSettings: "'wdth' 100", fontWeight: 500, color: "#0d0d0d", lineHeight: 1 }}>
                  Sign up with Google
                </span>
              </button>

              <button
                className="flex items-center justify-center w-full cursor-pointer"
                style={{
                  backgroundColor: "#00e3b9",
                  border: "none",
                  borderRadius: "clamp(9px, 2.91vw, 11.679px)",
                  height: "clamp(48px, 6.41svh, 56px)",
                  gap: "clamp(8px, 2.99vw, 12px)",
                  boxShadow: "0px 4px 4px 0px rgba(0,0,0,0.25)",
                  position: "relative",
                  zIndex: 2,
                }}
              >
                <div style={{ width: "24px", height: "24px", position: "relative", flexShrink: 0, filter: "brightness(0)" }}>
                  <Image src="/assets/icons/telegram.svg" alt="Telegram" fill className="object-contain" />
                </div>
                <span className="uppercase whitespace-nowrap" style={{ fontFamily: "'Tektur', sans-serif", fontSize: "clamp(14px, 4.48vw, 18px)", fontVariationSettings: "'wdth' 100", fontWeight: 500, color: "#0d0d0d", lineHeight: 1 }}>
                  Sign up with Telegram
                </span>
              </button>

              <p style={{ fontFamily: "'Wix Madefor Display', sans-serif", fontSize: "clamp(12px, 3.73vw, 15px)", color: "#ffffff", textAlign: "center", lineHeight: 1.4, position: "relative", zIndex: 2 }}>
                Already have an account?{" "}
                <button
                  onClick={(e) => { e.stopPropagation(); onClose(); onLoginInstead?.(); }}
                  style={{ fontFamily: "inherit", fontSize: "inherit", color: "#ffffff", background: "none", border: "none", padding: 0, cursor: "pointer", textDecoration: "underline", lineHeight: "inherit" }}
                >
                  Log in
                </button>{" "}
                and claim your daily bonus
              </p>
            </>
          )}

          {/* TODO: remove before production */}
          {process.env.NODE_ENV === "development" && (
            <div className="flex flex-col" style={{ gap: "6px", position: "relative", zIndex: 2 }}>
              <button
                onClick={handleDevFaucet}
                className="flex items-center justify-center w-full cursor-pointer"
                style={{ backgroundColor: "transparent", border: "1px dashed #545454", borderRadius: "clamp(9px, 2.91vw, 11.679px)", height: "clamp(40px, 5.5svh, 48px)" }}
              >
                <span className="uppercase whitespace-nowrap" style={{ fontFamily: "'Tektur', sans-serif", fontSize: "clamp(12px, 3.73vw, 15px)", fontVariationSettings: "'wdth' 100", fontWeight: 500, color: "#545454", lineHeight: 1 }}>
                  DEV: Claim Faucet
                </span>
              </button>
              {devMsg && (
                <p style={{ fontFamily: "'Wix Madefor Display', sans-serif", fontSize: "clamp(12px, 3.73vw, 15px)", color: devMsg.startsWith("✓") ? "#00e3b9" : "#ff5100", textAlign: "center", lineHeight: 1.3 }}>
                  {devMsg}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
