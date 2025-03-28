import { formatNumHandler } from "../../general/formatNumbers/formatNumbers";
import { startCase } from "lodash";
import { MyContext } from "@/app/bot";
import { allAssetsFromDB } from "./getAssetsFromDB/allAssetsFromDB/allAssetsFromDB";

export default async function getOneAssetFromDB(
  ctx: MyContext,
  assetName: string
) {
  try {
    const allAssetsObjects = await allAssetsFromDB(ctx);
    const assetObject = allAssetsObjects?.allAssets.find(
      (storedAsset) =>
        storedAsset?.enName
          .includes(assetName.toLowerCase()) ||
        storedAsset?.faName
          .includes(assetName.toLowerCase())
    );

    const enLang = ctx.session.__language_code === "en";
    const toman = enLang ? "T" : "تومان";
    const dollar = enLang ? "$" : "دلار";
    const sign = assetObject!.type === "CRYPTO" ? dollar : toman;
    const resultText = `🔹 ${startCase(enLang ? assetObject!.enName[0] : assetObject!.faName[0])}
    💰 ${ctx.t("price")}: ${formatNumHandler(assetObject!.currentPrice)} ${sign}    
    🔗 /assets
    📜 /menu`;

    return {
      currencyName: assetObject!.enName[0],
      price: assetObject?.currentPrice,
      resultText,
    };
  } catch {
    return null;
  }
}
