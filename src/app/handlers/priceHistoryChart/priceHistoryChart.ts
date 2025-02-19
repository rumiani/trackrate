// import prisma from "@/lib/prisma";
import { createCanvas } from "canvas";
import { getPriceHistory } from "./priceHistory/priceHistory";
import Chart from "chart.js/auto";
import * as fs from "fs";
import * as path from "path";
import { AssetDBTypes } from "@/types/other";
export async function priceHistoryChart(asset: AssetDBTypes, period: string) {
  const priceHistory = await getPriceHistory(asset.code, period);
  if (!priceHistory.length) return null;
  const canvas = createCanvas(800, 400);
  canvas.getContext("2d");

  const chartCanvas = canvas as unknown as HTMLCanvasElement;
  new Chart(chartCanvas, {
    type: "line",
    data: {
      labels: priceHistory.map(
        (entry) => entry.createdAt.toISOString().split("T")[0]
      ),
      datasets: [
        {
          label: "Price",
          data: priceHistory.map((entry) => entry.price),
          borderColor: "blue",
          borderWidth: 2,
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
    },
  });
  const filePath = path.join(__dirname, "chart.png");
  const out = fs.createWriteStream(filePath);
  const stream = canvas.createPNGStream();
  stream.pipe(out);

  return new Promise<string>((resolve, reject) => {
    out.on("finish", () => resolve(filePath)); // Return file path after saving
    out.on("error", (err) => reject(err)); // Handle error if any
  });
}
