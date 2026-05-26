"use client";

import { useEffect } from "react";

interface PopupOverlayProps {
  onClose: () => void;
  children: React.ReactNode;
}

export default function PopupOverlay({ onClose, children }: PopupOverlayProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="absolute inset-0" style={{ zIndex: 10 }} onClick={onClose}>
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: "rgba(13, 13, 13, 0.80)",
          backdropFilter: "blur(7.5px)",
          WebkitBackdropFilter: "blur(7.5px)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{ zIndex: 11 }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
