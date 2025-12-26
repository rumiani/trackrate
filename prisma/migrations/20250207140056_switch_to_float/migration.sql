/*
  Warnings:

  - You are about to alter the column `currentPrice` on the `Asset` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `changeAmount` on the `Notification` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `originalPrice` on the `Notification` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `newPrice` on the `Notification` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `price` on the `PriceHistory` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `threshold` on the `UserAssetTrack` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "Asset" ALTER COLUMN "currentPrice" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Notification" ALTER COLUMN "changeAmount" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "originalPrice" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "newPrice" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "PriceHistory" ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "UserAssetTrack" ALTER COLUMN "threshold" SET DATA TYPE DOUBLE PRECISION;
