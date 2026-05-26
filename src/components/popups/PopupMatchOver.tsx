import Image from "next/image";

interface PopupMatchOverProps {
  onClose: () => void;
  onPlayAgain: () => void;
  // Результаты игры — TODO: придут от бэкенда
  result?: string;      // "0.0000414 ETH"
  profit?: string;      // "+ 20 %"
  points?: string;      // "+ 10 PTS"
  title?: string;       // "Nice try!" / "You won!" / etc.
}

export default function PopupMatchOver({
  onClose,
  onPlayAgain,
  result = "0.0000414 ETH",
  profit = "+ 20 %",
  points = "+ 10 PTS",
  title = "Nice try!",
}: PopupMatchOverProps) {
  return (
    <div
      className="flex items-center justify-center w-full h-full"
      onClick={onClose}
    >
      {/* Карточка — Figma: w=362 h=632 p=25 rounded=18 */}
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
            left: "clamp(-16px, -6.07vw, -22px)",
            top: "clamp(228px, 48.23svh, 305px)",
            width: "clamp(322px, 119.65vw, 429px)",
            height: "clamp(253px, 53.47svh, 338px)",
            zIndex: 1,
          }}
        >
          <Image
            src="/assets/game/astra-chest.png"
            alt=""
            fill
            className="object-cover"
            sizes="120vw"
          />
        </div>

        <div
          className="absolute pointer-events-none"
          style={{
            left: "clamp(164px, 54.48vw, 219px)",
            top: "clamp(-28px, -5.93svh, -37px)",
            width: "clamp(130px, 43.03vw, 173px)",
            height: "clamp(186px, 39.32svh, 248px)",
            zIndex: 3,
          }}
        >
          <Image
            src="/assets/game/3coins.png"
            alt=""
            fill
            className="object-cover"
            sizes="44vw"
          />
        </div>

        <div
          className="relative flex flex-col"
          style={{ gap: "clamp(20px, 3.43svh, 30px)", zIndex: 2 }}
        >
          <p
            className="uppercase"
            style={{
              fontFamily: "'Tektur', sans-serif",
              fontSize: "clamp(30px, 11.19vw, 45px)",
              fontVariationSettings: "'wdth' 100",
              fontWeight: 400,
              color: "#00e3b9",
              textShadow: "0px 0px 27px rgba(0, 255, 179, 0.57)",
              lineHeight: 1,
            }}
          >
            {title}
          </p>

          <div className="flex flex-col" style={{ gap: "clamp(16px, 2.52svh, 22px)" }}>

            <div className="flex flex-col" style={{ gap: "clamp(4px, 0.69svh, 6px)" }}>
              <p style={{ fontFamily: "'Wix Madefor Display', sans-serif", fontSize: "clamp(14px, 4.48vw, 18px)", fontWeight: 400, color: "#ffffff", lineHeight: "normal" }}>
                Your result:
              </p>
              <p
                className="uppercase whitespace-nowrap"
                style={{
                  fontFamily: "'Tektur', sans-serif",
                  fontSize: "clamp(20px, 7.46vw, 30px)",
                  fontVariationSettings: "'wdth' 100",
                  fontWeight: 400,
                  color: "#ffffff",
                  lineHeight: 1,
                }}
              >
                {result}
              </p>
            </div>

            <div className="flex flex-col" style={{ gap: "clamp(4px, 0.69svh, 6px)" }}>
              <p style={{ fontFamily: "'Wix Madefor Display', sans-serif", fontSize: "clamp(14px, 4.48vw, 18px)", fontWeight: 400, color: "#ffffff", lineHeight: "normal", whiteSpace: "nowrap" }}>
                Total profit:
              </p>
              <p
                className="uppercase whitespace-nowrap"
                style={{
                  fontFamily: "'Tektur', sans-serif",
                  fontSize: "clamp(20px, 7.46vw, 30px)",
                  fontVariationSettings: "'wdth' 100",
                  fontWeight: 400,
                  color: "#ffae00",
                  lineHeight: 1,
                }}
              >
                {profit}
              </p>
            </div>

            <div className="flex flex-col" style={{ gap: "clamp(4px, 0.69svh, 6px)" }}>
              <p style={{ fontFamily: "'Wix Madefor Display', sans-serif", fontSize: "clamp(14px, 4.48vw, 18px)", fontWeight: 400, color: "#ffffff", lineHeight: "normal", whiteSpace: "nowrap" }}>
                Points:
              </p>
              <p
                className="uppercase whitespace-nowrap"
                style={{
                  fontFamily: "'Tektur', sans-serif",
                  fontSize: "clamp(20px, 7.46vw, 30px)",
                  fontVariationSettings: "'wdth' 100",
                  fontWeight: 400,
                  color: "#00e3b9",
                  lineHeight: 1,
                }}
              >
                {points}
              </p>
            </div>
          </div>

          <button
            onClick={onPlayAgain}
            className="flex items-center justify-center cursor-pointer shrink-0"
            style={{
              background: "rgba(15, 11, 22, 0.3)",
              border: "1.168px solid #00e3b9",
              borderRadius: "clamp(7px, 2.49vw, 10px)",
              height: "clamp(44px, 6.41svh, 56px)",
              paddingLeft: "clamp(10px, 4.07vw, 16.35px)",
              paddingRight: "clamp(10px, 4.07vw, 16.35px)",
              gap: "clamp(2px, 0.87vw, 3.5px)",
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
              PLAY AGAIN
            </span>
            <div className="relative shrink-0" style={{ width: "clamp(10px, 4.07vw, 16.35px)", height: "clamp(16px, 6.39vw, 25.69px)" }}>
              <Image src="/assets/icons/arrow.svg" alt="→" fill sizes="16px" className="object-contain" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
