import { Context } from "grammy";
import { allAssetsObjectsFromDB } from "../assets/allAssetsObjectsFromDB/allAssetsObjectsFromDB";
import { uploadAssetsObjectToTheDB } from "../assets/uploadAllAssetsToTheDB/uploadAllAssetsToTheDB";
import { replies } from "../ui/replies/replies";
import { Message } from "grammy/types";

type CommandHandler = () => string | Promise<Message>;

const HELP_MESSAGE = `Available commands:
/menu
/assets
Developer: @rumimaz`;

export default async function commands(messageText: string, ctx: Context) {
  const allAssets = await allAssetsObjectsFromDB();

  const commandReplies: Record<string, CommandHandler> = {
    "/myassets": async () => await replies.myListReply(ctx),
    "/help": () => HELP_MESSAGE,
    "/uploadassetobject": async () => {
      const uploadRes = await uploadAssetsObjectToTheDB();
      return uploadRes
        ? ctx.reply("Asset object uploaded successfully.")
        : ctx.reply("Failed to upload asset object.");
    },
    "/assets": () =>
      `Assets List:\n${allAssets?.assetsComandList ?? "No assets available"}`,
  };

  return (
    commandReplies[messageText]?.() ?? "Bad request, please check out the /menu"
  );
}
