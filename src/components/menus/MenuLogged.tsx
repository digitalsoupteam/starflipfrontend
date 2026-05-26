import Image from "next/image";

interface MenuLoggedProps {
  onClose: () => void;
  accId?: string;
  onLogout?: () => void;
  ethBalance?: string;
  pts?: string;
}

export default function MenuLogged({
  onClose,
  accId = "Paramour",
  onLogout,
  ethBalance,
  pts,
}: MenuLoggedProps) {
  return (
    <div
      className="flex flex-col items-center justify-between w-full h-full"
      style={{
        paddingTop: "clamp(60px, 9svh, 80px)",
        paddingBottom: "clamp(60px, 9svh, 80px)",
        paddingLeft: "clamp(16px, 3.98vw, 16px)",
        paddingRight: "clamp(16px, 3.98vw, 16px)",
      }}
      onClick={onClose}
    >
      {/* Крестик */}
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
        <Image
          src="/assets/icons/x.svg"
          alt="Close"
          fill
          className="object-contain"
        />
      </button>

      {(ethBalance || pts) && (
        <div
          className="flex flex-col items-center"
          style={{ gap: "4px" }}
          onClick={(e) => e.stopPropagation()}
        >
          {ethBalance && (
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
                className="font-bold whitespace-nowrap"
                style={{
                  fontFamily: "'Wix Madefor Display', sans-serif",
                  fontSize: "clamp(14px, 4.48vw, 18px)",
                  color: "#ffffff",
                  lineHeight: 1,
                }}
              >
                {ethBalance}
              </span>
            </div>
          )}
          {pts && (
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
                {pts}
              </span>
            </div>
          )}
        </div>
      )}

      <div
        className="flex flex-col items-center w-full"
        style={{ gap: "clamp(18px, 2.74svh, 24px)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center" style={{ gap: "4px" }}>
          <p
            style={{
              fontFamily: "'Wix Madefor Display', sans-serif",
              fontSize: "clamp(16px, 4.48vw, 18px)",
              color: "#ffffff",
              fontWeight: 400,
              lineHeight: 1.4,
            }}
          >
            acc id:
          </p>
          <p
            className="uppercase"
            style={{
              fontFamily: "'Tektur', sans-serif",
              fontSize: "clamp(22px, 7.46vw, 30px)",
              fontVariationSettings: "'wdth' 100",
              fontWeight: 500,
              color: "#00e3b9",
              lineHeight: 1,
              textShadow: "0px 0px 27px rgba(0, 255, 179, 0.57)",
            }}
          >
            {accId}
          </p>
        </div>

        <div
          className="flex items-center w-full"
          style={{ gap: "clamp(8px, 2.99vw, 12px)" }}
        >
          <button
            className="flex items-center justify-center cursor-pointer"
            style={{
              background: "rgba(0, 227, 185, 0.3)",
              border: "1.168px solid #00e3b9",
              borderRadius: "clamp(8px, 2.91vw, 11.679px)",
              height: "clamp(44px, 6.41svh, 56px)",
              flex: 1,
            }}
          >
            <span
              className="uppercase whitespace-nowrap"
              style={{
                fontFamily: "'Tektur', sans-serif",
                fontSize: "clamp(13px, 5.23vw, 21px)",
                fontVariationSettings: "'wdth' 100",
                fontWeight: 500,
                color: "#00e3b9",
                lineHeight: 1,
              }}
            >
              Deposit
            </span>
          </button>
          <button
            className="flex items-center justify-center cursor-pointer"
            style={{
              background: "rgba(15, 11, 22, 0.3)",
              border: "1.168px solid #00e3b9",
              borderRadius: "clamp(7px, 2.49vw, 10px)",
              height: "clamp(44px, 6.41svh, 56px)",
              flex: 1,
            }}
          >
            <span
              className="uppercase whitespace-nowrap"
              style={{
                fontFamily: "'Tektur', sans-serif",
                fontSize: "clamp(11px, 4.23vw, 17px)",
                fontVariationSettings: "'wdth' 100",
                fontWeight: 500,
                color: "#00e3b9",
                lineHeight: 1,
              }}
            >
              Withdrawal
            </span>
          </button>
        </div>
      </div>

      <div
        className="flex flex-col w-full"
        style={{ gap: "clamp(8px, 1.37svh, 12px)" }}
        onClick={(e) => e.stopPropagation()}
      >

        <div
          className="flex items-center justify-between w-full"
          style={{
            backgroundColor: "#0d0d0d",
            borderRadius: "clamp(9px, 2.91vw, 11.679px)",
            height: "clamp(48px, 6.41svh, 56px)",
            paddingLeft: "clamp(12px, 3.98vw, 16px)",
            paddingRight: "clamp(12px, 3.98vw, 16px)",
            opacity: 0.3,
          }}
        >
          <div className="flex items-center" style={{ gap: "12px" }}>
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
              style={{
                fontFamily: "'Wix Madefor Display', sans-serif",
                fontSize: "clamp(14px, 4.48vw, 18px)",
                fontWeight: 500,
                color: "#ffffff",
                whiteSpace: "nowrap",
              }}
            >
              Google
            </span>
          </div>
          <span
            style={{
              fontFamily: "'Wix Madefor Display', sans-serif",
              fontSize: "clamp(12px, 3.48vw, 14px)",
              fontWeight: 500,
              color: "#ffffff",
              whiteSpace: "nowrap",
            }}
          >
            Connected
          </span>
        </div>

        {/* Telegram — Connect */}
        <div
          className="flex items-center justify-between w-full"
          style={{
            backgroundColor: "#0d0d0d",
            borderRadius: "clamp(9px, 2.91vw, 11.679px)",
            height: "clamp(48px, 6.41svh, 56px)",
            paddingLeft: "clamp(12px, 3.98vw, 16px)",
            paddingRight: "clamp(12px, 3.98vw, 16px)",
          }}
        >
          <div className="flex items-center" style={{ gap: "12px" }}>
            <div
              style={{
                width: "24px",
                height: "24px",
                position: "relative",
                flexShrink: 0,
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
              style={{
                fontFamily: "'Wix Madefor Display', sans-serif",
                fontSize: "clamp(14px, 4.48vw, 18px)",
                fontWeight: 500,
                color: "#ffffff",
                whiteSpace: "nowrap",
              }}
            >
              Telegram
            </span>
          </div>
          <button
            onClick={(e) => e.stopPropagation()}
            style={{
              fontFamily: "'Wix Madefor Display', sans-serif",
              fontSize: "clamp(12px, 3.48vw, 14px)",
              fontWeight: 500,
              color: "#00e3b9",
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            Connect
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
              width: "24px",
              height: "24px",
              position: "relative",
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              filter:
                "invert(71%) sepia(99%) saturate(362%) hue-rotate(118deg) brightness(98%) contrast(101%)",
            }}
          >
            <Image
              src="/assets/icons/twitter.svg"
              alt="Twitter"
              fill
              className="object-contain"
            />
          </button>
          <button
            style={{
              width: "24px",
              height: "24px",
              position: "relative",
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              filter:
                "invert(71%) sepia(99%) saturate(362%) hue-rotate(118deg) brightness(98%) contrast(101%)",
            }}
          >
            <Image
              src="/assets/icons/telegram.svg"
              alt="Telegram"
              fill
              className="object-contain"
            />
          </button>
        </div>

        <button
          style={{
            fontFamily: "'Wix Madefor Display', sans-serif",
            fontSize: "clamp(16px, 4.97vw, 20px)",
            fontWeight: 700,
            color: "#00e3b9",
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          How to play
        </button>

        <button
          style={{
            fontFamily: "'Wix Madefor Display', sans-serif",
            fontSize: "clamp(16px, 4.97vw, 20px)",
            fontWeight: 700,
            color: "#00e3b9",
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          Support
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onLogout?.();
            onClose();
          }}
          style={{
            fontFamily: "'Wix Madefor Display', sans-serif",
            fontSize: "clamp(16px, 4.97vw, 20px)",
            fontWeight: 700,
            color: "#ffffff",
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          Log out
        </button>
      </div>
    </div>
  );
}
