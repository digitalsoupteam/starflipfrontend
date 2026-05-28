import Image from "next/image";

interface PopupAirdropProps {
  onClose: () => void;
}

export default function PopupAirdrop({ onClose }: PopupAirdropProps) {
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

        <div className="flex items-start justify-between relative" style={{ zIndex: 1 }}>
          <p style={{ fontFamily: "'Tektur', sans-serif", fontSize: "clamp(26px, 9.95vw, 40px)", fontVariationSettings: "'wdth' 100", fontWeight: 400, color: "#00e3b9", textShadow: "0px 0px 27px rgba(0, 255, 179, 0.57)", lineHeight: 1.05, flex: 1 }}>
            Get real tokens
          </p>
          <button onClick={onClose} style={{ width: "clamp(28px, 8.96vw, 36px)", height: "clamp(28px, 8.96vw, 36px)", background: "none", border: "none", padding: 0, cursor: "pointer", flexShrink: 0, position: "relative" }}>
            <Image src="/assets/icons/x.svg" alt="Close" fill className="object-contain" />
          </button>
        </div>

        <div className="flex items-start justify-between relative" style={{ zIndex: 1 }}>
          <div style={{ width: "clamp(110px, 39.55vw, 159px)", height: "clamp(117px, 26.91svh, 170px)", position: "relative", flexShrink: 0 }}>
            <Image src="/assets/game/desk.png" alt="Game board" fill className="object-cover" sizes="40vw" />
          </div>
          <div className="flex flex-col" style={{ gap: "5px", width: "clamp(100px, 33.58vw, 135px)" }}>
            <p style={{ fontFamily: "'Wix Madefor Display', sans-serif", fontSize: "clamp(12px, 3.73vw, 16px)", fontWeight: 600, color: "rgba(255,255,255,0.5)", lineHeight: 1.3 }}>01</p>
            <p style={{ fontFamily: "'Wix Madefor Display', sans-serif", fontSize: "clamp(12px, 3.73vw, 16px)", fontWeight: 600, color: "#ffffff", lineHeight: 1.3 }}>Play actively and earn ranking points</p>
          </div>
        </div>

        <div className="flex items-start justify-between relative" style={{ zIndex: 1 }}>
          <div style={{ width: "clamp(103px, 37.06vw, 149px)", height: "clamp(103px, 37.06vw, 149px)", position: "relative", flexShrink: 0 }}>
            <Image src="/assets/game/chest.png" alt="Chest" fill className="object-cover" sizes="37vw" />
          </div>
          <div className="flex flex-col" style={{ gap: "5px", width: "clamp(100px, 33.58vw, 135px)" }}>
            <p style={{ fontFamily: "'Wix Madefor Display', sans-serif", fontSize: "clamp(12px, 3.73vw, 16px)", fontWeight: 600, color: "rgba(255,255,255,0.5)", lineHeight: 1.3 }}>02</p>
            <p style={{ fontFamily: "'Wix Madefor Display', sans-serif", fontSize: "clamp(12px, 3.73vw, 16px)", fontWeight: 600, color: "#ffffff", lineHeight: 1.3 }}>Receive rewards when the projects token launches!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
