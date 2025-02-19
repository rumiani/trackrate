import { Context } from "grammy";
import { allAssetsObjectsFromDB } from "../assets/allAssetsObjectsFromDB/allAssetsObjectsFromDB";
import { uploadAssetsObjectToTheDB } from "../assets/uploadAllAssetsToTheDB/uploadAllAssetsToTheDB";
import { isAdmin } from "../general/isAdmin";

export default async function commands(messageText: string, ctx: Context) {
  const allAssets = await allAssetsObjectsFromDB();

  const commandReplies: {
    [key: string]: () => string | Promise<string>;
  } = {
    "/help": () => `Available commands:\n/menu \n/assets\nDeveloper: @rumimaz`,
    "/uploadassetobject": async () => {
      if (isAdmin(ctx.from!.id)) {
        const uploadRes = await uploadAssetsObjectToTheDB();
        return uploadRes
          ? "Asset object uploaded successfully."
          : "Failed to upload asset object.";
      }
      return "Bad request, please check out the /menu";
    },
    "/assets": () => `Assets List:\n${allAssets?.assetsComandList}`,
  };
  if (commandReplies[messageText]) return commandReplies[messageText]();
  else return "Bad request, please check out the /menu";
}
