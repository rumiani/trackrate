export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
import { NextResponse } from "next/server";
import { bot } from "@/app/bot";
import { updateAssetsPrice } from "@/app/handlers/assets/updateAssetsPrice/updateAssetsPrice";
import { allAssetTracksObjectsFromDB } from "@/app/handlers/assetTrack/allAssetTracksObjectsFromDB/allAssetTracksObjectsFromDB";
import oneAssetRateFromTheBigObject from "@/app/handlers/assets/assetsRateHandler/oneAssetRateFromTheBigObject";
import { lastNotifUpdate } from "@/app/handlers/user/lastNotifUpdate/lastNotifUpdate";
import { allAssetsPrice } from "@/app/handlers/assets/assetsRateHandler/assetsPrice/allAssetsPrice";

export const GET = async (req: Request) => {
  try {
    if (
      req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    const allAssetsPriceResult = await allAssetsPrice();

    const assetTracks = await allAssetTracksObjectsFromDB();
    for (const assetTrack of assetTracks! || []) {
      const oneAsset = oneAssetRateFromTheBigObject(
        assetTrack.user.languageCode!,
        allAssetsPriceResult!,
        assetTrack,
        assetTrack.asset
      );
      if (oneAsset && oneAsset.bigChange) {
        try {
          await bot.api.sendMessage(
            assetTrack.user.telegramId,
            oneAsset!.resultText
          );
          await lastNotifUpdate(assetTrack.user.telegramId);
        } catch {
          bot.api.sendMessage(1028887352, "Error tracking changes");
        }
      }
    }
    await updateAssetsPrice(allAssetsPriceResult!);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json("Server error.", { status: 500 });
  }
};
