import { bot } from "@/app/bot/index";
import { allAssetTracksObjectsFromDB } from "../allAssetTracksObjectsFromDB/allAssetTracksObjectsFromDB";
import { updateAssetsPrice } from "../updateAssetsPrice/updateAssetsPrice";
import oneAssetRateFromTheBigObject from "../assetsRateHandler/oneAssetRateFromTheBigObject";
import { allAssetsPrice } from "../assetsRateHandler/allAssetsPrice";

export default async function changeUpdate() {
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
}
