"use client";

import { Menu, Sparkles } from "lucide-react";
import VaraLogo from "./vara-logo";

interface ChatHeaderProps {
  onMenuClick: () => void;
}

export default function ChatHeader({
  onMenuClick,
}: ChatHeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#293A3B] px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation"
          className="rounded-lg p-2 text-[#8DA5A0] hover:bg-[#233735] hover:text-white md:hidden"
        >
          <Menu size={22} />
        </button>

        <VaraLogo iconSize={22} />
      </div>

      <div className="flex items-center gap-2 rounded-full border border-[#293A3B] px-3 py-2">
        <Sparkles size={15} className="text-[#35D6BD]" />
        <span className="text-xs text-[#8DA5A0]">
          SI Assistant
        </span>
      </div>
    </header>
  );
}