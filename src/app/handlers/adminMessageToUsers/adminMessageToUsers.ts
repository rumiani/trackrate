import { MyContext } from "@/app/bot";
import { sendMessageToAll } from "./toAll/sendMessageToAll";
import { toUsersWithNoAssetTrack } from "./toUsersWithNoAssetTrack/toUsersWithNoAssetTrack";
import { isEmpty } from "lodash";

export async function adminMessageToUsers(ctx: MyContext) {
  const adminId = process.env.TELEGRAM_ADMIN_ID;
  const userId = ctx.from?.id.toString();
  if (!adminId || !userId || userId !== adminId) return;

  const msg = ctx.message!.text!.split("\n").slice(1).join("\n").trim();

  const [lang, command] = ctx.message!.text!.split("\n")[0].split("#").slice(1);
  if (isEmpty(msg)) return ctx.reply("Message is empty!");
  // commands handlers

  if (command === "all") {
      return await sendMessageToAll({ ctx, msg, lang });
    } else if (command === "usersnoasset") {
    return await toUsersWithNoAssetTrack({ ctx, msg, lang });
  } else {
    return await ctx.reply(
      `List of commands by which you can send users a message:\n #en#all , #fa#all \n #en#usersnoasset , #fa#usersnoasset`
    );
  }
}
