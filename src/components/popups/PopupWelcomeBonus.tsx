import Image from "next/image";

interface PopupWelcomeBonusProps {
  onClose: () => void;
}

export default function PopupWelcomeBonus({ onClose }: PopupWelcomeBonusProps) {
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
          className="flex items-start justify-between relative"
          style={{ zIndex: 2 }}
        >
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
              <p>0.1 ETH and</p>
              <p>150 ranking</p>
              <p>points</p>
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
              Sign up now and receive a welcome bonus:
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
            <Image
              src="/assets/icons/x.svg"
              alt="Close"
              fill
              className="object-contain"
            />
          </button>
        </div>

        <div
          className="relative flex flex-col"
          style={{ gap: "clamp(8px, 2.99vw, 12px)" }}
        >
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
            <div
              style={{
                width: "24px",
                height: "24px",
                position: "relative",
                flexShrink: 0,
              }}
            >
              <Image
                src="/assets/icons/google.svg"
                alt="Google"
                fill
                className="object-contain"
              />
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
            <div
              style={{
                width: "24px",
                height: "24px",
                position: "relative",
                flexShrink: 0,
                filter: "brightness(0)",
              }}
            >
              <Image
                src="/assets/icons/telegram.svg"
                alt="Telegram"
                fill
                className="object-contain"
              />
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
              Sign up with Telegram
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
