/*
  Warnings:

  - Added the required column `name` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updateAt` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Room" ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "updateAt" TIMESTAMP(3) NOT NULL;
