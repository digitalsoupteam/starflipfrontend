import type { Metadata } from "next";
import "./globals.css";
import { UserProvider } from "@/context/UserContext";

export const metadata: Metadata = {
  title: "Astra Game",
  description: "Telegram Mini App — Astra Game",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          {/* Desktop off loader ≥ 1000px */}
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

          {/* mobile < 1000px */}
          <div
            className="min-[1000px]:hidden w-full flex justify-center"
            style={{ backgroundColor: "#0d0d0d", minHeight: "100svh" }}
          >
            <div className="w-full" style={{ maxWidth: "505px" }}>
              {children}
            </div>
          </div>
        </UserProvider>
      </body>
    </html>
  );
}