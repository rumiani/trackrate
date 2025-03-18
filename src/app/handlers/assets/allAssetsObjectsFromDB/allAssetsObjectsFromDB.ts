import { MyContext } from "@/app/bot";
import prisma from "@/lib/prisma";
import { AssetType } from "@prisma/client";
import { startCase, toLower, toUpper } from "lodash";

export async function allAssetsObjectsFromDB(ctx: MyContext) {
  try {
    const allAssets = await prisma.asset.findMany();
    const typeOrder = { FIAT: 1, GOLD: 2, CRYPTO: 3 };
    allAssets.sort((a, b) => typeOrder[a.type] - typeOrder[b.type]);

    const lang = ctx.session.__language_code;
    let previousType: AssetType | null = null;
    const assetsComandList = allAssets
      .map((asset) => {
        const separator = previousType !== asset.type ? `\n${ctx.t(toLower(asset.type))}:\n` : "";
        previousType = asset.type;
        return `${separator}${startCase(lang === "en" ? asset.enName[0] : asset.faName[0])}: /${toUpper(
          asset.code
        )}`;
      })
      .join("\n");
    const assetsCodes = allAssets.map((asset) => asset.code);
    return { allAssets, assetsCodes, assetsComandList };
  } catch {}
}
