import prisma from "@/lib/prisma";

export default async function userStoredData(telegramId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { telegramId },
      include: { UserAssetTrack: { include: { asset: true } } },
    });
    if (!user) return null;
    return user;
  } catch {
    return undefined;
  }
}
