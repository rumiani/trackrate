import prisma from "@/lib/prisma";
import { getStartDate } from "../getStartDate/getStartDate";
import { MyContext } from "@/app/bot";

export async function getPriceHistory(ctx:MyContext,assetCode: string, dateRange: string) {
  const startDate = getStartDate(ctx,dateRange);
  return await prisma.priceHistory.findMany({
    where: {
      asset: { code: assetCode },
      createdAt: { gte: startDate },
    },
    orderBy: { createdAt: "asc" },
    select: { price: true, createdAt: true },
  });
}
