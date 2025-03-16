import { AssetDBTypes } from "@/types/other";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY_TRACKRATE!);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
export const getAnalisisFromFlash = async (
  asset: AssetDBTypes,
  period: string,
  formatPriceHistoryData: {
    labels: string[];
    data: number[];
  }
) => {
  const converted = JSON.stringify(
    formatPriceHistoryData.data.map((price, index) => ({
      date: formatPriceHistoryData.labels[index],
      price,
    }))
  );

  const analisisPrompt = `You are a profacional trader.
  Here is the history price for ${asset.enName[0]} for the past ${period}:
  ${converted},analise the chart and give me some suggestions or predictions all in a few lines.`;

  const result = await model.generateContent(analisisPrompt);

  return result.response.text();
};
