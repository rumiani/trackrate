export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
import { Bot } from "grammy";
import { allAssetsObjectsFromDB } from "../handlers/assets/allAssetsObjectsFromDB/allAssetsObjectsFromDB";
import { replies } from "../handlers/ui/replies/replies";
import removeAssetTrack from "../handlers/assetTrack/removeAssetTrack/removeAssetTrack";
import { updatUserAssetTracks } from "../handlers/assetTrack/updatUserAssetTracks/updatUserAssetTracks";

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token)
  throw new Error("TELEGRAM_BOT_TOKEN environment variable not found.");

export const bot = new Bot(token);
bot.command("start", replies.startReply);
bot.command("menu", replies.menuReply);

bot.on("callback_query:data", async (ctx) => {
  const { message, data } = ctx.callbackQuery;
  if (message) await ctx.deleteMessage();

  const [action, value] = data.split("_");
console.log(action,value);

  switch (action) {
    case "category":
      switch (value) {
        case "add-crypto":
          return replies.assetReply(ctx, "crypto");
        case "add-fiat":
          return replies.assetReply(ctx, "fiat");
        case "add-gold":
          return replies.assetReply(ctx, "gold");
        case "see-list":
          return replies.listReply(ctx);
        case "remove-assets":
          return replies.removeTrackedAssetReply(ctx);
        case "assets-list":
          return replies.assetsListReply(ctx);
      }
      break;

    case "add-crypto":
    case "add-fiat":
    case "add-gold":
      return replies.percentageReply(ctx, value);

    case "remove-asset":
      const messageToUser = await removeAssetTrack(ctx, value);
      return ctx.reply(messageToUser);

    default:
      const allAssets = await allAssetsObjectsFromDB();
      if (allAssets?.assetsCodes.includes(action)) {
        const asset = allAssets.allAssets.find(
          (asset) => asset?.code.toLowerCase() === action.toLowerCase()
        );
        const updateMessage = await updatUserAssetTracks({
          code: action,
          percentage: value,
          userId: +ctx.from?.id,
          price: +asset!.currentPrice,
        });
        return ctx.reply(updateMessage!);
      }
  }

  ctx.answerCallbackQuery();
});

bot.on("message:text", async (ctx) => replies.messageTextReply(ctx));
