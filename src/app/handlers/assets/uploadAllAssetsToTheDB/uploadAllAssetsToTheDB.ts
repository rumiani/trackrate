import { allAssets } from "@/data/assets";
import prisma from "@/lib/prisma";

export async function uploadAssetsObjectToTheDB() {
  try {
    const cleanAssets = allAssets.map((asset) => ({
      code: asset.code,
      enName: asset.enName,
      faName: asset.faName,
      type: asset.type,
      currentPrice: 0,
      updatedAt: new Date(),
    }));

    await prisma.$transaction([
      prisma.asset.deleteMany(),
      prisma.asset.createMany({ data: cleanAssets, skipDuplicates: true }),
    ]);
    return true;
  } catch {
    return false;
  }
}
