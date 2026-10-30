<script lang="ts">
  import { AlertTriangle } from 'lucide-svelte';
  const title = 'เกิดข้อผิดพลาดบางอย่าง!';
  const message =
    'ขออภัยในความไม่สะดวก ขณะนี้ระบบของเรากำลังดำเนินการปรับปรุงและบำรุงรักษา';
</script>

<!-- TODO: Remove hard-coded color -->
<div
  class="fixed inset-0 z-[100] flex items-center justify-center bg-[#4A72B9] p-3 md:p-4"
>
  <div
    class="bg-surface-bright relative flex h-full w-full flex-col items-center justify-center rounded-[2.5rem] p-8 text-center shadow-2xl md:rounded-[2rem]"
  >
    <!-- TODO: Remove hard-coded color -->
    <div class="mb-12 text-[#4A72B9]">
      <AlertTriangle size={120} strokeWidth={1.2} />
    </div>

    <h1
      class="text-on-surface mb-8 text-4xl font-bold tracking-tight md:text-5xl"
    >
      {title}
    </h1>

    <div
      class="text-on-surface-var flex max-w-2xl flex-col gap-2 leading-relaxed"
    >
      <p class="text-base font-medium md:text-lg">
        {message}
      </p>
      <p class="text-base font-medium md:text-lg">
        ทีมงานของเรากำลังทำงานอย่างเต็มที่เพื่อให้เว็บไซต์กลับมาให้บริการตามปกติโดยเร็วที่สุด
      </p>
      <p class="text-base font-medium md:text-lg">
        กรุณาลองเข้าใช้งานใหม่อีกครั้งในอีกสักครู่ ขอบคุณที่เข้าใจค่ะ
      </p>
    </div>
  </div>
</div>
