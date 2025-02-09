export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
import { NextResponse } from "next/server";
// import changeUpdate from "@/app/handlers/changeUpdate/changeUpdate";
import { bot } from "@/app/bot";
import { updateAssetsPrice } from "@/app/handlers/assets/updateAssetsPrice/updateAssetsPrice";
import { allAssetsPrice } from "@/app/handlers/assets/assetsRateHandler/allAssetsPrice";
import { allAssetTracksObjectsFromDB } from "@/app/handlers/assetTrack/allAssetTracksObjectsFromDB/allAssetTracksObjectsFromDB";
import oneAssetRateFromTheBigObject from "@/app/handlers/assets/assetsRateHandler/oneAssetRateFromTheBigObject";

export const POST = async (req: Request) => {
  const userAgent = req.headers.get("user-agent");
  const UnauthorizedReq =
    req.headers.get("X-Cron-Token") !== process.env.CRON_SECRET;
  try {
    if (!userAgent || !userAgent.includes("cron-job.org") || UnauthorizedReq)
      return NextResponse.json("Unauthorized", { status: 403 });
    // changeUpdate();
    const allAssetsPriceResult = await allAssetsPrice();

    const assetTracks = await allAssetTracksObjectsFromDB();
    for (const assetTrack of assetTracks! || []) {
      const oneAsset = oneAssetRateFromTheBigObject(
        allAssetsPriceResult!,
        assetTrack,
        assetTrack.asset
      );

      if (oneAsset && oneAsset?.bigChange) {
        try {
          await bot.api.sendMessage(
            assetTrack.user.telegramId,
            oneAsset!.resultText
          );
        } catch {
          bot.api.sendMessage(1028887352, "Error tracking change");
        }
      }
    }
    await updateAssetsPrice(allAssetsPriceResult!);
    return NextResponse.json("Request from cronjob processed.");
  } catch {
    return NextResponse.json("Server error.", { status: 500 });
  }
};
