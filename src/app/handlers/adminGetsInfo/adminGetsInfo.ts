import { MyContext } from "@/app/bot";
import prisma from "@/lib/prisma";

export async function adminGetsInfo(ctx: MyContext) {
  const adminId = process.env.TELEGRAM_ADMIN_ID;
  const userId = ctx.from?.id.toString();
  if (!adminId || !userId || userId !== adminId) return;

  const command = ctx.message!.text!.replace("@", "");
  try {
    // commands handlers
    if (command === "usercount") {
      const userCount = await prisma.user.count();
      return ctx.reply(userCount.toString());
    } else if (command === "userscountnoasset") {
      const [userCount, userCountNoAsset] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { UserAssetTrack: { none: {} } } }),
      ]);
      const percentage =
        Math.round(((userCountNoAsset * 100) / userCount) * 100) / 100;
      return ctx.reply(
        `All users: ${userCount}\n Users with no asset track: ${percentage}%`
      );
    } else {
      ctx.reply(
        `List of commands fo db info:\n @usercount\n @userscountnoasset`
      );
    }
  } catch {
    ctx.reply("Something went wrong");
  }
}
