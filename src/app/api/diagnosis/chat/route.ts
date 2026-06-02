import { NextResponse } from "next/server";
import { aiService } from "@/lib/ai";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { conversationId, message, history } = body;

    if (!conversationId || !message) {
      return NextResponse.json(
        { reply: "参数不完整，请重试" },
        { status: 200 }
      );
    }

    const reply = await aiService.chat({ conversationId, message, history });
    return NextResponse.json({ reply });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("Chat error:", errMsg);
    return NextResponse.json(
      { reply: "网络好像不太稳定，再试一次？" },
      { status: 200 }
    );
  }
}
