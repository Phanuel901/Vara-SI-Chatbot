"use client";

import { useEffect, useRef } from "react";
import { LoaderCircle, UserRound } from "lucide-react";

import type { Message } from "@/lib/conversations";
import VaraMark from "./vara-mark";

interface ChatMessagesProps {
  messages: Message[];
  sending: boolean;
}

export default function ChatMessages({
  messages,
  sending,
}: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, sending]);

  if (messages.length === 0 && !sending) {
    return null;
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-8 sm:px-6">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-7">
        {messages.map((message) => {
          const isUser = message.role === "user";

          return (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${
                isUser ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                  isUser ? "bg-[#263638]" : "bg-[#123D3A]"
                }`}
              >
                {isUser ? (
                  <UserRound size={19} className="text-[#C7D8D3]" />
                ) : (
                  <VaraMark size={25} />
                )}
              </div>

              <div
                className={`min-w-0 max-w-[85%] rounded-2xl px-4 py-3 sm:max-w-[80%] ${
                  isUser
                    ? "rounded-tr-sm bg-[#183B38] text-[#E8F5F2]"
                    : "rounded-tl-sm border border-[#293A3B] bg-[#192426] text-[#D5E5E0]"
                }`}
              >
                <p className="whitespace-pre-wrap wrap-break-word text-sm leading-7">
                  {message.content}
                </p>
              </div>
            </div>
          );
        })}

        {sending && (
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#123D3A]">
              <VaraMark size={25} />
            </div>

            <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm border border-[#293A3B] bg-[#192426] px-4 py-4">
              <LoaderCircle
                size={17}
                className="animate-spin text-[#35D6BD]"
              />
              <span className="text-sm text-[#8DA5A0]">
                Vara is thinking...
              </span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}