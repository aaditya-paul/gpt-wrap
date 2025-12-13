import {
  Conversation,
  ConversationExport,
  Message,
  Node,
  ParsedConversation,
  ParsedMessage,
} from "./types";

/**
 * Extract text content from a message
 */
function extractMessageContent(message: Message): string {
  const content = message.content;

  if (content.parts && Array.isArray(content.parts)) {
    return content.parts
      .filter((part) => typeof part === "string")
      .join("\n")
      .trim();
  }

  if (content.text) {
    return content.text.trim();
  }

  if (content.result) {
    return content.result.trim();
  }

  return "";
}

/**
 * Count words in a string
 */
function countWords(text: string): number {
  if (!text) return 0;
  return text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
}

/**
 * Traverse the message tree and extract messages in order
 */
function extractMessagesFromMapping(mapping: Record<string, Node>): Message[] {
  const messages: Message[] = [];
  const visited = new Set<string>();

  // Find the root node (parent is null)
  let rootId: string | null = null;
  for (const [id, node] of Object.entries(mapping)) {
    if (node.parent === null) {
      rootId = id;
      break;
    }
  }

  if (!rootId) return messages;

  // BFS to traverse the tree
  const queue: string[] = [rootId];

  while (queue.length > 0) {
    const nodeId = queue.shift()!;
    if (visited.has(nodeId)) continue;
    visited.add(nodeId);

    const node = mapping[nodeId];
    if (!node) continue;

    // Add message if it exists and has content
    if (node.message && node.message.content) {
      const content = extractMessageContent(node.message);
      if (content || node.message.author.role !== "system") {
        messages.push(node.message);
      }
    }

    // Add children to queue (take first child for main conversation path)
    if (node.children && node.children.length > 0) {
      // For now, follow the main conversation path (first child)
      // This gives us the linear conversation without branches
      queue.push(node.children[0]);
    }
  }

  return messages;
}

/**
 * Parse a single conversation into a structured format
 */
function parseConversation(conversation: Conversation): ParsedConversation {
  const rawMessages = extractMessagesFromMapping(conversation.mapping);

  const messages: ParsedMessage[] = rawMessages
    .filter((msg) => {
      const role = msg.author.role;
      return role === "user" || role === "assistant";
    })
    .map((msg) => {
      const content = extractMessageContent(msg);
      return {
        id: msg.id,
        role: msg.author.role as "user" | "assistant",
        content,
        timestamp: msg.create_time,
        model: msg.metadata.model_slug,
        wordCount: countWords(content),
        charCount: content.length,
      };
    });

  const userMessages = messages.filter((m) => m.role === "user");
  const assistantMessages = messages.filter((m) => m.role === "assistant");

  const totalWords = messages.reduce((sum, m) => sum + m.wordCount, 0);
  const totalChars = messages.reduce((sum, m) => sum + m.charCount, 0);

  // Extract unique models used
  const models = [
    ...new Set(
      messages
        .map((m) => m.model)
        .filter((m): m is string => m !== undefined && m !== null)
    ),
  ];

  // Calculate conversation duration
  const timestamps = messages
    .map((m) => m.timestamp)
    .filter((t): t is number => t !== null)
    .sort((a, b) => a - b);

  const duration =
    timestamps.length >= 2
      ? (timestamps[timestamps.length - 1] - timestamps[0]) * 1000
      : 0;

  return {
    id: conversation.conversation_id || conversation.id || "",
    title: conversation.title || "Untitled",
    createdAt: new Date(conversation.create_time * 1000),
    updatedAt: new Date(conversation.update_time * 1000),
    messages,
    userMessages,
    assistantMessages,
    totalWords,
    totalChars,
    models,
    plugins: conversation.plugin_ids || [],
    duration,
    isArchived: conversation.is_archived || false,
  };
}

/**
 * Parse the entire conversation export
 */
export function parseConversationExport(
  data: ConversationExport
): ParsedConversation[] {
  if (!Array.isArray(data)) {
    throw new Error("Invalid conversation export format: expected an array");
  }

  return data
    .filter((conv) => {
      // Filter out invalid conversations
      if (!conv || typeof conv !== "object") return false;
      if (!conv.mapping || typeof conv.mapping !== "object") return false;
      return true;
    })
    .map(parseConversation)
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
}

/**
 * Validate that the uploaded file is a valid ChatGPT export
 */
export function validateConversationExport(
  data: unknown
): data is ConversationExport {
  if (!Array.isArray(data)) {
    return false;
  }

  if (data.length === 0) {
    return true; // Empty export is valid
  }

  // Check first few items for expected structure
  const samplesToCheck = Math.min(data.length, 3);
  for (let i = 0; i < samplesToCheck; i++) {
    const item = data[i];
    if (!item || typeof item !== "object") return false;
    if (!("mapping" in item) || !("create_time" in item)) return false;
  }

  return true;
}

/**
 * Get a summary of the export for quick validation
 */
export function getExportSummary(conversations: ParsedConversation[]) {
  const totalMessages = conversations.reduce(
    (sum, c) => sum + c.messages.length,
    0
  );
  const dateRange =
    conversations.length > 0
      ? {
          from: conversations[0].createdAt,
          to: conversations[conversations.length - 1].createdAt,
        }
      : null;

  return {
    conversationCount: conversations.length,
    messageCount: totalMessages,
    dateRange,
  };
}
