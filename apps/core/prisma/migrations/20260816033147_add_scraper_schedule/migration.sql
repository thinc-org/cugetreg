-- CreateEnum
CREATE TYPE "entry_type" AS ENUM ('FIXED', 'INTERVAL');

-- CreateTable
CREATE TABLE "schedule_preset" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "schedule_preset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schedule_entry" (
    "id" TEXT NOT NULL,
    "preset_id" TEXT NOT NULL,
    "type" "entry_type" NOT NULL,
    "days_of_week" INTEGER[],
    "time" TEXT,
    "interval_hours" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "schedule_entry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "schedule_entry_preset_id_idx" ON "schedule_entry"("preset_id");

-- AddForeignKey
ALTER TABLE "schedule_entry" ADD CONSTRAINT "schedule_entry_preset_id_fkey" FOREIGN KEY ("preset_id") REFERENCES "schedule_preset"("id") ON DELETE CASCADE ON UPDATE CASCADE;
