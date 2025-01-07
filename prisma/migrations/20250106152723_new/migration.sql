/*
  Warnings:

  - You are about to alter the column `title` on the `Movie` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `genre` on the `Movie` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `rating` on the `Movie` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(25)`.
  - You are about to alter the column `posterurl` on the `Movie` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `trailerurl` on the `Movie` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.

*/
-- AlterTable
ALTER TABLE "Movie" ALTER COLUMN "title" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "release_date" DROP NOT NULL,
ALTER COLUMN "release_date" SET DATA TYPE DATE,
ALTER COLUMN "genre" DROP NOT NULL,
ALTER COLUMN "genre" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "rating" DROP NOT NULL,
ALTER COLUMN "rating" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "posterurl" DROP NOT NULL,
ALTER COLUMN "posterurl" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "trailerurl" DROP NOT NULL,
ALTER COLUMN "trailerurl" SET DATA TYPE VARCHAR(255);
