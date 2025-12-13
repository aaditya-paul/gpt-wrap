import { NextRequest, NextResponse } from "next/server";
import { generateInitialInsights, ChatMessage } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    const { messages, title } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    const chatMessages: ChatMessage[] = messages.map(
      (m: { role: string; content: string }) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.content,
      })
    );

    const insights = await generateInitialInsights(
      chatMessages,
      title || "Untitled"
    );

    return NextResponse.json(insights);
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze conversation" },
      { status: 500 }
    );
  }
}
