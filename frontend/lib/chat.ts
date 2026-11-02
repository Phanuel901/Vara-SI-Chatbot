import { apiRequest } from "./api";
import type { Message } from "./conversations";

export async function sendMessage(
  conversationId: number,
  content: string,
): Promise<Message> {
  return apiRequest<Message>(
    `/conversations/${conversationId}/messages`,
    {
      method: "POST",
      body: JSON.stringify({ content }),
    },
  );
}