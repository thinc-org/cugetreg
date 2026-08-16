<script lang="ts">
  import type { PageData } from './$types';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const status = $derived(data.scraperStatus);
</script>

<div class="mx-auto max-w-3xl p-6">
  <h1 class="mb-2 text-2xl font-bold">Scraper Status</h1>
  <p class="mb-6 text-sm text-gray-600">
    Python scraper writes to PostgreSQL (same DB as <code>apps/core</code>) and
    <code>apps/core/bin/courses.json</code>. Courses appear on the home page
    once scraping completes.
  </p>

  <dl class="grid gap-3 rounded-lg border border-gray-200 p-4">
    <div class="flex justify-between gap-4">
      <dt class="font-medium">Status</dt>
      <dd>{status.status}</dd>
    </div>
    <div class="flex justify-between gap-4">
      <dt class="font-medium">Courses total</dt>
      <dd>{status.courses_total ?? '-'}</dd>
    </div>
    <div class="flex justify-between gap-4">
      <dt class="font-medium">Courses scraped</dt>
      <dd>
        {status.courses_scraped ?? 0}
        {#if status.courses_total}
          / {status.courses_total}
        {/if}
      </dd>
    </div>
    <div class="flex justify-between gap-4">
      <dt class="font-medium">Courses failed</dt>
      <dd>{status.courses_failed ?? 0}</dd>
    </div>
    <div class="flex justify-between gap-4">
      <dt class="font-medium">Started</dt>
      <dd>{status.started_at ?? '-'}</dd>
    </div>
    <div class="flex justify-between gap-4">
      <dt class="font-medium">Finished</dt>
      <dd>{status.finished_at ?? '-'}</dd>
    </div>
    <div class="flex flex-col gap-1">
      <dt class="font-medium">Message</dt>
      <dd class="text-sm text-gray-600">{status.message ?? '-'}</dd>
    </div>
  </dl>

  <div class="mt-6 space-y-2 text-sm">
    <p>
      Run scraper:
      <code>pnpm scraper:run</code>
    </p>
    <p>
      <a class="underline" href="/">Back to course search</a>
    </p>
  </div>
</div>
