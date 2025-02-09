import { bot } from "@/app/bot/index";
import { Context } from "grammy";
import { telegramUserTypes } from "@/types/user";
import { keyboardBuilder } from "../keyboardBuilder/keyboardBuilder";
import { capitalize, isEmpty, toLower } from "lodash";
import { addUser } from "../../user/addUser/addUser";
import commands from "../../commands/commands";
import getOneAssetRateFromAPI from "../../assets/assetsRateHandler/getOneAssetRateFromAPI";
import { addCategoryKeyboardData, allCategoriesKeyboardData, percentageKeyboardData, watchingAssetsListKeyboardData } from "@/data/keyboardObjects";
import { allAssetsObjectsFromDB } from "../../assets/allAssetsObjectsFromDB/allAssetsObjectsFromDB";
import userStoredData from "../../user/userStoredData/userStoredData";
import { uploadAssetsObjectToTheDB } from "../../assets/uploadAllAssetsToTheDB/uploadAllAssetsToTheDB";

const startReply = async (ctx: Context) => {
  const addUserResponse = await addUser(ctx.from as telegramUserTypes);

  const welcomeMessage = `🤖: Hi ${ctx.from?.first_name},\nWelcome to the bot! 🎉\nExplore the features using /menu or get assistance with /help.`;
  const adminId = +process.env.TELEGRAM_ADMIN_ID!;
  ctx.reply(welcomeMessage);
  const userName = ctx.from?.username
    ? "Username: @" + ctx.from?.username
    : "No username";
  const newUserToMe = `#new_user \n Name: ${ctx.from?.first_name} \n Telegram_id: ${ctx.from?.id} \n Is a bot?: ${ctx.from?.is_bot} \n ${userName}`;
  if (addUserResponse?.isNewUser) bot.api.sendMessage(adminId!, newUserToMe);

  if (ctx.from?.id === adminId) uploadAssetsObjectToTheDB();
};

const menuReply = async (ctx: Context) => {
  ctx.reply(`Please choose an option from the list:`, {
    reply_markup: keyboardBuilder(allCategoriesKeyboardData, 3),
  });
};

const messageTextReply = async (ctx: Context) => {
  if (ctx.message!.text) {
    const cleanedText = ctx
      .message!.text.replace("@trackrate_bot", "")
      .trim()
      .toLowerCase();

    const result = await getOneAssetRateFromAPI(cleanedText.substring(1));
    console.log(result);

    if (result) return await ctx.reply(result.resultText);

    if (cleanedText.startsWith("/")) {
      const result = await commands(cleanedText);
      return ctx.reply(result);
    } else ctx.reply("Bad request, click /help");
  }
};
const assetReply = async (ctx: Context, assetType: string) => {
  const allAssetsResult = await allAssetsObjectsFromDB();
  const data = allAssetsResult?.allAssets
    .filter(
      (asset) => asset.type.toLocaleLowerCase() === assetType.toLowerCase()
    )
    .map((a) => ({
      name: capitalize(a.enName[0]),
      query: `add-${toLower(a.type)}_` + toLower(a.code),
    }));

  await ctx.reply(
    `ADD ${assetType}\nPlease select a ${assetType} to track its price changes:`,
    {
      reply_markup: keyboardBuilder(data!, 3),
    }
  );
};

const listReply = async (ctx: Context) => {
  const user = await userStoredData(ctx.from!.id.toString());
  if (isEmpty(user?.UserAssetTrack))
    return await ctx.reply("Your asset track list is empty. /menu", {
      reply_markup: keyboardBuilder(addCategoryKeyboardData, 2),
    });
  let textOutPut = ``;
  user?.UserAssetTrack!.forEach(
    (assetTrack) =>
      (textOutPut += `- ${capitalize(assetTrack.asset.enName[0])} : ${
        assetTrack.threshold
      }%\n`)
  );
  await ctx.reply(
    `MY ASSET LIST\nYou have ${user?.UserAssetTrack.length} assets: \n` +
      textOutPut,
    {
      reply_markup: keyboardBuilder(watchingAssetsListKeyboardData, 3),
    }
  );
};
const removeTrackedAssetReply = async (ctx: Context) => {
  const userStoredDataResult = await userStoredData(ctx.from!.id.toString());
  if (isEmpty(userStoredDataResult?.UserAssetTrack))
    return await ctx.reply("Your asset list is empty. /menu", {
      reply_markup: keyboardBuilder(addCategoryKeyboardData, 2),
    });
  const data = userStoredDataResult?.UserAssetTrack!.map((a) => ({
    name: `${a.asset.code}  ${a.threshold} %`,
    query: "remove-asset_" + a.asset.code,
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
const assetsListReply = async (ctx: Context) => {
  const allAssets = await allAssetsObjectsFromDB();
  await ctx.reply(`Assets List:\n${allAssets?.assetsComandList}`);
};

export const replies = {
  startReply,
  menuReply,
  messageTextReply,
  assetReply,
  listReply,
  removeTrackedAssetReply,
  percentageReply,
  assetsListReply,
};
