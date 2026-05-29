"use client";

import Image from "next/image";
import { useUser } from "@/context/UserContext";
import { api, ApiError, weiToEth, AuthResponse, ClaimPointsResponse, FaucetResponse } from "@/lib/api";

const HOW_TO_PLAY_URL =
  "https://www.notion.so/StarFlip-How-to-Play-36e95daac839807aab01ccbc1bc3d8a5?pvs=28";

interface MenuUnloggedProps {
  onClose: () => void;
  onLogin?: () => void;
  onFirstLogin?: () => void; // triggers WelcomeBonus popup on first-ever login
}

export default function MenuUnlogged({ onClose, onLogin, onFirstLogin }: MenuUnloggedProps) {
  const { setUser } = useUser();

  // Read at click time, not at render time — avoids issues if TG SDK loads late
  const getTelegramId = (): string | undefined => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (window as any).Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString();
    } catch {
      return undefined;
    }
  };

  // TMA passes the referral via start_param; browser uses ?ref= query param
  const getReferralCode = (): string | undefined => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const startParam = (window as any).Telegram?.WebApp?.initDataUnsafe?.start_param as string | undefined;
      if (startParam?.startsWith("ref_")) return startParam;
    } catch {}
    try {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get("ref");
      if (ref) return ref.startsWith("ref_") ? ref : `ref_${ref}`;
    } catch {}
    return undefined;
  };

  const runPostAuthFlow = async (
    playerId: string,
    initialPoints: number,
    initialBalance: string,
    inviteCode: string,
    inviteLink: string,
  ) => {
    const ethBalance = `${weiToEth(initialBalance)} ETH`;
    setUser({ accId: playerId, ethBalance, pts: `${initialPoints} PTS`, isLoggedIn: true, inviteCode, inviteLink });
    onLogin?.();
    onClose();

    try {
      const claimData = await api.post<ClaimPointsResponse>("/game/claim-points");
      setUser({ accId: playerId, ethBalance, pts: `${claimData.points} PTS`, isLoggedIn: true, inviteCode, inviteLink });

      try {
        const faucetData = await api.post<FaucetResponse>("/game/faucet");
        setUser({ accId: playerId, ethBalance: `${weiToEth(faucetData.balance)} ETH`, pts: `${claimData.points} PTS`, isLoggedIn: true, inviteCode, inviteLink });
      } catch {
        // non-critical — mainnet returns 403, testnet may have cooldown
      }

      onFirstLogin?.();
    } catch (err) {
      if (err instanceof ApiError && err.status === 429) {
        // returning user — daily bonus already claimed today
      } else {
        console.error("Post-auth flow error:", err);
      }
    }
  };

  const handleAuth = async (provider: "telegram" | "google") => {
    try {
      let data: AuthResponse;
      const referralCode = getReferralCode();

      if (provider === "telegram") {
        const telegramId = getTelegramId();
        if (!telegramId) { console.warn("Telegram ID not available"); return; }
        data = await api.post<AuthResponse>("/auth/telegram", { telegramId, referralCode });
      } else {
        console.warn("Google OAuth not yet integrated");
        return;
      }

      await runPostAuthFlow(
        data.player.playerId,
        data.player.points,
        data.player.balance ?? "0",
        data.player.inviteCode ?? "",
        data.player.inviteLink ?? "",
      );
    } catch (err) {
      console.error(`Auth error (${provider}):`, err);
    }
  };

  // TODO: remove before production
  const handleDevLogin = async (telegramId: string) => {
    try {
      const referralCode = getReferralCode();
      const data = await api.post<AuthResponse>("/auth/telegram", { telegramId, referralCode });
      await runPostAuthFlow(
        data.player.playerId,
        data.player.points,
        data.player.balance ?? "0",
        data.player.inviteCode ?? "",
        data.player.inviteLink ?? "",
      );
    } catch (err) {
      console.error("Dev login error:", err);
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
          Log in and claim your daily bonus 
        </p>

        <div className="flex flex-col w-full" style={{ gap: "clamp(8px, 1.37svh, 12px)" }}>
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
            <div style={{ width: "24px", height: "24px", position: "relative", flexShrink: 0, filter: "brightness(0)" }}>
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

          {process.env.NODE_ENV === "development" && [{label: "Dev Player 1", id: "111111111"}, {label: "Dev Player 2", id: "222222222"}].map(({ label, id }) => (
            <button
              key={id}
              onClick={(e) => { e.stopPropagation(); handleDevLogin(id); }}
              className="flex items-center justify-center w-full cursor-pointer"
              style={{
                backgroundColor: "transparent",
                border: "1px dashed #545454",
                borderRadius: "clamp(9px, 2.91vw, 11.679px)",
                height: "clamp(40px, 5.5svh, 48px)",
              }}
            >
              <span
                className="uppercase whitespace-nowrap"
                style={{
                  fontFamily: "'Tektur', sans-serif",
                  fontSize: "clamp(12px, 3.73vw, 15px)",
                  fontVariationSettings: "'wdth' 100",
                  fontWeight: 500,
                  color: "#545454",
                  lineHeight: 1,
                }}
              >
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div
        className="flex flex-col items-center"
        style={{ gap: "clamp(18px, 2.74svh, 24px)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center" style={{ gap: "16px" }}>
          <button
            onClick={() => window.open("https://x.com/StarFlipGaming", "_blank")}
            style={{
              width: "24px", height: "24px", position: "relative",
              background: "none", border: "none", padding: 0, cursor: "pointer",
              filter: "invert(71%) sepia(99%) saturate(362%) hue-rotate(118deg) brightness(98%) contrast(101%)",
            }}
          >
            <Image src="/assets/icons/twitter.svg" alt="Twitter" fill className="object-contain" />
          </button>
          <button
            onClick={() => window.open("https://t.me/StarFlipNews", "_blank")}
            style={{
              width: "24px", height: "24px", position: "relative",
              background: "none", border: "none", padding: 0, cursor: "pointer",
              filter: "invert(71%) sepia(99%) saturate(362%) hue-rotate(118deg) brightness(98%) contrast(101%)",
            }}
          >
            <Image src="/assets/icons/telegram.svg" alt="Telegram" fill className="object-contain" />
          </button>
        </div>

        <button onClick={() => window.open(HOW_TO_PLAY_URL, "_blank")} style={{ fontFamily: "'Wix Madefor Display', sans-serif", fontSize: "clamp(16px, 4.97vw, 20px)", fontWeight: 700, color: "#00e3b9", background: "none", border: "none", padding: 0, cursor: "pointer", whiteSpace: "nowrap" }}>
          How to play
        </button>

        <button onClick={() => window.open("https://t.me/unnamedDev0x", "_blank")} style={{ fontFamily: "'Wix Madefor Display', sans-serif", fontSize: "clamp(16px, 4.97vw, 20px)", fontWeight: 700, color: "#00e3b9", background: "none", border: "none", padding: 0, cursor: "pointer", whiteSpace: "nowrap" }}>
          Support
        </button>
      </div>
    </div>
  );
}
