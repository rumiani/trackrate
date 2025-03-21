import { bot, MyContext } from "@/app/bot";
import prisma from "@/lib/prisma";

export async function sendMessageToAll(ctx: MyContext) {
  const adminId = process.env.TELEGRAM_ADMIN_ID;
  const userId = ctx.from?.id.toString();

  if (!adminId || !userId || userId !== adminId) return;

  const msg = ctx.message?.text?.replace(/#allen|#allfa/gi, "").trim();
  if (!msg) return ctx.reply("❗ No message to send.");

  const msgLang = ctx.message?.text?.startsWith("#allen") ? "en" : "fa";

  try {
    const users = await prisma.user.findMany({
      where: { languageCode: msgLang === "en" ? "en" : { not: "en" } },
    });

    if (users.length === 0) {
      return ctx.reply("❗ No users found for the selected language.");
    }

    await Promise.all(
      users.map((user) =>
        bot.api.sendMessage(user.telegramId, msg).catch((e) => {
          console.error(`Failed to send message to ${user.telegramId}:`, e);
          ctx.reply(`Failed to send message to ${user.telegramId}`);
        })
      )
    );

    await ctx.reply(`✅ The message has been sent to ${users.length} users.`);
  } catch {
    await ctx.reply("❗ An error occurred while sending messages.");
  }
}
