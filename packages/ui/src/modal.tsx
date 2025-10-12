import * as React from "react";
import { cn } from "./utils/cn";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  showCloseButton?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  showCloseButton = true,
}) => {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return { maxWidth: "24rem" };
      case "lg":
        return { maxWidth: "32rem" };
      case "xl":
        return { maxWidth: "36rem" };
      default:
        return { maxWidth: "28rem" };
    }
  };

  return (
    <div 
      className={cn("modal-overlay")}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        zIndex: 50,
        animation: "fadeIn 0.2s ease-out",
      }}
      onClick={onClose}
    >
      <div
        className={cn("modal-content")}
        style={{
          background: "linear-gradient(135deg, var(--matty-black) 0%, var(--matty-brown) 100%)",
          borderRadius: "1rem",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          padding: "1.5rem",
          width: "100%",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          animation: "zoomIn 0.2s ease-out",
          ...getSizeStyles(),
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || showCloseButton) && (
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            marginBottom: "1.5rem" 
          }}>
            {title && (
              <h2 style={{ 
                fontSize: "1.5rem", 
                fontWeight: "700", 
                color: "var(--content-emphasis)",
                margin: 0
              }}>
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                style={{
                  color: "var(--content-muted)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--content-emphasis)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--content-muted)";
                }}
              >
                <svg style={{ width: "1.5rem", height: "1.5rem" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}
        <div>{children}</div>
      </div>
    </div>
  );
};

Modal.displayName = "Modal";

export { Modal };