"use client";

import { Sparkles } from "lucide-react";
import VaraMark from "./vara-mark";

export default function ChatWelcome() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-[#28645A] bg-[#123D3A]">
        <VaraMark size={48} className="text-[#35D6BD]" />
      </div>

      <h1 className="text-3xl font-semibold tracking-tight text-[#E8F5F2]">
        How can I help you today?
      </h1>

      <p className="mt-3 max-w-md text-sm leading-6 text-[#8DA5A0]">
        Start a conversation with Vara. Ask questions,
        explore ideas, or work through something complex.
      </p>

      <div className="mt-8 flex items-center gap-2 text-xs text-[#647C76]">
        <Sparkles size={14} />
        <span>Your intelligent conversation starts here.</span>
      </div>
    </div>
  );
}