-- CreateEnum
CREATE TYPE "AssetType" AS ENUM ('CRYPTO', 'STOCK', 'FOREX', 'COMMODITY');

-- CreateEnum
CREATE TYPE "TrackingType" AS ENUM ('PERCENTAGE_CHANGE', 'PRICE_REACH');

-- CreateEnum
CREATE TYPE "DirectionType" AS ENUM ('INCREASE', 'DECREASE');

-- CreateEnum
CREATE TYPE "TableStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('PER_MINUTE', 'PER10MINUTES', 'HOURLY', 'EVERY_6_HOURS', 'DAILY', 'WEEKLY', 'MONTHLY', 'OFF');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "telegramId" TEXT NOT NULL,
    "name" TEXT,
    "username" TEXT,
    "isBot" BOOLEAN NOT NULL DEFAULT false,
    "languageCode" TEXT,
    "status" "TableStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastNotification" TIMESTAMP(3),
    "notificationPref" TEXT NOT NULL DEFAULT 'HOURLY',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Asset" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "enName" TEXT NOT NULL,
    "faName" TEXT NOT NULL,
    "type" "AssetType" NOT NULL,
    "currentPrice" DECIMAL(65,30) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserTrackedAsset" (
    "id" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "assetId" UUID NOT NULL,
    "threshold" DECIMAL(65,30) NOT NULL,
    "trackingType" "TrackingType" NOT NULL,
    "direction" "DirectionType",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserTrackedAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PriceHistory" (
    "id" TEXT NOT NULL,
    "assetId" UUID NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PriceHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "assetId" UUID NOT NULL,
    "changeAmount" DECIMAL(65,30) NOT NULL,
    "originalPrice" DECIMAL(65,30) NOT NULL,
    "newPrice" DECIMAL(65,30) NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Currency" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "percentage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "telegram_id" TEXT NOT NULL,
    "status" "TableStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Currency_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_telegramId_key" ON "User"("telegramId");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "User_telegramId_idx" ON "User"("telegramId");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "User"("username");

-- CreateIndex
CREATE INDEX "User_id_idx" ON "User"("id");

-- CreateIndex
CREATE INDEX "Asset_code_idx" ON "Asset"("code");

-- CreateIndex
CREATE INDEX "Asset_type_idx" ON "Asset"("type");

-- CreateIndex
CREATE INDEX "Asset_updatedAt_idx" ON "Asset"("updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Asset_code_type_key" ON "Asset"("code", "type");

-- CreateIndex
CREATE INDEX "UserTrackedAsset_userId_assetId_idx" ON "UserTrackedAsset"("userId", "assetId");

-- CreateIndex
CREATE INDEX "UserTrackedAsset_assetId_idx" ON "UserTrackedAsset"("assetId");

-- CreateIndex
CREATE INDEX "PriceHistory_assetId_createdAt_idx" ON "PriceHistory"("assetId", "createdAt");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_assetId_idx" ON "Notification"("assetId");

-- CreateIndex
CREATE INDEX "Notification_sentAt_idx" ON "Notification"("sentAt");

-- AddForeignKey
ALTER TABLE "UserTrackedAsset" ADD CONSTRAINT "UserTrackedAsset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTrackedAsset" ADD CONSTRAINT "UserTrackedAsset_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriceHistory" ADD CONSTRAINT "PriceHistory_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
