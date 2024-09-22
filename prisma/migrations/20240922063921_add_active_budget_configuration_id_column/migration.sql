-- AlterTable
ALTER TABLE `budgets_configuration` ADD COLUMN `is_public` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `active_budget_configuration_id` INTEGER UNSIGNED NULL;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_active_budget_configuration_id_fkey` FOREIGN KEY (`active_budget_configuration_id`) REFERENCES `budgets_configuration`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
