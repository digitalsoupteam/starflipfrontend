"use client";

import Image from "next/image";

export default function PopupTechnicalWorks() {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{
        zIndex: 1000,
        backgroundColor: "rgba(13, 13, 13, 0.96)",
        padding: "clamp(16px, 5vw, 24px)",
      }}
    >
      <div
        className="relative w-full overflow-hidden"
        style={{
          maxWidth: "505px",
          minHeight: "min(82svh, 720px)",
          borderRadius: "0",
          border: "1px solid #0e1820",
          backgroundColor: "#0f0b16",
          boxShadow: "0 0 40px rgba(0, 227, 185, 0.22)",
        }}
      >
        <Image
          src="/assets/game/technicalworks.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(13,13,13,0.08) 0%, rgba(13,13,13,0.52) 48%, rgba(13,13,13,0.92) 100%)",
          }}
        />
        <div
          className="absolute left-0 right-0"
          style={{
            bottom: "clamp(28px, 8svh, 56px)",
            paddingLeft: "clamp(20px, 7vw, 34px)",
            paddingRight: "clamp(20px, 7vw, 34px)",
          }}
        >
          <h1
            style={{
              fontFamily: "'Tektur', sans-serif",
              fontSize: "clamp(28px, 9.95vw, 42px)",
              fontVariationSettings: "'wdth' 100",
              fontWeight: 500,
              color: "#00e3b9",
              lineHeight: 1.05,
              textShadow: "0 0 27px rgba(0, 255, 179, 0.57)",
              marginBottom: "clamp(12px, 3.2svh, 20px)",
            }}
          >
            Technical Work
          </h1>
          <p
            style={{
              fontFamily: "'Wix Madefor Display', sans-serif",
              fontSize: "clamp(16px, 4.7vw, 20px)",
              fontWeight: 500,
              color: "#ffffff",
              lineHeight: 1.38,
              maxWidth: "340px",
            }}
          >
            Good day, technical work is currently in progress. The transition to MoneyMode is coming very soon!
          </p>
        </div>
      </div>
    </div>
  );
}
