<script lang="ts">
  import { Button } from '@repo/ui/atom/button'
  import { Input } from '@repo/ui/atom/input'
  import { CourseCard } from '@repo/ui/molecule/course-card'

  import type { CourseSearchResult } from '../api/search/+server'

  let searchName = $state('')

  let searchResults = $state<CourseSearchResult[]>([])

  async function onSearch() {
    const result = (await fetch(
      `/api/search?courseName=${encodeURIComponent(searchName)}&studyProgram=S&academicYear=2567&semester=2&limit=10&offset=0`,
    ).then((r) => r.json())) as CourseSearchResult[]

    searchResults = result
  }
</script>

<main class="flex flex-col gap-4 py-8 sm:px-8 md:w-2/3 lg:w-1/2 mx-auto">
  <div class="flex items-baseline gap-2">
    <h1 class="text-h1 font-bold">วิชาเรียน</h1>

    <p class="text-surface-dim">({searchResults.length} ผลลัพธ์)</p>
  </div>

  <Input bind:value={searchName} placeholder="ค้นหารหัสวิชา / ชื่อวิชา" />

  <Button onclick={onSearch}>Manual Search Button</Button>

  <div class="grid grid-cols-1 sm:grid-cols-2 mx-auto gap-4">
    {#each searchResults as result, i}
      <CourseCard
        course={{
          code: result.courseNo,
          name: result.abbrName ?? '',
          credit: +(result.credit ?? 0),
          gened: result.genEdType === 'NO' ? [] : [result.genEdType],
          seat: +(result.regis ?? 0),
          maxseat: +(result.seat ?? 0),
          review: result.reviewCount,
          days: [],
        }}
        selected={i == 0}
        recommended={i < 3}
      />
    {/each}
  </div>
</main>
