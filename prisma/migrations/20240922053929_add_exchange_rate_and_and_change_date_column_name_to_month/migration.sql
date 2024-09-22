/*
  Warnings:

  - You are about to drop the column `date` on the `monthly_wages` table. All the data in the column will be lost.
  - Added the required column `exchange_rate` to the `monthly_wages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `monthly_wages` DROP COLUMN `date`,
    ADD COLUMN `exchange_rate` DOUBLE NOT NULL,
    ADD COLUMN `month` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
