<script lang="ts">
  import { ChevronLeft, ChevronRight, Dot } from 'lucide-svelte';
  import { prefersReducedMotion } from 'svelte/motion';
  import { fly } from 'svelte/transition';

  interface OnboardingProps {
    onCancel?: () => void;
  }

  let progress = $state(0);
  let direction = $state(1);

  const texts: { head: string; subtitle: string; video: string }[] = [
    {
      head: 'รวมวิชาของจุฬาฯ ไว้ที่นี้!',
      subtitle:
        'CU Get Reg ศูนย์รวมรายวิชาและรายละเอียดรายวิชาในรั้วจุฬาลงกรณ์มหาวิทยาลัย',
      video: '/videos/Tutorial1.mp4',
    },
    {
      head: 'ค้นหาวิชาที่ต้องการ',
      subtitle:
        'CU Get Reg ศูนย์รวมรายวิชาและรายละเอียดรายวิชาในรั้วจุฬาลงกรณ์มหาวิทยาลัย',
      video: '/videos/Tutorial2.mp4',
    },
    {
      head: 'รวมวิชาของจุฬาฯ ไว้ที่นี้!',
      subtitle:
        'CU Get Reg ศูนย์รวมรายวิชาและรายละเอียดรายวิชาในรั้วจุฬาลงกรณ์มหาวิทยาลัย',
      video: '/videos/Tutorial3.mp4',
    },
    {
      head: 'รวมวิชาของจุฬาฯ ไว้ที่นี้!',
      subtitle:
        'CU Get Reg ศูนย์รวมรายวิชาและรายละเอียดรายวิชาในรั้วจุฬาลงกรณ์มหาวิทยาลัย',
      video: '/videos/Tutorial4.mp4',
    },
    {
      head: 'รวมวิชาของจุฬาฯ ไว้ที่นี้!',
      subtitle:
        'CU Get Reg ศูนย์รวมรายวิชาและรายละเอียดรายวิชาในรั้วจุฬาลงกรณ์มหาวิทยาลัย',
      video: '/videos/Tutorial5.mp4',
    },
  ];

  const nextVideo = $derived(texts[progress + 1]?.video);
</script>

{#if nextVideo}
  <video hidden src={nextVideo} preload="auto" muted playsinline>
    <track kind="captions" />
  </video>
{/if}

<div
  class="bg-surface flex max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-[1000px] flex-col overflow-y-auto rounded-2xl"
>
  <div class="shrink-0 p-3 sm:p-4">
    <div class="relative aspect-[1542/720] overflow-hidden">
      {#key progress}
        <video
          class="absolute inset-0 h-full w-full object-contain"
          src={texts[progress].video}
          autoplay
          loop
          muted
          playsinline
          in:fly={{
            x: `${direction * 100}%`,
            duration: prefersReducedMotion.current ? 0 : 300,
            opacity: 1,
          }}
          out:fly={{
            x: `${-direction * 100}%`,
            duration: prefersReducedMotion.current ? 0 : 300,
            opacity: 1,
          }}
        >
          <track kind="captions" />
        </video>
      {/key}
    </div>
  </div>
  <div class="shrink-0 p-3 text-center break-words sm:p-4">
    <div class="text-xl font-bold sm:text-2xl">{texts[progress].head}</div>
    <div class="text-sm leading-relaxed sm:text-base">
      {texts[progress].subtitle}
    </div>
    <div class="flex items-center justify-between gap-2 pt-3 sm:p-4">
      <button
        class="focus-visible:outline-primary flex size-11 shrink-0 items-center justify-center rounded-lg hover:cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-default disabled:opacity-40"
        aria-label="Previous video"
        disabled={progress === 0}
        onclick={() => {
          direction = -1;
          progress--;
        }}
      >
        <ChevronLeft />
      </button>
      <div class="flex min-w-0 justify-center">
        {#each texts as item, index (item.video)}
          <button
            class="hover:cursor-pointer"
            onclick={() => {
              direction = progress - index > 0 ? 1 : -1;
              progress = index;
            }}
          >
            {#if index === progress}
              <Dot class="stroke-primary" size={32} />
            {:else}
              <Dot size={32} />
            {/if}
          </button>
        {/each}
      </div>

      {#if progress === texts.length - 1}
        <button
          class="focus-visible:outline-primary flex size-11 items-center justify-center rounded-lg hover:cursor-pointer focus-visible:outline-offset-2"
          aria-label="Exit onboarding"
          onclick={() => {
            direction = 1;
            progress++;
          }}
        >
          ไปเลย
        </button>
      {:else}
        <button
          class="focus-visible:outline-primary flex size-11 shrink-0 items-center justify-center rounded-lg hover:cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-default disabled:opacity-40"
          aria-label="Next video"
          disabled={progress === texts.length - 1}
          onclick={() => {
            direction = 1;
            progress++;
          }}
        >
          <ChevronRight />
        </button>
      {/if}
    </div>
  </div>
</div>
