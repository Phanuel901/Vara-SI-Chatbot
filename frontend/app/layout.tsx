import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Vara — SI Chatbot",
    template: "%s | Vara",
  },
  description:
    "Vara is an intelligent conversational assistant designed to help you think, learn, and get things done.",
  applicationName: "Vara",
  keywords: [
    "Vara",
    "AI Assistant",
    "SI Chatbot",
    "Artificial Intelligence",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}