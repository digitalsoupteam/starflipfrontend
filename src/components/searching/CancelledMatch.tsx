"use client";

import Image from "next/image";

export type CancelReason = "timeout" | "afk" | "balance";

interface CancelledMatchProps {
  onClose: () => void;
  reason?: CancelReason;
}

const REASON_CONTENT: Record<CancelReason, { title: string[]; subtitle: string }> = {
  timeout: {
    title: ["Search", "cancelled"],
    subtitle: "Reason: long wait",
  },
  afk: {
    title: ["Match", "cancelled"],
    subtitle: "Reason: one player AFK",
  },
  balance: {
    title: ["Search", "cancelled"],
    subtitle: "Reason: not enough ETH for the bid",
  },
};

export default function CancelledMatch({ onClose, reason = "timeout" }: CancelledMatchProps) {
  const { title, subtitle } = REASON_CONTENT[reason];
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
          justifyContent: "flex-start",
          gap: "clamp(20px, 3.79svh, 30px)",
        }}
        onClick={(e) => e.stopPropagation()}
      >

        {/* X close button top-right */}
        <button
          onClick={onClose}
          className="absolute flex items-center justify-center cursor-pointer"
          style={{
            top: "clamp(14px, 4vw, 18px)",
            right: "clamp(14px, 4vw, 18px)",
            width: "clamp(28px, 7.5vw, 32px)",
            height: "clamp(28px, 7.5vw, 32px)",
            zIndex: 4,
            background: "transparent",
            border: "none",
            padding: 0,
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" style={{ width: "100%", height: "100%" }}>
            <path d="M6 6L18 18M18 6L6 18" stroke="#00e3b9" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

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
          style={{ left: 0, right: 0, bottom: 0, height: "clamp(120px, 28svh, 200px)", zIndex: 1 }}
        >
          <Image src="/assets/game/sad-astra.png" alt="Sad Astra" fill className="object-cover object-top" sizes="90vw" />
        </div>

        <div
          className="relative shrink-0"
          style={{ width: "clamp(60px, 16vw, 80px)", height: "clamp(20px, 5.5vw, 26px)", zIndex: 2 }}
        >
          <Image src="/assets/game/xxx.png" alt="xxx" fill className="object-contain object-left" sizes="80px" />
        </div>

        <div
          className="relative flex flex-col shrink-0"
          style={{ gap: "clamp(12px, 1.72svh, 15px)", zIndex: 2 }}
        >
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
            {title.map((line, i) => <p key={i}>{line}</p>)}
          </div>

          <p
            style={{
              fontFamily: "'Wix Madefor Display', sans-serif",
              fontSize: "clamp(14px, 4.48vw, 18px)",
              color: "#ffffff",
              lineHeight: 1.4,
              fontWeight: 400,
              maxWidth: "clamp(200px, 68.78vw, 276px)",
            }}
          >
            {subtitle}
          </p>
        </div>

        <button
          onClick={onClose}
          className="flex items-center justify-center cursor-pointer shrink-0 relative"
          style={{
            background: "rgba(0, 227, 185, 0.3)",
            border: "1.168px solid #00e3b9",
            borderRadius: "clamp(9px, 2.91vw, 11.679px)",
            height: "clamp(44px, 6.41svh, 56px)",
            paddingLeft: "clamp(12px, 4.07vw, 16.35px)",
            paddingRight: "clamp(12px, 4.07vw, 16.35px)",
            zIndex: 2,
            alignSelf: "flex-start",
          }}
        >
          <span
            className="uppercase whitespace-nowrap"
            style={{
              fontFamily: "'Tektur', sans-serif",
              fontSize: "clamp(14px, 5.23vw, 21px)",
              fontVariationSettings: "'wdth' 100",
              fontWeight: 500,
              color: "#00e3b9",
              lineHeight: 1,
            }}
          >
            OK
          </span>
        </button>
      </div>
    </div>
  );
}
