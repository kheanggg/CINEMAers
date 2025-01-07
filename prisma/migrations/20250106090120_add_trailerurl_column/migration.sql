/*
  Warnings:

  - Added the required column `trailerurl` to the `Movie` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Movie" ADD COLUMN     "trailerurl" TEXT NOT NULL,
ALTER COLUMN "rating" SET DATA TYPE TEXT;
