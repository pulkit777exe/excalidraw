"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Select, Card } from "@repo/ui";
import { useUIStore } from "@repo/store";
import { Moon, Sun, Monitor, LogOut, Settings } from "lucide-react";

export default function CanvasMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { theme, setTheme } = useUIStore();

  const handleLeaveRoom = () => {
    router.push("/");
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme as 'light' | 'dark' | 'system');
  };

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ];


  return (
    <div className="relative">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="ghost"
        size="sm"
        className="fixed top-20 left-4 z-50 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20"
      >
        <Settings className="w-4 h-4" />
      </Button>

      {isOpen && (
        <Card 
          variant="glass" 
          className="fixed top-28 left-4 z-50 w-64 p-4 bg-white/10 backdrop-blur-sm border border-white/20"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Theme
              </label>
              <Select
                value={theme}
                onChange={(e) => handleThemeChange(e.target.value)}
                options={themeOptions.map(option => ({
                  value: option.value,
                  label: option.label,
                }))}
                className="w-full"
              />
            </div>

            <Button
              onClick={handleLeaveRoom}
              variant="destructive"
              size="sm"
              className="w-full flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Leave Room
            </Button>
          </div>
        </Card>
      )}

      {/* Backdrop to close menu */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
