import { Context } from "grammy";
import { allAssetsObjectsFromDB } from "../assets/allAssetsObjectsFromDB/allAssetsObjectsFromDB";
import { uploadAssetsObjectToTheDB } from "../assets/uploadAllAssetsToTheDB/uploadAllAssetsToTheDB";
import { replies } from "../ui/replies/replies";
import { Message } from "grammy/types";

const HELP_MESSAGE = `Available commands:
/menu
/assets
Developer: @rumimaz`;

export default async function commands(messageText: string, ctx: Context) {
  const allAssets = await allAssetsObjectsFromDB();

  const commandReplies: Record<string, () => Promise<Message>> = {
    "/myassets": async () => await replies.myListReply(ctx),
    "/help": () => ctx.reply(HELP_MESSAGE),
    "/uploadassetobject": async () => {
      const uploadRes = await uploadAssetsObjectToTheDB();
      return uploadRes
        ? ctx.reply("Asset object uploaded successfully.")
        : ctx.reply("Failed to upload asset object.");
    },
    "/assets": () =>
      ctx.reply(
        `Assets List:\n${allAssets?.assetsComandList ?? "No assets available"}`
      ),
  };

  return (
    commandReplies[messageText]?.() ?? "Bad request, please check out the /menu"
  );
}
