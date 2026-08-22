<script lang="ts">
  import { page } from '$app/state';
  import { api } from '$lib/api';

  import { ChevronLeft, Loader2 } from 'lucide-svelte';
  import SvelteMarkdown from 'svelte-markdown';

  interface AnnouncementDetail {
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    content: string;
  }

  let announcement = $state<AnnouncementDetail | null>(null);
  let isLoading = $state(true);
  let errorMessage = $state('');

  let announcementId = $derived(page.params.announcementID);

  $effect(() => {
    if (!announcementId) return;
    const fetchDetail = async () => {
      isLoading = true;
      try {
        const response = await api.get(`/announcement/${announcementId}`);
        announcement = response.data.data;
      } catch (error) {
        console.error('Error fetching announcement detail:', error);
      } finally {
        isLoading = false;
      }
    };
    fetchDetail();
  });
</script>

<div class="mx-auto w-full max-w-[800px] p-6 md:p-10">
  <div class="flex items-start">
    <button
      type="button"
      class="hover:bg-surface-container-low active:bg-surface-container mb-4 flex items-center justify-center gap-1 rounded-lg p-1 transition-colors lg:mb-6"
      onclick={() => history.back()}
    >
      <ChevronLeft size={18} strokeWidth={2.5} />
      <span class="text-on-surface translate-y-[-1px] text-sm font-normal">
        กลับ
      </span>
    </button>
  </div>

  {#if isLoading}
    <div
      class="text-on-surface-var flex h-64 flex-col items-center justify-center gap-3"
    >
      <Loader2 class="animate-spin" size={32} />
      <span class="text-sm">กำลังโหลดเนื้อหา...</span>
    </div>
  {:else if errorMessage || !announcement}
    <div
      class="flex h-64 items-center justify-center rounded-2xl border border-dashed border-red-200 bg-red-50 text-red-500"
    >
      {errorMessage}
    </div>
  {:else}
    <article class="flex flex-col gap-8">
      <h1 class="text-on-surface text-2xl leading-tight font-bold md:text-3xl">
        {announcement.title}
      </h1>

      <div class="prose text-on-surface max-w-none">
        <SvelteMarkdown source={announcement.content} />
      </div>
    </article>
  {/if}
</div>
