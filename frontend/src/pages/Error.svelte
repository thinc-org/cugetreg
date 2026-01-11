<script lang="ts">
  import { AlertTriangle } from "lucide-svelte";
  let { 
    title = "เกิดข้อผิดพลาดบางอย่าง!", 
    message = "ขออภัยในความไม่สะดวก ขณะนี้ระบบของเรากำลังดำเนินการปรับปรุงและบำรุงรักษา" 
  } = $props();
</script>

<div class="fixed inset-0 flex items-center justify-center bg-[#4A72B9] p-1 md:p-3 z-[100]">
  
  <div class="bg-white w-full h-full rounded-[2.5rem] md:rounded-[2rem] shadow-2xl flex flex-col items-center justify-center p-8 text-center relative">
    
    <div class="text-[#4A72B9] mb-12">
      <AlertTriangle size={120} strokeWidth={1.2} />
    </div>

    <h1 class="text-4xl md:text-5xl font-bold text-[#1C1B1F] mb-8 tracking-tight">
      {title}
    </h1>

    <div class="flex flex-col gap-2 text-[#4F4F4F] max-w-2xl leading-relaxed">
      <p class="text-base md:text-lg font-medium">
        {message}
      </p>
      <p class="text-base md:text-lg font-medium">
        ทีมงานของเรากำลังทำงานอย่างเต็มที่เพื่อให้เว็บไซต์กลับมาให้บริการตามปกติโดยเร็วที่สุด
      </p>
      <p class="text-base md:text-lg font-medium">
        กรุณาลองเข้าใช้งานใหม่อีกครั้งในอีกสักครู่ ขอบคุณที่เข้าใจค่ะ
      </p>
    </div>

  </div>
</div>