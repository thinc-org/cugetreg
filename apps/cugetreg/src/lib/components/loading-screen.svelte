<!-- Shown on initial app load, mobile only (md:hidden) -->
<script lang="ts"></script>

<!-- TODO: Remove hard-coded color -->
<div
  class="fixed inset-0 z-[100] flex items-center justify-center bg-[#4A72B9] p-3 md:hidden"
>
  <div
    class="bg-surface-bright flex h-full w-full flex-col items-center justify-center gap-8 rounded-[2.5rem] p-8 text-center shadow-2xl md:rounded-[2rem]"
  >
    <svg
      viewBox="0 0 24 24"
      class="spinner size-16 md:size-20"
      role="status"
      aria-label="กำลังโหลด"
    >
      {#each Array.from({ length: 12 }) as _, i (i)}
        <!-- TODO: Remove hard-coded color -->
        <rect
          x="11"
          y="2"
          width="2"
          height="6.5"
          rx="1"
          fill="#4A72B9"
          opacity={(i + 1) / 12}
          transform="rotate({i * 30} 12 12)"
        />
      {/each}
    </svg>

    <p class="text-on-surface text-xl font-medium md:text-2xl">กำลังโหลด...</p>
  </div>
</div>

<style>
  .spinner {
    animation: spinner-rotate 1s steps(12, end) infinite;
  }

  @keyframes spinner-rotate {
    to {
      transform: rotate(360deg);
    }
  }
</style>
