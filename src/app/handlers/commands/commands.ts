import { allAssetsObjectsFromDB } from "../assets/assetsRateHandler/getAssetsFromDB/allAssetsFromDB/allAssetsFromDB";
import { uploadAssetsObjectToTheDB } from "../assets/uploadAllAssetsToTheDB/uploadAllAssetsToTheDB";
import { replies } from "../ui/replies/replies";
import { Message } from "grammy/types";
import { MyContext } from "@/app/bot";

export default async function commands(messageText: string, ctx: MyContext) {
  const allAssets = await allAssetsObjectsFromDB(ctx);

  const commandReplies: Record<string, () => Promise<Message>> = {
    "/myassets": async () => await replies.myListReply(ctx),
    "/help": () => ctx.reply(ctx.t("help")),
    "/uploadassetobject": async () => {
      const uploadRes = await uploadAssetsObjectToTheDB();
      return uploadRes
        ? ctx.reply("Asset object uploaded successfully.")
        : ctx.reply("Failed to upload asset object.");
    },
    "/assets": () =>
      ctx.reply(
        `${ctx.t("assetsList")}\n${allAssets?.assetsComandList ?? ctx.t("noAssetsAvailable")}`
      ),
  };

  return (
    commandReplies[messageText]?.() ?? ctx.t("badRequest")
  );
}
