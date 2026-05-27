<script lang="ts">
  import { faculties } from '$lib/constants';

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
  } from '@lucide/svelte';
  import { untrack } from 'svelte';

  import { Button } from '@cugetreg/ui/atoms/button';
  import { GenedChip } from '@cugetreg/ui/atoms/gened-chip';
  import { Comment } from '@cugetreg/ui/molecules/comment';
  import {
    type ClassInfo,
    SectionTable,
    type SectionTableData,
  } from '@cugetreg/ui/molecules/section-table';
  import * as Select from '@cugetreg/ui/molecules/select';
  import { Footer } from '@cugetreg/ui/organisms/footer';
  import type { GenEdType } from '@cugetreg/utils/types';

  import type { PageProps } from './$types';

  let isSectionOpen = $state(true);
  const years = ['2566', '2565', '2564'];
  const terms = ['ภาคต้น', 'ภาคปลาย'];
  let selectedYear = $state(years[0]);
  let selectedTerm = $state(terms[0]);
  let reviewRating = $state(1);
  const getStarState = (value: number) => {
    if (reviewRating >= value) return 'full';
    if (reviewRating >= value - 0.5) return 'half';
    return 'empty';
  };
  const onStarClick = (value: number, event: MouseEvent) => {
    const target = event.currentTarget as HTMLButtonElement;
    const rect = target.getBoundingClientRect();
    const isHalf = event.clientX - rect.left < rect.width / 2;
    reviewRating = isHalf ? value - 0.5 : value;
  };
  const reviewYearPlaceholder = 'ปีการศึกษา';
  const reviewTermPlaceholder = 'ภาคเรียน';
  let selectedReviewYear = $state(reviewYearPlaceholder);
  let selectedReviewTerm = $state(reviewTermPlaceholder);
  const reviewsPerPage = 2;
  let reviewsPage = $state(1);
  const isReviewYearPlaceholder = $derived(
    selectedReviewYear === reviewYearPlaceholder,
  );
  const isReviewTermPlaceholder = $derived(
    selectedReviewTerm === reviewTermPlaceholder,
  );
  const _reviewSamples = [
    {
      rating: 4,
      semester: 'ภาคต้น 2566',
      facultyMajor: 'คณะวิศวกรรมศาสตร์ ภาคเครื่องใน',
      content:
        'ส่วนตัวคิดว่าง่ายมาก มีงานสัปดาห์ละครั้ง ปกติจะมีวิดีโอให้ดู ไม่ยาวมาก แต่จะไม่ดูไม่ได้ เพราะปกติโฮมอ่านตัวอย่างที่ให้มาแล้วก็ลองเขียนเลย งานส่วนใหญ่จะให้ Topic กว้างๆมา ถ้าอาจารย์ประจำ sec ไม่ strict มาก ก็เขียนตามใจไปเลย แต่อาจารย์ที่สอนในสัปดาห์นั้นมาปรับบ้างหน่อย ปกติจะมีเวลาไม่มาก ก็เขียนครั้งเดียวแล้วส่งไปเลย เลยเสียเวลาแค่ 1-2 ชม. ต่อสัปดาห์ แต่ถ้าใครจะส่งชิงงานเขียนหน่อยก็อาจใช้เวลาเพิ่มขึ้น สอบเหมือนกับงานที่ทำ จะไม่อ่านไปสอบก็ได้ถ้าจำพวกงานที่ทำส่งได้ แต่ก่อนสอบมีคลิปรีวิวให้ดูก่อน ฟังตัวนี้เอาก็ได้ อันนี้ขึ้นอยู่กับ sec ของเราว่าอาจารย์ให้คะแนนค่อนข้างง่าย แต่ถ้าให้คะแนนมากหน่อย เฉลี่ยก็รวมๆกันได้ A เพราะจะเขียนตามใจตัวเองเป็นหลัก ไม่ค่อยยึดกับเรื่องที่เรียนมาเลยรู้สึกไม่ค่อยได้อะไรใหม่ ที่ช่วยนำจะเป็นการจัดระเบียบความคิดและสรุปให้อยู่ในย่อหน้า',
      likesCount: 2,
      dislikesCount: 0,
    },
    {
      rating: 3.5,
      semester: 'ภาคปลาย 2566',
      facultyMajor: 'คณะวิศวกรรมศาสตร์ ภาคเครื่องใน',
      content:
        'ส่วนตัวคิดว่าง่ายมาก มีงานสัปดาห์ละครั้ง ปกติจะมีวิดีโอให้ดู ไม่ยาวมาก แต่จะไม่ดูไม่ได้ เพราะปกติโฮมอ่านตัวอย่างที่ให้มาแล้วก็ลองเขียนเลย งานส่วนใหญ่จะให้ Topic กว้างๆมา ถ้าอาจารย์ประจำ sec ไม่ strict มาก ก็เขียนตามใจไปเลย แต่อาจารย์ที่สอนในสัปดาห์นั้นมาปรับบ้างหน่อย ปกติจะมีเวลาไม่มาก ก็เขียนครั้งเดียวแล้วส่งไปเลย เลยเสียเวลาแค่ 1-2 ชม. ต่อสัปดาห์ แต่ถ้าใครจะส่งชิงงานเขียนหน่อยก็อาจใช้เวลาเพิ่มขึ้น สอบเหมือนกับงานที่ทำ จะไม่อ่านไปสอบก็ได้ถ้าจำพวกงานที่ทำส่งได้ แต่ก่อนสอบมีคลิปรีวิวให้ดูก่อน ฟังตัวนี้เอาก็ได้ อันนี้ขึ้นอยู่กับ sec ของเราว่าอาจารย์ให้คะแนนค่อนข้างง่าย แต่ถ้าให้คะแนนมากหน่อย เฉลี่ยก็รวมๆกันได้ A เพราะจะเขียนตามใจตัวเองเป็นหลัก ไม่ค่อยยึดกับเรื่องที่เรียนมาเลยรู้สึกไม่ค่อยได้อะไรใหม่ ที่ช่วยนำจะเป็นการจัดระเบียบความคิดและสรุปให้อยู่ในย่อหน้า',
      likesCount: 1,
      dislikesCount: 0,
    },
    {
      rating: 4,
      semester: 'ภาคต้น 2565',
      facultyMajor: 'คณะวิศวกรรมศาสตร์ ภาคเครื่องใน',
      content:
        'ส่วนตัวคิดว่าง่ายมาก มีงานสัปดาห์ละครั้ง ปกติจะมีวิดีโอให้ดู ไม่ยาวมาก แต่จะไม่ดูไม่ได้ เพราะปกติโฮมอ่านตัวอย่างที่ให้มาแล้วก็ลองเขียนเลย งานส่วนใหญ่จะให้ Topic กว้างๆมา ถ้าอาจารย์ประจำ sec ไม่ strict มาก ก็เขียนตามใจไปเลย แต่อาจารย์ที่สอนในสัปดาห์นั้นมาปรับบ้างหน่อย ปกติจะมีเวลาไม่มาก ก็เขียนครั้งเดียวแล้วส่งไปเลย เลยเสียเวลาแค่ 1-2 ชม. ต่อสัปดาห์ แต่ถ้าใครจะส่งชิงงานเขียนหน่อยก็อาจใช้เวลาเพิ่มขึ้น สอบเหมือนกับงานที่ทำ จะไม่อ่านไปสอบก็ได้ถ้าจำพวกงานที่ทำส่งได้ แต่ก่อนสอบมีคลิปรีวิวให้ดูก่อน ฟังตัวนี้เอาก็ได้ อันนี้ขึ้นอยู่กับ sec ของเราว่าอาจารย์ให้คะแนนค่อนข้างง่าย แต่ถ้าให้คะแนนมากหน่อย เฉลี่ยก็รวมๆกันได้ A เพราะจะเขียนตามใจตัวเองเป็นหลัก ไม่ค่อยยึดกับเรื่องที่เรียนมาเลยรู้สึกไม่ค่อยได้อะไรใหม่ ที่ช่วยนำจะเป็นการจัดระเบียบความคิดและสรุปให้อยู่ในย่อหน้า',
      likesCount: 2,
      dislikesCount: 1,
    },
    {
      rating: 4.5,
      semester: 'ภาคปลาย 2565',
      facultyMajor: 'คณะวิศวกรรมศาสตร์ ภาคเครื่องใน',
      content:
        'ส่วนตัวคิดว่าง่ายมาก มีงานสัปดาห์ละครั้ง ปกติจะมีวิดีโอให้ดู ไม่ยาวมาก แต่จะไม่ดูไม่ได้ เพราะปกติโฮมอ่านตัวอย่างที่ให้มาแล้วก็ลองเขียนเลย งานส่วนใหญ่จะให้ Topic กว้างๆมา ถ้าอาจารย์ประจำ sec ไม่ strict มาก ก็เขียนตามใจไปเลย แต่อาจารย์ที่สอนในสัปดาห์นั้นมาปรับบ้างหน่อย ปกติจะมีเวลาไม่มาก ก็เขียนครั้งเดียวแล้วส่งไปเลย เลยเสียเวลาแค่ 1-2 ชม. ต่อสัปดาห์ แต่ถ้าใครจะส่งชิงงานเขียนหน่อยก็อาจใช้เวลาเพิ่มขึ้น สอบเหมือนกับงานที่ทำ จะไม่อ่านไปสอบก็ได้ถ้าจำพวกงานที่ทำส่งได้ แต่ก่อนสอบมีคลิปรีวิวให้ดูก่อน ฟังตัวนี้เอาก็ได้ อันนี้ขึ้นอยู่กับ sec ของเราว่าอาจารย์ให้คะแนนค่อนข้างง่าย แต่ถ้าให้คะแนนมากหน่อย เฉลี่ยก็รวมๆกันได้ A เพราะจะเขียนตามใจตัวเองเป็นหลัก ไม่ค่อยยึดกับเรื่องที่เรียนมาเลยรู้สึกไม่ค่อยได้อะไรใหม่ ที่ช่วยนำจะเป็นการจัดระเบียบความคิดและสรุปให้อยู่ในย่อหน้า',
      likesCount: 3,
      dislikesCount: 0,
    },
  ];

  // const reviews = Array.from({ length: 12 }, (_, i) => {
  //   const sample = reviewSamples[i % reviewSamples.length]
  //   return { ...sample }
  // })

  const reviews = [];
  const filteredReviews = $derived.by(() =>
    reviews.filter((review) => {
      const [term, year] = review.semester.split(' ');
      if (!isReviewYearPlaceholder && year !== selectedReviewYear) return false;
      if (!isReviewTermPlaceholder && term !== selectedReviewTerm) return false;
      return true;
    }),
  );

  const totalReviewPages = $derived(
    Math.max(1, Math.ceil(filteredReviews.length / reviewsPerPage)),
  );

  const pagedReviews = $derived(
    filteredReviews.slice(
      (reviewsPage - 1) * reviewsPerPage,
      reviewsPage * reviewsPerPage,
    ),
  );

  const reviewPageItems = $derived.by(() => {
    const last = totalReviewPages;
    const current = reviewsPage;
    const items: Array<number | 'ellipsis'> = [];
    if (last <= 1) return [1];
    items.push(1);
    if (current > 3) items.push('ellipsis');
    const start = Math.max(2, current - 1);
    const end = Math.min(last - 1, current + 1);
    for (let i = start; i <= end; i += 1) items.push(i);
    if (current < last - 2) items.push('ellipsis');
    if (last > 1) items.push(last);
    return items;
  });

  const reviewMeta = reviews
    .map((review) => {
      const [term, year] = review.semester.split(' ');
      return { term, year };
    })
    .filter((item) => item.term && item.year);

  const reviewYearOptions = [
    reviewYearPlaceholder,
    ...Array.from(new Set(reviewMeta.map((item) => item.year)))
      .sort()
      .reverse(),
  ];

  const reviewTermOptions = $derived.by(() => {
    const terms = reviews
      .map((review) => {
        const [term, year] = review.semester.split(' ');
        return { term, year };
      })
      .filter((item) =>
        isReviewYearPlaceholder ? true : item.year === selectedReviewYear,
      )
      .map((item) => item.term);
    return [reviewTermPlaceholder, ...Array.from(new Set(terms))];
  });

  $effect(() => {
    if (!reviewYearOptions.includes(selectedReviewYear)) {
      selectedReviewYear = reviewYearPlaceholder;
    }
    if (!reviewTermOptions.includes(selectedReviewTerm)) {
      selectedReviewTerm = reviewTermPlaceholder;
    }
    if (reviewsPage > totalReviewPages) {
      reviewsPage = totalReviewPages;
    }
    if (reviewsPage < 1) {
      reviewsPage = 1;
    }
  });

  const { data }: PageProps = $props();
  const course = $derived(data.course);

  const isLoggedIn = false;

  const sectionGroups = $derived.by(() => {
    return course.sections.reduce(
      (accum: Record<string, SectionTableData[]>, section) => {
        const group = section.note ?? 'General';
        if (!accum[group]) accum[group] = [];
        accum[group].push({
          section: String(section.sectionNo),
          seats: section.closed ? 'ปิด' : `${section.regis} / ${section.max}`,
          classes: section.classes.map(
            (classInfo) =>
              ({
                teacher: classInfo.professors.join(','),
                schedule: `${classInfo.dayOfWeek} ${classInfo.periodStart} - ${classInfo.periodEnd}`,
                room: `${classInfo.building ?? 'AR'} ${classInfo.room ?? 'AR'}`,
                type: classInfo.type,
              }) as ClassInfo,
          ),
        });

        return accum;
      },
      {},
    );
  });

  let selectedGroup = $state(untrack(() => Object.keys(sectionGroups)[0]));
</script>

<div>
  <main class="px-6 py-6">
    <section class="text-on-surface mx-auto w-full max-w-5xl">
      <div class="flex flex-wrap items-center gap-3">
        <h1 class="text-primary text-xl font-semibold">
          {course.courseNo}
          {course.courseInfo.abbrName}
        </h1>
        {#if ['SC', 'SO', 'HU', 'IN'].includes(course.genEdType)}
          <GenedChip
            type={course.genEdType as GenEdType}
            class="px-3 py-1 text-xs"
          />
        {/if}
      </div>
      <p class="text-on-surface mt-2 text-sm font-semibold">
        {course.courseInfo.courseNameTh}
      </p>
      <p class="text-on-surface text-sm font-semibold">
        {course.courseInfo.courseNameEn}
      </p>
      <div class="mt-5 flex items-start gap-2 bg-amber-50 px-3 py-2 text-xs">
        <AlertTriangle size={16} class="mt-0.5 text-amber-900" />
        <span class="font-sarabun text-neutral-900">
          ข้อมูลคำอธิบายรายวิชาที่แสดงไม่ได้เป็นข้อมูลล่าสุด
          อาจมีการเปลี่ยนแปลงได้ โปรดตรวจสอบกับรายวิชาที่จัดอีกครั้ง
        </span>
      </div>
    </section>
    <section class="text-on-surface mx-auto mt-6 w-full max-w-5xl">
      <div class="grid gap-6 md:grid-cols-2 md:gap-0">
        <div class="md:col-span-2">
          <div
            class="bg-surface-container-lowest grid rounded-full md:grid-cols-2"
          >
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
            {course.courseInfo.courseDescTh}
          </p>
        </div>
        <div>
          <p class="text-on-surface font-sarabun mt-3 px-4 text-sm">
            {course.courseInfo.courseDescEn}
          </p>
        </div>
      </div>

      <div class="mt-6 grid gap-6 md:grid-cols-2 md:gap-0">
        <div class="md:col-span-2">
          <div
            class="bg-surface-container-lowest grid rounded-full md:grid-cols-2"
          >
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
            {faculties[course.courseInfo.faculty].th}
          </p>
        </div>
        <div>
          <p class="text-on-surface font-sarabun mt-3 px-4 text-sm">
            {course.courseInfo.department}
          </p>
        </div>
      </div>

      <div class="mt-6 grid gap-6 md:grid-cols-2 md:gap-0">
        <div class="md:col-span-2">
          <div
            class="bg-surface-container-lowest grid rounded-full md:grid-cols-2"
          >
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
            {course.courseInfo.creditHours.split(' ')[0]}
          </p>
        </div>
        <div>
          <p class="text-on-surface font-sarabun mt-3 px-4 text-sm">
            {course.courseInfo.credit}
          </p>
        </div>
      </div>

      <div class="mt-6 grid gap-6 md:grid-cols-2 md:gap-0">
        <div class="md:col-span-2">
          <div
            class="bg-surface-container-lowest grid rounded-full md:grid-cols-2"
          >
            <p class="text-primary px-4 py-1 text-left text-sm font-medium">
              เงื่อนไขรายวิชา
            </p>
            <p class="text-primary px-4 py-1 text-left text-sm font-medium">
              วิธีการวัดผล
            </p>
          </div>
        </div>
        <div>
          <p class="text-on-surface font-sarabun mt-3 px-4 text-sm">-</p>
        </div>
        <div>
          <p class="text-on-surface font-sarabun mt-3 px-4 text-sm">
            Letter Grade
          </p>
        </div>
      </div>

      <div class="mt-6 grid gap-6 md:grid-cols-2 md:gap-0">
        <div class="md:col-span-2">
          <div
            class="bg-surface-container-lowest grid rounded-full md:grid-cols-2"
          >
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
            06 มี.ค. 2567 16:00 - 19:00
          </p>
        </div>
        <div>
          <p class="text-on-surface font-sarabun mt-3 px-4 text-sm">
            01 พ.ค. 2567 16:00 - 19:00
          </p>
        </div>
      </div>
    </section>
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
              {#each Object.keys(sectionGroups) as groupName (groupName)}
                <Select.Item value={groupName} label={`กลุ่ม : ${groupName}`} />
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
          <div
            class="flex items-center gap-2 text-sm font-medium text-[#4A70C6]"
          >
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
            <SectionTable
              tableData={sectionGroups[selectedGroup]}
              boxed={false}
              class="w-full"
            />
          </div>
        {/if}
      </div>
      <!-- <div class="mt-4"> -->
      <!--   <Select.Root type="single" bind:value={selectedGroup}> -->
      <!--     <Select.Trigger -->
      <!--       class="text-on-surface h-14 w-full rounded-2xl border border-[#D6D7E1] bg-white px-5 text-base font-medium focus:ring-0 focus:ring-offset-0" -->
      <!--     > -->
      <!--       กลุ่ม : {selectedGroup} -->
      <!--     </Select.Trigger> -->
      <!--     <Select.Content role="listbox"> -->
      <!--       <Select.Group> -->
      <!--         {#each sectionGroups as group} -->
      <!--           <Select.Item value={group} label={`กลุ่ม : ${group}`} /> -->
      <!--         {/each} -->
      <!--       </Select.Group> -->
      <!--     </Select.Content> -->
      <!--   </Select.Root> -->
      <!-- </div> -->
    </section>

    {#if isLoggedIn}
      <section class="text-on-surface mx-auto mt-10 w-full max-w-5xl">
        <div class="flex items-center justify-between">
          <h2 class="text-on-surface text-lg font-semibold">
            เขียนรีวิวรายวิชา
          </h2>
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
                  {#each years as year (year)}
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
                {selectedTerm}
              </Select.Trigger>
              <Select.Content role="listbox">
                <Select.Group>
                  {#each terms as term (term)}
                    <Select.Item value={term} label={term} />
                  {/each}
                </Select.Group>
              </Select.Content>
            </Select.Root>
          </div>
          <div class="flex items-center gap-2">
            {#each [1, 2, 3, 4, 5] as value (value)}
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
        <div
          class="border-surface-container-high bg-surface mt-4 rounded-xl border"
        >
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
    {/if}

    <section class="text-on-surface mx-auto mt-8 w-full max-w-5xl">
      <div class="flex items-center justify-between gap-4">
        <div class="text-lg font-semibold">
          <span class="text-on-surface/60">ทั้งหมด </span>
          <span class="text-primary">{filteredReviews.length} รีวิว</span>
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
                {#each reviewYearOptions as year (year)}
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
                {#each reviewTermOptions as term (term)}
                  <Select.Item value={term} label={term} />
                {/each}
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </div>
      </div>
      {#if filteredReviews.length === 0}
        <div
          class="mt-12 flex flex-col items-center justify-center gap-4 py-12 text-center"
        >
          <NotebookPen size={140} strokeWidth={2.2} class="text-[#4A70C6]" />
          <div class="text-on-surface text-lg font-semibold">
            เริ่มแบ่งปันเป็นคนแรก
          </div>
          <p class="text-on-surface/70 max-w-lg text-sm">
            เริ่มเป็นคนแรกที่จะแบ่งปันประสบการณ์ที่น่าสนใจกับวิชานี้ให้กับเพื่อน
            ๆ
          </p>
        </div>
      {:else}
        <div class="mt-6 flex flex-col gap-6">
          {#each pagedReviews as review, index (index)}
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
  </main>

  <Footer />
</div>
