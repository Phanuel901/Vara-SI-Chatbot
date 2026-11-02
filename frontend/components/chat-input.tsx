"use client";

import { KeyboardEvent } from "react";
import { Send, LoaderCircle } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  sending: boolean;
  disabled?: boolean;
}

export default function ChatInput({
  value,
  onChange,
  onSend,
  sending,
  disabled = false,
}: ChatInputProps) {
  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSend();
    }
  }

  const canSend = value.trim().length > 0 && !sending && !disabled;

  return (
    <div className="border-t border-[#293A3B] px-4 py-5 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-end gap-3 rounded-2xl border border-[#344846] bg-[#192426] p-3 transition focus-within:border-[#35D6BD]">
          <textarea
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              disabled
                ? "Select or create a conversation first..."
                : "Message Vara..."
            }
            rows={1}
            maxLength={4000}
            disabled={disabled || sending}
            className="max-h-40 min-h-10 flex-1 resize-y bg-transparent px-2 py-2 text-sm text-[#E8F5F2] outline-none placeholder:text-[#647C76] disabled:cursor-not-allowed disabled:opacity-50"
          />

          <button
            type="button"
            onClick={onSend}
            disabled={!canSend}
            aria-label="Send message"
            title="Send message"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#123D3A] text-[#35D6BD] transition hover:bg-[#19534C] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {sending ? (
              <LoaderCircle size={18} className="animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </button>
        </div>

        <p className="mt-3 text-center text-xs text-[#647C76]">
          Press Enter to send. Use Shift + Enter for a new line.
        </p>
      </div>
    </div>
  );
}