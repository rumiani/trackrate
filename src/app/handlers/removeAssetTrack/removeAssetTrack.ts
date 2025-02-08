import prisma from "@/lib/prisma";
import { Context } from "grammy";
import userStoredData from "../userStoredData/userStoredData";

export default async function removeAssetTrack(ctx: Context, code: string) {
  try {
    const userData = await userStoredData(ctx.from!.id.toString());

    if (userData) {
      const assetTrack = userData?.UserAssetTrack.find(
        (assetTrack) => assetTrack?.asset.code === code
      );
      await prisma.userAssetTrack.delete({
        where: { id: assetTrack?.id },
      });

      return `${assetTrack?.asset.enName[0]} asset has been removed. /menu`;
    }
    return "Asset not found. /menu";
  } catch {
    return "An error occurred while removing the currency. /menu";
  }
}
