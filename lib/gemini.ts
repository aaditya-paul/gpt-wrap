import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Token limit for Gemini (conservative estimate for context)
const MAX_CONTEXT_TOKENS = 28000; // Leave room for response
const CHARS_PER_TOKEN = 4; // Rough estimate

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ConversationChunk {
  messages: ChatMessage[];
  startIndex: number;
  endIndex: number;
}

/**
 * Splits a long conversation into manageable chunks
 */
export function chunkConversation(
  messages: ChatMessage[],
  maxCharsPerChunk: number = MAX_CONTEXT_TOKENS * CHARS_PER_TOKEN
): ConversationChunk[] {
  const chunks: ConversationChunk[] = [];
  let currentChunk: ChatMessage[] = [];
  let currentLength = 0;
  let startIndex = 0;

  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];
    const messageLength = message.content.length + 50; // Add overhead for role, formatting

    if (
      currentLength + messageLength > maxCharsPerChunk &&
      currentChunk.length > 0
    ) {
      // Save current chunk and start new one
      chunks.push({
        messages: currentChunk,
        startIndex,
        endIndex: i - 1,
      });
      currentChunk = [];
      currentLength = 0;
      startIndex = i;
    }

    currentChunk.push(message);
    currentLength += messageLength;
  }

  // Add remaining messages
  if (currentChunk.length > 0) {
    chunks.push({
      messages: currentChunk,
      startIndex,
      endIndex: messages.length - 1,
    });
  }

  return chunks;
}

/**
 * Creates a condensed summary of messages for context
 */
export function condenseMessages(
  messages: ChatMessage[],
  maxLength: number = 10000
): string {
  let result = "";

  for (const msg of messages) {
    const prefix = msg.role === "user" ? "User: " : "Assistant: ";
    const content = msg.content.slice(0, 500); // Truncate long messages
    const truncated = msg.content.length > 500 ? "..." : "";
    result += `${prefix}${content}${truncated}\n\n`;

    if (result.length > maxLength) {
      return result.slice(0, maxLength) + "\n[... conversation continues ...]";
    }
  }

  return result;
}

/**
 * Generate a brief context summary of a conversation
 */
export async function generateConversationSummary(
  messages: ChatMessage[],
  title: string
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

  // For long conversations, use chunking and summarization
  const chunks = chunkConversation(messages);

  if (chunks.length === 1) {
    // Single chunk - direct summarization
    const conversationText = condenseMessages(messages, 50000);

    const prompt = `Analyze this ChatGPT conversation titled "${title}" and provide a brief, concise summary that captures:
1. The main topic/purpose of the conversation
2. Key points discussed or problems solved
3. Important outcomes or conclusions
4. Any notable insights or decisions made

Keep the summary to 3-5 sentences. Be specific and avoid generic statements.

Conversation:
${conversationText}`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } else {
    // Multiple chunks - summarize each, then combine
    const chunkSummaries: string[] = [];

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const chunkText = condenseMessages(chunk.messages, 20000);

      const prompt = `Briefly summarize this part (${i + 1}/${
        chunks.length
      }) of a conversation titled "${title}":
${chunkText}

Provide 2-3 sentences covering the main points discussed in this section.`;

      const result = await model.generateContent(prompt);
      chunkSummaries.push(result.response.text());
    }

    // Combine summaries
    const combinedPrompt = `These are summaries of different parts of a conversation titled "${title}". 
Combine them into one cohesive 3-5 sentence summary that captures the overall context, main points, and conclusions:

${chunkSummaries.map((s, i) => `Part ${i + 1}: ${s}`).join("\n\n")}`;

    const finalResult = await model.generateContent(combinedPrompt);
    return finalResult.response.text();
  }
}

/**
 * Analyze user's patterns from conversation
 */
export async function analyzeUserPatterns(
  messages: ChatMessage[],
  title: string
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

  // Extract only user messages for analysis
  const userMessages = messages.filter((m) => m.role === "user");
  const userText = userMessages.map((m) => m.content).join("\n---\n");

  // Condense if too long
  const condensedText =
    userText.length > 40000 ? userText.slice(0, 40000) + "\n[...]" : userText;

  const prompt = `Based on these messages from a user in a conversation titled "${title}", provide an insightful analysis. Consider:

1. **Communication Style**: How do they express themselves? Are they formal, casual, detailed, or brief?
2. **Thought Process**: How do they approach problems? Are they analytical, creative, methodical?
3. **Interests & Priorities**: What topics or aspects seem most important to them?
4. **Emotional Tone**: What's the general emotional undertone? (curious, frustrated, excited, etc.)

Keep your analysis empathetic, constructive, and around 4-6 sentences. Don't make assumptions beyond what's evident.

User's messages:
${condensedText}`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

/**
 * Chat with AI about the conversation - handles context management
 */
export async function chatAboutConversation(
  conversationMessages: ChatMessage[],
  title: string,
  chatHistory: { role: "user" | "model"; parts: { text: string }[] }[],
  userMessage: string,
  cachedSummary?: string
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

  // Create context summary if not provided
  let contextSummary = cachedSummary;
  if (!contextSummary) {
    // Create a condensed version of the conversation for context
    const condensed = condenseMessages(conversationMessages, 15000);
    contextSummary = `Conversation "${title}" summary:\n${condensed}`;
  }

  // System instruction for the chat
  const systemPrompt = `You are an insightful, empathetic AI companion analyzing a user's ChatGPT conversation history. 

Your role is to:
- Help the user understand their patterns, thought processes, and interests
- Provide gentle insights about their communication style and mental approach
- Be supportive and non-judgmental
- Answer questions about the conversation content
- Offer constructive observations about their social/professional context if evident

Context about the conversation being analyzed:
${contextSummary}

Respond naturally and conversationally. Be concise but thoughtful.`;

  // Start chat with history
  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: systemPrompt }],
      },
      {
        role: "model",
        parts: [
          {
            text: "I've analyzed the conversation. I'm ready to discuss it with you and share any insights. What would you like to know?",
          },
        ],
      },
      ...chatHistory,
    ],
  });

  const result = await chat.sendMessage(userMessage);
  return result.response.text();
}

/**
 * Generate initial insights for the chat feature
 */
export async function generateInitialInsights(
  messages: ChatMessage[],
  title: string
): Promise<{
  summary: string;
  mentalHealthInsights: string;
  conversationStyle: string;
  suggestedQuestions: string[];
}> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

  const userMessages = messages.filter((m) => m.role === "user");
  const condensedConversation = condenseMessages(messages, 30000);
  const condensedUserMessages = userMessages
    .map((m) => m.content.slice(0, 300))
    .join("\n");

  const prompt = `Analyze this ChatGPT conversation titled "${title}" and provide insights in JSON format.

Conversation:
${condensedConversation}

Provide analysis in this exact JSON format:
{
  "summary": "2-3 sentence summary of what this conversation was about",
  "mentalHealthInsights": "2-3 sentences about the user's apparent mental state, stress level, or emotional context. Be gentle and observational, not diagnostic.",
  "conversationStyle": "2-3 sentences about how the user communicates - their approach to problems, level of detail, tone, etc.",
  "suggestedQuestions": ["question 1 the user might want to explore", "question 2", "question 3"]
}

Only output valid JSON, nothing else.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  // Parse JSON from response
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch {
    // Fallback if JSON parsing fails
  }

  return {
    summary: "Unable to generate summary.",
    mentalHealthInsights: "Unable to analyze patterns.",
    conversationStyle: "Unable to determine style.",
    suggestedQuestions: [
      "What was the main topic?",
      "How did you feel during this conversation?",
    ],
  };
}
