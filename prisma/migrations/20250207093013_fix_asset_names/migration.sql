/*
  Warnings:

  - The values [STOCK,FOREX,COMMODITY] on the enum `AssetType` will be removed. If these variants are still used in the database, this will fail.
  - The `enName` column on the `Asset` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `faName` column on the `Asset` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AssetType_new" AS ENUM ('CRYPTO', 'CURRENCY', 'GOLD');
ALTER TABLE "Asset" ALTER COLUMN "type" TYPE "AssetType_new" USING ("type"::text::"AssetType_new");
ALTER TYPE "AssetType" RENAME TO "AssetType_old";
ALTER TYPE "AssetType_new" RENAME TO "AssetType";
DROP TYPE "AssetType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Asset" DROP COLUMN "enName",
ADD COLUMN     "enName" TEXT[],
DROP COLUMN "faName",
ADD COLUMN     "faName" TEXT[];
