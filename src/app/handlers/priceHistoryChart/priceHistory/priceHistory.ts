import prisma from "@/lib/prisma";
import { getStartDate } from "../getStartDate/getStartDate";

export async function getPriceHistory(assetCode: string, dateRange: string) {
  const startDate = getStartDate(dateRange);
  return await prisma.priceHistory.findMany({
    where: {
      asset: { code: assetCode },
      createdAt: { gte: startDate },
    },
    orderBy: { createdAt: "asc" },
    select: { price: true, createdAt: true },
  });
}
