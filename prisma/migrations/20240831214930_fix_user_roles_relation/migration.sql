/*
  Warnings:

  - You are about to drop the column `role` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `_UserRoles` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updated_at` to the `roles` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_UserRoles` DROP FOREIGN KEY `_UserRoles_A_fkey`;

-- DropForeignKey
ALTER TABLE `_UserRoles` DROP FOREIGN KEY `_UserRoles_B_fkey`;

-- AlterTable
ALTER TABLE `roles` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `role`;

-- DropTable
DROP TABLE `_UserRoles`;

-- CreateTable
CREATE TABLE `user_roles` (
    `userId` INTEGER UNSIGNED NOT NULL,
    `roleId` INTEGER UNSIGNED NOT NULL,

    PRIMARY KEY (`userId`, `roleId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_roles` ADD CONSTRAINT `user_roles_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_roles` ADD CONSTRAINT `user_roles_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE roles
MODIFY updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
