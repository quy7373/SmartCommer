/*
  Warnings:

  - You are about to drop the column `paypalClientId` on the `PaymentSetting` table. All the data in the column will be lost.
  - You are about to drop the column `paypalSecretKey` on the `PaymentSetting` table. All the data in the column will be lost.
  - You are about to drop the `OAuthAccount` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[storeId,date]` on the table `AnalyticsDaily` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[storeId,month]` on the table `AnalyticsMonthly` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[storeId,slug]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[storeId,name]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[storeId,code]` on the table `Coupon` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[storeId,slug]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[googleId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[facebookId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `profit` to the `AnalyticsDaily` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storeId` to the `AnalyticsDaily` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profit` to the `AnalyticsMonthly` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storeId` to the `AnalyticsMonthly` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Cart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storeId` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedBy` to the `CommissionSetting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdBy` to the `Coupon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storeId` to the `Coupon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `afterStock` to the `InventoryLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `beforeStock` to the `InventoryLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productName` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Store` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Provider" AS ENUM ('LOCAL', 'GOOGLE', 'FACEBOOK', 'GITHUB');

-- AlterEnum
ALTER TYPE "public"."MessageType" ADD VALUE 'EMOJI';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."NotificationType" ADD VALUE 'COMPLAINT';
ALTER TYPE "public"."NotificationType" ADD VALUE 'REVIEW';
ALTER TYPE "public"."NotificationType" ADD VALUE 'SHIPMENT';

-- DropForeignKey
ALTER TABLE "public"."OAuthAccount" DROP CONSTRAINT "OAuthAccount_userId_fkey";

-- DropIndex
DROP INDEX "public"."Category_slug_key";

-- DropIndex
DROP INDEX "public"."Coupon_code_key";

-- DropIndex
DROP INDEX "public"."Product_slug_key";

-- AlterTable
ALTER TABLE "public"."AnalyticsDaily" ADD COLUMN     "cancelled" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "conversionRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "newCustomer" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "profit" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "refund" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "storeId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."AnalyticsMonthly" ADD COLUMN     "cancelled" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "conversionRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "newCustomer" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "profit" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "refund" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "storeId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Cart" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."Category" ADD COLUMN     "storeId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."CommissionSetting" ADD COLUMN     "updatedBy" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Coupon" ADD COLUMN     "createdBy" TEXT NOT NULL,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "maxUsagePerUser" INTEGER,
ADD COLUMN     "storeId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."InventoryLog" ADD COLUMN     "afterStock" INTEGER NOT NULL,
ADD COLUMN     "beforeStock" INTEGER NOT NULL,
ADD COLUMN     "createdBy" TEXT;

-- AlterTable
ALTER TABLE "public"."Message" ADD COLUMN     "editedAt" TIMESTAMP(3),
ADD COLUMN     "fileUrl" TEXT,
ADD COLUMN     "replyToId" TEXT;

-- AlterTable
ALTER TABLE "public"."Notification" ADD COLUMN     "action" TEXT,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "metadata" JSONB;

-- AlterTable
ALTER TABLE "public"."Order" ADD COLUMN     "addressId" TEXT,
ADD COLUMN     "cancelReason" TEXT,
ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "couponId" TEXT,
ADD COLUMN     "note" TEXT,
ADD COLUMN     "paidAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "public"."OrderItem" ADD COLUMN     "productImage" TEXT,
ADD COLUMN     "productName" TEXT NOT NULL,
ADD COLUMN     "variantName" TEXT;

-- AlterTable
ALTER TABLE "public"."Payment" ADD COLUMN     "callbackData" JSONB,
ADD COLUMN     "failureReason" TEXT,
ADD COLUMN     "paidAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "public"."PaymentSetting" DROP COLUMN "paypalClientId",
DROP COLUMN "paypalSecretKey";

-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "dimensionUnit" TEXT,
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "publishedAt" TIMESTAMP(3),
ADD COLUMN     "seoDescription" TEXT,
ADD COLUMN     "seoTitle" TEXT,
ADD COLUMN     "video" TEXT,
ADD COLUMN     "weightUnit" TEXT,
ALTER COLUMN "thumbnail" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."ProductVariant" ADD COLUMN     "costPrice" DECIMAL(65,30),
ADD COLUMN     "image" TEXT,
ADD COLUMN     "isDefault" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."Review" ADD COLUMN     "images" TEXT[],
ADD COLUMN     "reply" TEXT,
ADD COLUMN     "replyAt" TIMESTAMP(3),
ADD COLUMN     "videos" TEXT[];

-- AlterTable
ALTER TABLE "public"."Shipment" ADD COLUMN     "carrier" TEXT,
ADD COLUMN     "deliveredAt" TIMESTAMP(3),
ADD COLUMN     "estimatedDelivery" TIMESTAMP(3),
ADD COLUMN     "trackingNumber" TEXT;

-- AlterTable
ALTER TABLE "public"."Store" ADD COLUMN     "businessLicense" TEXT,
ADD COLUMN     "coverImage" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "openingHours" TEXT,
ADD COLUMN     "taxCode" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "facebookId" TEXT,
ADD COLUMN     "googleId" TEXT,
ADD COLUMN     "lastLoginAt" TIMESTAMP(3),
ADD COLUMN     "provider" "public"."Provider" NOT NULL DEFAULT 'LOCAL',
ADD COLUMN     "refreshToken" TEXT,
ADD COLUMN     "resetPasswordExpires" TIMESTAMP(3),
ADD COLUMN     "resetPasswordToken" TEXT,
ALTER COLUMN "role" SET DEFAULT 'USER';

-- DropTable
DROP TABLE "public"."OAuthAccount";

-- CreateTable
CREATE TABLE "public"."ProductStatistic" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "sold" INTEGER NOT NULL DEFAULT 0,
    "wishlist" INTEGER NOT NULL DEFAULT 0,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "ProductStatistic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ComplaintAttachment" (
    "id" TEXT NOT NULL,
    "complaintId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "ComplaintAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Visitor" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "ip" TEXT,
    "country" TEXT,
    "device" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Visitor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Banner" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "link" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Banner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FlashSale" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FlashSale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FlashSaleProduct" (
    "id" TEXT NOT NULL,
    "flashSaleId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "stock" INTEGER NOT NULL,
    "sold" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "FlashSaleProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OtpLog" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "expiredAt" TIMESTAMP(3) NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OtpLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "oldValue" JSONB,
    "newValue" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "device" TEXT,
    "browser" TEXT,
    "ip" TEXT,
    "refreshToken" TEXT NOT NULL,
    "expiredAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StoreFollower" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StoreFollower_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SearchHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "keyword" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SearchHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RecentlyViewed" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecentlyViewed_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductStatistic_productId_key" ON "public"."ProductStatistic"("productId");

-- CreateIndex
CREATE INDEX "ComplaintAttachment_complaintId_idx" ON "public"."ComplaintAttachment"("complaintId");

-- CreateIndex
CREATE INDEX "Visitor_storeId_idx" ON "public"."Visitor"("storeId");

-- CreateIndex
CREATE UNIQUE INDEX "FlashSaleProduct_flashSaleId_productId_key" ON "public"."FlashSaleProduct"("flashSaleId", "productId");

-- CreateIndex
CREATE INDEX "OtpLog_email_idx" ON "public"."OtpLog"("email");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "public"."AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_entity_entityId_idx" ON "public"."AuditLog"("entity", "entityId");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "public"."Session"("userId");

-- CreateIndex
CREATE INDEX "StoreFollower_storeId_idx" ON "public"."StoreFollower"("storeId");

-- CreateIndex
CREATE INDEX "StoreFollower_userId_idx" ON "public"."StoreFollower"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "StoreFollower_storeId_userId_key" ON "public"."StoreFollower"("storeId", "userId");

-- CreateIndex
CREATE INDEX "SearchHistory_userId_idx" ON "public"."SearchHistory"("userId");

-- CreateIndex
CREATE INDEX "RecentlyViewed_userId_idx" ON "public"."RecentlyViewed"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "RecentlyViewed_userId_productId_key" ON "public"."RecentlyViewed"("userId", "productId");

-- CreateIndex
CREATE INDEX "Address_userId_idx" ON "public"."Address"("userId");

-- CreateIndex
CREATE INDEX "AnalyticsDaily_storeId_idx" ON "public"."AnalyticsDaily"("storeId");

-- CreateIndex
CREATE UNIQUE INDEX "AnalyticsDaily_storeId_date_key" ON "public"."AnalyticsDaily"("storeId", "date");

-- CreateIndex
CREATE INDEX "AnalyticsMonthly_storeId_idx" ON "public"."AnalyticsMonthly"("storeId");

-- CreateIndex
CREATE UNIQUE INDEX "AnalyticsMonthly_storeId_month_key" ON "public"."AnalyticsMonthly"("storeId", "month");

-- CreateIndex
CREATE INDEX "Category_storeId_idx" ON "public"."Category"("storeId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_storeId_slug_key" ON "public"."Category"("storeId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "Category_storeId_name_key" ON "public"."Category"("storeId", "name");

-- CreateIndex
CREATE INDEX "CommissionSetting_updatedBy_idx" ON "public"."CommissionSetting"("updatedBy");

-- CreateIndex
CREATE INDEX "Coupon_storeId_idx" ON "public"."Coupon"("storeId");

-- CreateIndex
CREATE UNIQUE INDEX "Coupon_storeId_code_key" ON "public"."Coupon"("storeId", "code");

-- CreateIndex
CREATE INDEX "InventoryLog_productVariantId_idx" ON "public"."InventoryLog"("productVariantId");

-- CreateIndex
CREATE INDEX "InventoryLog_createdBy_idx" ON "public"."InventoryLog"("createdBy");

-- CreateIndex
CREATE INDEX "Order_userId_idx" ON "public"."Order"("userId");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "public"."Order"("status");

-- CreateIndex
CREATE INDEX "Order_addressId_idx" ON "public"."Order"("addressId");

-- CreateIndex
CREATE INDEX "Order_couponId_idx" ON "public"."Order"("couponId");

-- CreateIndex
CREATE INDEX "Product_storeId_idx" ON "public"."Product"("storeId");

-- CreateIndex
CREATE INDEX "Product_categoryId_idx" ON "public"."Product"("categoryId");

-- CreateIndex
CREATE INDEX "Product_deletedAt_idx" ON "public"."Product"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Product_storeId_slug_key" ON "public"."Product"("storeId", "slug");

-- CreateIndex
CREATE INDEX "Review_productId_idx" ON "public"."Review"("productId");

-- CreateIndex
CREATE INDEX "Store_ownerId_idx" ON "public"."Store"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "public"."User"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "User_facebookId_key" ON "public"."User"("facebookId");

-- AddForeignKey
ALTER TABLE "public"."Category" ADD CONSTRAINT "Category_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "public"."Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductStatistic" ADD CONSTRAINT "ProductStatistic_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "public"."Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "public"."Coupon"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ComplaintAttachment" ADD CONSTRAINT "ComplaintAttachment_complaintId_fkey" FOREIGN KEY ("complaintId") REFERENCES "public"."Complaint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_replyToId_fkey" FOREIGN KEY ("replyToId") REFERENCES "public"."Message"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Coupon" ADD CONSTRAINT "Coupon_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "public"."Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Coupon" ADD CONSTRAINT "Coupon_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CommissionSetting" ADD CONSTRAINT "CommissionSetting_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnalyticsDaily" ADD CONSTRAINT "AnalyticsDaily_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "public"."Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnalyticsMonthly" ADD CONSTRAINT "AnalyticsMonthly_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "public"."Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InventoryLog" ADD CONSTRAINT "InventoryLog_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Visitor" ADD CONSTRAINT "Visitor_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "public"."Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FlashSaleProduct" ADD CONSTRAINT "FlashSaleProduct_flashSaleId_fkey" FOREIGN KEY ("flashSaleId") REFERENCES "public"."FlashSale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FlashSaleProduct" ADD CONSTRAINT "FlashSaleProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StoreFollower" ADD CONSTRAINT "StoreFollower_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "public"."Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StoreFollower" ADD CONSTRAINT "StoreFollower_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SearchHistory" ADD CONSTRAINT "SearchHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RecentlyViewed" ADD CONSTRAINT "RecentlyViewed_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RecentlyViewed" ADD CONSTRAINT "RecentlyViewed_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
