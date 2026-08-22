<script lang="ts">
  import { goto } from '$app/navigation';
  import { resolve } from '$app/paths';
  import { api } from '$lib/api';
  import { GOOGLE_FORM_URL } from '$lib/constants';

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
    <h1 class="text-on-surface mb-8 text-2xl font-bold">การแจ้งเตือน</h1>
    {#if isLoading}
      <div
        class="text-on-surface-var flex h-40 flex-col items-center justify-center gap-3"
      >
        <Loader2 class="animate-spin" size={32} />
        <span class="text-sm">กำลังโหลด...</span>
      </div>
    {:else if announcements.length === 0}
      <div
        class="border-surface-container-high text-on-surface-var flex h-40 items-center justify-center rounded-2xl border border-dashed"
      >
        ไม่มีการแจ้งเตือนในขณะนี้
      </div>
    {:else}
      <div class="flex flex-col gap-4">
        {#each announcements as item (item.id)}
          <button
            class="border-surface-container bg-surface-bright flex flex-col items-start gap-1 rounded-2xl border-2 px-10 py-8 transition-all hover:border-[#4A6CF7] focus:outline-none"
            onclick={() => goto(resolve(`/announcement/${item.id}`))}
          >
            <span class="font-regular text-on-surface-var text-xs"
              >CU GetReg</span
            >
            <h2 class="text-primary text-left text-[17px] font-bold md:text-lg">
              {item.title}
            </h2>
            <span class="text-on-surface-var text-xs">
              {formatDate(item.createdAt)}
            </span>
          </button>
        {/each}
      </div>
    {/if}
  </div>
  <a
    class="border-on-surface bg-surface-bright sticky right-6 bottom-6 z-50 mt-8 mb-6 ml-auto flex w-max cursor-pointer items-center gap-1 rounded-full border-2 px-2 py-1 md:gap-2 md:px-4"
    href={GOOGLE_FORM_URL}
    target="_blank"
    rel="external noopener noreferrer"
  >
    <TriangleAlert
      class="text-on-surface"
      size={isMobile ? 16 : 20}
      strokeWidth={1.5}
    />
    <span class="text-on-surface text-[10px] md:text-xs"
      >แจ้งปัญหาการใช้งาน</span
    >
  </a>
</div>
<Footer />
