import prisma from "@/lib/prisma";
import { startCase, toUpper } from "lodash";

export async function allAssetsObjectsFromDB() {
  try {
    const allAssets = await prisma.asset.findMany();
    allAssets.sort((a, b) => a.code.localeCompare(b.code, undefined, { sensitivity: 'base' }));

    const assetsCodes = allAssets.map((asset) => asset.code.toLowerCase());
    
    const assetsComandList = allAssets
      .map((asset) => `${startCase(asset.enName[0])}: /${toUpper(asset.code)}`)
      .join("\n");
    return { allAssets, assetsCodes, assetsComandList };
  } catch {}
}
