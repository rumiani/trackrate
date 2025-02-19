// import prisma from "@/lib/prisma";
import { createCanvas } from "canvas";
import { getPriceHistory } from "./priceHistory/priceHistory";
import Chart from "chart.js/auto";
import { AssetDBTypes } from "@/types/other";

export async function priceHistoryChart(asset: AssetDBTypes, period: string) {
  const priceHistory = await getPriceHistory(asset.code, period);
  if (!priceHistory.length) return null;
  const canvas = createCanvas(800, 400);
  const ctx = canvas.getContext("2d");
  ctx.font = "16px Arial";
  const chartCanvas = canvas as unknown as HTMLCanvasElement;
  new Chart(chartCanvas, {
    type: "line",
    data: {
      labels: priceHistory.map(
        (entry) => entry.createdAt.toISOString().split("T")[0]
      ),
      datasets: [
        {
          label: asset.enName[0] + " Price",
          data: priceHistory.map((entry) => entry.price),
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
              family: "Arial", // Use Arial for labels
            },
          },
        },
      },
    },
  });
  return canvas.toBuffer("image/png");
}
