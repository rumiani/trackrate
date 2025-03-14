// import prisma from "@/lib/prisma";
import { createCanvas, registerFont } from "canvas";
import { getPriceHistory } from "./priceHistory/priceHistory";
import Chart from "chart.js/auto";
import { AssetDBTypes } from "@/types/other";
import path from "path";
import { getFormatPriceHistoryData } from "./getFormatPriceHistoryData/getFormatPriceHistoryData";

const fontPath = path.join(process.cwd(), "assets/fonts/Roboto-Regular.ttf");
registerFont(fontPath, { family: "Roboto" });

export async function priceHistoryChart(asset: AssetDBTypes, period: string) {
  const priceHistory = await getPriceHistory(asset.code, period);
  if (!priceHistory.length) return null;

  const formatPriceHistoryData = getFormatPriceHistoryData(
    priceHistory,
    period
  );
  

  const canvas = createCanvas(800, 400);
  const ctx = canvas.getContext("2d");
  ctx.font = "16px Roboto";
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
  return canvas.toBuffer("image/png");
}
