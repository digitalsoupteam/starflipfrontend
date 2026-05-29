import type { Metadata } from "next";
import "./globals.css";
import { UserProvider } from "@/context/UserContext";
import { SoundProvider } from "@/context/SoundContext";

export const metadata: Metadata = {
  title: "Astra Game",
  description: "Telegram Mini App — Astra Game",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const devTgMock = process.env.NODE_ENV === "development"
    ? `if(!window.Telegram){window.Telegram={WebApp:{initDataUnsafe:{user:{id:111111111},start_param:undefined},ready:function(){},expand:function(){},close:function(){}}}};console.log('[DEV] Telegram mock: id=111111111');`
    : null;

  return (
    <html lang="en">
      <head>
        {process.env.NODE_ENV === "production" && (
          // eslint-disable-next-line @next/next/no-sync-scripts
          <script src="https://telegram.org/js/telegram-web-app.js" />
        )}
        {devTgMock && <script dangerouslySetInnerHTML={{ __html: devTgMock }} />}
      </head>
      <body>
        <UserProvider>
        <SoundProvider>
            {/* Hidden on mobile, shown on desktop ≥ 1000px */}
          <div
            className="hidden min-[1000px]:flex items-center justify-center h-screen w-screen"
            style={{ backgroundColor: "#0d0d0d" }}
          >
            <p
              style={{
                fontFamily: "'Tektur', sans-serif",
                color: "#00e3b9",
                fontSize: "1.5rem",
                letterSpacing: "0.05em",
              }}
            >
              This game is for mobile only, sorry 🙏
            </p>
          </div>

          <div
            className="min-[1000px]:hidden w-full flex justify-center"
            style={{ backgroundColor: "#0d0d0d", minHeight: "100svh" }}
          >
            <div className="w-full" style={{ maxWidth: "505px" }}>
              {children}
            </div>
          </div>
        </SoundProvider>
        </UserProvider>
      </body>
    </html>
  );
}