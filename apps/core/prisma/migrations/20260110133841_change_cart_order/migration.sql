-- AlterTable
ALTER TABLE "cart" ALTER COLUMN "cart_order" SET DEFAULT '0|hzzzzz:',
ALTER COLUMN "cart_order" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "cart_item" ALTER COLUMN "cart_order" SET DEFAULT '0|hzzzzz:',
ALTER COLUMN "cart_order" SET DATA TYPE TEXT;
