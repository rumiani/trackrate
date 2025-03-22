import { MyContext } from "@/app/bot";
import { sendMessageToAll } from "./toAll/sendMessageToAll";
import { toUsersWithNoAssetTrack } from "./toUsersWithNoAssetTrack/toUsersWithNoAssetTrack";

export async function adminMessageToUsers(ctx: MyContext) {
  const adminId = process.env.TELEGRAM_ADMIN_ID;
  const userId = ctx.from?.id.toString();
  if (!adminId || !userId || userId !== adminId) return;

  const msg = ctx.message!.text!.split("\n").slice(1).join("\n");

  const [lang, command] = ctx.message!.text!.split("#").slice(1);

  // commands handlers
  if (command === "all") {
    return await sendMessageToAll({ ctx, msg, lang });
  } else if (command === "usersnoasset") {
    return await toUsersWithNoAssetTrack({ ctx, msg, lang });
  } else {
    ctx.reply(
      `List of commands by which you can send users a message: #en#all , #fa#all \n #en#usersnoasset , #fa#usersnoasset`
    );
  }
}
