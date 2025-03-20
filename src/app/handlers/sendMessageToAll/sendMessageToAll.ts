import { bot, MyContext } from "@/app/bot";
import prisma from "@/lib/prisma";

export async function sendMessageToAll(ctx: MyContext) {
  const AdminId = process.env.TELEGRAM_ADMIN_ID!;
  const userId = ctx.from!.id.toString();
  if (userId != AdminId) return;

  let msg = ctx.message!.text!;
  const msgLang = msg.startsWith("#allen") ? "en" : "fa";
  const users = await prisma.user.findMany();

  const englishUsers = users.filter((user) => user.languageCode === "en");
  const persianUsers = users.filter((user) => user.languageCode !== "en");

  msg = msg.replace(/#allen|#allfa/gi, "");
  if (msgLang === "en") {
    for (const user of englishUsers) {
      bot.api.sendMessage(user.telegramId, msg);
    }
  } else {
    for (const user of persianUsers) {
      bot.api.sendMessage(user.telegramId, msg);
    }
  }

  bot.api.sendMessage(
    AdminId!,
    `✅\nThe message has been sent to all the users:\n${msg}`
  );
}
