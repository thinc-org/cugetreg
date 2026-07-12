-- CreateTable
CREATE TABLE "activity" (
    "id" TEXT NOT NULL,
    "cart_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "day_of_week" "day_of_week" NOT NULL,
    "period_start" TEXT NOT NULL,
    "period_end" TEXT NOT NULL,
    "color" TEXT,
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    "cart_order" TEXT NOT NULL DEFAULT '0|hzzzzz:',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "announcement" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "announcement_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "activity" ADD CONSTRAINT "activity_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "cart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
