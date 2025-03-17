import { bot } from "@/app/bot/index";
import { Context, InputFile } from "grammy";
import { telegramUserTypes } from "@/types/user";
import { keyboardBuilder } from "../keyboardBuilder/keyboardBuilder";
import { isEmpty, startCase } from "lodash";
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

const startReply = async (ctx: Context) => {
  const addUserResponse = await addUser(ctx.from as telegramUserTypes);
  const adminId = +process.env.TELEGRAM_ADMIN_ID!;
  const userName = ctx.from?.username
    ? "Username: @" + ctx.from?.username
    : "No username";
  if (addUserResponse) {
    ctx.reply(
      `🤖: Hi ${ctx.from?.first_name}
      Please select a language from the list:`,
      {
        reply_markup: keyboardBuilder(languageKeyboardData, 2),
      }
    );

    const newUserToMe = `#new_user \n Name: ${ctx.from?.first_name} \n Telegram_id: ${ctx.from?.id} \n Is a bot?: ${ctx.from?.is_bot} \n ${userName}`;
    if (addUserResponse?.isNewUser) bot.api.sendMessage(adminId!, newUserToMe);
  } else {
    ctx.reply("Something went wrong, please contact the developer: @rumimaz");

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

const menuReply = async (ctx: Context) => {
  ctx.reply(`Please choose an option from the list:`, {
    reply_markup: keyboardBuilder(allCategoriesKeyboardData, 2),
  });
};

const messageTextReply = async (ctx: Context) => {
  if (ctx.message!.text) {
    const cleanedText = ctx
      .message!.text.replace("@trackrate_bot", "")
      .trim()
      .toLowerCase();

    const result = await getOneAssetRateFromAPI(cleanedText.substring(1));
    if (result) return await ctx.reply(result.resultText);

    if (cleanedText.startsWith("/")) {
      await commands(cleanedText, ctx);
    } else ctx.reply("Bad request, click /help");
  }
};
const assetReply = async (
  ctx: Context,
  assetType: string,
  operation: string
) => {
  const allAssetsResult = await allAssetsObjectsFromDB();
  const data = allAssetsResult?.allAssets
    .filter(
      (asset) => asset.type.toLocaleLowerCase() === assetType.toLowerCase()
    )
    .map((a) => ({
      name: startCase(a.enName[0]),
      query: `${operation}_` + a.code,
    }));

  const caption =
    operation === "add"
      ? `ADD ${assetType}\nPlease select a ${assetType} to track its price changes:`
      : `HISTORY ${assetType}\nPlease select a ${assetType} to check its history:`;
  await ctx.reply(caption, { reply_markup: keyboardBuilder(data!, 3) });
};

const myListReply = async (ctx: Context) => {
  const user = await userStoredData(ctx.from!.id.toString());
  if (isEmpty(user?.UserAssetTrack)) {
    const keyboardDataWithoutRemoveBtn = selectAssetsKeyboardData.slice(0, -1);
    return await ctx.reply("Your asset track list is empty. /menu", {
      reply_markup: keyboardBuilder(keyboardDataWithoutRemoveBtn, 2),
    });
  }
  const textOutput = user
    ?.UserAssetTrack!.map(
      (assetTrack) =>
        `- ${startCase(assetTrack.asset.enName[0])} : ${assetTrack.threshold}%`
    )
    .join("\n");
  return await ctx.reply(
    `MY ASSET LIST\n${textOutput}\n\n Add or Edit an asset:`,
    {
      reply_markup: keyboardBuilder(selectAssetsKeyboardData, 3),
    }
  );
};
const removeTrackedAssetReply = async (ctx: Context) => {
  const userStoredDataResult = await userStoredData(ctx.from!.id.toString());
  if (isEmpty(userStoredDataResult?.UserAssetTrack)) {
    const keyboardDataWithoutRemoveBtn = selectAssetsKeyboardData.slice(0, -1);
    return await ctx.reply("Your asset list is empty. /menu", {
      reply_markup: keyboardBuilder(keyboardDataWithoutRemoveBtn, 2),
    });
  }
  const data = userStoredDataResult?.UserAssetTrack!.map((a) => ({
    name: `${startCase(a.asset.enName[0])}  ${a.threshold} %`,
    query: "remove_" + a.asset.code,
  }));
  await ctx.reply("REMOVE\nSelect an asset to remove from the list:", {
    reply_markup: keyboardBuilder(data!, 2),
  });
};
const percentageReply = async (ctx: Context, value: string) => {
  const data = percentageKeyboardData.map((c) => ({
    name: c + "%",
    query: value + "_" + c,
  }));
  await ctx.reply(
    "PERCENTAGE\nSelect the percentage change at which you’d like to receive alerts:",
    {
      reply_markup: keyboardBuilder(data, 3),
    }
  );
};
const listReply = async (ctx: Context) => {
  const allAssets = await allAssetsObjectsFromDB();
  await ctx.reply(`Assets List:\n${allAssets?.assetsComandList}`);
};
const priceHistoryReply = async (
  ctx: Context,
  asset: AssetDBTypes,
  period: string
) => {
  const historyChartData = await priceHistoryChart(asset, period);
  if (!historyChartData?.chartImage)
    return ctx.reply("No price history available.");
  return ctx.replyWithPhoto(
    new InputFile(historyChartData.chartImage, "chart.png"),
    {
      caption: `Price history of ${asset.enName[0]} for the past ${period}\nAI analisis:\n${historyChartData.aiAnalisis}`,
    }
  );
};

const assetHistoryListReply = async (ctx: Context) => {
  ctx.reply(`Please choose an asset from the list to see the history:`, {
    reply_markup: keyboardBuilder(priceHistoryKeyboardData, 3),
  });
};

const periodsReply = async (ctx: Context, value: string) => {
  const data = periodArray.map((c) => ({
    name: c.name,
    query: value + "_" + c.date,
  }));
  await ctx.reply("Please select a period:", {
    reply_markup: keyboardBuilder(data, 3),
  });
};
const langMenuReply = async (ctx: Context) => {
  await ctx.reply("Please select a language from the list", {
    reply_markup: keyboardBuilder(languageKeyboardData, 3),
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
