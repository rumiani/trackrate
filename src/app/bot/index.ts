import { Bot, Context, session, SessionFlavor } from "grammy";
import { I18n, I18nFlavor } from "@grammyjs/i18n";
import { allAssetsObjectsFromDB } from "../handlers/assets/allAssetsObjectsFromDB/allAssetsObjectsFromDB";
import { replies } from "../handlers/ui/replies/replies";
import removeAssetTrack from "../handlers/assetTrack/removeAssetTrack/removeAssetTrack";
import { updatUserAssetTracks } from "../handlers/assetTrack/updatUserAssetTracks/updatUserAssetTracks";
import { percentageKeyboardData, periodArray } from "@/data/keyboardObjects";
import userStoredData from "../handlers/user/userStoredData/userStoredData";
import path from "path";
import { changeUserLang } from "../handlers/user/changeUserLang/changeUserLang";

interface SessionData {
  __language_code?: string;
}

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) throw new Error("TELEGRAM TOKEN not found.");

export type MyContext = Context & SessionFlavor<SessionData> & I18nFlavor;

export const bot = new Bot<MyContext>(token);

export const i18n = new I18n<MyContext>({
  defaultLocale: "en",
  directory: path.join(process.cwd(), "src", "app", "bot", "locales"),
  useSession: true,
});

bot.use(
  session({
    initial: (): SessionData => ({
      __language_code: undefined, // Start with no language set
    }),
  })
);
bot.use(i18n.middleware());

bot.use(async (ctx, next) => {
  const userId = ctx.from?.id.toString();
  if (userId && !ctx.session.__language_code) {
    try {
      const userInfo = await userStoredData(userId);
      ctx.session.__language_code = userInfo?.languageCode || "en";
      ctx.i18n.useLocale(ctx.session.__language_code);
    } catch (error) {
      console.error("Error fetching user language:", error);
      ctx.session.__language_code = "en"; // Fallback on error
      ctx.i18n.useLocale("en");
    }
  }
  await next();
});

bot.command("start", replies.startReply);
bot.command("menu", replies.menuReply);
bot.command("language", replies.langMenuReply);

bot.on("callback_query:data", async (ctx) => {
  const { message, data } = ctx.callbackQuery;
  if (message) await ctx.deleteMessage();

  const [action, value] = data.split("_");

  const actionHandlers: Record<
    string,
    (ctx: MyContext, value: string) => void | Promise<void>
  > = {
    // 🏷 Category Actions
    "category:mylist": async (ctx) => {
      await replies.myListReply(ctx);
    },
    "category:remove": async (ctx) => {
      await replies.removeTrackedAssetReply(ctx);
    },
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
    add: (ctx, value) => replies.percentageReply(ctx, value),
    history: (ctx, value) => replies.periodsReply(ctx, value),

    // ❌ Removing Assets
    remove: async (ctx, value) => {
      const messageToUser = await removeAssetTrack(ctx, value);
      await ctx.reply(messageToUser);
    },
    // Language
    lang: async (ctx: MyContext, value: string) => {
      await ctx.i18n.setLocale(value);
      const result = await changeUserLang(ctx.from!.id.toString(), value);
      if (result) await ctx.reply(ctx.t("language_set"));
      else await ctx.reply(ctx.t("somethingWrong"));
    },
  };
  const handler =
    actionHandlers[`${action}:${value}`] || actionHandlers[action];
  if (handler) return handler(ctx, value);

  const allAssets = await allAssetsObjectsFromDB(ctx);
  if (allAssets?.assetsCodes.includes(action)) {
    const asset = allAssets.allAssets.find(
      (asset) => asset?.code.toLowerCase() === action.toLowerCase()
    );
    if (percentageKeyboardData.includes(value)) {
      const updateMessage = await updatUserAssetTracks({
        code: action,
        percentage: value,
        ctx,
      });
      return ctx.reply(updateMessage!);
    } else if (periodArray(ctx).map(({ date }) => date).includes(value)) {
      return replies.priceHistoryReply(ctx, asset!, value);
    }
  }
  ctx.answerCallbackQuery();
});

bot.on("message:text", async (ctx) => replies.messageTextReply(ctx));
