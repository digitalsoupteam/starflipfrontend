"use client";

import Image from "next/image";
import { useUser } from "@/context/UserContext";
import { api, AuthResponse } from "@/lib/api";
import { useLaunchParams } from "@telegram-apps/sdk-react";

interface MenuUnloggedProps {
  onClose: () => void;
  onLogin?: () => void;
}

export default function MenuUnlogged({ onClose, onLogin }: MenuUnloggedProps) {
  const { user, setUser } = useUser();
  const launchParams = useLaunchParams() as { initData?: { user?: { id?: number } } };
  const telegramId = launchParams.initData?.user?.id;

  const handleAuth = async (provider: "telegram" | "google") => {
    try {
      let data: AuthResponse;

      if (provider === "telegram") {
        if (!telegramId) {
          console.warn("Telegram ID not available");
          return;
        }
        data = await api.post<AuthResponse>("/auth/telegram", {
          telegramId: String(telegramId),
        });
      } else {
        // TODO: Integrate Google OAuth (obtain googleId via Google Identity Services)
        console.warn("Google OAuth not yet integrated");
        return;
      }

      setUser({
        accId: data.player.playerId,
        ethBalance: "0 ETH",
        pts: `${data.player.points} PTS`,
        isLoggedIn: true,
      });
      onLogin?.();
      onClose();
    } catch (err) {
      console.error(`Auth error (${provider}):`, err);
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-between w-full h-full"
      style={{
        paddingTop: "clamp(100px, 15svh, 140px)",
        paddingBottom: "clamp(60px, 9svh, 80px)",
        paddingLeft: "clamp(16px, 3.98vw, 16px)",
        paddingRight: "clamp(16px, 3.98vw, 16px)",
      }}
      onClick={onClose}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
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

      <div
        className="flex flex-col items-center w-full"
        style={{ gap: "clamp(18px, 2.74svh, 24px)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <p
          style={{
            fontFamily: "'Wix Madefor Display', sans-serif",
            fontSize: "clamp(16px, 4.48vw, 18px)",
            color: "#ffffff",
            fontWeight: 400,
            lineHeight: 1.4,
            whiteSpace: "nowrap",
          }}
        >
          Login with
        </p>

        <div className="flex flex-col w-full" style={{ gap: "clamp(8px, 1.37svh, 12px)" }}>
          {/* Google */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAuth("google");
            }}
            className="flex items-center justify-center w-full cursor-pointer"
            style={{
              backgroundColor: "#00e3b9",
              border: "none",
              borderRadius: "clamp(9px, 2.91vw, 11.679px)",
              height: "clamp(48px, 6.41svh, 56px)",
              gap: "clamp(8px, 2.99vw, 12px)",
              boxShadow: "0px 4px 4px 0px rgba(0,0,0,0.25)",
              opacity: user.isLoggedIn ? 0.4 : 1,
              cursor: user.isLoggedIn ? "default" : "pointer",
            }}
            disabled={user.isLoggedIn}
          >
            <div style={{ width: "24px", height: "24px", position: "relative", flexShrink: 0 }}>
              <Image src="/assets/icons/google.svg" alt="Google" fill className="object-contain" />
            </div>
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
              {user.isLoggedIn ? "Google — Connected" : "Google"}
            </span>
          </button>

          {/* Telegram */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAuth("telegram");
            }}
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
            <div style={{ width: "24px", height: "24px", position: "relative", flexShrink: 0, filter: "brightness(0)",  }}>
              <Image src="/assets/icons/telegram.svg" alt="Telegram" fill className="object-contain" />
            </div>
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
              Telegram
            </span>
          </button>
        </div>
      </div>

      <div
        className="flex flex-col items-center"
        style={{ gap: "clamp(18px, 2.74svh, 24px)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center" style={{ gap: "16px" }}>
          <button
            style={{
              width: "24px", height: "24px", position: "relative",
              background: "none", border: "none", padding: 0, cursor: "pointer",
              filter: "invert(71%) sepia(99%) saturate(362%) hue-rotate(118deg) brightness(98%) contrast(101%)",
            }}
          >
            <Image src="/assets/icons/twitter.svg" alt="Twitter" fill className="object-contain" />
          </button>
          <button
            style={{
              width: "24px", height: "24px", position: "relative",
              background: "none", border: "none", padding: 0, cursor: "pointer",
              filter: "invert(71%) sepia(99%) saturate(362%) hue-rotate(118deg) brightness(98%) contrast(101%)",
            }}
          >
            <Image src="/assets/icons/telegram.svg" alt="Telegram" fill className="object-contain" />
          </button>
        </div>

        <button style={{ fontFamily: "'Wix Madefor Display', sans-serif", fontSize: "clamp(16px, 4.97vw, 20px)", fontWeight: 700, color: "#00e3b9", background: "none", border: "none", padding: 0, cursor: "pointer", whiteSpace: "nowrap" }}>
          How to play
        </button>

        <button style={{ fontFamily: "'Wix Madefor Display', sans-serif", fontSize: "clamp(16px, 4.97vw, 20px)", fontWeight: 700, color: "#00e3b9", background: "none", border: "none", padding: 0, cursor: "pointer", whiteSpace: "nowrap" }}>
          Support
        </button>
      </div>
    </div>
  );
}
