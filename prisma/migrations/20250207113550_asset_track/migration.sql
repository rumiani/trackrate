/*
  Warnings:

  - You are about to drop the `UserTrackedAsset` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserTrackedAsset" DROP CONSTRAINT "UserTrackedAsset_assetId_fkey";

-- DropForeignKey
ALTER TABLE "UserTrackedAsset" DROP CONSTRAINT "UserTrackedAsset_userId_fkey";

-- DropTable
DROP TABLE "UserTrackedAsset";

-- CreateTable
CREATE TABLE "UserAssetTrack" (
    "id" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "assetId" UUID NOT NULL,
    "threshold" DECIMAL(65,30) NOT NULL,
    "trackingType" "TrackingType" NOT NULL,
    "direction" "DirectionType",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserAssetTrack_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserAssetTrack_userId_assetId_idx" ON "UserAssetTrack"("userId", "assetId");

-- CreateIndex
CREATE INDEX "UserAssetTrack_assetId_idx" ON "UserAssetTrack"("assetId");

-- AddForeignKey
ALTER TABLE "UserAssetTrack" ADD CONSTRAINT "UserAssetTrack_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAssetTrack" ADD CONSTRAINT "UserAssetTrack_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
