<script lang="ts">
  import { goto } from '$app/navigation';
  import { api } from '$lib/api';

  import { TriangleAlert } from '@lucide/svelte';
  import { Loader2 } from 'lucide-svelte';

  import { Footer } from '@cugetreg/ui/organisms/footer';
  interface Announcement {
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
  }

  let announcements = $state<Announcement[]>([]);
  let isLoading = $state(true);
  let isMobile = $state(false);

  $effect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    isMobile = mq.matches;

    const handler = (e: MediaQueryListEvent) => {
      isMobile = e.matches;
    };
    mq.addEventListener('change', handler);

    const fetchAnnouncements = async () => {
      try {
        const response = await api.get('/announcement');
        announcements = response.data.data;
      } catch (error) {
        console.error('Error fetching announcements:', error);
      } finally {
        isLoading = false;
      }
    };
    fetchAnnouncements();
    return () => {
      mq.removeEventListener('change', handler);
    };
  });

  function formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const formatted = date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    return formatted.replace(/([a-zA-Z]+)/, '$1.');
  }
</script>

<div class="flex flex-col items-center justify-center pt-10">
  <div class="w-[90vw] pb-16 md:w-[60vw]">
    <h1 class="mb-8 text-2xl font-bold text-[#1C1B1F]">การแจ้งเตือน</h1>
    {#if isLoading}
      <div
        class="flex h-40 flex-col items-center justify-center gap-3 text-gray-400"
      >
        <Loader2 class="animate-spin" size={32} />
        <span class="text-sm">กำลังโหลด...</span>
      </div>
    {:else if announcements.length === 0}
      <div
        class="flex h-40 items-center justify-center rounded-2xl border border-dashed border-gray-300 text-gray-500"
      >
        ไม่มีการแจ้งเตือนในขณะนี้
      </div>
    {:else}
      <div class="flex flex-col gap-4">
        {#each announcements as item (item.id)}
          <button
            class="flex flex-col items-start gap-1 rounded-2xl border-2 border-gray-200 bg-white px-10 py-8 transition-all hover:border-[#4A6CF7] focus:outline-none"
            onclick={() => goto(`/announcement/${item.id}`)}
          >
            <span class="font-regular text-xs text-gray-600">CU GetReg</span>
            <h2
              class="text-left text-[17px] font-bold text-[#4A70C6] md:text-lg"
            >
              {item.title}
            </h2>
            <span class="text-xs text-gray-600">
              {formatDate(item.createdAt)}
            </span>
          </button>
        {/each}
      </div>
    {/if}
  </div>
  <a
    class="sticky right-6 bottom-6 z-50 mt-8 mb-6 ml-auto flex w-max cursor-pointer items-center gap-1 rounded-full border-2 border-black bg-white px-2 py-1 md:gap-2 md:px-4"
    href="https://docs.google.com/forms/d/e/1FAIpQLScH2AZyifTnBVXiJBtyzM73MReGX2vpM1_I9IWQfABMduVgsg/viewform?usp=dialog"
    target="_blank"
    rel="noopener noreferrer"
  >
    <TriangleAlert size={isMobile ? 16 : 20} strokeWidth={1.5} color="black" />
    <span class="text-[10px] text-black md:text-xs">แจ้งปัญหาการใช้งาน</span>
  </a>
</div>
<Footer />
