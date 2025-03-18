// import prisma from "@/lib/prisma";
import { createCanvas, registerFont } from "canvas";
import { getPriceHistory } from "./priceHistory/priceHistory";
import Chart from "chart.js/auto";
import { AssetDBTypes } from "@/types/other";
import path from "path";
import { getFormatPriceHistoryData } from "./getFormatPriceHistoryData/getFormatPriceHistoryData";
import { getAnalisisFromFlash } from "./getAnalysisFromFlash/getAnalysisFromFlash";
import { MyContext } from "@/app/bot";

const fontPath = path.join(process.cwd(), "assets/fonts/Roboto-Regular.ttf");
registerFont(fontPath, { family: "Roboto" });

export async function priceHistoryChart(ctx:MyContext,asset: AssetDBTypes, period: string) {
  const priceHistory = await getPriceHistory(ctx,asset.code, period);
  if (!priceHistory.length) return null;

  const formatPriceHistoryData = getFormatPriceHistoryData(
    priceHistory,
    period
  );
  const aiAnalisis = await getAnalisisFromFlash(
    ctx,
    asset,
    period,
    formatPriceHistoryData
  );

  const canvas = createCanvas(800, 400);
  const chartCtx = canvas.getContext("2d");
  chartCtx.font = "16px Roboto";
  const chartCanvas = canvas as unknown as HTMLCanvasElement;
  new Chart(chartCanvas, {
    type: "line",
    data: {
      labels: formatPriceHistoryData.labels,
      datasets: [
        {
          label: asset.enName[0] + " Price",
          data: formatPriceHistoryData.data,
          borderColor: "blue",
          borderWidth: 2,
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            font: {
              size: 14, // Ensure the font size is appropriate
              family: "Roboto", // Use Arial for labels
            },
          },
        },
      },
    },
  });
  return { aiAnalisis, chartImage: canvas.toBuffer("image/png") };
}
