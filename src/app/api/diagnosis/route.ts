import { NextResponse } from "next/server";
import { aiService } from "@/lib/ai";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { imageBase64, mimeType } = body;

    if (!imageBase64) {
      return NextResponse.json(
        { error: "缺少图片数据" },
        { status: 400 }
      );
    }

    const result = await aiService.diagnose({ imageBase64, mimeType });
    return NextResponse.json(result);
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("Diagnosis error:", errMsg);
    return NextResponse.json(
      { error: `诊断失败: ${errMsg.slice(0, 100)}` },
      { status: 500 }
    );
  }
}
