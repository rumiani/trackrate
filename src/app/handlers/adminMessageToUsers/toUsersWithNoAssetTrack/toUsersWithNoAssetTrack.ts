import { bot, MyContext } from "@/app/bot";
import prisma from "@/lib/prisma";

export async function toUsersWithNoAssetTrack({
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
      where: {
        AND: [
          { languageCode: lang === "en" ? "en" : { not: "en" } },
          { UserAssetTrack: { none: {} } },
        ],
      },
    });

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
