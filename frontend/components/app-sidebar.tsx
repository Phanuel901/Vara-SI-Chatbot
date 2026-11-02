"use client";

import {
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  MessageSquare,
  Settings,
  X,
  Trash2,
  LoaderCircle,
} from "lucide-react";

import VaraLogo from "./vara-logo";
import VaraMark from "./vara-mark";
import type { Conversation } from "@/lib/conversations";

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  onNewChat: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  conversations: Conversation[];
  activeConversationId: number | null;
  onSelectConversation: (id: number) => void;
  onDeleteConversation: (id: number) => void;
  conversationsLoading: boolean;
}

interface SidebarPanelProps {
  collapsed: boolean;
  mobile?: boolean;
  onToggle: () => void;
  onNewChat: () => void;
  onCloseMobile: () => void;
  conversations: Conversation[];
  activeConversationId: number | null;
  onSelectConversation: (id: number) => void;
  onDeleteConversation: (id: number) => void;
  conversationsLoading: boolean;
}

function SidebarPanel({
  collapsed,
  mobile = false,
  onToggle,
  onNewChat,
  onCloseMobile,
  conversations,
  activeConversationId,
  onSelectConversation,
  onDeleteConversation,
  conversationsLoading,
}: SidebarPanelProps) {
  function handleNewChat() {
    onNewChat();
    onCloseMobile();
  }

  function handleSelectConversation(id: number) {
    onSelectConversation(id);
    onCloseMobile();
  }

  const showContent = !collapsed || mobile;

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between px-4">
        {collapsed && !mobile ? (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#123D3A]">
            <VaraMark size={28} />
          </div>
        ) : (
          <VaraLogo showTagline iconSize={27} />
        )}

        {mobile ? (
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close sidebar"
            className="rounded-lg p-2 text-[#8DA5A0] hover:bg-[#233735] hover:text-white"
          >
            <X size={21} />
          </button>
        ) : (
          <button
            type="button"
            onClick={onToggle}
            aria-label="Toggle sidebar"
            className="rounded-lg p-2 text-[#8DA5A0] hover:bg-[#233735] hover:text-white"
          >
            {collapsed ? (
              <PanelLeftOpen size={20} />
            ) : (
              <PanelLeftClose size={20} />
            )}
          </button>
        )}
      </div>

      <div className="px-3 pt-4">
        <button
          type="button"
          onClick={handleNewChat}
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#123D3A] px-3 py-3 text-sm font-medium text-[#35D6BD] transition hover:bg-[#19534C]"
        >
          <Plus size={19} />
          {showContent && <span>New conversation</span>}
        </button>
      </div>

      {showContent && (
        <>
          <div className="px-5 pb-3 pt-8">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#78918B]">
              Your conversations
            </span>
          </div>

          <div className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
            {conversationsLoading ? (
              <div className="flex items-center justify-center gap-2 py-6 text-sm text-[#8DA5A0]">
                <LoaderCircle size={17} className="animate-spin" />
                Loading conversations...
              </div>
            ) : conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-3 py-8 text-center">
                <MessageSquare
                  size={25}
                  className="mb-3 text-[#536D67]"
                />
                <p className="text-sm text-[#8DA5A0]">
                  No conversations yet
                </p>
                <p className="mt-1 text-xs text-[#647C76]">
                  Start a new conversation to see it here.
                </p>
              </div>
            ) : (
              conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`group flex items-center gap-1 rounded-lg transition ${
                    activeConversationId === conversation.id
                      ? "bg-[#233735]"
                      : "hover:bg-[#1C2B2D]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() =>
                      handleSelectConversation(conversation.id)
                    }
                    title={conversation.title}
                    className="flex min-w-0 flex-1 items-center gap-3 px-3 py-3 text-left"
                  >
                    <MessageSquare
                      size={17}
                      className="shrink-0 text-[#78918B]"
                    />

                    <span className="truncate text-sm text-[#C7D8D3]">
                      {conversation.title}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onDeleteConversation(conversation.id);
                    }}
                    aria-label={`Delete ${conversation.title}`}
                    title="Delete conversation"
                    className="mr-2 rounded-md p-2 text-[#78918B] opacity-100 transition hover:bg-red-950/50 hover:text-red-400 md:opacity-0 md:group-hover:opacity-100"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))
            )}
          </div>
        </>
      )}

      <div className="border-t border-[#293A3B] p-3">
        <button
          type="button"
          className="flex w-full items-center justify-center gap-3 rounded-lg p-3 text-sm text-[#8DA5A0] hover:bg-[#233735] hover:text-white"
        >
          <Settings size={19} />
          {showContent && <span>Settings</span>}
        </button>
      </div>
    </div>
  );
}

export default function AppSidebar({
  collapsed,
  onToggle,
  onNewChat,
  mobileOpen,
  onCloseMobile,
  conversations,
  activeConversationId,
  onSelectConversation,
  onDeleteConversation,
  conversationsLoading,
}: AppSidebarProps) {
  const panelProps = {
    onNewChat,
    onCloseMobile,
    conversations,
    activeConversationId,
    onSelectConversation,
    onDeleteConversation,
    conversationsLoading,
  };

  return (
    <>
      <aside
        className={`hidden h-screen shrink-0 flex-col border-r border-[#293A3B] bg-[#151F22] transition-all duration-300 md:flex ${
          collapsed ? "w-18" : "w-67.5"
        }`}
      >
        <SidebarPanel
          {...panelProps}
          collapsed={collapsed}
          onToggle={onToggle}
        />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={onCloseMobile}
            className="absolute inset-0 h-full w-full bg-black/65"
          />

          <aside className="absolute inset-y-0 left-0 w-71.25 max-w-[85vw] border-r border-[#293A3B] bg-[#151F22] shadow-2xl">
            <SidebarPanel
              {...panelProps}
              collapsed={false}
              mobile
              onToggle={onToggle}
            />
          </aside>
        </div>
      )}
    </>
  );
}