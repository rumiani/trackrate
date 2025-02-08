import prisma from "@/lib/prisma";

export async function allAssetTracksObjectsFromDB() {
  try {
    const assetsTracks = await prisma.userAssetTrack.findMany({
      include: { user: true, asset: true },
    });
    return assetsTracks;
  } catch {}
}
