<script lang="ts">
  import { AlertTriangle } from 'lucide-svelte';

  import { defineMessages, useTranslations } from '@cugetreg/ui/i18n';

  const t = useTranslations(
    defineMessages({
      th: {
        title: 'เกิดข้อผิดพลาดบางอย่าง!',
        message:
          'ขออภัยในความไม่สะดวก ขณะนี้ระบบของเรากำลังดำเนินการปรับปรุงและบำรุงรักษา',
        working:
          'ทีมงานของเรากำลังทำงานอย่างเต็มที่เพื่อให้เว็บไซต์กลับมาให้บริการตามปกติโดยเร็วที่สุด',
        tryAgain:
          'กรุณาลองเข้าใช้งานใหม่อีกครั้งในอีกสักครู่ ขอบคุณที่เข้าใจค่ะ',
      },
      en: {
        title: 'Something went wrong!',
        message:
          'Sorry for the inconvenience. Our system is currently undergoing maintenance.',
        working:
          'Our team is working hard to get the website back up and running as soon as possible.',
        tryAgain:
          'Please try again in a moment. Thank you for your understanding.',
      },
    }),
  );
</script>

<div
  class="fixed inset-0 z-[100] flex items-center justify-center bg-[#4A72B9] p-3 md:p-4"
>
  <div
    class="relative flex h-full w-full flex-col items-center justify-center rounded-[2.5rem] bg-white p-8 text-center shadow-2xl md:rounded-[2rem]"
  >
    <div class="mb-12 text-[#4A72B9]">
      <AlertTriangle size={120} strokeWidth={1.2} />
    </div>

    <h1
      class="mb-8 text-4xl font-bold tracking-tight text-[#1C1B1F] md:text-5xl"
    >
      {t('title')}
    </h1>

    <div class="flex max-w-2xl flex-col gap-2 leading-relaxed text-[#4F4F4F]">
      <p class="text-base font-medium md:text-lg">
        {t('message')}
      </p>
      <p class="text-base font-medium md:text-lg">
        {t('working')}
      </p>
      <p class="text-base font-medium md:text-lg">
        {t('tryAgain')}
      </p>
    </div>
  </div>
</div>
