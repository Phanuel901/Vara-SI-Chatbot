import { apiRequest } from "./api";

export interface Conversation {
  id: number;
  user_id: number;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: number;
  conversation_id: number;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export interface ConversationDetail extends Conversation {
  messages: Message[];
}

// Retrieve all conversations belonging to the authenticated user.
export async function getConversations(): Promise<Conversation[]> {
  return apiRequest<Conversation[]>("/conversations/");
}

// Create a new conversation.
export async function createConversation(
  title = "New conversation",
): Promise<Conversation> {
  return apiRequest<Conversation>("/conversations/", {
    method: "POST",
    body: JSON.stringify({ title }),
  });
}

// Retrieve one conversation, including its messages.
export async function getConversation(
  conversationId: number,
): Promise<ConversationDetail> {
  return apiRequest<ConversationDetail>(
    `/conversations/${conversationId}`,
  );
}

// Delete a conversation.
export async function deleteConversation(
  conversationId: number,
): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(
    `/conversations/${conversationId}`,
    {
      method: "DELETE",
    },
  );
}