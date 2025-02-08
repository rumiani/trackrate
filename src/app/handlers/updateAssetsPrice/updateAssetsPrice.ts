import { bot } from "@/app/bot";
import prisma from "@/lib/prisma";
import { CoinData } from "@/types/coinDataTypes";
import { BigAssetsDataObjectTypes, brsapiCurrencyTypes } from "@/types/other";

export async function updateAssetsPrice(
  assetsFromAPI: BigAssetsDataObjectTypes
) {

  const assets = await prisma.asset.findMany();

  try {
    const updatePromises = assets.map((asset) => {
      let newPrice: number | null = null;

      if (asset.type === "CRYPTO") {
        const resultCoin = assetsFromAPI!.cryptoRateArray.find(
          (obj: CoinData) =>
            obj.symbol.toLowerCase() === asset.code.toLowerCase()
        );
        newPrice = resultCoin?.current_price ?? null;
      } else {
        const assetArray =
          asset.type === "FIAT"
            ? assetsFromAPI!.currenciesRateArray
            : assetsFromAPI!.goldsRateArray;
        const currency = assetArray.find(
          (item: brsapiCurrencyTypes) =>
            asset.enName.includes(item.name.toLowerCase()) ||
            asset.faName.includes(item.name.toLowerCase())
        );
        newPrice = currency?.price ?? null;
      }

      if (newPrice !== null) {
        return prisma.asset.update({
          where: { id: asset.id },
          data: { currentPrice: newPrice },
        });
      }
      return null;
    });

    await Promise.all(updatePromises.filter(Boolean)); // Remove null promises

    const adminId = +process.env.TELEGRAM_ADMIN_ID!;
    bot.api.sendMessage(adminId!, "Assets price updated successfully");
  } catch {
  }
}
