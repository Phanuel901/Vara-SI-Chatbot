"use client";

import { useEffect, useState } from "react";

import AppSidebar from "@/components/app-sidebar";
import AuthScreen from "@/components/auth-screen";
import ChatHeader from "@/components/chat-header";
import ChatWelcome from "@/components/chat-welcome";
import ChatInput from "@/components/chat-input";
import ChatMessages from "@/components/chat-messages";
import VaraLogo from "@/components/vara-logo";

import { getCurrentUser, type User } from "@/lib/auth";
import { getToken, removeToken } from "@/lib/api";

import {
  createConversation,
  deleteConversation,
  getConversation,
  getConversations,
  type Conversation,
  type Message,
} from "@/lib/conversations";

import { sendMessage } from "@/lib/chat";

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] =
    useState<number | null>(null);

  const [conversationsLoading, setConversationsLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const [message, setMessage] = useState("");
  const [chatError, setChatError] = useState("");

  // Restore the user's authentication session.
  useEffect(() => {
    let active = true;

    async function restoreSession() {
      const token = getToken();

      if (!token) {
        if (active) setAuthLoading(false);
        return;
      }

      try {
        const currentUser = await getCurrentUser();

        if (active) {
          setUser(currentUser);
        }
      } catch {
        removeToken();
      } finally {
        if (active) setAuthLoading(false);
      }
    }

    restoreSession();

    return () => {
      active = false;
    };
  }, []);

  // Load conversations when the authenticated user changes.
  useEffect(() => {
    if (!user) return;

    let active = true;

    async function loadUserConversations() {
      setConversationsLoading(true);

      try {
        const data = await getConversations();

        if (active) {
          setConversations(data);
        }
      } catch (error) {
        if (active) {
          console.error("Failed to load conversations:", error);
        }
      } finally {
        if (active) {
          setConversationsLoading(false);
        }
      }
    }

    loadUserConversations();

    return () => {
      active = false;
    };
  }, [user]);

  // Load messages whenever the selected conversation changes.
  useEffect(() => {
    if (activeConversationId === null) {
      return;
    }

    const conversationId = activeConversationId;
    let active = true;

    async function loadMessages() {
      setMessagesLoading(true);
      setChatError("");
      setMessages([]);

      try {
        const conversation = await getConversation(conversationId);

        if (active) {
          setMessages(conversation.messages);
        }
      } catch (error) {
        if (active) {
          setChatError(
            error instanceof Error
              ? error.message
              : "Could not load conversation messages.",
          );
        }
      } finally {
        if (active) {
          setMessagesLoading(false);
        }
      }
    }

    loadMessages();

    return () => {
      active = false;
    };
  }, [activeConversationId]);

  // Handle successful authentication.
  function handleAuthenticated(authenticatedUser: User) {
    setUser(authenticatedUser);
  }

  // Create a new conversation.
  async function handleNewChat() {
    try {
      setChatError("");

      const conversation = await createConversation();

      setConversations((previous) => [
        conversation,
        ...previous,
      ]);

      setMessages([]);
      setActiveConversationId(conversation.id);
      setMessage("");
      setMobileSidebarOpen(false);
    } catch (error) {
      console.error("Failed to create conversation:", error);

      setChatError(
        error instanceof Error
          ? error.message
          : "Could not create a new conversation.",
      );
    }
  }

  // Select an existing conversation.
  function handleSelectConversation(id: number) {
    setActiveConversationId(id);
    setMessage("");
    setChatError("");
    setMobileSidebarOpen(false);
  }

  // Delete a conversation.
  async function handleDeleteConversation(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this conversation?",
    );

    if (!confirmed) return;

    try {
      await deleteConversation(id);

      setConversations((previous) =>
        previous.filter((conversation) => conversation.id !== id),
      );

      if (activeConversationId === id) {
        setActiveConversationId(null);
        setMessages([]);
        setMessage("");
        setChatError("");
      }
    } catch (error) {
      console.error("Failed to delete conversation:", error);

      setChatError(
        error instanceof Error
          ? error.message
          : "Could not delete this conversation.",
      );
    }
  }

  // Send a message and receive Vara's response.
  async function handleSendMessage() {
    const content = message.trim();

    if (
      !content ||
      activeConversationId === null ||
      sending ||
      messagesLoading
    ) {
      return;
    }

    const conversationId = activeConversationId;

    const temporaryMessage: Message = {
      id: -Date.now(),
      conversation_id: conversationId,
      role: "user",
      content,
      created_at: new Date().toISOString(),
    };

    setChatError("");
    setMessage("");
    setSending(true);

    // Display the user's message immediately.
    setMessages((previous) => [
      ...previous,
      temporaryMessage,
    ]);

    try {
      // Send the message to the FastAPI backend.
      const assistantResponse = await sendMessage(
        conversationId,
        content,
      );

      // Display Vara's response.
      setMessages((previous) => [
        ...previous,
        assistantResponse,
      ]);

      // Update the conversation's position in the sidebar.
      setConversations((previous) => {
        const updated = previous.map((conversation) =>
          conversation.id === conversationId
            ? {
                ...conversation,
                updated_at: assistantResponse.created_at,
              }
            : conversation,
        );

        return updated.sort(
          (a, b) =>
            new Date(b.updated_at).getTime() -
            new Date(a.updated_at).getTime(),
        );
      });
    } catch (error) {
      // Remove the temporary message if the request fails.
      setMessages((previous) =>
        previous.filter(
          (item) => item.id !== temporaryMessage.id,
        ),
      );

      // Restore the user's message.
      setMessage(content);

      setChatError(
        error instanceof Error
          ? error.message
          : "Vara could not send a response. Please try again.",
      );
    } finally {
      setSending(false);
    }
  }

  // Authentication loading screen.
  if (authLoading) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-[#101719]">
        <div className="flex flex-col items-center gap-4">
          <VaraLogo iconSize={32} />

          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#293A3B] border-t-[#35D6BD]" />

          <p className="text-sm text-[#8DA5A0]">
            Checking your session...
          </p>
        </div>
      </main>
    );
  }

  // Show authentication screen when the user is not logged in.
  if (!user) {
    return <AuthScreen onAuthenticated={handleAuthenticated} />;
  }

  return (
    <main className="flex h-dvh overflow-hidden bg-[#101719]">
      <AppSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        onNewChat={handleNewChat}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
        conversationsLoading={conversationsLoading}
      />

      <section className="flex min-w-0 flex-1 flex-col">
        <ChatHeader
          onMenuClick={() => setMobileSidebarOpen(true)}
        />

        {/* Main conversation area */}
        {messagesLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="flex items-center gap-3 text-sm text-[#8DA5A0]">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#293A3B] border-t-[#35D6BD]" />
              Loading conversation...
            </div>
          </div>
        ) : messages.length === 0 ? (
          <ChatWelcome />
        ) : (
          <ChatMessages
            messages={messages}
            sending={sending}
          />
        )}

        {/* Error display */}
        {chatError && (
          <div
            role="alert"
            className="mx-auto mb-3 w-full max-w-3xl px-4"
          >
            <div className="rounded-xl border border-red-900/60 bg-red-950/30 px-4 py-3 text-sm text-red-300">
              {chatError}
            </div>
          </div>
        )}

        {/* Message input */}
        <ChatInput
          value={message}
          onChange={setMessage}
          onSend={handleSendMessage}
          sending={sending}
          disabled={
            activeConversationId === null ||
            messagesLoading
          }
        />
      </section>
    </main>
  );
}