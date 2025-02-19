export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
import { Bot, Context } from "grammy";
import { allAssetsObjectsFromDB } from "../handlers/assets/allAssetsObjectsFromDB/allAssetsObjectsFromDB";
import { replies } from "../handlers/ui/replies/replies";
import removeAssetTrack from "../handlers/assetTrack/removeAssetTrack/removeAssetTrack";
import { updatUserAssetTracks } from "../handlers/assetTrack/updatUserAssetTracks/updatUserAssetTracks";
import { dateRangeArray, percentageKeyboardData } from "@/data/keyboardObjects";

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
  
  const actionHandlers: Record<string, (ctx: Context, value: string) => void> =
    {
      // 🏷 Category Actions
      "category:mylist": (ctx) => replies.myListReply(ctx),
      "category:remove": (ctx) => replies.removeTrackedAssetReply(ctx),
      "category:list": (ctx) => replies.listReply(ctx),
      "category:history": (ctx) => replies.assetHistoryListReply(ctx),

      // + Add assets category
      "select:crypto": (ctx) => replies.assetReply(ctx, "crypto", "add"),
      "select:fiat": (ctx) => replies.assetReply(ctx, "fiat", "add"),
      "select:gold": (ctx) => replies.assetReply(ctx, "gold", "add"),

      // 🔍 Asset History
      "history:crypto": (ctx) => replies.assetReply(ctx, "crypto", "history"),
      "history:fiat": (ctx) => replies.assetReply(ctx, "fiat", "history"),
      "history:gold": (ctx) => replies.assetReply(ctx, "gold", "history"),

      // 📊 Adding Assets
      "add": (ctx, value) => replies.percentageReply(ctx, value),
      "history": (ctx, value) => replies.periodsReply(ctx, value),
  

      // ❌ Removing Assets
      remove: async (ctx, value) => {
        const messageToUser = await removeAssetTrack(ctx, value);
        return ctx.reply(messageToUser);
      },
    };
  const handler =
    actionHandlers[`${action}:${value}`] || actionHandlers[action];
  if (handler) return handler(ctx, value);

  const allAssets = await allAssetsObjectsFromDB();
  if (allAssets?.assetsCodes.includes(action)) {
    const asset = allAssets.allAssets.find(
      (asset) => asset?.code.toLowerCase() === action.toLowerCase()
    );
    if (percentageKeyboardData.includes(value)) {
      const updateMessage = await updatUserAssetTracks({
        code: action,
        percentage: value,
        userId: +ctx.from?.id,
        price: +asset!.currentPrice,
      });
      return ctx.reply(updateMessage!);
    } else if (dateRangeArray.map(({ date }) => date).includes(value)) {
      return replies.priceHistoryReply(ctx, asset!, value);
    }
  }
  ctx.answerCallbackQuery();
});

bot.on("message:text", async (ctx) => replies.messageTextReply(ctx));
