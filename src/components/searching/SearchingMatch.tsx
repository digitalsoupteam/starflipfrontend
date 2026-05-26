"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface SearchingMatchProps {
  onStop: () => void;
  onOpenChat: () => void;
  onCancel?: () => void;
}

function Loader() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % 8);
    }, 150);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative shrink-0" style={{ width: "40px", height: "40px" }}>
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * 45 * Math.PI) / 180;
        const cx = 20 + Math.sin(angle) * 13;
        const cy = 20 - Math.cos(angle) * 13;
        const distance = (i - active + 8) % 8;
        const opacity = distance === 0 ? 1 : Math.max(0.15, 1 - distance * 0.12);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              width: "6px",
              height: "14px",
              backgroundColor: "#00e3b9",
              borderRadius: "3px",
              opacity,
              left: `${cx - 3}px`,
              top: `${cy - 7}px`,
              transform: `rotate(${i * 45}deg)`,
              transformOrigin: "center center",
              transition: "opacity 0.1s ease",
            }}
          />
        );
      })}
    </div>
  );
}

export default function SearchingMatch({ onStop, onOpenChat, onCancel }: SearchingMatchProps) {

  // TODO: заменить на сигнал от бэкенда
  useEffect(() => {
    const timer = setTimeout(() => {
      onCancel?.();
    }, 30000);
    return () => clearTimeout(timer);
  }, [onCancel]);

  return (
    <div className="flex items-center justify-center w-full h-full" onClick={onStop}>
      {/* Карточка */}
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
            right: "clamp(-50px, -12vw, -30px)",
            top: "clamp(90px, 16svh, 130px)",
            width: "clamp(90px, 33vw, 133px)",
            height: "clamp(90px, 33vw, 133px)",
            zIndex: 3,
            mixBlendMode: "screen",
            transform: "rotate(-1.41deg)",
          }}
        >
          <Image src="/assets/game/coins.png" alt="" fill className="object-contain" sizes="133px" />
        </div>

        <div
          className="absolute pointer-events-none"
          style={{ left: 0, right: 0, bottom: 0, height: "clamp(130px, 30svh, 230px)" }}
        >
          <Image src="/assets/game/astra-wait.png" alt="Astra waiting" fill className="object-cover object-bottom" sizes="90vw" />
        </div>

        <div className="relative flex flex-col w-full" style={{ gap: "clamp(20px, 3.79svh, 30px)", zIndex: 2 }}>
          <div className="flex items-start justify-between w-full">
            <div
              style={{
                fontFamily: "'Tektur', sans-serif",
                fontSize: "clamp(30px, 11.19vw, 45px)",
                fontVariationSettings: "'wdth' 100",
                fontWeight: 400,
                color: "#00e3b9",
                textShadow: "0px 0px 27px rgba(0, 255, 179, 0.57)",
                lineHeight: 1.05,
              }}
            >
              <p>Finding</p>
              <p>a match</p>
            </div>
            <Loader />
          </div>

          <p style={{ fontFamily: "'Wix Madefor Display', sans-serif", fontSize: "clamp(14px, 4.48vw, 18px)", color: "#ffffff", lineHeight: 1.4, fontWeight: 400 }}>
            Searching for an available opponent...
          </p>

          <div className="flex items-center" style={{ gap: "clamp(10px, 3.73vw, 15px)" }}>
            <button
              onClick={onStop}
              className="flex items-center justify-center cursor-pointer shrink-0"
              style={{ background: "rgba(15, 11, 22, 0.3)", border: "1.168px solid #00e3b9", borderRadius: "clamp(7px, 2.49vw, 10px)", height: "clamp(44px, 6.41svh, 56px)", paddingLeft: "clamp(10px, 2.91vw, 11.679px)", paddingRight: "clamp(12px, 4.07vw, 16.35px)", gap: "clamp(6px, 2.04vw, 8.175px)" }}
            >
              <div className="relative shrink-0 flex items-center justify-center" style={{ width: "clamp(18px, 6.39vw, 25.693px)", height: "clamp(18px, 6.39vw, 25.693px)" }}>
                <svg viewBox="0 0 26 26" fill="none" style={{ width: "100%", height: "100%" }}>
                  <path d="M6 6L20 20M20 6L6 20" stroke="#00e3b9" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
              <span className="uppercase whitespace-nowrap" style={{ fontFamily: "'Tektur', sans-serif", fontSize: "clamp(14px, 5.23vw, 21px)", fontVariationSettings: "'wdth' 100", fontWeight: 500, color: "#00e3b9", lineHeight: 1 }}>
                stop
              </span>
            </button>

            <button
              onClick={onOpenChat}
              className="flex items-center justify-center cursor-pointer shrink-0"
              style={{ background: "rgba(0, 227, 185, 0.3)", border: "1.168px solid #00e3b9", borderRadius: "clamp(9px, 2.91vw, 11.679px)", height: "clamp(44px, 6.41svh, 56px)", paddingLeft: "clamp(12px, 4.07vw, 16.35px)", paddingRight: "clamp(12px, 4.07vw, 16.35px)" }}
            >
              <span className="uppercase whitespace-nowrap" style={{ fontFamily: "'Tektur', sans-serif", fontSize: "clamp(14px, 5.23vw, 21px)", fontVariationSettings: "'wdth' 100", fontWeight: 500, color: "#00e3b9", lineHeight: 1 }}>
                OPEN CHAT
              </span>
            </button>
          </div>

          <p style={{ fontFamily: "'Wix Madefor Display', sans-serif", fontSize: "clamp(12px, 3.98vw, 16px)", color: "#7f7f7f", lineHeight: 1.4, fontWeight: 400 }}>
            Tip: If you cant find an opponent, ask in the game chat — someone might join you faster.
          </p>
        </div>
      </div>
    </div>
  );
}
