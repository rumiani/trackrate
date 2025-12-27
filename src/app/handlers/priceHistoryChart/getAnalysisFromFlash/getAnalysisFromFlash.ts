import { bot, MyContext } from "@/app/bot";
import { AssetDBTypes } from "@/types/other";
import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({});

export const getAnalisisFromFlash = async (
  ctx: MyContext,
  asset: AssetDBTypes,
  period: string,
  formatPriceHistoryData: {
    labels: string[];
    data: number[];
  }
) => {
  try {
    const converted = JSON.stringify(
      formatPriceHistoryData.data.map((price, index) => ({
        date: formatPriceHistoryData.labels[index],
        price,
      }))
    );

    const enAnalisisPrompt = `You are a profacional trader.
  Here is the history price for ${asset.enName[0]} for the past ${period}:
  ${converted},analise the chart and give me some suggestions or predictions all in less than 5 lines.`;
    const faAnalisisPrompt = `تو یک تریدر حرفه‌ای هستی.
  این تاریخچه قیمت${asset.faName[0]} برای ${ctx.t(period)} گذشته است: ${converted}.
  چارت را تحلیل کن و پیشنهاداد و پیش‌بینی‌های خودت رو در کمتر از ۴ سطر بنویس برام.
  `;
    const enLang = ctx.session.__language_code === "en";

    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: enLang ? enAnalisisPrompt : faAnalisisPrompt,
    });

    return response.text;
  } catch (error) {
    const adminId = +process.env.TELEGRAM_ADMIN_ID!;
    if (error instanceof Error)
      bot.api.sendMessage(adminId!, `Unable to generate analysis at this time.\n${error.message}`);

  }
};
