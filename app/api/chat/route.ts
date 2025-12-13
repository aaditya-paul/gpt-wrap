import { NextRequest, NextResponse } from "next/server";
import {
  chatAboutConversation,
  condenseMessages,
  ChatMessage,
} from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    const { messages, title, chatHistory, userMessage, cachedContext } =
      await request.json();

    if (!userMessage) {
      return NextResponse.json(
        { error: "User message is required" },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    const chatMessages: ChatMessage[] = (messages || []).map(
      (m: { role: string; content: string }) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.content,
      })
    );

    // Create context if not cached
    let context = cachedContext;
    if (!context && messages) {
      context = `Conversation "${title}" content:\n${condenseMessages(
        chatMessages,
        15000
      )}`;
    }

    const response = await chatAboutConversation(
      chatMessages,
      title || "Untitled",
      chatHistory || [],
      userMessage,
      context
    );

    return NextResponse.json({
      response,
      context: context, // Return context for caching
    });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Failed to process chat message" },
      { status: 500 }
    );
  }
}
