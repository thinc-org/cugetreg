<script lang="ts">
  import { Navbar } from '@cugetreg/ui/organisms/navbar'
  import {
    AlertTriangle,
    Bold,
    Check,
    ChevronUp,
    Code,
    Italic,
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

  const sectionGroups = ['4EE ONLY', 'OPEN']
  let selectedGroup = $state(sectionGroups[0])
  const years = ['2566', '2565', '2564']
  const terms = ['ภาคต้น', 'ภาคปลาย']
  let selectedYear = $state(years[0])
  let selectedTerm = $state(terms[0])
  let reviewRating = $state(1)
  const reviewYears = ['ปีการศึกษา', '2566', '2565']
  const reviewTerms = ['ภาคเรียน', 'ภาคต้น', 'ภาคปลาย']
  let selectedReviewYear = $state(reviewYears[0])
  let selectedReviewTerm = $state(reviewTerms[0])
  const isReviewYearPlaceholder = $derived(
    selectedReviewYear === reviewYears[0],
  )
  const isReviewTermPlaceholder = $derived(
    selectedReviewTerm === reviewTerms[0],
  )
  const reviews = [
    {
      rating: 4,
      semester: 'ภาคต้น 2565',
      content:
        'คณะวิศวกรรมศาสตร์ ภาคเครื่องใน\nส่วนตัวคิดว่าง่ายมาก มีงานสัปดาห์ละครั้ง ปกติจะมีวิดีโอให้ดู ไม่ยาวมาก แต่จะไม่ดูไม่ได้ เพราะปกติโฮมอ่านตัวอย่างที่ให้มาแล้วก็ลองเขียนเลย งานส่วนใหญ่จะให้ Topic กว้างๆมา ถ้าอาจารย์ประจำ sec ไม่ strict มาก ก็เขียนตามใจไปเลย แต่อาจารย์ที่สอนในสัปดาห์นั้นมาปรับบ้างหน่อย ปกติจะมีเวลาไม่มาก ก็เขียนครั้งเดียวแล้วส่งไปเลย เลยเสียเวลาแค่ 1-2 ชม. ต่อสัปดาห์ แต่ถ้าใครจะส่งชิงงานเขียนหน่อยก็อาจใช้เวลาเพิ่มขึ้น สอบเหมือนกับงานที่ทำ จะไม่อ่านไปสอบก็ได้ถ้าจำพวกงานที่ทำส่งได้ แต่ก่อนสอบมีคลิปรีวิวให้ดูก่อน ฟังตัวนี้เอาก็ได้ อันนี้ขึ้นอยู่กับ sec ของเราว่าอาจารย์ให้คะแนนค่อนข้างง่าย แต่ถ้าให้คะแนนมากหน่อย เฉลี่ยก็รวมๆกันได้ A เพราะจะเขียนตามใจตัวเองเป็นหลัก ไม่ค่อยยึดกับเรื่องที่เรียนมาเลยรู้สึกไม่ค่อยได้อะไรใหม่ ที่ช่วยนำจะเป็นการจัดระเบียบความคิดและสรุปให้อยู่ในย่อหน้า',
      likesCount: 2,
      dislikesCount: 0,
    },
    {
      rating: 4,
      semester: 'ภาคต้น 2565',
      content:
        'คณะวิศวกรรมศาสตร์ ภาคเครื่องใน\nส่วนตัวคิดว่าง่ายมาก มีงานสัปดาห์ละครั้ง ปกติจะมีวิดีโอให้ดู ไม่ยาวมาก แต่จะไม่ดูไม่ได้ เพราะปกติโฮมอ่านตัวอย่างที่ให้มาแล้วก็ลองเขียนเลย งานส่วนใหญ่จะให้ Topic กว้างๆมา ถ้าอาจารย์ประจำ sec ไม่ strict มาก ก็เขียนตามใจไปเลย แต่อาจารย์ที่สอนในสัปดาห์นั้นมาปรับบ้างหน่อย ปกติจะมีเวลาไม่มาก ก็เขียนครั้งเดียวแล้วส่งไปเลย เลยเสียเวลาแค่ 1-2 ชม. ต่อสัปดาห์ แต่ถ้าใครจะส่งชิงงานเขียนหน่อยก็อาจใช้เวลาเพิ่มขึ้น สอบเหมือนกับงานที่ทำ จะไม่อ่านไปสอบก็ได้ถ้าจำพวกงานที่ทำส่งได้ แต่ก่อนสอบมีคลิปรีวิวให้ดูก่อน ฟังตัวนี้เอาก็ได้ อันนี้ขึ้นอยู่กับ sec ของเราว่าอาจารย์ให้คะแนนค่อนข้างง่าย แต่ถ้าให้คะแนนมากหน่อย เฉลี่ยก็รวมๆกันได้ A เพราะจะเขียนตามใจตัวเองเป็นหลัก ไม่ค่อยยึดกับเรื่องที่เรียนมาเลยรู้สึกไม่ค่อยได้อะไรใหม่ ที่ช่วยนำจะเป็นการจัดระเบียบความคิดและสรุปให้อยู่ในย่อหน้า',
      likesCount: 2,
      dislikesCount: 0,
    },
  ]
  const sectionTableData = [
    {
      section: '1',
      seats: '28 / 28',
      teacher: 'SSS',
      schedule: 'THU 16:00 - 17:00',
      room: 'MAHIT 202',
      type: 'LECT',
    },
    {
      section: '2',
      seats: '20 / 28',
      teacher: 'SSS',
      schedule: 'THU 16:00 - 17:00',
      room: 'MAHIT 202',
      type: 'LECT',
    },
    {
      section: '3',
      seats: 'ปิด',
      teacher: 'SSS',
      schedule: 'THU 16:00 - 17:00',
      room: 'MAHIT 202',
      type: 'LECT',
    },
  ]
</script>

<div>
  <Navbar />
  <main class="px-6 py-6">
    <section class="text-on-surface mx-auto w-full max-w-5xl">
      <div class="flex flex-wrap items-center gap-3">
        <h1 class="text-primary text-xl font-semibold">
          0123104 CON PDG PEACE CONFWV
        </h1>
        <GenedChip type="HU" class="px-3 py-1 text-xs" />
      </div>
      <p class="text-on-surface mt-2 text-sm font-medium">
        การลดความขัดแย้ง การเปลี่ยนความขัดแย้งและกระบวนการสันติภาพ
      </p>
      <p class="text-on-surface text-sm">
        CONFLICT RESOLUTION,CONFLICT TRANSFORMATION,AND PEACE PROCESS
      </p>
      <div
        class="mt-5 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900"
      >
        <AlertTriangle size={16} class="mt-0.5" />
        <span>
          ข้อมูลคำอธิบายรายวิชาที่แสดงไม่ได้เป็นข้อมูลล่าสุด
          อาจมีการเปลี่ยนแปลงได้ โปรดตรวจสอบกับรายวิชาที่จัดอีกครั้ง
        </span>
      </div>
    </section>
    <section class="text-on-surface mx-auto mt-6 w-full max-w-5xl">
      <div class="grid gap-6 md:grid-cols-2">
        <div>
          <p
            class="bg-surface-container-lowest text-primary w-full rounded-full px-4 py-1 text-left text-sm font-medium"
          >
            คำอธิบายรายวิชา (ภาษาไทย)
          </p>
          <p class="text-on-surface mt-3 px-4 text-sm">
            หลักการอ่าน ระดับของการอ่าน การจับใจความ การตีความบทอ่านประเภทต่างๆ
            ทั้งบทอ่านทั่วไป บทอ่านเชิงวิชาการ ตาราง แผนภูมิ หรือรูปภาพ
          </p>
        </div>
        <div>
          <p
            class="bg-surface-container-lowest text-primary w-full rounded-full px-4 py-1 text-left text-sm font-medium"
          >
            คำอธิบายรายวิชา (ภาษาอังกฤษ)
          </p>
          <p class="text-on-surface mt-3 px-4 text-sm">
            Reading principles; levels of reading; main idea finding;
            interpretation of general texts, academic texts, tables, figures and
            illustrations
          </p>
        </div>
      </div>

      <div class="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <p
            class="bg-surface-container-lowest text-primary w-full rounded-full px-4 py-1 text-left text-sm font-medium"
          >
            คณะ
          </p>
          <p class="text-on-surface mt-3 px-4 text-sm">สถาบันภาษาไทยสิรินธร</p>
        </div>
        <div>
          <p
            class="bg-surface-container-lowest text-primary w-full rounded-full px-4 py-1 text-left text-sm font-medium"
          >
            ภาควิชา/กลุ่มวิชา/สาขาวิชา
          </p>
          <p class="text-on-surface mt-3 px-4 text-sm">สถาบันภาษาไทยสิรินธร</p>
        </div>
      </div>

      <div class="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <p
            class="bg-surface-container-lowest text-primary w-full rounded-full px-4 py-1 text-left text-sm font-medium"
          >
            รูปแบบรายวิชา
          </p>
          <p class="text-on-surface mt-3 px-4 text-sm">LECT/PRAC</p>
        </div>
        <div>
          <p
            class="bg-surface-container-lowest text-primary w-full rounded-full px-4 py-1 text-left text-sm font-medium"
          >
            หน่วยกิต
          </p>
          <p class="text-on-surface mt-3 px-4 text-sm">3</p>
        </div>
      </div>

      <div class="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <p
            class="bg-surface-container-lowest text-primary w-full rounded-full px-4 py-1 text-left text-sm font-medium"
          >
            เงื่อนไขรายวิชา
          </p>
          <p class="text-on-surface mt-3 px-4 text-sm">-</p>
        </div>
        <div>
          <p
            class="bg-surface-container-lowest text-primary w-full rounded-full px-4 py-1 text-left text-sm font-medium"
          >
            วิธีการวัดผล
          </p>
          <p class="text-on-surface mt-3 px-4 text-sm">Letter Grade</p>
        </div>
      </div>

      <div class="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <p
            class="bg-surface-container-lowest text-primary w-full rounded-full px-4 py-1 text-left text-sm font-medium"
          >
            สอบกลางภาค
          </p>
          <p class="text-on-surface mt-3 px-4 text-sm">
            06 มี.ค. 2567 16:00 - 19:00
          </p>
        </div>
        <div>
          <p
            class="bg-surface-container-lowest text-primary w-full rounded-full px-4 py-1 text-left text-sm font-medium"
          >
            สอบปลายภาค
          </p>
          <p class="text-on-surface mt-3 px-4 text-sm">
            01 พ.ค. 2567 16:00 - 19:00
          </p>
        </div>
      </div>
    </section>
    <section class="text-on-surface mx-auto mt-8 w-full max-w-5xl">
      <h2 class="text-on-surface text-lg font-semibold">รายละเอียดเซคชัน</h2>
      <div class="mt-4">
        <Select.Root type="single" bind:value={selectedGroup}>
          <Select.Trigger class="h-14 rounded-xl px-4">
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
      <div
        class="border-surface-container-high bg-surface mt-4 rounded-2xl border p-4"
      >
        <div class="flex items-center justify-between">
          <div class="text-primary flex items-center gap-2 text-sm font-medium">
            <Check size={16} />
            <span>กลุ่ม : {selectedGroup}</span>
          </div>
          <ChevronUp size={18} class="text-on-surface/60" />
        </div>
        <div class="mt-4 overflow-x-auto">
          <SectionTable
            tableData={sectionTableData}
            boxed={false}
            class="w-full"
          />
        </div>
      </div>
    </section>
    <section class="text-on-surface mx-auto mt-10 w-full max-w-5xl">
      <div class="flex items-center justify-between">
        <h2 class="text-on-surface text-lg font-semibold">เขียนรีวิวรายวิชา</h2>
      </div>
      <div class="mt-4 flex flex-wrap items-center gap-4">
        <div class="min-w-[140px] flex-1">
          <Select.Root type="single" bind:value={selectedYear}>
            <Select.Trigger class="h-10 rounded-xl px-4">
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
        <div class="min-w-[140px] flex-1">
          <Select.Root type="single" bind:value={selectedTerm}>
            <Select.Trigger class="h-10 rounded-xl px-4">
              {selectedTerm}
            </Select.Trigger>
            <Select.Content role="listbox">
              <Select.Group>
                {#each terms as term}
                  <Select.Item value={term} label={term} />
                {/each}
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </div>
        <div class="text-primary flex items-center gap-1">
          {#each [1, 2, 3, 4, 5] as value}
            <button
              class="flex h-8 w-8 items-center justify-center"
              type="button"
              onclick={() => (reviewRating = value)}
              aria-label={`Rate ${value} stars`}
            >
              <Star
                size={18}
                class={reviewRating >= value
                  ? 'fill-current'
                  : 'text-on-surface-placeholder'}
              />
            </button>
          {/each}
        </div>
      </div>
      <div
        class="border-surface-container-high bg-surface mt-4 rounded-xl border"
      >
        <div
          class="border-surface-container-high text-on-surface/60 flex items-center gap-3 border-b px-4 py-2"
        >
          <Bold size={16} />
          <Italic size={16} />
          <Underline size={16} />
          <Strikethrough size={16} />
          <Code size={16} />
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
    <section class="text-on-surface mx-auto mt-8 w-full max-w-5xl">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="text-lg font-semibold">
          <span class="text-on-surface/60">ทั้งหมด </span>
          <span class="text-primary">12 รีวิว</span>
        </div>
        <div class="flex flex-nowrap items-center gap-3">
          <Select.Root type="single" bind:value={selectedReviewYear}>
            <Select.Trigger
              class={`h-9 w-[140px] rounded-xl px-4 text-sm ${
                isReviewYearPlaceholder
                  ? 'text-on-surface/60'
                  : 'text-on-surface'
              }`}
            >
              {selectedReviewYear}
            </Select.Trigger>
            <Select.Content role="listbox">
              <Select.Group>
                {#each reviewYears as year}
                  <Select.Item value={year} label={year} />
                {/each}
              </Select.Group>
            </Select.Content>
          </Select.Root>
          <Select.Root type="single" bind:value={selectedReviewTerm}>
            <Select.Trigger
              class={`h-9 w-[120px] rounded-xl px-4 text-sm ${
                isReviewTermPlaceholder
                  ? 'text-on-surface/60'
                  : 'text-on-surface'
              }`}
            >
              {selectedReviewTerm}
            </Select.Trigger>
            <Select.Content role="listbox">
              <Select.Group>
                {#each reviewTerms as term}
                  <Select.Item value={term} label={term} />
                {/each}
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </div>
      </div>
      <div class="mt-6 flex flex-col gap-6">
        {#each reviews as review, index (index)}
          <Comment
            rating={review.rating}
            semester={review.semester}
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
          >
            ‹
          </button>
          <button
            class="border-primary text-primary flex h-9 w-9 items-center justify-center rounded-lg border"
            type="button"
            aria-current="page"
          >
            1
          </button>
          <button
            class="border-surface-container-high bg-surface text-on-surface flex h-9 w-9 items-center justify-center rounded-lg border"
            type="button"
          >
            2
          </button>
          <button
            class="border-surface-container-high bg-surface text-on-surface flex h-9 w-9 items-center justify-center rounded-lg border"
            type="button"
            aria-label="More pages"
          >
            …
          </button>
          <button
            class="border-surface-container-high bg-surface text-on-surface flex h-9 w-9 items-center justify-center rounded-lg border"
            type="button"
          >
            5
          </button>
          <button
            class="border-surface-container-high bg-surface text-on-surface flex h-9 w-9 items-center justify-center rounded-lg border"
            type="button"
            aria-label="Next page"
          >
            ›
          </button>
        </nav>
      </div>
    </section>
  </main>
</div>
