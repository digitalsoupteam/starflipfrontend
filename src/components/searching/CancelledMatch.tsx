"use client";

import Image from "next/image";

interface CancelledMatchProps {
  onStartAnother: () => void;
}

export default function CancelledMatch({ onStartAnother }: CancelledMatchProps) {
  return (
    <div
      className="flex items-center justify-center w-full h-full"
      onClick={onStartAnother}
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

        {/* sad-astra.png — прижата к низу */}
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
            <p>Match</p>
            <p>cancelled</p>
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
            Your opponent hasn&apos;t been found or has left. You can start another match. Your money and PTS are saved.
          </p>
        </div>

        <button
          onClick={onStartAnother}
          className="flex items-center justify-center cursor-pointer shrink-0 relative"
          style={{
            background: "rgba(0, 227, 185, 0.3)",
            border: "1.168px solid #00e3b9",
            borderRadius: "clamp(9px, 2.91vw, 11.679px)",
            height: "clamp(44px, 6.41svh, 56px)",
            paddingLeft: "clamp(12px, 4.07vw, 16.35px)",
            paddingRight: "clamp(12px, 4.07vw, 16.35px)",
            gap: "clamp(3px, 0.87vw, 3.5px)",
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
            start another
          </span>
          <div className="relative shrink-0" style={{ width: "clamp(10px, 4.07vw, 16.35px)", height: "clamp(16px, 6.39vw, 25.69px)" }}>
            <Image src="/assets/icons/arrow.svg" alt="→" fill sizes="16px" className="object-contain" />
          </div>
        </button>
      </div>
    </div>
  );
}
