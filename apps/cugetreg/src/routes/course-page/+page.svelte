<script lang="ts">
  import SelectedCourse from '$lib/components/selected-course.svelte';
  import { getSemesterLabel } from '$lib/semesterOptions';
  import { getCartSelectionController } from '$lib/stores/cart-selection.svelte';
  import { getUserCartStore } from '$lib/stores/user-cart';

  import {
    AlertTriangle,
    Bold,
    Book,
    BookMarked,
    Check,
    ChevronUp,
    Code,
    Heading,
    Italic,
    Menu,
    MessageCircleQuestionIcon,
    NotebookPen,
    Pencil,
    Quote,
    Send,
    Star,
    StickyNote,
    Strikethrough,
    Underline,
    X,
  } from '@lucide/svelte';
  import { fade } from 'svelte/transition';

  import { Button } from '@cugetreg/ui/atoms/button';
  import { GenedChip } from '@cugetreg/ui/atoms/gened-chip';
  import { StudyProgramChip } from '@cugetreg/ui/atoms/studyprogram-chip';
  import { YearSemesterChip } from '@cugetreg/ui/atoms/yearsemester-chip';
  import {
    defineMessages,
    useLocale,
    useTranslations,
  } from '@cugetreg/ui/i18n';
  import { Comment } from '@cugetreg/ui/molecules/comment';
  import { FloatingButton } from '@cugetreg/ui/molecules/floating-button';
  import { SectionTable } from '@cugetreg/ui/molecules/section-table';
  import * as Select from '@cugetreg/ui/molecules/select';
  import { SelectTimetable } from '@cugetreg/ui/molecules/select-timetable';
  import { Footer } from '@cugetreg/ui/organisms/footer';
  import * as Sidebar from '@cugetreg/ui/organisms/sidebar';
  import type { Semester } from '@cugetreg/zod-schemas';
  // TODO: To be removed

  const locale = useLocale();
  const t = useTranslations(
    defineMessages({
      th: {
        menu: 'เมนู',
        courseDescription: 'คำอธิบายรายวิชา',
        sectionDetails: 'รายละเอียดเซคชัน',
        courseReviews: 'รีวิวรายวิชา',
        selectedCourses: 'วิชาที่เลือก',
        reviewCount: '{count} รีวิว',
        writeReview: 'เขียนรีวิว',
        notOfficialTitle: 'CU Get Reg ไม่ใช่การลงทะเบียนเรียนจริง',
        registerAt: 'สามารถลงทะเบียนเรียนได้ที่',
        onlyChannel: 'เพียงช่องทางเดียวเท่านั้น',
        dataWarning:
          'ข้อมูลคำอธิบายรายวิชาที่แสดงไม่ได้เป็นข้อมูลล่าสุด อาจมีการเปลี่ยนแปลงได้ โปรดตรวจสอบกับรายวิชาที่จัดอีกครั้ง',
        descriptionTh: 'คำอธิบายรายวิชา (ภาษาไทย)',
        descriptionEn: 'คำอธิบายรายวิชา (ภาษาอังกฤษ)',
        faculty: 'คณะ',
        department: 'ภาควิชา/กลุ่มวิชา/สาขาวิชา',
        courseFormat: 'รูปแบบรายวิชา',
        credits: 'หน่วยกิต',
        prerequisites: 'เงื่อนไขรายวิชา',
        grading: 'วิธีการวัดผล',
        letterGrade: 'Letter Grade',
        midtermExam: 'สอบกลางภาค',
        finalExam: 'สอบปลายภาค',
        group: 'กลุ่ม : {name}',
        closed: 'ปิด',
        writeCourseReview: 'เขียนรีวิวรายวิชา',
        semester: 'ภาคเรียน',
        academicYear: 'ปีการศึกษา',
        rateCourse: 'ให้คะแนนรายวิชา',
        rateStars: 'ให้คะแนน {value} ดาว',
        reviewPlaceholder: 'คุณคิดว่าวิชานี้เป็นอย่างไรบ้าง?',
        submitReview: 'ส่งรีวิว',
        total: 'ทั้งหมด',
        emptyTitle: 'เริ่มแบ่งปันเป็นคนแรก',
        emptyDescription:
          'เริ่มเป็นคนแรกที่จะแบ่งปันประสบการณ์ที่น่าสนใจกับวิชานี้ให้กับเพื่อน ๆ',
        pagination: 'การแบ่งหน้า',
        previousPage: 'หน้าก่อนหน้า',
        nextPage: 'หน้าถัดไป',
        morePages: 'หน้าเพิ่มเติม',
        // Sample data shown by this placeholder page
        sampleCourseNameTh:
          'การลดความขัดแย้ง การเปลี่ยนความขัดแย้งและกระบวนการสันติภาพ',
        sampleDescriptionTh:
          'หลักการอ่าน ระดับของการอ่าน การจับใจความ การตีความบทอ่านประเภทต่างๆ ทั้งบทอ่านทั่วไป บทอ่านเชิงวิชาการ ตาราง แผนภูมิ หรือรูปภาพ',
        sampleFaculty: 'สถาบันภาษาไทยสิรินธร',
        sampleMidterm: '06 มี.ค. 2567 16:00 - 19:00',
        sampleFinal: '01 พ.ค. 2567 16:00 - 19:00',
        sampleFacultyMajor: 'คณะวิศวกรรมศาสตร์ ภาคเครื่องใน',
      },
      en: {
        menu: 'Menu',
        courseDescription: 'Course description',
        sectionDetails: 'Section details',
        courseReviews: 'Course reviews',
        selectedCourses: 'Selected courses',
        reviewCount: '{count} reviews',
        writeReview: 'Write a review',
        notOfficialTitle: 'CU Get Reg is not the official registration system',
        registerAt: 'Please register at',
        onlyChannel: 'which is the only official channel',
        dataWarning:
          'The course description shown may be outdated and subject to change. Please double-check with the official course offering.',
        descriptionTh: 'Course description (Thai)',
        descriptionEn: 'Course description (English)',
        faculty: 'Faculty',
        department: 'Department',
        courseFormat: 'Course format',
        credits: 'Credits',
        prerequisites: 'Prerequisites',
        grading: 'Grading',
        letterGrade: 'Letter Grade',
        midtermExam: 'Midterm exam',
        finalExam: 'Final exam',
        group: 'Group: {name}',
        closed: 'Closed',
        writeCourseReview: 'Write a course review',
        semester: 'Semester',
        academicYear: 'Academic year',
        rateCourse: 'Rate this course',
        rateStars: 'Rate {value} stars',
        reviewPlaceholder: 'What do you think about this course?',
        submitReview: 'Submit review',
        total: 'Total',
        emptyTitle: 'Be the first to share',
        emptyDescription:
          'Be the first to share your experience with this course with your friends.',
        pagination: 'Pagination',
        previousPage: 'Previous page',
        nextPage: 'Next page',
        morePages: 'More pages',
        sampleCourseNameTh:
          'การลดความขัดแย้ง การเปลี่ยนความขัดแย้งและกระบวนการสันติภาพ',
        sampleDescriptionTh:
          'หลักการอ่าน ระดับของการอ่าน การจับใจความ การตีความบทอ่านประเภทต่างๆ ทั้งบทอ่านทั่วไป บทอ่านเชิงวิชาการ ตาราง แผนภูมิ หรือรูปภาพ',
        sampleFaculty: 'The Sirindhorn Thai Language Institute',
        sampleMidterm: '06 Mar 2024 16:00 - 19:00',
        sampleFinal: '01 May 2024 16:00 - 19:00',
        sampleFacultyMajor: 'Faculty of Engineering',
      },
    }),
  );

  const sectionGroups = ['4EE ONLY', 'OPEN'];
  let selectedGroup = $state(sectionGroups[0]);
  let selectedSectionNumber = $state<string | null>(null);
  let isSectionOpen = $state(true);
  const years = ['2566', '2565', '2564'];
  const terms: Semester[] = ['FIRST', 'SECOND'];
  let selectedYear = $state(years[0]);
  let selectedTerm = $state<Semester>(terms[0]);
  let reviewRating = $state(1);
  let activeModal = $state<'selected' | null>(null);
  let textareaRef: HTMLTextAreaElement;
  let screenWidth = $state(0);

  let openPanel = $state<
    | 'sidebar'
    | 'description_only'
    | 'detail_only'
    | 'review_only'
    | 'selected_only'
    | null
  >(null);
  let activePanel = $state<
    | 'sidebar'
    | 'description_only'
    | 'detail_only'
    | 'review_only'
    | 'selected_only'
    | null
  >(null);
  let sidebarExpanded = $state(true);

  let timetableSection = $state<HTMLElement>();
  let descriptionSection = $state<HTMLElement>();
  let detailSection = $state<HTMLElement>();
  let reviewSection = $state<HTMLElement>();
  let selectedSection = $state<HTMLElement>();

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
  // Sentinel select values for "no filter"; labels are rendered via t().
  const reviewYearPlaceholder = '__all_years__';
  const reviewTermPlaceholder = '__all_terms__';
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

  const floatingOptions = $derived([
    {
      label: t('courseDescription'),
      icon: Book,
      onClick: () => {
        scrollToSection(descriptionSection);
      },
    },
    {
      label: t('sectionDetails'),
      icon: StickyNote,
      onClick: () => {
        scrollToSection(detailSection);
      },
    },
    {
      label: t('courseReviews'),
      icon: MessageCircleQuestionIcon,
      onClick: () => {
        scrollToSection(reviewSection);
      },
    },
    {
      label: t('selectedCourses'),
      icon: BookMarked,
      onClick: () => {
        activeModal = 'selected';
      },
    },
  ]);

  function togglePanel(type: typeof openPanel) {
    if (type === 'sidebar' || type === 'selected_only') {
      if (sidebarExpanded) scrollToSection(timetableSection);
      else {
        if (openPanel === type) {
          openPanel = null;
        } else {
          openPanel = type;
          activePanel = type;
        }
      }
    } else {
      if (type === 'description_only') scrollToSection(descriptionSection);
      else if (type === 'detail_only') scrollToSection(detailSection);
      else if (type === 'review_only') scrollToSection(reviewSection);
      activePanel = type;
    }
  }

  function scrollToSection(el: HTMLElement | undefined) {
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const userCart = getUserCartStore();
  const cartSelection = getCartSelectionController();

  const reviewSamples = [
    {
      rating: 4,
      semester: 'FIRST' as Semester,
      year: '2566',
      content:
        'ส่วนตัวคิดว่าง่ายมาก มีงานสัปดาห์ละครั้ง ปกติจะมีวิดีโอให้ดู ไม่ยาวมาก แต่จะไม่ดูไม่ได้ เพราะปกติโฮมอ่านตัวอย่างที่ให้มาแล้วก็ลองเขียนเลย งานส่วนใหญ่จะให้ Topic กว้างๆมา ถ้าอาจารย์ประจำ sec ไม่ strict มาก ก็เขียนตามใจไปเลย แต่อาจารย์ที่สอนในสัปดาห์นั้นมาปรับบ้างหน่อย ปกติจะมีเวลาไม่มาก ก็เขียนครั้งเดียวแล้วส่งไปเลย เลยเสียเวลาแค่ 1-2 ชม. ต่อสัปดาห์ แต่ถ้าใครจะส่งชิงงานเขียนหน่อยก็อาจใช้เวลาเพิ่มขึ้น สอบเหมือนกับงานที่ทำ จะไม่อ่านไปสอบก็ได้ถ้าจำพวกงานที่ทำส่งได้ แต่ก่อนสอบมีคลิปรีวิวให้ดูก่อน ฟังตัวนี้เอาก็ได้ อันนี้ขึ้นอยู่กับ sec ของเราว่าอาจารย์ให้คะแนนค่อนข้างง่าย แต่ถ้าให้คะแนนมากหน่อย เฉลี่ยก็รวมๆกันได้ A เพราะจะเขียนตามใจตัวเองเป็นหลัก ไม่ค่อยยึดกับเรื่องที่เรียนมาเลยรู้สึกไม่ค่อยได้อะไรใหม่ ที่ช่วยนำจะเป็นการจัดระเบียบความคิดและสรุปให้อยู่ในย่อหน้า',
      likesCount: 2,
      dislikesCount: 0,
    },
    {
      rating: 3.5,
      semester: 'SECOND' as Semester,
      year: '2566',
      content:
        'ส่วนตัวคิดว่าง่ายมาก มีงานสัปดาห์ละครั้ง ปกติจะมีวิดีโอให้ดู ไม่ยาวมาก แต่จะไม่ดูไม่ได้ เพราะปกติโฮมอ่านตัวอย่างที่ให้มาแล้วก็ลองเขียนเลย งานส่วนใหญ่จะให้ Topic กว้างๆมา ถ้าอาจารย์ประจำ sec ไม่ strict มาก ก็เขียนตามใจไปเลย แต่อาจารย์ที่สอนในสัปดาห์นั้นมาปรับบ้างหน่อย ปกติจะมีเวลาไม่มาก ก็เขียนครั้งเดียวแล้วส่งไปเลย เลยเสียเวลาแค่ 1-2 ชม. ต่อสัปดาห์ แต่ถ้าใครจะส่งชิงงานเขียนหน่อยก็อาจใช้เวลาเพิ่มขึ้น สอบเหมือนกับงานที่ทำ จะไม่อ่านไปสอบก็ได้ถ้าจำพวกงานที่ทำส่งได้ แต่ก่อนสอบมีคลิปรีวิวให้ดูก่อน ฟังตัวนี้เอาก็ได้ อันนี้ขึ้นอยู่กับ sec ของเราว่าอาจารย์ให้คะแนนค่อนข้างง่าย แต่ถ้าให้คะแนนมากหน่อย เฉลี่ยก็รวมๆกันได้ A เพราะจะเขียนตามใจตัวเองเป็นหลัก ไม่ค่อยยึดกับเรื่องที่เรียนมาเลยรู้สึกไม่ค่อยได้อะไรใหม่ ที่ช่วยนำจะเป็นการจัดระเบียบความคิดและสรุปให้อยู่ในย่อหน้า',
      likesCount: 1,
      dislikesCount: 0,
    },
    {
      rating: 4,
      semester: 'FIRST' as Semester,
      year: '2565',
      content:
        'ส่วนตัวคิดว่าง่ายมาก มีงานสัปดาห์ละครั้ง ปกติจะมีวิดีโอให้ดู ไม่ยาวมาก แต่จะไม่ดูไม่ได้ เพราะปกติโฮมอ่านตัวอย่างที่ให้มาแล้วก็ลองเขียนเลย งานส่วนใหญ่จะให้ Topic กว้างๆมา ถ้าอาจารย์ประจำ sec ไม่ strict มาก ก็เขียนตามใจไปเลย แต่อาจารย์ที่สอนในสัปดาห์นั้นมาปรับบ้างหน่อย ปกติจะมีเวลาไม่มาก ก็เขียนครั้งเดียวแล้วส่งไปเลย เลยเสียเวลาแค่ 1-2 ชม. ต่อสัปดาห์ แต่ถ้าใครจะส่งชิงงานเขียนหน่อยก็อาจใช้เวลาเพิ่มขึ้น สอบเหมือนกับงานที่ทำ จะไม่อ่านไปสอบก็ได้ถ้าจำพวกงานที่ทำส่งได้ แต่ก่อนสอบมีคลิปรีวิวให้ดูก่อน ฟังตัวนี้เอาก็ได้ อันนี้ขึ้นอยู่กับ sec ของเราว่าอาจารย์ให้คะแนนค่อนข้างง่าย แต่ถ้าให้คะแนนมากหน่อย เฉลี่ยก็รวมๆกันได้ A เพราะจะเขียนตามใจตัวเองเป็นหลัก ไม่ค่อยยึดกับเรื่องที่เรียนมาเลยรู้สึกไม่ค่อยได้อะไรใหม่ ที่ช่วยนำจะเป็นการจัดระเบียบความคิดและสรุปให้อยู่ในย่อหน้า',
      likesCount: 2,
      dislikesCount: 1,
    },
    {
      rating: 4.5,
      semester: 'SECOND' as Semester,
      year: '2565',
      content:
        'ส่วนตัวคิดว่าง่ายมาก มีงานสัปดาห์ละครั้ง ปกติจะมีวิดีโอให้ดู ไม่ยาวมาก แต่จะไม่ดูไม่ได้ เพราะปกติโฮมอ่านตัวอย่างที่ให้มาแล้วก็ลองเขียนเลย งานส่วนใหญ่จะให้ Topic กว้างๆมา ถ้าอาจารย์ประจำ sec ไม่ strict มาก ก็เขียนตามใจไปเลย แต่อาจารย์ที่สอนในสัปดาห์นั้นมาปรับบ้างหน่อย ปกติจะมีเวลาไม่มาก ก็เขียนครั้งเดียวแล้วส่งไปเลย เลยเสียเวลาแค่ 1-2 ชม. ต่อสัปดาห์ แต่ถ้าใครจะส่งชิงงานเขียนหน่อยก็อาจใช้เวลาเพิ่มขึ้น สอบเหมือนกับงานที่ทำ จะไม่อ่านไปสอบก็ได้ถ้าจำพวกงานที่ทำส่งได้ แต่ก่อนสอบมีคลิปรีวิวให้ดูก่อน ฟังตัวนี้เอาก็ได้ อันนี้ขึ้นอยู่กับ sec ของเราว่าอาจารย์ให้คะแนนค่อนข้างง่าย แต่ถ้าให้คะแนนมากหน่อย เฉลี่ยก็รวมๆกันได้ A เพราะจะเขียนตามใจตัวเองเป็นหลัก ไม่ค่อยยึดกับเรื่องที่เรียนมาเลยรู้สึกไม่ค่อยได้อะไรใหม่ ที่ช่วยนำจะเป็นการจัดระเบียบความคิดและสรุปให้อยู่ในย่อหน้า',
      likesCount: 3,
      dislikesCount: 0,
    },
  ];
  const reviews = Array.from({ length: 12 }, (_, i) => {
    const sample = reviewSamples[i % reviewSamples.length];
    return { ...sample };
  });
  const filteredReviews = $derived.by(() =>
    reviews.filter((review) => {
      const { semester: term, year } = review;
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
  const reviewMeta = reviews.map((review) => ({
    term: review.semester,
    year: review.year,
  }));
  const reviewYearOptions = [
    reviewYearPlaceholder,
    ...Array.from(new Set(reviewMeta.map((item) => item.year)))
      .sort()
      .reverse(),
  ];
  const reviewTermOptions = $derived.by(() => {
    const terms = reviews
      .map((review) => ({ term: review.semester, year: review.year }))
      .filter((item) =>
        isReviewYearPlaceholder ? true : item.year === selectedReviewYear,
      )
      .map((item) => item.term);
    return [
      reviewTermPlaceholder,
      ...Array.from(new Set<string>(terms)),
    ] as string[];
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
  const sectionTableData = $derived([
    {
      section: '1',
      seats: '28 / 28',
      classes: [
        {
          teacher: 'SSS',
          schedule: 'THU 16:00 - 17:00',
          room: 'MAHIT 202',
          type: 'LECT',
        },
      ],
    },
    {
      section: '2',
      seats: '20 / 28',
      classes: [
        {
          teacher: 'SSS',
          schedule: 'THU 16:00 - 17:00',
          room: 'MAHIT 202',
          type: 'LECT',
        },
      ],
    },
    {
      section: '3',
      seats: t('closed'),
      classes: [
        {
          teacher: 'SSS',
          schedule: 'THU 16:00 - 17:00',
          room: 'MAHIT 202',
          type: 'LECT',
        },
      ],
    },
  ]);
</script>

<svelte:window bind:innerWidth={screenWidth} />

<div class="relative flex h-full flex-col overflow-hidden bg-white">
  <div class="relative flex flex-1 overflow-hidden">
    <Sidebar.Provider
      bind:open={sidebarExpanded}
      class="relative h-full min-h-0"
      style="--sidebar-width-icon: 4rem; --sidebar-width: 450px;"
    >
      {#if screenWidth >= 1024}
        {@render SidebarComponent()}
      {/if}
      <Sidebar.Inset class="min-w-0">
        <main
          class="h-full min-w-0 flex-1 overflow-y-auto scroll-smooth bg-white"
        >
          <div class="flex min-h-full flex-col">
            <div class="px-6 py-6">
              <section class="text-on-surface mx-auto w-full max-w-5xl">
                <div class="flex flex-wrap items-center gap-3">
                  <div class="flex flex-col items-start gap-3">
                    <GenedChip type="HU" class="px-3 py-1 text-xs md:hidden" />
                    <h1 class="text-primary text-h1 font-semibold">
                      0123104 CON PDG PEACE CONFWV
                    </h1>
                  </div>
                  <GenedChip
                    type="HU"
                    class="hidden px-3 py-1 text-xs md:block"
                  />
                </div>
                <div class="flex flex-wrap items-center gap-3 py-2">
                  <StudyProgramChip type="I" class="px-3 py-1 text-xs" />
                  <YearSemesterChip
                    year={2566}
                    semester="FIRST"
                    class="px-3 py-1 text-xs"
                  />
                </div>
                <p
                  class="text-on-surface mt-2 text-sm font-semibold sm:text-lg"
                >
                  {t('sampleCourseNameTh')}
                </p>
                <p class="text-on-surface text-sm font-semibold sm:text-lg">
                  CONFLICT RESOLUTION,CONFLICT TRANSFORMATION,AND PEACE PROCESS
                </p>
                <div
                  class="mt-5 flex items-start gap-2 bg-amber-50 px-3 py-2 text-sm"
                >
                  <AlertTriangle size={16} class="mt-0.5 text-amber-900" />
                  <span class="font-sarabun text-neutral-900">
                    {t('dataWarning')}
                  </span>
                </div>
              </section>
              <section
                class="text-on-surface mx-auto mt-6 w-full max-w-5xl"
                bind:this={descriptionSection}
              >
                <div class="grid gap-6 md:hidden">
                  <div>
                    <div class="bg-surface-container-lowest rounded-full">
                      <p
                        class="text-primary px-4 py-1 text-xs font-medium sm:text-base"
                      >
                        {t('descriptionTh')}
                      </p>
                    </div>
                    <p
                      class="text-on-surface font-sarabun text-body1 mt-3 px-4"
                    >
                      {t('sampleDescriptionTh')}
                    </p>
                  </div>

                  <div>
                    <div class="bg-surface-container-lowest rounded-full">
                      <p
                        class="text-primary px-4 py-1 text-xs font-medium sm:text-base"
                      >
                        {t('descriptionEn')}
                      </p>
                    </div>
                    <p
                      class="text-on-surface font-sarabun text-body1 mt-3 px-4"
                    >
                      Reading principles; levels of reading; main idea finding;
                      interpretation of general texts, academic texts, tables,
                      figures and illustrations
                    </p>
                  </div>
                </div>

                <div class="hidden md:grid md:grid-cols-2 md:gap-0">
                  <div class="md:col-span-2">
                    <div
                      class="bg-surface-container-lowest grid rounded-full md:grid-cols-2"
                    >
                      <p
                        class="text-primary px-4 py-1 text-left text-xs font-medium sm:text-base"
                      >
                        {t('descriptionTh')}
                      </p>
                      <p
                        class="text-primary px-4 py-1 text-left text-xs font-medium sm:text-base"
                      >
                        {t('descriptionEn')}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p
                      class="text-on-surface font-sarabun text-body1 mt-3 px-4"
                    >
                      {t('sampleDescriptionTh')}
                    </p>
                  </div>
                  <div>
                    <p
                      class="text-on-surface font-sarabun text-body1 mt-3 px-4"
                    >
                      Reading principles; levels of reading; main idea finding;
                      interpretation of general texts, academic texts, tables,
                      figures and illustrations
                    </p>
                  </div>
                </div>

                <div class="mt-6 grid gap-6 md:hidden">
                  <div>
                    <div class="bg-surface-container-lowest rounded-full">
                      <p
                        class="text-primary px-4 py-1 text-xs font-medium sm:text-base"
                      >
                        {t('faculty')}
                      </p>
                    </div>
                    <p
                      class="text-on-surface font-sarabun text-body1 mt-3 px-4"
                    >
                      {t('sampleFaculty')}
                    </p>
                  </div>

                  <div>
                    <div class="bg-surface-container-lowest rounded-full">
                      <p
                        class="text-primary px-4 py-1 text-xs font-medium sm:text-base"
                      >
                        {t('department')}
                      </p>
                    </div>
                    <p
                      class="text-on-surface font-sarabun text-body1 mt-3 px-4"
                    >
                      {t('sampleFaculty')}
                    </p>
                  </div>
                </div>

                <div class="hidden md:mt-6 md:grid md:grid-cols-2 md:gap-0">
                  <div class="md:col-span-2">
                    <div
                      class="bg-surface-container-lowest grid rounded-full md:grid-cols-2"
                    >
                      <p
                        class="text-primary px-4 py-1 text-left text-xs font-medium sm:text-base"
                      >
                        {t('faculty')}
                      </p>
                      <p
                        class="text-primary px-4 py-1 text-left text-xs font-medium sm:text-base"
                      >
                        {t('department')}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p
                      class="text-on-surface font-sarabun text-body1 mt-3 px-4"
                    >
                      {t('sampleFaculty')}
                    </p>
                  </div>
                  <div>
                    <p
                      class="text-on-surface font-sarabun text-body1 mt-3 px-4"
                    >
                      {t('sampleFaculty')}
                    </p>
                  </div>
                </div>

                <div class="mt-6 grid gap-6 md:hidden">
                  <div>
                    <div class="bg-surface-container-lowest rounded-full">
                      <p
                        class="text-primary px-4 py-1 text-xs font-medium sm:text-base"
                      >
                        {t('courseFormat')}
                      </p>
                    </div>
                    <p
                      class="text-on-surface font-sarabun text-body1 mt-3 px-4"
                    >
                      LECT/PRAC
                    </p>
                  </div>

                  <div>
                    <div class="bg-surface-container-lowest rounded-full">
                      <p
                        class="text-primary px-4 py-1 text-xs font-medium sm:text-base"
                      >
                        {t('credits')}
                      </p>
                    </div>
                    <p
                      class="text-on-surface font-sarabun text-body1 mt-3 px-4"
                    >
                      3
                    </p>
                  </div>
                </div>

                <div class="hidden md:mt-6 md:grid md:grid-cols-2 md:gap-0">
                  <div class="md:col-span-2">
                    <div
                      class="bg-surface-container-lowest grid rounded-full md:grid-cols-2"
                    >
                      <p
                        class="text-primary px-4 py-1 text-left text-xs font-medium sm:text-base"
                      >
                        {t('courseFormat')}
                      </p>
                      <p
                        class="text-primary px-4 py-1 text-left text-xs font-medium sm:text-base"
                      >
                        {t('credits')}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p
                      class="text-on-surface font-sarabun text-body1 mt-3 px-4"
                    >
                      LECT/PRAC
                    </p>
                  </div>
                  <div>
                    <p
                      class="text-on-surface font-sarabun text-body1 mt-3 px-4"
                    >
                      3
                    </p>
                  </div>
                </div>

                <div class="mt-6 grid gap-6 md:hidden">
                  <div>
                    <div class="bg-surface-container-lowest rounded-full">
                      <p
                        class="text-primary px-4 py-1 text-xs font-medium sm:text-base"
                      >
                        {t('prerequisites')}
                      </p>
                    </div>
                    <p
                      class="text-on-surface font-sarabun text-body1 mt-3 px-4"
                    >
                      -
                    </p>
                  </div>

                  <div>
                    <div class="bg-surface-container-lowest rounded-full">
                      <p
                        class="text-primary px-4 py-1 text-xs font-medium sm:text-base"
                      >
                        {t('grading')}
                      </p>
                    </div>
                    <p
                      class="text-on-surface font-sarabun text-body1 mt-3 px-4"
                    >
                      {t('letterGrade')}
                    </p>
                  </div>
                </div>

                <div class="hidden md:mt-6 md:grid md:grid-cols-2 md:gap-0">
                  <div class="md:col-span-2">
                    <div
                      class="bg-surface-container-lowest grid rounded-full md:grid-cols-2"
                    >
                      <p
                        class="text-primary px-4 py-1 text-left text-xs font-medium sm:text-base"
                      >
                        {t('prerequisites')}
                      </p>
                      <p
                        class="text-primary px-4 py-1 text-left text-xs font-medium sm:text-base"
                      >
                        {t('grading')}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p
                      class="text-on-surface font-sarabun text-body1 mt-3 px-4"
                    >
                      -
                    </p>
                  </div>
                  <div>
                    <p
                      class="text-on-surface font-sarabun text-body1 mt-3 px-4"
                    >
                      {t('letterGrade')}
                    </p>
                  </div>
                </div>

                <div class="mt-6 grid gap-6 md:hidden">
                  <div>
                    <div class="bg-surface-container-lowest rounded-full">
                      <p
                        class="text-primary px-4 py-1 text-xs font-medium sm:text-base"
                      >
                        {t('midtermExam')}
                      </p>
                    </div>
                    <p
                      class="text-on-surface font-sarabun text-body1 mt-3 px-4"
                    >
                      {t('sampleMidterm')}
                    </p>
                  </div>

                  <div>
                    <div class="bg-surface-container-lowest rounded-full">
                      <p
                        class="text-primary px-4 py-1 text-xs font-medium sm:text-base"
                      >
                        {t('finalExam')}
                      </p>
                    </div>
                    <p
                      class="text-on-surface font-sarabun text-body1 mt-3 px-4"
                    >
                      {t('sampleFinal')}
                    </p>
                  </div>
                </div>

                <div class="hidden md:mt-6 md:grid md:grid-cols-2 md:gap-0">
                  <div class="md:col-span-2">
                    <div
                      class="bg-surface-container-lowest grid rounded-full md:grid-cols-2"
                    >
                      <p
                        class="text-primary px-4 py-1 text-left text-xs font-medium sm:text-base"
                      >
                        {t('midtermExam')}
                      </p>
                      <p
                        class="text-primary px-4 py-1 text-left text-xs font-medium sm:text-base"
                      >
                        {t('finalExam')}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p
                      class="text-on-surface font-sarabun text-body1 mt-3 px-4"
                    >
                      {t('sampleMidterm')}
                    </p>
                  </div>
                  <div>
                    <p
                      class="text-on-surface font-sarabun text-body1 mt-3 px-4"
                    >
                      {t('sampleFinal')}
                    </p>
                  </div>
                </div>
              </section>
              <section
                class="text-on-surface mx-auto mt-8 w-full max-w-5xl"
                bind:this={detailSection}
              >
                <h2 class="text-on-surface text-base font-semibold sm:text-2xl">
                  {t('sectionDetails')}
                </h2>
                <div class="mt-4">
                  <Select.Root type="single" bind:value={selectedGroup}>
                    <Select.Trigger
                      class="text-on-surface h-14 w-full rounded-2xl border border-[#D6D7E1] bg-white px-5 text-base font-medium focus:ring-0 focus:ring-offset-0"
                    >
                      {t('group', { name: selectedGroup })}
                    </Select.Trigger>
                    <Select.Content role="listbox">
                      <Select.Group>
                        {#each sectionGroups as group (group)}
                          <Select.Item
                            value={group}
                            label={t('group', { name: group })}
                          />
                        {/each}
                      </Select.Group>
                    </Select.Content>
                  </Select.Root>
                </div>
                <div
                  class="mt-4 rounded-2xl border border-[#D6D7E1] bg-white p-6"
                >
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
                      <span>{t('group', { name: selectedGroup })}</span>
                    </div>
                    <ChevronUp
                      size={18}
                      strokeWidth={4}
                      class={`-mr-2 text-neutral-400 transition-transform ${isSectionOpen ? '' : 'rotate-180'}`}
                    />
                  </button>
                  {#if isSectionOpen}
                    <div class="w-full md:hidden">
                      <SectionTable
                        tableData={sectionTableData}
                        boxed={true}
                        class="w-full"
                        selectedSection={selectedSectionNumber}
                        onSelectSection={(section) => {
                          selectedSectionNumber =
                            selectedSectionNumber === section ? null : section;
                        }}
                      />
                    </div>

                    <div class="hidden w-full md:block">
                      <SectionTable
                        tableData={sectionTableData}
                        boxed={false}
                        class="w-full"
                        selectedSection={selectedSectionNumber}
                        onSelectSection={(section) => {
                          selectedSectionNumber =
                            selectedSectionNumber === section ? null : section;
                        }}
                      />
                    </div>
                  {/if}
                </div>
                <div class="mt-4">
                  <Select.Root type="single" bind:value={selectedGroup}>
                    <Select.Trigger
                      class="text-on-surface h-14 w-full rounded-2xl border border-[#D6D7E1] bg-white px-5 text-base font-medium focus:ring-0 focus:ring-offset-0"
                    >
                      {t('group', { name: selectedGroup })}
                    </Select.Trigger>
                    <Select.Content role="listbox">
                      <Select.Group>
                        {#each sectionGroups as group (group)}
                          <Select.Item
                            value={group}
                            label={t('group', { name: group })}
                          />
                        {/each}
                      </Select.Group>
                    </Select.Content>
                  </Select.Root>
                </div>
              </section>
              <section
                class="text-on-surface mx-auto mt-10 w-full max-w-5xl"
                bind:this={reviewSection}
              >
                <div class="flex items-center justify-between">
                  <h2
                    class="text-on-surface text-base font-semibold sm:text-2xl"
                  >
                    {t('writeCourseReview')}
                  </h2>
                </div>
                <div
                  class="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:gap-5"
                >
                  <div
                    class="flex w-full flex-row items-center justify-between gap-5 md:w-fit md:justify-start"
                  >
                    <p class="shrink-0 text-sm font-normal md:hidden">
                      {t('semester')}
                    </p>
                    <div class="flex flex-row gap-2 md:gap-5">
                      <div>
                        <Select.Root type="single" bind:value={selectedYear}>
                          <Select.Trigger
                            class="text-on-surface h-9 w-[120px] rounded-lg border border-[#D6D7E1] bg-white px-4 text-sm font-medium md:h-12 md:w-[180px] md:text-base"
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
                      <div>
                        <Select.Root type="single" bind:value={selectedTerm}>
                          <Select.Trigger
                            class="text-on-surface h-9 w-[120px] rounded-lg border border-[#D6D7E1] bg-white px-4 text-sm font-medium md:h-12 md:w-[180px] md:text-base"
                          >
                            {getSemesterLabel(selectedTerm, locale.current)}
                          </Select.Trigger>
                          <Select.Content role="listbox">
                            <Select.Group>
                              {#each terms as term (term)}
                                <Select.Item
                                  value={term}
                                  label={getSemesterLabel(term, locale.current)}
                                />
                              {/each}
                            </Select.Group>
                          </Select.Content>
                        </Select.Root>
                      </div>
                    </div>
                  </div>
                  <div class="flex items-center justify-between gap-8">
                    <p class="text-sm font-normal md:hidden">
                      {t('rateCourse')}
                    </p>
                    <div class="flex gap-2 md:gap-0">
                      {#each [1, 2, 3, 4, 5] as value (value)}
                        <button
                          class="flex h-10 w-6 items-center justify-center md:w-10"
                          type="button"
                          onclick={(event) => onStarClick(value, event)}
                          aria-label={t('rateStars', { value })}
                        >
                          {#if getStarState(value) === 'half'}
                            <span class="relative inline-flex">
                              <Star size={26} class="text-[#D6D7E1]" />
                              <span
                                class="absolute inset-0 w-1/2 overflow-hidden"
                              >
                                <Star
                                  size={26}
                                  class="text-primary fill-current"
                                />
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
                    bind:this={textareaRef}
                    class="text-on-surface h-36 w-full resize-none bg-transparent px-4 py-3 text-sm outline-none"
                    placeholder={t('reviewPlaceholder')}
                  ></textarea>
                </div>
                <div class="mt-4 flex w-full md:justify-end">
                  <Button
                    size="sm"
                    variant="solid"
                    color="secondary"
                    class="bg-primary-container text-primary hover:ring-primary-container w-full gap-2 md:w-auto"
                  >
                    {t('submitReview')}
                    <Send size={14} />
                  </Button>
                </div>
              </section>
              <section class="text-on-surface mx-auto mt-8 w-full max-w-5xl">
                <div
                  class="flex flex-col justify-between gap-4 md:flex-row md:items-center"
                >
                  <div class="text-base font-semibold sm:text-2xl">
                    <span class="text-on-surface/60">{t('total')} </span>
                    <span class="text-primary"
                      >{t('reviewCount', {
                        count: filteredReviews.length,
                      })}</span
                    >
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
                        {isReviewYearPlaceholder
                          ? t('academicYear')
                          : selectedReviewYear}
                      </Select.Trigger>
                      <Select.Content role="listbox">
                        <Select.Group>
                          {#each reviewYearOptions as year (year)}
                            <Select.Item
                              value={year}
                              label={year === reviewYearPlaceholder
                                ? t('academicYear')
                                : year}
                            />
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
                        {isReviewTermPlaceholder
                          ? t('semester')
                          : getSemesterLabel(
                              selectedReviewTerm as Semester,
                              locale.current,
                            )}
                      </Select.Trigger>
                      <Select.Content role="listbox">
                        <Select.Group>
                          {#each reviewTermOptions as term (term)}
                            <Select.Item
                              value={term}
                              label={term === reviewTermPlaceholder
                                ? t('semester')
                                : getSemesterLabel(
                                    term as Semester,
                                    locale.current,
                                  )}
                            />
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
                    <NotebookPen
                      size={140}
                      strokeWidth={2.2}
                      class="text-[#4A70C6]"
                    />
                    <div
                      class="text-on-surface text-base font-semibold sm:text-2xl"
                    >
                      {t('emptyTitle')}
                    </div>
                    <p class="text-on-surface/70 max-w-lg text-sm">
                      {t('emptyDescription')}
                    </p>
                  </div>
                {:else}
                  <div class="mt-6 flex flex-col gap-6">
                    {#each pagedReviews as review, index (index)}
                      <Comment
                        rating={review.rating}
                        semester={getSemesterLabel(
                          review.semester,
                          locale.current,
                        )}
                        year={Number(review.year)}
                        status="APPROVED"
                        facultyMajor={t('sampleFacultyMajor')}
                        content={review.content}
                        likesCount={review.likesCount}
                        dislikesCount={review.dislikesCount}
                        onLike={() => {}}
                        onDislike={() => {}}
                      />
                    {/each}
                  </div>
                  <div class="mt-6 flex justify-end">
                    <nav
                      class="flex items-center gap-2"
                      aria-label={t('pagination')}
                    >
                      <button
                        class="border-surface-container-high bg-surface text-on-surface flex h-9 w-9 items-center justify-center rounded-lg border"
                        type="button"
                        aria-label={t('previousPage')}
                        onclick={() =>
                          (reviewsPage = Math.max(1, reviewsPage - 1))}
                      >
                        ‹
                      </button>
                      {#each reviewPageItems as item, index (index)}
                        {#if item === 'ellipsis'}
                          <button
                            class="border-surface-container-high bg-surface text-on-surface flex h-9 w-9 items-center justify-center rounded-lg border"
                            type="button"
                            aria-label={t('morePages')}
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
                            aria-current={reviewsPage === item
                              ? 'page'
                              : undefined}
                            onclick={() => (reviewsPage = item)}
                          >
                            {item}
                          </button>
                        {/if}
                      {/each}
                      <button
                        class="border-surface-container-high bg-surface text-on-surface flex h-9 w-9 items-center justify-center rounded-lg border"
                        type="button"
                        aria-label={t('nextPage')}
                        onclick={() =>
                          (reviewsPage = Math.min(
                            totalReviewPages,
                            reviewsPage + 1,
                          ))}
                      >
                        ›
                      </button>
                    </nav>
                  </div>
                {/if}
              </section>
            </div>
          </div>
          <div class="mt-auto w-full border-t bg-white">
            <Footer />
          </div>
        </main>
      </Sidebar.Inset>
    </Sidebar.Provider>
  </div>
  <div class="lg:hidden">
    {#if !activeModal}
      <div transition:fade={{ duration: 200 }}>
        <FloatingButton options={floatingOptions} />
      </div>
    {/if}
  </div>
  {#if activeModal}
    <div
      class="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      transition:fade={{ duration: 200 }}
    >
      <div
        class="custom-scrollbar relative flex max-h-[85vh] w-full max-w-[400px] flex-col overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl"
      >
        <button
          class="absolute top-7 right-5 bg-white"
          onclick={() => (activeModal = null)}
        >
          <X size={20} strokeWidth={2.5} />
        </button>
        {@render SelectedContent()}
        {@render WarningContent()}
      </div>
    </div>
  {/if}
</div>

{#snippet SidebarComponent()}
  {@const _sidebar = Sidebar.useSidebar()}
  <Sidebar.Sidebar
    variant="sidebar"
    collapsible="icon"
    class="!absolute z-30 !h-full border-none"
  >
    <Sidebar.Content class="flex-row overflow-visible!">
      <Sidebar.Group
        class="w-(--sidebar-width-icon) shrink-0 items-center border-r border-r-neutral-100 bg-white p-0 pt-[1rem] pb-6 group-data-[variant=floating]:rounded-l-lg md:pt-[1.5rem]"
      >
        <Sidebar.GroupContent>
          <Sidebar.Menu class="gap-6">
            <Sidebar.MenuItem>
              <Sidebar.MenuButton
                onclick={() => (sidebarExpanded = !sidebarExpanded)}
                isActive={sidebarExpanded && activePanel === 'sidebar'}
                size="lg"
                tooltipContent={t('menu')}
                class="mx-auto size-12! justify-center rounded-xl p-0! ring-0 transition-all data-[active=true]:bg-[#E9EEF6] data-[active=true]:text-[#004494] [&>svg]:size-6!"
              >
                <Menu size="24" strokeWidth={2.5} />
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton
                onclick={() => togglePanel('description_only')}
                isActive={activePanel === 'description_only'}
                size="lg"
                tooltipContent={t('courseDescription')}
                class="mx-auto size-12! justify-center rounded-xl p-0! transition-all data-[active=true]:bg-[#E9EEF6] data-[active=true]:text-[#004494] [&>svg]:size-6!"
              >
                <Book size="24" strokeWidth={2.5} />
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton
                onclick={() => togglePanel('detail_only')}
                isActive={activePanel === 'detail_only'}
                size="lg"
                tooltipContent={t('sectionDetails')}
                class="mx-auto size-12! justify-center rounded-xl p-0! transition-all data-[active=true]:bg-[#E9EEF6] data-[active=true]:text-[#004494] [&>svg]:size-6!"
              >
                <StickyNote size="24" strokeWidth={2.5} />
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton
                onclick={() => togglePanel('review_only')}
                isActive={activePanel === 'review_only'}
                size="lg"
                tooltipContent={t('courseReviews')}
                class="mx-auto size-12! justify-center rounded-xl p-0! transition-all data-[active=true]:bg-[#E9EEF6] data-[active=true]:text-[#004494] [&>svg]:size-6!"
              >
                <MessageCircleQuestionIcon size="24" strokeWidth={2.5} />
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton
                onclick={() => togglePanel('selected_only')}
                isActive={activePanel === 'selected_only'}
                size="lg"
                tooltipContent={t('selectedCourses')}
                class="mx-auto size-12! justify-center rounded-xl p-0! transition-all data-[active=true]:bg-[#E9EEF6] data-[active=true]:text-[#004494] [&>svg]:size-6!"
              >
                <BookMarked size="24" strokeWidth={2.5} />
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
          </Sidebar.Menu>
        </Sidebar.GroupContent>
      </Sidebar.Group>

      {#if openPanel || sidebarExpanded}
        {#if !sidebarExpanded}
          <div
            class="fixed inset-0 z-40 bg-black/5"
            onclick={() => (openPanel = null)}
            role="button"
            tabindex="0"
            onkeydown={() => {}}
          ></div>
        {/if}
        <div
          class="bg-surface flex flex-1 flex-col overflow-hidden border-r border-neutral-100 group-data-[state=collapsed]:absolute group-data-[state=collapsed]:top-4 group-data-[state=collapsed]:left-[calc(var(--sidebar-width-icon)+1rem)] group-data-[state=collapsed]:z-50 group-data-[state=collapsed]:max-h-[min(800px,calc(100%-2rem))] group-data-[state=collapsed]:w-[400px] group-data-[state=collapsed]:rounded-3xl group-data-[state=collapsed]:border group-data-[state=collapsed]:border-neutral-100 group-data-[state=collapsed]:shadow-2xl md:px-8 md:pt-0 md:pb-8"
        >
          <div class="flex-1 overflow-y-auto pr-6 pb-10 md:pr-8">
            {#if sidebarExpanded || openPanel === 'sidebar'}
              <div
                bind:this={timetableSection}
                class="relative mb-6 flex flex-col gap-2"
              >
                <SelectTimetable
                  class="px-2 pt-5"
                  options={$userCart.cartList?.map((item) => ({
                    name: item.name,
                    id: item.id,
                  })) ?? []}
                  bind:value={
                    () => cartSelection.selectedId,
                    (id) => void cartSelection.select(id)
                  }
                  semester={$userCart.currentCart.semester}
                  semesterType={$userCart.currentCart.studyProgram}
                  academicYear={$userCart.currentCart.academicYear}
                />
              </div>
              <hr class="mb-0 border-t border-neutral-100" />
            {/if}

            {#if sidebarExpanded}
              <div class="text-on-surface mb-6 flex flex-col">
                <button
                  type="button"
                  class="hover:text-primary w-full border-b border-gray-400 py-4 text-left text-xl font-semibold transition-colors"
                  onclick={() => scrollToSection(descriptionSection)}
                >
                  {t('courseDescription')}
                </button>

                <button
                  type="button"
                  class="hover:text-primary w-full border-b border-gray-400 py-4 text-left text-xl font-semibold transition-colors"
                  onclick={() => scrollToSection(detailSection)}
                >
                  {t('sectionDetails')}
                </button>

                <div
                  class="flex w-full items-center justify-between border-b border-gray-400 py-3.5"
                >
                  <button
                    type="button"
                    class="hover:text-primary text-left text-xl font-semibold transition-colors"
                    onclick={() => scrollToSection(reviewSection)}
                  >
                    {t('courseReviews')}
                    <span class="text-on-surface/50 ml-1 text-sm font-normal">
                      ({t('reviewCount', { count: filteredReviews.length })})
                    </span>
                  </button>

                  <button
                    type="button"
                    class="flex items-center gap-1.5 rounded-xl bg-[#E9EEF6] px-3.5 py-1.5 text-sm font-medium text-[#004494] transition-all hover:bg-[#D2E0F5]"
                    onclick={() => {
                      scrollToSection(reviewSection);
                      setTimeout(() => textareaRef?.focus(), 300);
                    }}
                  >
                    {t('writeReview')}
                    <Pencil size={14} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            {/if}

            {#if sidebarExpanded || openPanel === 'selected_only'}
              {@render SelectedContent()}
            {/if}

            {#if sidebarExpanded || openPanel === 'sidebar'}
              {@render WarningContent()}
            {/if}
          </div>
        </div>
      {/if}
    </Sidebar.Content>
  </Sidebar.Sidebar>
{/snippet}

{#snippet SelectedContent()}
  <div bind:this={selectedSection}>
    {#if $userCart.currentCart}
      <SelectedCourse variant="grouped" class="border-b border-neutral-200" />
    {:else}
      <SelectedCourse class="border-b border-neutral-200" />
    {/if}
  </div>
{/snippet}

{#snippet WarningContent()}
  <div
    class="mt-8 rounded-2xl border border-orange-300 px-5 py-4 text-center text-[15px] leading-relaxed text-orange-500"
  >
    <span class="font-bold">{t('notOfficialTitle')}</span><br />
    {t('registerAt')}
    <a
      href="https://www2.reg.chula.ac.th/"
      target="_blank"
      rel="noreferrer"
      class="underline"
    >
      https://www2.reg.chula.ac.th/
    </a><br />
    {t('onlyChannel')}
  </div>
{/snippet}
