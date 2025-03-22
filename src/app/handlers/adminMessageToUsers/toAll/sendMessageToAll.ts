import { bot, MyContext } from "@/app/bot";
import prisma from "@/lib/prisma";

export async function sendMessageToAll({
  ctx,
  msg,
  lang,
}: {
  ctx: MyContext;
  msg: string;
  lang: string;
}) {
  try {
    const users = await prisma.user.findMany({
      where: { languageCode: lang === "en" ? "en" : { not: "en" } },
    });

    if (users.length === 0)
      return ctx.reply("❗ No users found for the selected language.");
    await Promise.all(
      users.map((user) =>
        bot.api
          .sendMessage(user.telegramId, msg)
          .catch(() =>
            ctx.reply(`Failed to send message to ${user.telegramId}`)
          )
      )
    );

    await ctx.reply(`✅ The message has been sent to ${users.length} users.`);
  } catch {
    await ctx.reply("❗ An error occurred while sending messages.");
  }
}
