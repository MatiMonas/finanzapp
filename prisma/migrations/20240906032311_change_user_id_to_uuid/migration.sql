/*
  Warnings:

  - You are about to alter the column `user_id` on the `budgets` table. The data in that column could be lost. The data in that column will be cast from `UnsignedInt` to `Char(36)`.
  - You are about to alter the column `name` on the `budgets` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(30)`.
  - You are about to alter the column `user_id` on the `credit_cards` table. The data in that column could be lost. The data in that column will be cast from `UnsignedInt` to `Char(36)`.
  - You are about to alter the column `user_id` on the `debts` table. The data in that column could be lost. The data in that column will be cast from `UnsignedInt` to `Char(36)`.
  - You are about to alter the column `user_id` on the `expenses` table. The data in that column could be lost. The data in that column will be cast from `UnsignedInt` to `Char(36)`.
  - You are about to alter the column `user_id` on the `investments` table. The data in that column could be lost. The data in that column will be cast from `UnsignedInt` to `Char(36)`.
  - You are about to alter the column `user_id` on the `monthly_wages` table. The data in that column could be lost. The data in that column will be cast from `UnsignedInt` to `Char(36)`.
  - The primary key for the `user_roles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `roleId` on the `user_roles` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `user_roles` table. All the data in the column will be lost.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `users` table. The data in that column could be lost. The data in that column will be cast from `UnsignedInt` to `Char(36)`.
  - Added the required column `role_id` to the `user_roles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `user_roles` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `budgets` DROP FOREIGN KEY `budgets_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `credit_cards` DROP FOREIGN KEY `credit_cards_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `debts` DROP FOREIGN KEY `debts_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `expenses` DROP FOREIGN KEY `expenses_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `investments` DROP FOREIGN KEY `investments_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `monthly_wages` DROP FOREIGN KEY `monthly_wages_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `user_roles` DROP FOREIGN KEY `user_roles_roleId_fkey`;

-- DropForeignKey
ALTER TABLE `user_roles` DROP FOREIGN KEY `user_roles_userId_fkey`;

-- AlterTable
ALTER TABLE `budgets` MODIFY `user_id` CHAR(36) NOT NULL,
    MODIFY `name` VARCHAR(30) NOT NULL;

-- AlterTable
ALTER TABLE `credit_cards` MODIFY `user_id` CHAR(36) NOT NULL;

-- AlterTable
ALTER TABLE `debts` MODIFY `user_id` CHAR(36) NOT NULL;

-- AlterTable
ALTER TABLE `expenses` MODIFY `user_id` CHAR(36) NOT NULL;

-- AlterTable
ALTER TABLE `investments` MODIFY `user_id` CHAR(36) NOT NULL;

-- AlterTable
ALTER TABLE `monthly_wages` MODIFY `user_id` CHAR(36) NOT NULL;

-- AlterTable
ALTER TABLE `user_roles` DROP PRIMARY KEY,
    DROP COLUMN `roleId`,
    DROP COLUMN `userId`,
    ADD COLUMN `role_id` INTEGER UNSIGNED NOT NULL,
    ADD COLUMN `user_id` CHAR(36) NOT NULL,
    ADD PRIMARY KEY (`user_id`, `role_id`);

-- AlterTable
ALTER TABLE `users` DROP PRIMARY KEY,
    MODIFY `id` CHAR(36) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `user_roles` ADD CONSTRAINT `user_roles_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_roles` ADD CONSTRAINT `user_roles_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `monthly_wages` ADD CONSTRAINT `monthly_wages_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `budgets` ADD CONSTRAINT `budgets_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `expenses` ADD CONSTRAINT `expenses_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `investments` ADD CONSTRAINT `investments_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `debts` ADD CONSTRAINT `debts_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `credit_cards` ADD CONSTRAINT `credit_cards_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
