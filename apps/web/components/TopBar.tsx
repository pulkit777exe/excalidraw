// components/TopBar.tsx
import { Menu } from "lucide-react";

interface TopBarProps {
  onMenuClick?: () => void;
  children?: React.ReactNode;
}

export default function TopBar({ onMenuClick, children }: TopBarProps) {
  return (
    <div className="w-full h-12 flex items-center justify-between px-4 bg-gray-800 text-white border-b border-gray-700">
      <button
        onClick={onMenuClick}
        className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-700 transition-colors"
      >
        <Menu className="w-5 h-5" />
        <span className="font-bold">Menu</span>
      </button>

      {children}
    </div>
  );
}