import { allAssets } from "@/data/assets";
import prisma from "@/lib/prisma";

export async function uploadAssetsObjectToTheDB() {
  try {
    const updatePromises = allAssets.map((asset) =>
      prisma.asset.upsert({
        where: { code: asset.code },
        update: {
          enName: asset.enName,
          faName: asset.faName,
          type: asset.type,
          currentPrice: 0,
          status: asset.status,
          updatedAt: new Date(),
        },
        create: {
          code: asset.code,
          enName: asset.enName,
          faName: asset.faName,
          type: asset.type,
          currentPrice: 0,
          status: asset.status,
          updatedAt: new Date(),
        },
      })
    );

    await Promise.all(updatePromises);

    return true;
  } catch {
    return false;
  }
}
