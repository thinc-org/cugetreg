/*
  Warnings:

  - The values [SPECIAL,THAI,INTERNATIONAL] on the enum `study_program` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
-- 1. ตัด Dependency โดยการเปลี่ยนคอลัมน์ที่ใช้งาน Enum อยู่ให้เป็น TEXT
ALTER TABLE "course" ALTER COLUMN "study_program" TYPE TEXT;
ALTER TABLE "cart" ALTER COLUMN "study_program" TYPE TEXT; 
ALTER TABLE "review" ALTER COLUMN "study_program" TYPE TEXT; 

-- 2. แปลงข้อมูลเก่าจากตัวเต็ม (SPECIAL, THAI, INTERNATIONAL) ให้เป็นตัวย่อ (S, T, I)
UPDATE "course" SET "study_program" = CASE 
    WHEN "study_program" = 'SPECIAL' THEN 'S'
    WHEN "study_program" = 'THAI' THEN 'T'
    WHEN "study_program" = 'INTERNATIONAL' THEN 'I'
    ELSE "study_program" 
END;

UPDATE "cart" SET "study_program" = CASE 
    WHEN "study_program" = 'SPECIAL' THEN 'S'
    WHEN "study_program" = 'THAI' THEN 'T'
    WHEN "study_program" = 'INTERNATIONAL' THEN 'I'
    ELSE "study_program" 
END;

UPDATE "review" SET "study_program" = CASE 
    WHEN "study_program" = 'SPECIAL' THEN 'S'
    WHEN "study_program" = 'THAI' THEN 'T'
    WHEN "study_program" = 'INTERNATIONAL' THEN 'I'
    ELSE "study_program" 
END;

-- 3. ลบ Enum เดิมทิ้ง (ชื่อตาม @@map ใน Prisma หรือชื่อ Type ใน DB)
-- จาก Error ของคุณ ระบบแจ้งว่าชื่อ "semester" แต่ตาม Schema ควรจะเป็น "study_program"
-- ให้ตรวจสอบชื่อที่แท้จริงใน DB อีกครั้ง (ในที่นี้ขอใช้ "study_program" ตาม @@map)
DROP TYPE "study_program";

-- 4. สร้าง Enum ใหม่ที่มีค่าตัวย่อ S, T, I
CREATE TYPE "study_program" AS ENUM ('S', 'T', 'I'); 

-- 5. เปลี่ยนคอลัมน์กลับมาเป็น Enum และ Cast ข้อมูล (Using) ให้ถูกต้อง
ALTER TABLE "course" ALTER COLUMN "study_program" TYPE "study_program" 
USING "study_program"::"study_program"; 

ALTER TABLE "cart" ALTER COLUMN "study_program" TYPE "study_program" 
USING "study_program"::"study_program"; 

ALTER TABLE "review" ALTER COLUMN "study_program" TYPE "study_program" 
USING "study_program"::"study_program"; 

-- 6. ตั้งค่า Default กลับมา (หากใน Schema มีการกำหนด @default ไว้)
ALTER TABLE "cart" ALTER COLUMN "study_program" SET DEFAULT 'S'; 