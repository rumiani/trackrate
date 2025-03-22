import { bot, MyContext } from "@/app/bot/index";
import { InputFile } from "grammy";
import { telegramUserTypes } from "@/types/user";
import { keyboardBuilder } from "../keyboardBuilder/keyboardBuilder";
import { capitalize, isEmpty, startCase } from "lodash";
import { addUser } from "../../user/addUser/addUser";
import commands from "../../commands/commands";
import getOneAssetRateFromAPI from "../../assets/assetsRateHandler/getOneAssetRateFromAPI";
import {
  allCategoriesKeyboardData,
  languageKeyboardData,
  percentageKeyboardData,
  periodArray,
  priceHistoryKeyboardData,
  selectAssetsKeyboardData,
} from "@/data/keyboardObjects";
import { allAssetsObjectsFromDB } from "../../assets/allAssetsObjectsFromDB/allAssetsObjectsFromDB";
import userStoredData from "../../user/userStoredData/userStoredData";
import { priceHistoryChart } from "../../priceHistoryChart/priceHistoryChart";
import { AssetDBTypes } from "@/types/other";
import { adminMessageToUsers } from "../../adminMessageToUsers/adminMessageToUsers";
import { adminGetsInfo } from "../../adminGetsInfo/adminGetsInfo";

const startReply = async (ctx: MyContext) => {
  const addUserResponse = await addUser(ctx.from as telegramUserTypes);
  const adminId = +process.env.TELEGRAM_ADMIN_ID!;
  const userName = ctx.from?.username
    ? "Username: @" + ctx.from?.username
    : "No username";
  if (addUserResponse) {
    ctx.reply(
      `🤖: ${ctx.t("hi")} ${ctx.from?.first_name}
    ${ctx.t("chooseLanguage")}`,
      {
        reply_markup: keyboardBuilder(ctx, languageKeyboardData, 2),
      }
    );

    const newUserToMe = `#new_user \n Name: ${ctx.from?.first_name} \n Telegram_id: ${ctx.from?.id} \n Is a bot?: ${ctx.from?.is_bot} \n ${userName}`;
    if (addUserResponse?.isNewUser) bot.api.sendMessage(adminId!, newUserToMe);
  } else {
    ctx.reply(ctx.t("somethingWrong"));

    bot.api.sendMessage(
      adminId!,
      `Error registering new user
      Name ${ctx.from?.first_name}
      Telegram_id: ${ctx.from?.id}
      Is a bot?: ${ctx.from?.is_bot}
      ${userName}`
    );
  }
};

const menuReply = async (ctx: MyContext) => {
  ctx.reply(ctx.t("menuCaption"), {
    reply_markup: keyboardBuilder(ctx, allCategoriesKeyboardData(ctx), 2),
  });
};

const messageTextReply = async (ctx: MyContext) => {
  if (ctx.message!.text?.startsWith("#")) return await adminMessageToUsers(ctx);
  if (ctx.message!.text?.startsWith("@")) return await adminGetsInfo(ctx);

  if (ctx.message!.text) {
    const cleanedText = ctx
      .message!.text.replace("@trackrate_bot", "")
      .trim()
      .toLowerCase();

    const result = await getOneAssetRateFromAPI(ctx, cleanedText.substring(1));
    if (result) return await ctx.reply(result.resultText);

    if (cleanedText.startsWith("/")) {
      await commands(cleanedText, ctx);
    } else ctx.reply(ctx.t("badRequest"));
  }
};
const assetReply = async (
  ctx: MyContext,
  assetType: string,
  operation: string
) => {
  const allAssetsResult = await allAssetsObjectsFromDB(ctx);
  const lang = ctx.session.__language_code;
  const data = allAssetsResult?.allAssets
    .filter(
      (asset) => asset.type.toLocaleLowerCase() === assetType.toLowerCase()
    )
    .map((a) => ({
      name: startCase(lang === "en" ? a.enName[0] : a.faName[0]),
      query: `${operation}_` + a.code,
    }));

  const caption =
    operation === "add"
      ? `${ctx.t("addAsset")}\n${ctx.t("chooseAssetToAdd")}`
      : `${capitalize(ctx.t("history"))} ${ctx.t(assetType)}\n ${ctx.t("chooseAnAsset")}`;
  await ctx.reply(caption, { reply_markup: keyboardBuilder(ctx, data!, 3) });
};

const myListReply = async (ctx: MyContext) => {
  const user = await userStoredData(ctx.from!.id.toString());
  if (isEmpty(user?.UserAssetTrack)) {
    const keyboardDataWithoutRemoveBtn = selectAssetsKeyboardData(ctx).slice(
      0,
      -1
    );
    return await ctx.reply(ctx.t("emptyAssetTrack"), {
      reply_markup: keyboardBuilder(ctx, keyboardDataWithoutRemoveBtn, 2),
    });
  }
  const textOutput = user
    ?.UserAssetTrack!.map((assetTrack) => {
      const userLang = ctx.session.__language_code;
      const assetName =
        userLang === "en"
          ? assetTrack.asset.enName[0]
          : assetTrack.asset.faName[0];
      return `- ${startCase(assetName)} : ${assetTrack.threshold}%`;
    })
    .join("\n");
  return await ctx.reply(
    `${ctx.t("myAssetListTitle")}\n${textOutput}\n\n ${ctx.t("myAssetListAddEdit")}`,
    {
      reply_markup: keyboardBuilder(ctx, selectAssetsKeyboardData(ctx), 3),
    }
  );
};
const removeTrackedAssetReply = async (ctx: MyContext) => {
  const userStoredDataResult = await userStoredData(ctx.from!.id.toString());
  if (isEmpty(userStoredDataResult?.UserAssetTrack)) {
    const keyboardDataWithoutRemoveBtn = selectAssetsKeyboardData(ctx).slice(
      0,
      -1
    );
    return await ctx.reply(ctx.t("emptyAssetTrack"), {
      reply_markup: keyboardBuilder(ctx, keyboardDataWithoutRemoveBtn, 2),
    });
  }
  const lang = ctx.session.__language_code;
  const data = userStoredDataResult?.UserAssetTrack!.map((a) => ({
    name: `${startCase(lang === "en" ? a.asset.enName[0] : a.asset.faName[0])}  ${a.threshold} %`,
    query: "remove_" + a.asset.code,
  }));
  await ctx.reply(ctx.t("removeCaption"), {
    reply_markup: keyboardBuilder(ctx, data!, 2),
  });
};
const percentageReply = async (ctx: MyContext, value: string) => {
  const data = percentageKeyboardData.map((c) => ({
    name: c + "%",
    query: value + "_" + c,
  }));
  await ctx.reply(ctx.t("choosePercentageCaption"), {
    reply_markup: keyboardBuilder(ctx, data, 3),
  });
};
const listReply = async (ctx: MyContext) => {
  const allAssets = await allAssetsObjectsFromDB(ctx);
  await ctx.reply(`${ctx.t("assetsList")}\n${allAssets?.assetsComandList}`);
};
const priceHistoryReply = async (
  ctx: MyContext,
  asset: AssetDBTypes,
  period: string
) => {
  const historyChartData = await priceHistoryChart(ctx, asset, period);

  if (!historyChartData?.chartImage) return ctx.reply(ctx.t("noPriceHistory"));
  const userLang = ctx.session.__language_code;
  const periodObject = periodArray(ctx).find(
    (periodObject) => periodObject.date === period
  );
  return ctx.replyWithPhoto(
    new InputFile(historyChartData.chartImage, "chart.png"),
    {
      caption: `${ctx.t("priceChart")}\n ${ctx.t("asset")}: ${userLang === "en" ? asset.enName[0] : asset.faName[0]}\n ${ctx.t("period")}: ${periodObject!.name}\n${ctx.t("aiAnalisis")}:\n${historyChartData.aiAnalisis}`,
    }
  );
};

const assetHistoryListReply = async (ctx: MyContext) => {
  ctx.reply(ctx.t("chooseAssetToSeeHistory"), {
    reply_markup: keyboardBuilder(ctx, priceHistoryKeyboardData(ctx), 3),
  });
};

const periodsReply = async (ctx: MyContext, value: string) => {
  const data = periodArray(ctx).map((c) => ({
    name: c.name,
    query: value + "_" + c.date,
  }));
  await ctx.reply(ctx.t("choosePeriod"), {
    reply_markup: keyboardBuilder(ctx, data, 3),
  });
};
const langMenuReply = async (ctx: MyContext) => {
  await ctx.reply(ctx.t("chooseLanguage"), {
    reply_markup: keyboardBuilder(ctx, languageKeyboardData, 3),
  });
};
export const replies = {
  startReply,
  menuReply,
  messageTextReply,
  assetReply,
  myListReply,
  removeTrackedAssetReply,
  percentageReply,
  listReply,
  assetHistoryListReply,
  priceHistoryReply,
  periodsReply,
  langMenuReply,
};
