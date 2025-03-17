export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
import { webhookCallback } from "grammy";
import { NextResponse } from "next/server";
import { bot } from "@/app/bot/index";

export const POST = async (req: Request) => {  
  try {
    return webhookCallback(bot, "std/http")(req);
  } catch {
    return NextResponse.json("Server error.", { status: 500 });
  }
};
