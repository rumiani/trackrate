import prisma from "@/lib/prisma";
import { AssetType } from "@prisma/client";
import { startCase, toUpper } from "lodash";

export async function allAssetsObjectsFromDB() {
  try {
    const allAssets = await prisma.asset.findMany();
    const typeOrder = { FIAT: 1, GOLD: 2, CRYPTO: 3 };
    allAssets.sort((a, b) => typeOrder[a.type] - typeOrder[b.type]);

    let previousType: AssetType | null = null;
    const assetsComandList = allAssets
      .map((asset) => {
        const separator = previousType !== asset.type ? `${asset.type}:\n` : "";
        previousType = asset.type;
        return `${separator}${startCase(asset.enName[0])}: /${toUpper(
          asset.code
        )}`;
      })
      .join("\n");
    const assetsCodes = allAssets.map((asset) => asset.code);
    return { allAssets, assetsCodes, assetsComandList };
  } catch {}
}
