<script lang="ts">
  import { afterNavigate, goto } from '$app/navigation';
  import { resolve } from '$app/paths';
  import { page } from '$app/state';
  import { api } from '$lib/api';
  import { useSession } from '$lib/auth-client';
  import AppSidebar from '$lib/components/app-sidebar.svelte';
  import MarkdownEditor from '$lib/components/markdown-editor.svelte';
  import ScheduleMismatchPopup from '$lib/components/schedule-mismatch-popup.svelte';
  import SelectedCourse from '$lib/components/selected-course.svelte';
  import { faculties } from '$lib/constants';
  import { thaiLabelToSemesterMapper } from '$lib/mapper';
  import {
    ALLOWED_ACADEMIC_YEAR,
    ALLOWED_SEMESTER,
    SEMESTER_LABEL_LONG,
  } from '$lib/semesterOptions';
  import { loginPopupState } from '$lib/stores/login-popup.svelte';
  import { getUserCartStore, useCartActions } from '$lib/stores/user-cart';

  import {
    AlertTriangle,
    Book,
    BookMarked,
    Check,
    ChevronLeft,
    Loader2,
    Menu,
    MessageCircleQuestionIcon,
    NotebookPen,
    Pencil,
    Send,
    Star,
    StickyNote,
    X,
  } from '@lucide/svelte';
  import { isAxiosError } from 'axios';
  import { untrack } from 'svelte';
  import { fade } from 'svelte/transition';
  import toast from 'svelte-french-toast';

  import * as Accordion from '@cugetreg/ui/atoms/accordion';
  import { Button } from '@cugetreg/ui/atoms/button';
  import { GenedChip } from '@cugetreg/ui/atoms/gened-chip';
  import { StudyProgramChip } from '@cugetreg/ui/atoms/studyprogram-chip';
  import { YearSemesterChip } from '@cugetreg/ui/atoms/yearsemester-chip';
  import { Comment } from '@cugetreg/ui/molecules/comment';
  import { FloatingButton } from '@cugetreg/ui/molecules/floating-button';
  import {
    type ClassInfo,
    SectionTable,
    type SectionTableData,
  } from '@cugetreg/ui/molecules/section-table';
  import * as Select from '@cugetreg/ui/molecules/select';
  import { SelectTimetable } from '@cugetreg/ui/molecules/select-timetable';
  import { Footer } from '@cugetreg/ui/organisms/footer';
  import * as Sidebar from '@cugetreg/ui/organisms/sidebar';
  import { formatDate, formatExamTime } from '@cugetreg/utils';
  import type { GenEdType } from '@cugetreg/utils/types';
  import {
    type CourseReview,
    type CourseReviewFacet,
    CourseReviewResponseSchema,
    CourseSectionsResponseSchema,
    type Semester,
    type SubmitReviewBodySchema,
    SubmitReviewResponseSchema,
    VoteReviewBodySchema,
    VoteReviewResponseSchema,
  } from '@cugetreg/zod-schemas';

  import type { PageProps } from './$types';

  const { data }: PageProps = $props();
  type ReviewPageData = typeof data & {
    reviewCount?: number;
    reviewFacets?: CourseReviewFacet[];
    reviewsError?: boolean;
  };
  const course = $derived(data.course);
  const midtermExam = $derived(
    course.midtermStart && course.midtermEnd
      ? `${formatDate(new Date(course.midtermStart))} ${formatExamTime(
          new Date(course.midtermStart),
          (new Date(course.midtermEnd).getTime() -
            new Date(course.midtermStart).getTime()) /
            (1000 * 60 * 60),
        )}`
      : 'ยังไม่ประกาศ',
  );
  const finalExam = $derived(
    course.finalStart && course.finalEnd
      ? `${formatDate(new Date(course.finalStart))} ${formatExamTime(
          new Date(course.finalStart),
          (new Date(course.finalEnd).getTime() -
            new Date(course.finalStart).getTime()) /
            (1000 * 60 * 60),
        )}`
      : 'ยังไม่ประกาศ',
  );
  let reviews = $state<CourseReview[]>(untrack(() => data.reviews));
  let reviewCount = $state(
    untrack(() => (data as ReviewPageData).reviewCount ?? data.reviews.length),
  );
  let reviewFacets = $state<CourseReviewFacet[]>(
    untrack(() => (data as ReviewPageData).reviewFacets ?? []),
  );
  let reviewsLoading = $state(false);
  let reviewsError = $state(
    untrack(() => (data as ReviewPageData).reviewsError ?? false),
  );
  let reviewsRequestId = 0;
  let reviewsCourseNo = untrack(() => data.course.courseNo);

  const session = useSession();
  let reviewSessionUserId = $state<string | null>(
    untrack(() => $session.data?.user.id ?? null),
  );

  const userCart = getUserCartStore();
  const { addCourse, removeCourse, updateCourse } = useCartActions();

  const years = [...ALLOWED_ACADEMIC_YEAR].reverse().map(String);
  const terms = ALLOWED_SEMESTER.map((s) => SEMESTER_LABEL_LONG[s]);

  let selectedYear = $state(years[0]);
  let selectedTerm = $state(terms[0]);
  let writeReviewSectionOptions = $state<number[]>([]);
  let writeReviewSectionNo = $state<string | null>(null);
  let reviewRating = $state(1);
  let reviewContent = $state('');
  let selectedSection = $state<HTMLElement>();

  let sidebarExpanded = $state(true);
  let openPanel = $state<string | null>(null);
  let activePanel = $state<string | null>(null);
  let selectedOpen = $state(true);

  let timetableSection = $state<HTMLElement>();
  let descriptionSection = $state<HTMLElement>();
  let detailSection = $state<HTMLElement>();
  let reviewSection = $state<HTMLElement>();

  let showMismatchPopup = $state(false);
  let pendingSection = $state<any>(null);

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

  // The write-review form lets you pick a year/semester independently of
  // the page's currently-loaded course data (which is bound to the URL's
  // academicYear/semester), so the Section picker needs its own fetch
  // whenever the form's year/term changes.
  $effect(() => {
    const academicYear = Number(selectedYear);
    const semester = thaiLabelToSemesterMapper(selectedTerm);
    const studyProgram = course.studyProgram;

    void api
      .get(`/courses/${course.courseNo}/sections`, {
        params: { studyProgram, academicYear, semester },
      })
      .then((response) => {
        const { sections } = CourseSectionsResponseSchema.parse(response.data);
        writeReviewSectionOptions = sections;
        if (
          writeReviewSectionNo === null ||
          !sections.includes(Number(writeReviewSectionNo))
        ) {
          writeReviewSectionNo =
            sections.length > 0 ? String(sections[0]) : null;
        }
        return;
      })
      .catch(() => {
        writeReviewSectionOptions = [];
        writeReviewSectionNo = null;
      });
  });

  const reviewYearPlaceholder = 'ปีการศึกษา';
  const reviewSemesterPlaceholder = 'ภาคเรียน';
  const reviewSectionPlaceholder = 'เซค';
  let selectedReviewYear = $state(reviewYearPlaceholder);
  let selectedReviewSemester = $state<Semester | null>(null);
  let selectedReviewSection = $state<number | null>(null);
  const reviewsPerPage = 4;
  let reviewsPage = $state(1);
  let reviewSubmitting = $state(false);
  let pendingReviewVotes = $state<string[]>([]);

  const isReviewYearPlaceholder = $derived(
    selectedReviewYear === reviewYearPlaceholder,
  );

  const isReviewSemesterPlaceholder = $derived(selectedReviewSemester === null);

  const isReviewSectionPlaceholder = $derived(selectedReviewSection === null);

  let activeModal = $state<'selected' | null>(null);
  let reviewEditor = $state<MarkdownEditor>();
  let screenWidth = $state(0);

  const floatingOptions = [
    {
      label: 'คำอธิบายรายวิชา',
      icon: Book,
      onClick: () => {
        scrollToSection(descriptionSection);
      },
    },
    {
      label: 'รายละเอียดเซ็คชัน',
      icon: StickyNote,
      onClick: () => {
        scrollToSection(detailSection);
      },
    },
    {
      label: 'รีวิวรายวิชา',
      icon: MessageCircleQuestionIcon,
      onClick: () => {
        scrollToSection(reviewSection);
      },
    },
    {
      label: 'วิชาที่เลือก',
      icon: BookMarked,
      onClick: () => {
        activeModal = 'selected';
      },
    },
  ];

  function scrollToSection(el: HTMLElement | undefined) {
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function focusSelected() {
    if (sidebarExpanded && selectedOpen) {
      selectedOpen = false;
      activePanel = null;
      return;
    }
    sidebarExpanded = true;
    openPanel = null;
    selectedOpen = true;
    activePanel = 'selected_only';
  }

  function toggleSidebar() {
    if (sidebarExpanded) {
      sidebarExpanded = false;
      activePanel = null;
    } else {
      sidebarExpanded = true;
      activePanel = 'sidebar';
      openPanel = null;
      selectedOpen = true;
    }
  }

  const totalReviewPages = $derived(
    Math.max(1, Math.ceil(reviewCount / reviewsPerPage)),
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

  const reviewYearOptions = $derived.by(() => [
    reviewYearPlaceholder,
    ...Array.from(
      new Set(reviewFacets.map((facet) => String(facet.academicYear))),
    )
      .sort()
      .reverse(),
  ]);

  function getReviewSemesters(reviewYear: string) {
    return Array.from(
      new Set(
        reviewFacets
          .filter((facet) =>
            reviewYear === reviewYearPlaceholder
              ? true
              : facet.academicYear === Number(reviewYear),
          )
          .map((facet) => facet.semester),
      ),
    );
  }

  const reviewSemesterOptions = $derived(
    getReviewSemesters(selectedReviewYear),
  );

  function getReviewSections(
    reviewYear: string,
    reviewSemester: Semester | null,
  ) {
    return Array.from(
      new Set(
        reviewFacets
          .filter((facet) => {
            if (
              reviewYear !== reviewYearPlaceholder &&
              facet.academicYear !== Number(reviewYear)
            )
              return false;
            if (reviewSemester !== null && facet.semester !== reviewSemester)
              return false;
            return facet.sectionNo !== null;
          })
          .map((facet) => facet.sectionNo as number),
      ),
    ).sort((a, b) => a - b);
  }

  const reviewSectionOptions = $derived(
    getReviewSections(selectedReviewYear, selectedReviewSemester),
  );

  function setSelectedReviewYear(value: string) {
    selectedReviewYear = value;
    if (
      selectedReviewSemester !== null &&
      !getReviewSemesters(value).includes(selectedReviewSemester)
    ) {
      selectedReviewSemester = null;
    }
    if (
      selectedReviewSection !== null &&
      !getReviewSections(value, selectedReviewSemester).includes(
        selectedReviewSection,
      )
    ) {
      selectedReviewSection = null;
    }
    reviewsPage = 1;
    void refreshReviews({ targetPage: 1 });
  }

  function setSelectedReviewSemester(value: string) {
    selectedReviewSemester =
      value === reviewSemesterPlaceholder ? null : (value as Semester);
    if (
      selectedReviewSection !== null &&
      !getReviewSections(selectedReviewYear, selectedReviewSemester).includes(
        selectedReviewSection,
      )
    ) {
      selectedReviewSection = null;
    }
    reviewsPage = 1;
    void refreshReviews({ targetPage: 1 });
  }

  function setSelectedReviewSection(value: string) {
    selectedReviewSection =
      value === reviewSectionPlaceholder ? null : Number(value);
    reviewsPage = 1;
    void refreshReviews({ targetPage: 1 });
  }

  async function refreshReviews(
    options: { includeFacets?: boolean; targetPage?: number } = {},
  ) {
    const { includeFacets = false, targetPage = reviewsPage } = options;
    const requestId = ++reviewsRequestId;
    reviewsLoading = true;
    reviewsError = false;

    try {
      const response = await api.get(`/courses/reviews/${course.courseNo}`, {
        params: {
          limit: reviewsPerPage,
          page: targetPage,
          ...(includeFacets && { includeFacets: true }),
          ...(!isReviewYearPlaceholder && {
            academicYear: Number(selectedReviewYear),
          }),
          ...(selectedReviewSemester && {
            semester: selectedReviewSemester,
          }),
          ...(selectedReviewSection !== null && {
            sectionNo: selectedReviewSection,
          }),
        },
      });
      const result = CourseReviewResponseSchema.parse(response.data);

      if (requestId !== reviewsRequestId) return;

      if (result.facets) {
        reviewFacets = result.facets;

        const nextYearOptions = new Set(
          result.facets.map((facet) => String(facet.academicYear)),
        );
        let filtersChanged = false;

        if (
          selectedReviewYear !== reviewYearPlaceholder &&
          !nextYearOptions.has(selectedReviewYear)
        ) {
          selectedReviewYear = reviewYearPlaceholder;
          selectedReviewSemester = null;
          selectedReviewSection = null;
          filtersChanged = true;
        } else if (
          selectedReviewSemester !== null &&
          !getReviewSemesters(selectedReviewYear).includes(
            selectedReviewSemester,
          )
        ) {
          selectedReviewSemester = null;
          selectedReviewSection = null;
          filtersChanged = true;
        } else if (
          selectedReviewSection !== null &&
          !getReviewSections(
            selectedReviewYear,
            selectedReviewSemester,
          ).includes(selectedReviewSection)
        ) {
          selectedReviewSection = null;
          filtersChanged = true;
        }

        if (filtersChanged) {
          await refreshReviews({ targetPage: 1 });
          return;
        }
      }

      const lastPage = Math.max(1, Math.ceil(result.count / reviewsPerPage));
      if (targetPage > lastPage) {
        await refreshReviews({
          includeFacets,
          targetPage: lastPage,
        });
        return;
      }

      reviews = result.reviews;
      reviewCount = result.count;
      reviewsPage = result.page;
    } catch (error) {
      if (requestId !== reviewsRequestId) return;
      console.error(error);
      reviewsError = true;
    } finally {
      if (requestId === reviewsRequestId) reviewsLoading = false;
    }
  }

  function setReviewsPage(targetPage: number) {
    if (targetPage === reviewsPage || reviewsLoading) return;
    void refreshReviews({ targetPage });
  }

  async function handleReactReview(reviewId: string, interaction: 'L' | 'D') {
    if (pendingReviewVotes.includes(reviewId)) return;
    pendingReviewVotes = [...pendingReviewVotes, reviewId];

    const payload: VoteReviewBodySchema = {
      interaction,
    };

    try {
      const response = await api.patch(`/reviews/react/${reviewId}`, payload);
      const {
        id,
        likeCount,
        dislikeCount,
        myInteraction: reaction,
      } = VoteReviewResponseSchema.parse(response.data).data;

      const review = reviews.find((r) => r.id === id);
      if (review) {
        Object.assign(review, {
          reaction,
          stats: {
            likeCount,
            dislikeCount,
          },
        });
      }
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.status === 401)
          toast.error('Please login before doing this action', {
            position: 'bottom-right',
          });
        return;
      }
      console.error(error);
      toast.error('Something went wrong', {
        position: 'bottom-right',
      });
    } finally {
      pendingReviewVotes = pendingReviewVotes.filter((id) => id !== reviewId);
    }
  }

  async function handleSubmitReview() {
    if (reviewSubmitting) return;
    reviewSubmitting = true;

    if (editingReviewId) {
      const patchPayload = {
        academicYear: Number(selectedYear),
        semester: thaiLabelToSemesterMapper(selectedTerm),
        ...(writeReviewSectionNo !== null && {
          sectionNo: Number(writeReviewSectionNo),
        }),
        rating: reviewRating * 2,
        content: reviewContent,
      };

      try {
        await api.patch(`/reviews/${editingReviewId}`, patchPayload);
        await refreshReviews({ includeFacets: true });
        editingReviewId = null;
        reviewContent = '';
        reviewRating = 1;
      } catch (error) {
        console.error(error);
        toast.error('Something went wrong', {
          position: 'bottom-right',
        });
      } finally {
        reviewSubmitting = false;
      }
      return;
    }

    const payload: SubmitReviewBodySchema = {
      courseNo: course.courseNo,
      studyProgram: course.studyProgram,
      academicYear: Number(selectedYear),
      semester: thaiLabelToSemesterMapper(selectedTerm),
      ...(writeReviewSectionNo !== null && {
        sectionNo: Number(writeReviewSectionNo),
      }),
      rating: reviewRating * 2,
      content: reviewContent,
    };

    try {
      const response = await api.post('/reviews', payload);
      SubmitReviewResponseSchema.parse(response.data);
      await refreshReviews({ includeFacets: true, targetPage: 1 });
      reviewContent = '';
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.status === 401) {
          toast.error('Please login before doing this action', {
            position: 'bottom-right',
          });
          return;
        }
      }

      toast.error('Something went wrong', {
        position: 'bottom-right',
      });
    } finally {
      reviewSubmitting = false;
    }
  }

  async function handleDeleteReview(reviewId: string) {
    const isConfirm = confirm('Confirm Delete?');
    if (!isConfirm) return;
    try {
      await api.delete(`/reviews/${reviewId}`);
      await refreshReviews({ includeFacets: true });
      toast.success('ลบรีวิวสำเร็จ', { position: 'bottom-right' });
    } catch (error) {
      console.error(error);
    }
  }

  let editingReviewId = $state<string | null>(null);

  function handleEditReview(review: any) {
    reviewRating = review.rating / 2;
    reviewContent = review.content;
    selectedYear = String(review.academicYear);
    selectedTerm =
      SEMESTER_LABEL_LONG[review.semester as keyof typeof SEMESTER_LABEL_LONG];
    writeReviewSectionNo =
      review.sectionNo != null ? String(review.sectionNo) : null;
    editingReviewId = review.id;
    scrollToSection(reviewSection);
    reviewEditor?.focus();
  }

  $effect(() => {
    const academicYear = page.url.searchParams.get('academicYear');
    const semester = page.url.searchParams.get('semester');
    const studyProgram = page.url.searchParams.get('studyProgram');

    if (academicYear && semester && studyProgram) {
      return;
    }

    const params = new URLSearchParams({
      academicYear: String($userCart.currentCart.academicYear),
      semester: $userCart.currentCart.semester,
      studyProgram: $userCart.currentCart.studyProgram,
    });
    goto(resolve(`/course-page/${page.params.courseId}?${params.toString()}`), {
      replaceState: true,
    });
  });

  afterNavigate(() => {
    const loadedCourseNo = data.course.courseNo;

    if (loadedCourseNo === reviewsCourseNo) return;

    reviewsRequestId += 1;
    reviewsCourseNo = loadedCourseNo;
    reviews = data.reviews;
    reviewCount = (data as ReviewPageData).reviewCount ?? data.reviews.length;
    reviewFacets = (data as ReviewPageData).reviewFacets ?? [];
    reviewsError = (data as ReviewPageData).reviewsError ?? false;
    reviewsLoading = false;
    selectedReviewYear = reviewYearPlaceholder;
    selectedReviewSemester = null;
    selectedReviewSection = null;
    reviewsPage = 1;
  });

  $effect(() => {
    const userId = $session.data?.user.id ?? null;

    if (userId === reviewSessionUserId) return;

    reviewSessionUserId = userId;
    void refreshReviews({ includeFacets: true, targetPage: 1 });
  });

  let globalSelectedSection = $state<string | null>(
    untrack(() => {
      const item = $userCart.currentCart.items.find(
        (item) => item.courseNo === course.courseNo,
      );
      return item ? String(item.sectionNo) : null;
    }),
  );

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

  $effect(() => {
    const triggerSection = globalSelectedSection;
    untrack(() => {
      const currentItem = $userCart.currentCart.items.find(
        (item) => item.courseNo === course.courseNo,
      );
      const currentSection = currentItem ? String(currentItem.sectionNo) : null;

      if (triggerSection === currentSection) return;

      if (triggerSection) {
        if (currentItem) {
          updateCourse(currentItem.id, { sectionNo: Number(triggerSection) });
        } else {
          addCourse(course.courseNo, Number(triggerSection));
        }
      } else if (currentItem) {
        removeCourse(currentItem.id);
      }
    });
  });

  function isMismatch() {
    if (!$userCart.currentCart || !$session.data) return false;
    return (
      String($userCart.currentCart.academicYear) !==
        String(course.academicYear) ||
      $userCart.currentCart.semester !== course.semester ||
      $userCart.currentCart.studyProgram !== course.studyProgram
    );
  }

  function handleSelectSection(section: any) {
    if (!$session.data) {
      loginPopupState.show = true;
      return;
    }

    if (isMismatch()) {
      pendingSection = section;
      showMismatchPopup = true;
      return;
    }
    globalSelectedSection = globalSelectedSection === section ? null : section;
  }

  function handlePopupConfirm(scheduleId: string) {
    $userCart.currentCartId = scheduleId;
    if (pendingSection) {
      globalSelectedSection = pendingSection;
    }
    showMismatchPopup = false;
    pendingSection = null;
  }
</script>

<svelte:window bind:innerWidth={screenWidth} />

<div class="relative flex h-full flex-col overflow-hidden bg-white">
  <div class="relative flex flex-1 overflow-hidden">
    <AppSidebar
      showSidebar={screenWidth >= 1024}
      panelWidth="490px"
      bind:expanded={sidebarExpanded}
      bind:openPanel
      bind:activePanel
    >
      {#snippet iconItems({ expanded })}
        <Sidebar.MenuItem>
          <div class="mt-[0px]">
            <Sidebar.MenuButton
              onclick={toggleSidebar}
              isActive={expanded && activePanel === 'sidebar'}
              size="lg"
              tooltipContent="เมนู"
              class="mx-auto size-12! justify-center rounded-xl p-0! ring-0 transition-all data-[active=true]:bg-[#E9EEF6] data-[active=true]:text-[#004494] [&>svg]:size-5!"
            >
              <Menu size="20" strokeWidth={2.5} />
            </Sidebar.MenuButton>
          </div>
        </Sidebar.MenuItem>
        <Sidebar.MenuItem>
          <div class="mt-[0px]">
            <Sidebar.MenuButton
              onclick={() => {
                activePanel = 'description_only';
                scrollToSection(descriptionSection);
              }}
              isActive={activePanel === 'description_only'}
              size="lg"
              tooltipContent="คำอธิบายรายวิชา"
              class="mx-auto size-12! justify-center rounded-xl p-0! transition-all data-[active=true]:bg-[#E9EEF6] data-[active=true]:text-[#004494] [&>svg]:size-5!"
            >
              <Book size="20" strokeWidth={2.5} />
            </Sidebar.MenuButton>
          </div>
        </Sidebar.MenuItem>
        <Sidebar.MenuItem>
          <div class="mt-[-12px]">
            <Sidebar.MenuButton
              onclick={() => {
                activePanel = 'detail_only';
                scrollToSection(detailSection);
              }}
              isActive={activePanel === 'detail_only'}
              size="lg"
              tooltipContent="รายละเอียดเซคชัน"
              class="mx-auto size-12! justify-center rounded-xl p-0! transition-all data-[active=true]:bg-[#E9EEF6] data-[active=true]:text-[#004494] [&>svg]:size-5!"
            >
              <StickyNote size="20" strokeWidth={2.5} />
            </Sidebar.MenuButton>
          </div>
        </Sidebar.MenuItem>
        <Sidebar.MenuItem>
          <div class="mt-[-12px]">
            <Sidebar.MenuButton
              onclick={() => {
                activePanel = 'review_only';
                scrollToSection(reviewSection);
              }}
              isActive={activePanel === 'review_only'}
              size="lg"
              tooltipContent="รีวิวรายวิชา"
              class="mx-auto size-12! justify-center rounded-xl p-0! transition-all data-[active=true]:bg-[#E9EEF6] data-[active=true]:text-[#004494] [&>svg]:size-5!"
            >
              <MessageCircleQuestionIcon size="20" strokeWidth={2.5} />
            </Sidebar.MenuButton>
          </div>
        </Sidebar.MenuItem>
        {#if $session.data}
          <Sidebar.MenuItem>
            <div class="mt-[-10px]">
              <Sidebar.MenuButton
                onclick={focusSelected}
                isActive={activePanel === 'selected_only'}
                size="lg"
                tooltipContent="วิชาที่เลือก"
                class="mx-auto size-12! justify-center rounded-xl p-0! transition-all data-[active=true]:bg-[#E9EEF6] data-[active=true]:text-[#004494] [&>svg]:size-5!"
              >
                <BookMarked size="20" strokeWidth={2.5} />
              </Sidebar.MenuButton>
            </div>
          </Sidebar.MenuItem>
        {/if}
      {/snippet}
      {#snippet panelContent({ openPanel, expanded })}
        {@const isLoggedIn = Boolean($session.data)}
        {#if (expanded || openPanel === 'sidebar') && isLoggedIn}
          <div
            bind:this={timetableSection}
            class="relative mb-6 flex flex-col gap-2"
          >
            <SelectTimetable
              options={$userCart.cartList?.map((item) => ({
                name: item.name,
                id: item.id,
              })) ?? []}
              bind:value={$userCart.currentCartId}
              semester={$userCart.currentCart.semester}
              semesterType={$userCart.currentCart.studyProgram}
              academicYear={$userCart.currentCart.academicYear}
            />
          </div>
          <hr class="mb-0 border-t border-neutral-100" />
        {/if}

        {#if expanded}
          <div class="text-on-surface mb-6 flex flex-col">
            <button
              type="button"
              class="hover:text-primary w-full border-b border-neutral-200 py-4 text-left text-xl font-semibold transition-colors"
              onclick={() => {
                activePanel = 'description_only';
                scrollToSection(descriptionSection);
              }}
            >
              คำอธิบายรายวิชา
            </button>

            <button
              type="button"
              class="hover:text-primary w-full border-b border-neutral-200 py-4 text-left text-xl font-semibold transition-colors"
              onclick={() => {
                activePanel = 'detail_only';
                scrollToSection(detailSection);
              }}
            >
              รายละเอียดเซคชัน
            </button>

            <div
              class="flex w-full items-center justify-between border-b border-neutral-200 py-3.5"
            >
              <button
                type="button"
                class="hover:text-primary text-left text-xl font-semibold transition-colors"
                onclick={() => {
                  activePanel = 'review_only';
                  scrollToSection(reviewSection);
                }}
              >
                รีวิวรายวิชา
                <span class="text-on-surface/50 ml-1 text-sm font-normal">
                  ({reviewCount} รีวิว)
                </span>
              </button>

              <button
                type="button"
                data-hidden={!isLoggedIn}
                class="flex items-center gap-1.5 rounded-xl bg-[#E9EEF6] px-3.5 py-1.5 text-sm font-medium text-[#004494] transition-all hover:bg-[#D2E0F5] data-[hidden=true]:hidden"
                onclick={() => {
                  scrollToSection(reviewSection);
                  setTimeout(() => reviewEditor?.focus(), 300);
                }}
              >
                เขียนรีวิว
                <Pencil size={14} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        {/if}

        {#if (expanded || openPanel === 'selected_only') && isLoggedIn}
          <div bind:this={selectedSection}>
            {#if $userCart.currentCart}
              <SelectedCourse
                variant="grouped"
                bind:open={selectedOpen}
                class="border-b border-neutral-100"
              />
            {:else}
              <SelectedCourse class="border-b border-neutral-100" />
            {/if}
          </div>
        {/if}

        {#if expanded || openPanel === 'sidebar'}
          <div
            class="border-secondary text-on-secondary-container mt-8 rounded-2xl border px-5 py-4 text-center text-xs/[18px]"
          >
            <span class="font-bold">CU Get Reg ไม่ใช่การลงทะเบียนเรียนจริง</span
            ><br />
            สามารถลงทะเบียนเรียนได้ที่
            <a
              href="https://www2.reg.chula.ac.th/"
              target="_blank"
              rel="noreferrer"
              class="underline">https://www2.reg.chula.ac.th/</a
            ><br />
            เพียงช่องทางเดียวเท่านั้น
          </div>
        {/if}
      {/snippet}
      <div class="flex min-h-full flex-col">
        <div class="px-6 py-6">
          <section class="text-on-surface mx-auto w-full max-w-5xl">
            <button
              type="button"
              class="mb-4 flex items-center justify-center gap-1 rounded-lg p-1 hover:bg-gray-100 active:bg-gray-200 lg:mb-1"
              onclick={() => history.back()}
            >
              <ChevronLeft size={18} strokeWidth={2.5} />
              <span
                class="translate-y-[-1px] text-sm font-normal text-[#353745]"
              >
                กลับ
              </span>
            </button>
            <div class="flex flex-wrap items-center gap-3">
              <div class="flex flex-col items-start gap-3">
                {#if ['SC', 'SO', 'HU', 'IN'].includes(course.genEdType)}
                  <GenedChip
                    type={course.genEdType as GenEdType}
                    class="px-3 py-1 text-xs md:hidden"
                  />
                {/if}
                <h1 class="text-primary text-h1 font-semibold">
                  {course.courseNo}
                  {course.courseInfo.abbrName}
                </h1>
              </div>
              {#if ['SC', 'SO', 'HU', 'IN'].includes(course.genEdType)}
                <GenedChip
                  type={course.genEdType as GenEdType}
                  class="hidden px-3 py-1 text-xs md:block"
                />
              {/if}
            </div>
            <div class="flex flex-wrap items-center gap-3 py-2">
              <StudyProgramChip
                type={course.studyProgram as 'S' | 'I' | 'T'}
                class="px-3 py-1 text-xs"
              />
              <YearSemesterChip
                year={course.academicYear}
                semester={course.semester as 'FIRST' | 'SECOND' | 'SUMMER'}
                class="px-3 py-1 text-xs"
              />
            </div>
            <p class="text-on-surface mt-2 text-sm font-semibold sm:text-lg">
              {course.courseInfo.courseNameTh}
            </p>
            <p class="text-on-surface text-sm font-semibold sm:text-lg">
              {course.courseInfo.courseNameEn}
            </p>
            <div
              class="mt-5 flex items-start gap-2 bg-amber-50 px-3 py-2 text-sm"
            >
              <AlertTriangle size={16} class="mt-0.5 text-amber-900" />
              <span class="font-sans text-neutral-900">
                ข้อมูลคำอธิบายรายวิชาที่แสดงไม่ได้เป็นข้อมูลล่าสุด
                อาจมีการเปลี่ยนแปลงได้ โปรดตรวจสอบกับรายวิชาที่จัดอีกครั้ง
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
                    คำอธิบายรายวิชา (ภาษาไทย)
                  </p>
                </div>
                <p class="text-on-surface font-sarabun text-body2 mt-3 px-4">
                  {course.courseInfo.courseDescTh}
                </p>
              </div>
              <div>
                <div class="bg-surface-container-lowest rounded-full">
                  <p
                    class="text-primary px-4 py-1 text-xs font-medium sm:text-base"
                  >
                    คำอธิบายรายวิชา (ภาษาอังกฤษ)
                  </p>
                </div>
                <p class="text-on-surface font-sarabun text-body2 mt-3 px-4">
                  {course.courseInfo.courseDescEn}
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
                    คำอธิบายรายวิชา (ภาษาไทย)
                  </p>
                  <p
                    class="text-primary px-4 py-1 text-left text-xs font-medium sm:text-base"
                  >
                    คำอธิบายรายวิชา (ภาษาอังกฤษ)
                  </p>
                </div>
              </div>
              <div>
                <p class="text-on-surface font-sarabun text-body2 mt-3 px-4">
                  {course.courseInfo.courseDescTh}
                </p>
              </div>
              <div>
                <p class="text-on-surface font-sarabun text-body2 mt-3 px-4">
                  {course.courseInfo.courseDescEn}
                </p>
              </div>
            </div>

            <div class="mt-6 grid gap-6 md:hidden">
              <div>
                <div class="bg-surface-container-lowest rounded-full">
                  <p
                    class="text-primary px-4 py-1 text-xs font-medium sm:text-base"
                  >
                    คณะ
                  </p>
                </div>
                <p class="text-on-surface font-sarabun text-body2 mt-3 px-4">
                  {faculties[course.courseInfo.faculty ?? '']?.th ?? '-'}
                </p>
              </div>
              <div>
                <div class="bg-surface-container-lowest rounded-full">
                  <p
                    class="text-primary px-4 py-1 text-xs font-medium sm:text-base"
                  >
                    ภาควิชา/กลุ่มวิชา/สาขาวิชา
                  </p>
                </div>
                <p class="text-on-surface font-sarabun text-body2 mt-3 px-4">
                  {course.courseInfo.department}
                </p>
              </div>
            </div>

            <div class="mt-6 hidden md:grid md:grid-cols-2 md:gap-0">
              <div class="md:col-span-2">
                <div
                  class="bg-surface-container-lowest grid rounded-full md:grid-cols-2"
                >
                  <p
                    class="text-primary px-4 py-1 text-left text-xs font-medium sm:text-base"
                  >
                    คณะ
                  </p>
                  <p
                    class="text-primary px-4 py-1 text-left text-xs font-medium sm:text-base"
                  >
                    ภาควิชา/กลุ่มวิชา/สาขาวิชา
                  </p>
                </div>
              </div>
              <div>
                <p class="text-on-surface font-sarabun text-body2 mt-3 px-4">
                  {faculties[course.courseInfo.faculty ?? '']?.th ?? '-'}
                </p>
              </div>
              <div>
                <p class="text-on-surface font-sarabun text-body2 mt-3 px-4">
                  {course.courseInfo.department}
                </p>
              </div>
            </div>

            <div class="mt-6 grid gap-6 md:hidden">
              <div>
                <div class="bg-surface-container-lowest rounded-full">
                  <p
                    class="text-primary px-4 py-1 text-xs font-medium sm:text-base"
                  >
                    รูปแบบรายวิชา
                  </p>
                </div>
                <p class="text-on-surface font-sarabun text-body2 mt-3 px-4">
                  {course.courseInfo.creditHours?.split(' ') ?? '-'}
                </p>
              </div>
              <div>
                <div class="bg-surface-container-lowest rounded-full">
                  <p
                    class="text-primary px-4 py-1 text-xs font-medium sm:text-base"
                  >
                    หน่วยกิต
                  </p>
                </div>
                <p class="text-on-surface font-sarabun text-body2 mt-3 px-4">
                  {course.courseInfo.credit}
                </p>
              </div>
            </div>

            <div class="mt-6 hidden md:grid md:grid-cols-2 md:gap-0">
              <div class="md:col-span-2">
                <div
                  class="bg-surface-container-lowest grid rounded-full md:grid-cols-2"
                >
                  <p
                    class="text-primary px-4 py-1 text-left text-xs font-medium sm:text-base"
                  >
                    รูปแบบรายวิชา
                  </p>
                  <p
                    class="text-primary px-4 py-1 text-left text-xs font-medium sm:text-base"
                  >
                    หน่วยกิต
                  </p>
                </div>
              </div>
              <div>
                <p class="text-on-surface font-sarabun text-body2 mt-3 px-4">
                  {course.courseInfo.creditHours?.split(' ') ?? '-'}
                </p>
              </div>
              <div>
                <p class="text-on-surface font-sarabun text-body2 mt-3 px-4">
                  {course.courseInfo.credit}
                </p>
              </div>
            </div>

            <div class="mt-6 grid gap-6 md:hidden">
              <div>
                <div class="bg-surface-container-lowest rounded-full">
                  <p
                    class="text-primary px-4 py-1 text-xs font-medium sm:text-base"
                  >
                    เงื่อนไขรายวิชา
                  </p>
                </div>
                <p class="text-on-surface font-sarabun text-body2 mt-3 px-4">
                  -
                </p>
              </div>
              <div>
                <div class="bg-surface-container-lowest rounded-full">
                  <p
                    class="text-primary px-4 py-1 text-xs font-medium sm:text-base"
                  >
                    วิธีการวัดผล
                  </p>
                </div>
                <p class="text-on-surface font-sarabun text-body2 mt-3 px-4">
                  Letter Grade
                </p>
              </div>
            </div>

            <div class="mt-6 hidden md:grid md:grid-cols-2 md:gap-0">
              <div class="md:col-span-2">
                <div
                  class="bg-surface-container-lowest grid rounded-full md:grid-cols-2"
                >
                  <p
                    class="text-primary px-4 py-1 text-left text-xs font-medium sm:text-base"
                  >
                    เงื่อนไขรายวิชา
                  </p>
                  <p
                    class="text-primary px-4 py-1 text-left text-xs font-medium sm:text-base"
                  >
                    วิธีการวัดผล
                  </p>
                </div>
              </div>
              <div>
                <p class="text-on-surface font-sarabun text-body2 mt-3 px-4">
                  -
                </p>
              </div>
              <div>
                <p class="text-on-surface font-sarabun text-body2 mt-3 px-4">
                  Letter Grade
                </p>
              </div>
            </div>

            <div class="mt-6 grid gap-6 md:hidden">
              <div>
                <div class="bg-surface-container-lowest rounded-full">
                  <p
                    class="text-primary px-4 py-1 text-xs font-medium sm:text-base"
                  >
                    สอบกลางภาค
                  </p>
                </div>
                <p class="text-on-surface font-sarabun text-body2 mt-3 px-4">
                  {midtermExam}
                </p>
              </div>
              <div>
                <div class="bg-surface-container-lowest rounded-full">
                  <p
                    class="text-primary px-4 py-1 text-xs font-medium sm:text-base"
                  >
                    สอบปลายภาค
                  </p>
                </div>
                <p class="text-on-surface font-sarabun text-body2 mt-3 px-4">
                  {finalExam}
                </p>
              </div>
            </div>

            <div class="mt-6 hidden md:grid md:grid-cols-2 md:gap-0">
              <div class="md:col-span-2">
                <div
                  class="bg-surface-container-lowest grid rounded-full md:grid-cols-2"
                >
                  <p
                    class="text-primary px-4 py-1 text-left text-xs font-medium sm:text-base"
                  >
                    สอบกลางภาค
                  </p>
                  <p
                    class="text-primary px-4 py-1 text-left text-xs font-medium sm:text-base"
                  >
                    สอบปลายภาค
                  </p>
                </div>
              </div>
              <div>
                <p class="text-on-surface font-sarabun text-body2 mt-3 px-4">
                  {midtermExam}
                </p>
              </div>
              <div>
                <p class="text-on-surface font-sarabun text-body2 mt-3 px-4">
                  {finalExam}
                </p>
              </div>
            </div>
          </section>
          <section
            class="text-on-surface mx-auto mt-8 w-full max-w-5xl"
            bind:this={detailSection}
          >
            <h2 class="text-on-surface text-base font-semibold sm:text-2xl">
              รายละเอียดเซคชัน
            </h2>
            <Accordion.Root
              type="multiple"
              value={Object.keys(sectionGroups)}
              class="mt-4 flex flex-col gap-4"
            >
              {#each Object.keys(sectionGroups) as groupName (groupName)}
                <Accordion.Item
                  value={groupName}
                  class="rounded-2xl border border-[#D6D7E1] bg-white px-4 py-2 md:px-6"
                >
                  <Accordion.Trigger class="hover:no-underline">
                    <div
                      class="flex items-center gap-2 text-xs font-medium text-[#4A70C6] sm:text-base"
                    >
                      <Check size={16} />
                      <span>กลุ่ม : {groupName}</span>
                    </div>
                  </Accordion.Trigger>
                  <Accordion.Content>
                    <div class="w-full md:hidden">
                      <SectionTable
                        tableData={sectionGroups[groupName]}
                        boxed={true}
                        class="w-full"
                        selectedSection={globalSelectedSection}
                        onSelectSection={handleSelectSection}
                      />
                    </div>

                    <div class="hidden w-full md:block">
                      <SectionTable
                        tableData={sectionGroups[groupName]}
                        boxed={false}
                        class="w-full"
                        selectedSection={globalSelectedSection}
                        onSelectSection={handleSelectSection}
                      />
                    </div>
                  </Accordion.Content>
                </Accordion.Item>
              {/each}
            </Accordion.Root>
          </section>

          {#if showMismatchPopup}
            <ScheduleMismatchPopup
              schedules={$userCart.cartList ?? []}
              expectedYear={String(course.academicYear)}
              expectedProgram={course.studyProgram}
              bind:currentScheduleId={$userCart.currentCartId}
              expectedSemester={course.semester}
              onConfirm={handlePopupConfirm}
              onClose={() => (showMismatchPopup = false)}
            />
          {/if}

          {#if $session.data}
            <section
              class="text-on-surface mx-auto mt-10 w-full max-w-5xl"
              bind:this={reviewSection}
            >
              <div class="flex items-center justify-between">
                <h2 class="text-on-surface text-base font-semibold sm:text-2xl">
                  เขียนรีวิวรายวิชา
                </h2>
              </div>
              <div
                class="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:gap-5"
              >
                <div
                  class="flex w-full flex-row items-center justify-between gap-5 md:w-fit md:justify-start"
                >
                  <p class="shrink-0 text-sm font-normal md:hidden">ภาคเรียน</p>
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
                    <div>
                      <Select.Root
                        type="single"
                        value={writeReviewSectionNo ?? ''}
                        onValueChange={(v) => (writeReviewSectionNo = v)}
                        disabled={writeReviewSectionOptions.length === 0}
                      >
                        <Select.Trigger
                          class="text-on-surface h-9 w-[120px] rounded-lg border border-[#D6D7E1] bg-white px-4 text-sm font-medium md:h-12 md:w-[180px] md:text-base"
                        >
                          {writeReviewSectionNo
                            ? `เซค ${writeReviewSectionNo}`
                            : 'ไม่มีเซค'}
                        </Select.Trigger>
                        <Select.Content role="listbox">
                          <Select.Group>
                            {#each writeReviewSectionOptions as sectionNo (sectionNo)}
                              <Select.Item
                                value={String(sectionNo)}
                                label={`เซค ${sectionNo}`}
                              />
                            {/each}
                          </Select.Group>
                        </Select.Content>
                      </Select.Root>
                    </div>
                  </div>
                </div>
                <div class="flex items-center justify-between gap-8">
                  <p class="text-sm font-normal md:hidden">ให้คะแนนรายวิชา</p>
                  <div class="flex gap-2 md:gap-0">
                    {#each [1, 2, 3, 4, 5] as value (value)}
                      <button
                        class="flex h-10 w-6 items-center justify-center md:w-10"
                        type="button"
                        onclick={(event) => onStarClick(value, event)}
                        aria-label={`Rate ${value} stars`}
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
              <div class="mt-4">
                <MarkdownEditor
                  bind:this={reviewEditor}
                  bind:value={reviewContent}
                  placeholder="คุณคิดว่าวิชานี้เป็นอย่างไรบ้าง?"
                />
              </div>
              <div class="mt-4 flex justify-end">
                <Button
                  size="sm"
                  variant="solid"
                  color="secondary"
                  class="bg-primary-container text-primary hover:ring-primary-container w-full gap-2 md:w-auto"
                  onclick={handleSubmitReview}
                  disabled={reviewSubmitting}
                >
                  {reviewSubmitting ? 'กำลังส่ง...' : 'ส่งรีวิว'}
                  <Send size={14} />
                </Button>
              </div>
            </section>
          {/if}

          <section class="text-on-surface mx-auto mt-8 w-full max-w-5xl">
            <div
              class="flex flex-col justify-between gap-4 md:flex-row md:items-center"
            >
              <div class="text-base font-semibold sm:text-2xl">
                <span class="text-on-surface/60">ทั้งหมด </span>
                <span class="text-primary">{reviewCount} รีวิว</span>
              </div>
              <div class="flex flex-nowrap items-center gap-3">
                <Select.Root
                  type="single"
                  bind:value={() => selectedReviewYear, setSelectedReviewYear}
                >
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
                <Select.Root
                  type="single"
                  bind:value={
                    () => selectedReviewSemester ?? reviewSemesterPlaceholder,
                    setSelectedReviewSemester
                  }
                >
                  <Select.Trigger
                    class={`h-9 w-[120px] rounded-xl px-4 text-sm ${
                      isReviewSemesterPlaceholder
                        ? 'text-on-surface/60'
                        : 'text-on-surface'
                    }`}
                  >
                    {selectedReviewSemester
                      ? SEMESTER_LABEL_LONG[selectedReviewSemester]
                      : reviewSemesterPlaceholder}
                  </Select.Trigger>
                  <Select.Content role="listbox">
                    <Select.Group>
                      <Select.Item
                        value={reviewSemesterPlaceholder}
                        label={reviewSemesterPlaceholder}
                      />
                      {#each reviewSemesterOptions as semester (semester)}
                        <Select.Item
                          value={semester}
                          label={SEMESTER_LABEL_LONG[semester]}
                        />
                      {/each}
                    </Select.Group>
                  </Select.Content>
                </Select.Root>
                <Select.Root
                  type="single"
                  bind:value={
                    () =>
                      selectedReviewSection !== null
                        ? String(selectedReviewSection)
                        : reviewSectionPlaceholder,
                    setSelectedReviewSection
                  }
                >
                  <Select.Trigger
                    class={`h-9 w-[120px] rounded-xl px-4 text-sm ${
                      isReviewSectionPlaceholder
                        ? 'text-on-surface/60'
                        : 'text-on-surface'
                    }`}
                  >
                    {selectedReviewSection !== null
                      ? `เซค ${selectedReviewSection}`
                      : reviewSectionPlaceholder}
                  </Select.Trigger>
                  <Select.Content role="listbox">
                    <Select.Group>
                      <Select.Item
                        value={reviewSectionPlaceholder}
                        label={reviewSectionPlaceholder}
                      />
                      {#each reviewSectionOptions as sectionNo (sectionNo)}
                        <Select.Item
                          value={String(sectionNo)}
                          label={`เซค ${sectionNo}`}
                        />
                      {/each}
                    </Select.Group>
                  </Select.Content>
                </Select.Root>
              </div>
            </div>
            {#if reviewsLoading}
              <div
                class="text-on-surface/70 mt-12 flex items-center justify-center gap-3 py-12"
                aria-live="polite"
              >
                <Loader2 class="animate-spin" size={24} />
                กำลังโหลดรีวิว...
              </div>
            {:else if reviewsError}
              <div
                class="mt-12 flex flex-col items-center justify-center gap-4 py-12 text-center"
                role="alert"
              >
                <AlertTriangle size={48} class="text-orange-500" />
                <p class="text-on-surface/70">ไม่สามารถโหลดรีวิวได้</p>
                <Button
                  size="sm"
                  variant="outlined"
                  onclick={() =>
                    refreshReviews({ includeFacets: true, targetPage: 1 })}
                >
                  ลองใหม่
                </Button>
              </div>
            {:else if reviews.length === 0}
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
                  เริ่มแบ่งปันเป็นคนแรก
                </div>
                <p class="text-on-surface/70 max-w-lg text-sm">
                  เริ่มเป็นคนแรกที่จะแบ่งปันประสบการณ์ที่น่าสนใจกับวิชานี้ให้กับเพื่อน
                  ๆ
                </p>
              </div>
            {:else}
              <div class="mt-6 flex flex-col gap-6">
                {#each reviews as review (review.id)}
                  {@const faculty = review.user.faculty ?? ''}
                  {@const department = review.user.department ?? ''}
                  {@const affiliation = `${faculty} ${department}`.trim()}
                  <Comment
                    rating={review.rating / 2}
                    semester={SEMESTER_LABEL_LONG[review.semester]}
                    year={review.academicYear}
                    section={review.sectionNo}
                    content={review.content}
                    likesCount={review.stats.likeCount}
                    dislikesCount={review.stats.dislikeCount}
                    status={review.status}
                    facultyMajor={affiliation || undefined}
                    onLike={() => handleReactReview(review.id, 'L')}
                    onDislike={() => handleReactReview(review.id, 'D')}
                    reaction={review.reaction}
                    onEdit={() => handleEditReview(review)}
                    onDelete={() => handleDeleteReview(review.id)}
                  />
                {/each}
              </div>
              <div
                class="mt-6 flex justify-end"
                class:hidden={totalReviewPages <= 1}
              >
                <nav class="flex items-center gap-2" aria-label="Pagination">
                  <button
                    class="border-surface-container-high bg-surface text-on-surface flex h-9 w-9 items-center justify-center rounded-lg border disabled:cursor-not-allowed disabled:opacity-50"
                    type="button"
                    aria-label="Previous page"
                    disabled={reviewsPage === 1}
                    onclick={() => setReviewsPage(Math.max(1, reviewsPage - 1))}
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
                        onclick={() => setReviewsPage(item)}
                      >
                        {item}
                      </button>
                    {/if}
                  {/each}
                  <button
                    class="border-surface-container-high bg-surface text-on-surface flex h-9 w-9 items-center justify-center rounded-lg border disabled:cursor-not-allowed disabled:opacity-50"
                    type="button"
                    aria-label="Next page"
                    disabled={reviewsPage === totalReviewPages}
                    onclick={() =>
                      setReviewsPage(
                        Math.min(totalReviewPages, reviewsPage + 1),
                      )}
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
    </AppSidebar>
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

{#snippet SelectedContent()}
  <div bind:this={selectedSection}>
    {#if $userCart.currentCart}
      <SelectedCourse
        variant="grouped"
        collapsible={false}
        class="border-b border-neutral-100"
      />
    {:else}
      <SelectedCourse collapsible={false} class="border-b border-neutral-100" />
    {/if}
  </div>
{/snippet}

{#snippet WarningContent()}
  <div
    class="border-secondary text-on-secondary-container mt-8 rounded-2xl border px-5 py-4 text-center text-xs/[18px]"
  >
    <span class="font-bold">CU Get Reg ไม่ใช่การลงทะเบียนเรียนจริง</span><br />
    สามารถลงทะเบียนเรียนได้ที่
    <a
      href="https://www2.reg.chula.ac.th/"
      target="_blank"
      rel="noreferrer"
      class="underline"
    >
      https://www2.reg.chula.ac.th/
    </a><br />
    เพียงช่องทางเดียวเท่านั้น
  </div>
{/snippet}
