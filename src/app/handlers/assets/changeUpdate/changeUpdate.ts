import { bot } from "@/app/bot/index";
import { allAssetsPrice } from "../assetsRateHandler/allAssetsPrice";
import { allAssetTracksObjectsFromDB } from "../../assetTrack/allAssetTracksObjectsFromDB/allAssetTracksObjectsFromDB";
import oneAssetRateFromTheBigObject from "../assetsRateHandler/oneAssetRateFromTheBigObject";
import { updateAssetsPrice } from "../updateAssetsPrice/updateAssetsPrice";

export default async function changeUpdate() {
  const allAssetsPriceResult = await allAssetsPrice();

  const assetTracks = await allAssetTracksObjectsFromDB();
  for (const assetTrack of assetTracks! || []) {
    const oneAsset = oneAssetRateFromTheBigObject(
      assetTrack.user.languageCode!,
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
}
