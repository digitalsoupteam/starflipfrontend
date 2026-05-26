"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import PopupOverlay from "../common/PopupOverlay";
import PopupWelcomeBonus from "@/components/popups/PopupWelcomeBonus";
import PopupDailyBonus from "@/components/popups/PopupDailyBonus";
import PopupAirdrop from "@/components/popups/PopupAirdrop";
import MenuLogged from "@/components/menus/MenuLogged";
import MenuUnlogged from "../menus/MenuUnlogged";
import SearchingMatch from "@/components/searching/SearchingMatch";
import CancelledMatch from "@/components/searching/CancelledMatch";
import Game from "@/components/screens/Game";
import { useUser } from "@/context/UserContext";

type OverlayType =
  | "welcome"
  | "daily"
  | "airdrop"
  | "menu"
  | "searching"
  | "cancelled"
  | "game"
  | null;

// typs for rendering PopupOverlay
const POPUP_TYPES = [
  "welcome",
  "daily",
  "airdrop",
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
  const { user, setUser, logout } = useUser();

  const close = () => setActive(null);

  //to do: delete this when back will give me starting matches *only for test webinterface*
  useEffect(() => {
    if (active !== "searching") return;
    const timer = setTimeout(() => {
      const result: OverlayType = Math.random() < 0.5 ? "game" : "cancelled";
      setActive(result);
    }, 15000);
    return () => clearTimeout(timer);
  }, [active]);

  if (active === "game") {
    return (
      <Game currentTurn="You" playerName="You" opponentName="PlayerName" />
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
                    src="/assets/icons/eth.png"
                    alt="ETH"
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
                  {user.ethBalance}
                </span>
              </div>
              <button
                onClick={() => setActive("welcome")}
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
                Deposit
              </button>
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
            onClick={() => setActive(active === "menu" ? null : "menu")}
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
            <button
              onClick={() => setActive("searching")}
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

            <button
              className="flex items-center justify-center shrink-0 cursor-pointer"
              onClick={() => setActive("daily")}
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
                onClick={() => setActive("airdrop")}
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
        <PopupOverlay onClose={close}>
          {active === "welcome" && <PopupWelcomeBonus onClose={close} />}
          {active === "daily" && <PopupDailyBonus onClose={close} />}
          {active === "airdrop" && <PopupAirdrop onClose={close} />}
          {active === "searching" && (
            <SearchingMatch
              onStop={close}
              onOpenChat={() => {}}
              onCancel={() => setActive("cancelled")}
            />
          )}
          {active === "cancelled" && (
            <CancelledMatch onStartAnother={() => setActive("searching")} />
          )}
          {active === "menu" &&
            (user.isLoggedIn ? (
              <MenuLogged
                onClose={close}
                accId={user.accId}
                ethBalance={user.ethBalance}
                pts={user.pts}
                onLogout={logout}
              />
            ) : (
              <MenuUnlogged
                onClose={close}
                onLogin={() => {
                  setUser({
                    accId: "Paramour",
                    ethBalance: "12.53 ETH",
                    pts: "530 PTS",
                    isLoggedIn: true,
                  });
                }}
              />
            ))}
        </PopupOverlay>
      )}
    </div>
  );
}
