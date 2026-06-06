<script lang="ts">
  import type { PageData } from './$types'

  interface Props {
    data: PageData
  }

  let { data }: Props = $props()

  const status = data.scraperStatus
</script>

<h1 class="text-h1">Scraper Status</h1>

<p class="mb-4 text-muted-foreground">
  Python Playwright scraper writes to PostgreSQL and
  <code>packages/database/data/courses.json</code>. This page reads live status
  from the backend API.
</p>

<dl class="grid max-w-xl gap-2 rounded-lg border p-4">
  <div class="flex justify-between gap-4">
    <dt class="font-medium">Status</dt>
    <dd>{status.status}</dd>
  </div>
  <div class="flex justify-between gap-4">
    <dt class="font-medium">Courses scraped</dt>
    <dd>{status.courses_scraped ?? 0}</dd>
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
    <dd class="text-sm text-muted-foreground">{status.message ?? '-'}</dd>
  </div>
</dl>

<p class="mt-6">
  Course API: <a class="underline" href="/api/courses?limit=5">/api/courses</a>
</p>
