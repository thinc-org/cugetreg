<script lang="ts">
  import { Navbar } from '@cugetreg/ui/organisms/navbar'
  import { Footer } from '@cugetreg/ui/organisms/footer'
  import {
    AlertTriangle,
    Bold,
    Check,
    ChevronUp,
    Code,
    Heading,
    Italic,
    NotebookPen,
    Quote,
    Send,
    Star,
    Strikethrough,
    Underline,
  } from '@lucide/svelte'
  import { GenedChip } from '@cugetreg/ui/atoms/gened-chip'
  import { Button } from '@cugetreg/ui/atoms/button'
  import { Comment } from '@cugetreg/ui/molecules/comment'
  import { SectionTable } from '@cugetreg/ui/molecules/section-table'
  import * as Select from '@cugetreg/ui/molecules/select'

  type RichTextBlock = {
    type: 'paragraph'
    text: string
  }

  type Review = {
    rating: number
    semester: string
    facultyMajor?: string
    content: string | RichTextBlock[]
    likesCount: number
    dislikesCount: number
  }

  type SectionRow = {
    section: string
    seats: string
    teacher: string
    // TODO: Backend sends a structured schedule, not a string. Align type once API is confirmed.
    schedule: string
    room: string
    type: string
  }

  type CourseInfo = {
    code: string
    titleTh: string
    titleEn: string
    descriptionTh: string
    descriptionEn: string
    faculty: string
    department: string
    format: string
    credits: string | number
    prerequisites: string
    grading: string
    midtermExam: string
    finalExam: string
    genedType?: string
    isDescriptionOutdated?: boolean
  }

  const TermsEnum = {
    FIRST: 'FIRST',
    SECOND: 'SECOND',
  } as const

  type TermsEnum = (typeof TermsEnum)[keyof typeof TermsEnum]

  const TermsTranslation = {
    [TermsEnum.FIRST]: 'ภาคต้น',
    [TermsEnum.SECOND]: 'ภาคปลาย',
  } as const satisfies Record<TermsEnum, string>

  type ReviewFilters = {
    years: string[]
    terms: TermsEnum[]
    selectedYear?: string
    selectedTerm?: TermsEnum
  }

  type ReviewPagination = {
    page: number
    totalPages: number
    pageItems: Array<number | 'ellipsis'>
    totalCount?: number
  }

  type ReviewFormOptions = {
    years: string[]
    terms: TermsEnum[]
  }

  let { data = {} } = $props<{
    data?: {
      course?: CourseInfo
      sections?: SectionRow[]
      sectionGroups?: string[]
      selectedSectionGroup?: string
      reviews?: Review[]
      reviewFilters?: ReviewFilters
      reviewPagination?: ReviewPagination
      reviewFormOptions?: ReviewFormOptions
    }
  }>()

  const course = data.course
  const sectionGroups = data.sectionGroups ?? []
  let selectedGroup = $state(data.selectedSectionGroup ?? sectionGroups[0] ?? '')
  let isSectionOpen = $state(true)

  const years = data.reviewFormOptions?.years ?? []
  const terms = data.reviewFormOptions?.terms ?? []
  let selectedYear = $state(years[0] ?? '')
  let selectedTerm = $state<TermsEnum | ''>(terms[0] ?? '')

  let reviewRating = $state(1)
  const getStarState = (value: number) => {
    if (reviewRating >= value) return 'full'
    if (reviewRating >= value - 0.5) return 'half'
    return 'empty'
  }
  const onStarClick = (value: number, event: MouseEvent) => {
    const target = event.currentTarget as HTMLButtonElement
    const rect = target.getBoundingClientRect()
    const isHalf = event.clientX - rect.left < rect.width / 2
    reviewRating = isHalf ? value - 0.5 : value
  }

  const reviewYearPlaceholder = 'ปีการศึกษา'
  const reviewTermPlaceholder = 'ภาคเรียน'
  let selectedReviewYear = $state(
    data.reviewFilters?.selectedYear ?? reviewYearPlaceholder,
  )
  let selectedReviewTerm = $state<TermsEnum | typeof reviewTermPlaceholder>(
    data.reviewFilters?.selectedTerm ?? reviewTermPlaceholder,
  )
  const isReviewYearPlaceholder = $derived(
    selectedReviewYear === reviewYearPlaceholder,
  )
  const isReviewTermPlaceholder = $derived(
    selectedReviewTerm === reviewTermPlaceholder,
  )
  let reviewsPage = $state(data.reviewPagination?.page ?? 1)
  const totalReviewPages = $derived(data.reviewPagination?.totalPages ?? 1)
  const reviewPageItems = $derived(data.reviewPagination?.pageItems ?? [1])
  const totalReviewCount = $derived(
    data.reviewPagination?.totalCount ?? data.reviews?.length ?? 0,
  )

  const reviewYearOptions = data.reviewFilters?.years ?? []
  const reviewTermOptions = data.reviewFilters?.terms ?? []
  const reviews = data.reviews ?? []
  const sectionTableData = data.sections ?? []
</script>

{#snippet CourseHeaderSection()}
  <section class="text-on-surface mx-auto w-full max-w-5xl">
    <div class="flex flex-wrap items-center gap-3">
      <h1 class="text-primary text-xl font-semibold">
        {course?.code ?? ''} {course?.titleEn ?? ''}
      </h1>
      {#if course?.genedType}
        <GenedChip type={course.genedType} class="px-3 py-1 text-xs" />
      {/if}
    </div>
    <p class="text-on-surface mt-2 text-sm font-semibold">
      {course?.titleTh ?? '-'}
    </p>
    <p class="text-on-surface text-sm font-semibold">
      {course?.titleEn ?? '-'}
    </p>
    {#if course?.isDescriptionOutdated}
      <div class="mt-5 flex items-start gap-2 bg-amber-50 px-3 py-2 text-xs">
        <AlertTriangle size={16} class="mt-0.5 text-amber-900" />
        <span class="font-sarabun text-neutral-900">
          ข้อมูลคำอธิบายรายวิชาที่แสดงไม่ได้เป็นข้อมูลล่าสุด
          อาจมีการเปลี่ยนแปลงได้ โปรดตรวจสอบกับรายวิชาที่จัดอีกครั้ง
        </span>
      </div>
    {/if}
  </section>
{/snippet}

{#snippet CourseInfoSection()}
  <section class="text-on-surface mx-auto mt-6 w-full max-w-5xl">
    <div class="grid gap-6 md:grid-cols-2 md:gap-0">
      <div class="md:col-span-2">
        <div class="bg-surface-container-lowest grid rounded-full md:grid-cols-2">
          <p class="text-primary px-4 py-1 text-left text-sm font-medium">
            คำอธิบายรายวิชา (ภาษาไทย)
          </p>
          <p class="text-primary px-4 py-1 text-left text-sm font-medium">
            คำอธิบายรายวิชา (ภาษาอังกฤษ)
          </p>
        </div>
      </div>
      <div>
        <p class="text-on-surface font-sarabun mt-3 px-4 text-sm">
          {course?.descriptionTh ?? '-'}
        </p>
      </div>
      <div>
        <p class="text-on-surface font-sarabun mt-3 px-4 text-sm">
          {course?.descriptionEn ?? '-'}
        </p>
      </div>
    </div>

    <div class="mt-6 grid gap-6 md:grid-cols-2 md:gap-0">
      <div class="md:col-span-2">
        <div class="bg-surface-container-lowest grid rounded-full md:grid-cols-2">
          <p class="text-primary px-4 py-1 text-left text-sm font-medium">
            คณะ
          </p>
          <p class="text-primary px-4 py-1 text-left text-sm font-medium">
            ภาควิชา/กลุ่มวิชา/สาขาวิชา
          </p>
        </div>
      </div>
      <div>
        <p class="text-on-surface font-sarabun mt-3 px-4 text-sm">
          {course?.faculty ?? '-'}
        </p>
      </div>
      <div>
        <p class="text-on-surface font-sarabun mt-3 px-4 text-sm">
          {course?.department ?? '-'}
        </p>
      </div>
    </div>

    <div class="mt-6 grid gap-6 md:grid-cols-2 md:gap-0">
      <div class="md:col-span-2">
        <div class="bg-surface-container-lowest grid rounded-full md:grid-cols-2">
          <p class="text-primary px-4 py-1 text-left text-sm font-medium">
            รูปแบบรายวิชา
          </p>
          <p class="text-primary px-4 py-1 text-left text-sm font-medium">
            หน่วยกิต
          </p>
        </div>
      </div>
      <div>
        <p class="text-on-surface font-sarabun mt-3 px-4 text-sm">
          {course?.format ?? '-'}
        </p>
      </div>
      <div>
        <p class="text-on-surface font-sarabun mt-3 px-4 text-sm">
          {course?.credits ?? '-'}
        </p>
      </div>
    </div>

    <div class="mt-6 grid gap-6 md:grid-cols-2 md:gap-0">
      <div class="md:col-span-2">
        <div class="bg-surface-container-lowest grid rounded-full md:grid-cols-2">
          <p class="text-primary px-4 py-1 text-left text-sm font-medium">
            เงื่อนไขรายวิชา
          </p>
          <p class="text-primary px-4 py-1 text-left text-sm font-medium">
            วิธีการวัดผล
          </p>
        </div>
      </div>
      <div>
        <p class="text-on-surface font-sarabun mt-3 px-4 text-sm">
          {course?.prerequisites ?? '-'}
        </p>
      </div>
      <div>
        <p class="text-on-surface font-sarabun mt-3 px-4 text-sm">
          {course?.grading ?? '-'}
        </p>
      </div>
    </div>

    <div class="mt-6 grid gap-6 md:grid-cols-2 md:gap-0">
      <div class="md:col-span-2">
        <div class="bg-surface-container-lowest grid rounded-full md:grid-cols-2">
          <p class="text-primary px-4 py-1 text-left text-sm font-medium">
            สอบกลางภาค
          </p>
          <p class="text-primary px-4 py-1 text-left text-sm font-medium">
            สอบปลายภาค
          </p>
        </div>
      </div>
      <div>
        <p class="text-on-surface font-sarabun mt-3 px-4 text-sm">
          {course?.midtermExam ?? '-'}
        </p>
      </div>
      <div>
        <p class="text-on-surface font-sarabun mt-3 px-4 text-sm">
          {course?.finalExam ?? '-'}
        </p>
      </div>
    </div>
  </section>
{/snippet}

{#snippet SectionDetailsSection()}
  <section class="text-on-surface mx-auto mt-8 w-full max-w-5xl">
    <h2 class="text-on-surface text-lg font-semibold">รายละเอียดเซคชัน</h2>
    <div class="mt-4">
      <Select.Root type="single" bind:value={selectedGroup}>
        <Select.Trigger
          class="text-on-surface h-14 w-full rounded-2xl border border-[#D6D7E1] bg-white px-5 text-base font-medium focus:ring-0 focus:ring-offset-0"
        >
          กลุ่ม : {selectedGroup}
        </Select.Trigger>
        <Select.Content role="listbox">
          <Select.Group>
            {#each sectionGroups as group}
              <Select.Item value={group} label={`กลุ่ม : ${group}`} />
            {/each}
          </Select.Group>
        </Select.Content>
      </Select.Root>
    </div>
    <div class="mt-4 rounded-2xl border border-[#D6D7E1] bg-white p-6">
      <button
        type="button"
        class="flex w-full items-center justify-between"
        onclick={() => (isSectionOpen = !isSectionOpen)}
        aria-expanded={isSectionOpen}
      >
        <div class="flex items-center gap-2 text-sm font-medium text-[#4A70C6]">
          <Check size={16} />
          <span>กลุ่ม : {selectedGroup}</span>
        </div>
        <ChevronUp
          size={18}
          strokeWidth={4}
          class={`-mr-2 text-neutral-400 transition-transform ${isSectionOpen ? '' : 'rotate-180'}`}
        />
      </button>
      {#if isSectionOpen}
        <div class="mt-4 overflow-x-auto">
          <SectionTable tableData={sectionTableData} boxed={false} class="w-full" />
        </div>
      {/if}
    </div>
    <div class="mt-4">
      <Select.Root type="single" bind:value={selectedGroup}>
        <Select.Trigger
          class="text-on-surface h-14 w-full rounded-2xl border border-[#D6D7E1] bg-white px-5 text-base font-medium focus:ring-0 focus:ring-offset-0"
        >
          กลุ่ม : {selectedGroup}
        </Select.Trigger>
        <Select.Content role="listbox">
          <Select.Group>
            {#each sectionGroups as group}
              <Select.Item value={group} label={`กลุ่ม : ${group}`} />
            {/each}
          </Select.Group>
        </Select.Content>
      </Select.Root>
    </div>
  </section>
{/snippet}

{#snippet ReviewFormSection()}
  <section class="text-on-surface mx-auto mt-10 w-full max-w-5xl">
    <div class="flex items-center justify-between">
      <h2 class="text-on-surface text-lg font-semibold">เขียนรีวิวรายวิชา</h2>
    </div>
    <div class="mt-4 flex flex-wrap items-center gap-5">
      <div class="min-w-[160px]">
        <Select.Root type="single" bind:value={selectedYear}>
          <Select.Trigger
            class="text-on-surface h-12 w-[180px] rounded-lg border border-[#D6D7E1] bg-white px-4 text-base font-medium"
          >
            {selectedYear}
          </Select.Trigger>
          <Select.Content role="listbox">
            <Select.Group>
              {#each years as year}
                <Select.Item value={year} label={year} />
              {/each}
            </Select.Group>
          </Select.Content>
        </Select.Root>
      </div>
      <div class="min-w-[160px]">
        <Select.Root type="single" bind:value={selectedTerm}>
          <Select.Trigger
            class="text-on-surface h-12 w-[180px] rounded-lg border border-[#D6D7E1] bg-white px-4 text-base font-medium"
          >
            {selectedTerm ? TermsTranslation[selectedTerm] : '-'}
          </Select.Trigger>
          <Select.Content role="listbox">
            <Select.Group>
              {#each terms as term}
                <Select.Item value={term} label={TermsTranslation[term]} />
              {/each}
            </Select.Group>
          </Select.Content>
        </Select.Root>
      </div>
      <div class="flex items-center gap-2">
        {#each [1, 2, 3, 4, 5] as value}
          <button
            class="flex h-10 w-10 items-center justify-center"
            type="button"
            onclick={(event) => onStarClick(value, event)}
            aria-label={`Rate ${value} stars`}
          >
            {#if getStarState(value) === 'half'}
              <span class="relative inline-flex">
                <Star size={26} class="text-[#D6D7E1]" />
                <span class="absolute inset-0 w-1/2 overflow-hidden">
                  <Star size={26} class="text-primary fill-current" />
                </span>
              </span>
            {:else}
              <Star
                size={26}
                class={getStarState(value) === 'full'
                  ? 'text-primary fill-current'
                  : 'text-[#D6D7E1]'}
              />
            {/if}
          </button>
        {/each}
      </div>
    </div>
    <div class="border-surface-container-high bg-surface mt-4 rounded-xl border">
      <div
        class="border-surface-container-high text-on-surface/60 flex items-center gap-6 border-b px-4 py-2"
      >
        <Bold size={18} />
        <Italic size={18} />
        <Underline size={18} />
        <Strikethrough size={18} />
        <Code size={18} />
        <div class="bg-surface-container-high h-6 w-px"></div>
        <Heading size={18} />
        <Quote size={18} fill="currentColor" strokeWidth={0} />
      </div>
      <textarea
        class="text-on-surface h-36 w-full resize-none bg-transparent px-4 py-3 text-sm outline-none"
        placeholder="คุณคิดว่าวิชานี้เป็นอย่างไรบ้าง?"
      ></textarea>
    </div>
    <div class="mt-4 flex justify-end">
      <Button
        size="sm"
        variant="solid"
        color="secondary"
        class="bg-primary-container text-primary hover:ring-primary-container gap-2"
      >
        ส่งรีวิว
        <Send size={14} />
      </Button>
    </div>
  </section>
{/snippet}

{#snippet ReviewsSection()}
  <section class="text-on-surface mx-auto mt-8 w-full max-w-5xl">
    <div class="flex items-center justify-between gap-4">
      <div class="text-lg font-semibold">
        <span class="text-on-surface/60">ทั้งหมด </span>
        <span class="text-primary">{totalReviewCount} รีวิว</span>
      </div>
      <div class="flex flex-nowrap items-center gap-3">
        <Select.Root type="single" bind:value={selectedReviewYear}>
          <Select.Trigger
            class={`h-9 w-[140px] rounded-xl px-4 text-sm ${
              isReviewYearPlaceholder ? 'text-on-surface/60' : 'text-on-surface'
            }`}
          >
            {selectedReviewYear}
          </Select.Trigger>
          <Select.Content role="listbox">
            <Select.Group>
              <Select.Item
                value={reviewYearPlaceholder}
                label={reviewYearPlaceholder}
              />
              {#each reviewYearOptions as year}
                <Select.Item value={year} label={year} />
              {/each}
            </Select.Group>
          </Select.Content>
        </Select.Root>
        <Select.Root type="single" bind:value={selectedReviewTerm}>
          <Select.Trigger
            class={`h-9 w-[120px] rounded-xl px-4 text-sm ${
              isReviewTermPlaceholder ? 'text-on-surface/60' : 'text-on-surface'
            }`}
          >
            {selectedReviewTerm === reviewTermPlaceholder
              ? reviewTermPlaceholder
              : TermsTranslation[selectedReviewTerm]}
          </Select.Trigger>
          <Select.Content role="listbox">
            <Select.Group>
              <Select.Item
                value={reviewTermPlaceholder}
                label={reviewTermPlaceholder}
              />
              {#each reviewTermOptions as term}
                <Select.Item value={term} label={TermsTranslation[term]} />
              {/each}
            </Select.Group>
          </Select.Content>
        </Select.Root>
      </div>
    </div>
    {#if reviews.length === 0}
      <div
        class="mt-12 flex flex-col items-center justify-center gap-4 py-12 text-center"
      >
        <NotebookPen size={140} strokeWidth={2.2} class="text-[#4A70C6]" />
        <div class="text-on-surface text-lg font-semibold">
          เริ่มแบ่งปันเป็นคนแรก
        </div>
        <p class="text-on-surface/70 max-w-lg text-sm">
          เริ่มเป็นคนแรกที่จะแบ่งปันประสบการณ์ที่น่าสนใจกับวิชานี้ให้กับเพื่อน ๆ
        </p>
      </div>
    {:else}
      <div class="mt-6 flex flex-col gap-6">
        {#each reviews as review, index (index)}
          <Comment
            rating={review.rating}
            semester={review.semester}
            facultyMajor={review.facultyMajor}
            content={review.content}
            likesCount={review.likesCount}
            dislikesCount={review.dislikesCount}
          />
        {/each}
      </div>
      <div class="mt-6 flex justify-end">
        <nav class="flex items-center gap-2" aria-label="Pagination">
          <button
            class="border-surface-container-high bg-surface text-on-surface flex h-9 w-9 items-center justify-center rounded-lg border"
            type="button"
            aria-label="Previous page"
            onclick={() => (reviewsPage = Math.max(1, reviewsPage - 1))}
          >
            ‹
          </button>
          {#each reviewPageItems as item, index (index)}
            {#if item === 'ellipsis'}
              <button
                class="border-surface-container-high bg-surface text-on-surface flex h-9 w-9 items-center justify-center rounded-lg border"
                type="button"
                aria-label="More pages"
                disabled
              >
                …
              </button>
            {:else}
              <button
                class={`flex h-9 w-9 items-center justify-center rounded-lg border ${
                  reviewsPage === item
                    ? 'border-primary text-primary'
                    : 'border-surface-container-high text-on-surface'
                }`}
                type="button"
                aria-current={reviewsPage === item ? 'page' : undefined}
                onclick={() => (reviewsPage = item)}
              >
                {item}
              </button>
            {/if}
          {/each}
          <button
            class="border-surface-container-high bg-surface text-on-surface flex h-9 w-9 items-center justify-center rounded-lg border"
            type="button"
            aria-label="Next page"
            onclick={() =>
              (reviewsPage = Math.min(totalReviewPages, reviewsPage + 1))}
          >
            ›
          </button>
        </nav>
      </div>
    {/if}
  </section>
{/snippet}

<div>
  <Navbar />
  <main class="px-6 py-6">
    {@render CourseHeaderSection()}
    {@render CourseInfoSection()}
    {@render SectionDetailsSection()}
    {@render ReviewFormSection()}
    {@render ReviewsSection()}
  </main>

  <Footer />
</div>
