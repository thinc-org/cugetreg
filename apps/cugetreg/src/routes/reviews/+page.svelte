<script lang="ts">
  import { goto } from '$app/navigation';
  import { resolve } from '$app/paths';
  import { api } from '$lib/api';
  import { GOOGLE_FORM_URL } from '$lib/constants';
  import { SEMESTER_LABEL_LONG } from '$lib/semesterOptions';

  import {
    AlertTriangle,
    ChevronLeft,
    Loader2,
    NotebookPen,
  } from '@lucide/svelte';
  import { isAxiosError } from 'axios';
  import { onMount } from 'svelte';
  import toast from 'svelte-french-toast';

  import { Button } from '@cugetreg/ui/atoms/button';
  import { GenedChip } from '@cugetreg/ui/atoms/gened-chip';
  import { Modal } from '@cugetreg/ui/atoms/modal';
  import { Comment } from '@cugetreg/ui/molecules/comment';
  import { ConfirmDeleteReview } from '@cugetreg/ui/molecules/confirm-delete-review';
  import { ReportProblem } from '@cugetreg/ui/molecules/report-problem';
  import * as Select from '@cugetreg/ui/molecules/select';
  import { Footer } from '@cugetreg/ui/organisms/footer';
  import type { GenEdType } from '@cugetreg/utils/types';
  import {
    type ReviewSchema,
    type ReviewSortBy,
    type SortOrder,
    UserReviewResponseSchema,
    VoteReviewResponseSchema,
  } from '@cugetreg/zod-schemas';

  const reviewsPerPage = 5;

  const reviewSortOptions: { field: ReviewSortBy; label: string }[] = [
    { field: 'DATE_CREATE', label: 'วันที่แสดงความคิดเห็น' },
    { field: 'RATING', label: 'คะแนน' },
    { field: 'NAME', label: 'ชื่อวิชา' },
  ];

  let reviews = $state<ReviewSchema[]>([]);
  let totalReviews = $state(0);
  let reviewsPage = $state(1);
  let reviewsLoading = $state(false);
  let reviewsError = $state(false);
  let reviewsRequestId = 0;
  let pendingReviewVotes = $state<string[]>([]);
  let deletingReviewId = $state<string | null>(null);
  let reviewDeleting = $state(false);
  let reviewSortBy = $state<ReviewSortBy>('DATE_CREATE');
  let reviewSortOrder = $state<SortOrder>('desc');

  const reviewSortByLabel = $derived(
    reviewSortOptions.find((option) => option.field === reviewSortBy)
      ?.label ?? '',
  );

  const totalReviewPages = $derived(
    Math.max(1, Math.ceil(totalReviews / reviewsPerPage)),
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

  async function fetchReviews(targetPage: number) {
    const requestId = ++reviewsRequestId;
    reviewsLoading = true;
    reviewsError = false;

    try {
      const response = await api.get('/user/reviews', {
        params: {
          page: targetPage,
          limit: reviewsPerPage,
          includeVote: true,
          sortBy: reviewSortBy,
          sortOrder: reviewSortOrder,
        },
      });
      const result = UserReviewResponseSchema.parse(response.data);

      if (requestId !== reviewsRequestId) return;

      reviews = result.reviews;
      totalReviews = result.totalReviews;
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
    void fetchReviews(targetPage);
  }

  function setReviewSortBy(sortBy: ReviewSortBy) {
    if (sortBy === reviewSortBy || reviewsLoading) return;
    reviewSortBy = sortBy;
    void fetchReviews(1);
  }

  function toggleReviewSortOrder() {
    if (reviewsLoading) return;
    reviewSortOrder = reviewSortOrder === 'asc' ? 'desc' : 'asc';
    void fetchReviews(1);
  }

  async function handleReactReview(reviewId: string, interaction: 'L' | 'D') {
    if (pendingReviewVotes.includes(reviewId)) return;
    pendingReviewVotes = [...pendingReviewVotes, reviewId];

    try {
      const response = await api.patch(`/reviews/react/${reviewId}`, {
        interaction,
      });
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
          stats: { likeCount, dislikeCount },
        });
      }
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.status === 401) {
          toast.error('Please login before doing this action', {
            position: 'bottom-right',
          });
        } else if (error.status === 409) {
          toast.error('ไม่สามารถ Like/Dislike รีวิวที่ยังไม่ถูกอนุมัติ', {
            position: 'bottom-right',
          });
        } else {
          toast.error('Something went wrong', {
            position: 'bottom-right',
          });
        }
        return;
      }
      console.error(error);
      toast.error('Something went wrong', { position: 'bottom-right' });
    } finally {
      pendingReviewVotes = pendingReviewVotes.filter((id) => id !== reviewId);
    }
  }

  function handleEditReview(review: ReviewSchema) {
    const params = new URLSearchParams({
      academicYear: String(review.academicYear),
      semester: review.semester,
      studyProgram: review.studyProgram,
    });
    goto(resolve(`/course-page/${review.courseNo}?${params.toString()}`));
  }

  function requestDeleteReview(reviewId: string) {
    deletingReviewId = reviewId;
  }

  async function confirmDeleteReview() {
    const reviewId = deletingReviewId;
    if (!reviewId || reviewDeleting) return;
    reviewDeleting = true;

    try {
      await api.delete(`/reviews/${reviewId}`);
      deletingReviewId = null;
      await fetchReviews(reviewsPage);
      toast.success('ลบรีวิวสำเร็จ', { position: 'bottom-right' });
    } catch (error) {
      console.error(error);
      toast.error('ไม่สามารถลบรีวิวได้', { position: 'bottom-right' });
    } finally {
      reviewDeleting = false;
    }
  }

  onMount(() => {
    fetchReviews(1);
  });
</script>

<div class="relative flex min-h-screen flex-col bg-white">
  <div class="container mx-auto w-full max-w-5xl flex-1 px-5 py-8 sm:px-8">
    <button
      type="button"
      class="mb-2 flex items-center justify-center gap-1 rounded-lg p-1 transition-colors hover:bg-gray-100 active:bg-gray-200 lg:mb-4"
      onclick={() => history.back()}
    >
      <ChevronLeft size={18} strokeWidth={2.5} />
      <span class="translate-y-[-1px] text-sm font-normal text-[#353745]">
        กลับ
      </span>
    </button>

    <div class="flex flex-wrap items-center justify-between gap-3">
      <h1 class="text-on-surface text-base font-semibold sm:text-3xl">
        กิจกรรมทั้งหมด
      </h1>

      <div class="flex shrink-0 items-center gap-4 text-gray-400">
        <h2 class="font-semibold text-sm whitespace-nowrap">
          จัดลำดับตาม
        </h2>
        <Select.Root
          type="single"
          value={reviewSortBy}
          onValueChange={(v) => setReviewSortBy(v as ReviewSortBy)}
        >
          <Select.Trigger
            class="h-10 min-w-42.5 justify-between rounded-xl border-0 bg-[#F1F3F7] px-4 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
          >
            {reviewSortByLabel}
          </Select.Trigger>
          <Select.Content align="end">
            <Select.Group>
              {#each reviewSortOptions as option (option.field)}
                <Select.Item
                  value={option.field}
                  label={option.label}
                  role="option"
                />
              {/each}
            </Select.Group>
          </Select.Content>
        </Select.Root>
        <button
          type="button"
          aria-label={reviewSortOrder === 'asc'
            ? 'เรียงจากน้อยไปมาก'
            : 'เรียงจากมากไปน้อย'}
          onclick={toggleReviewSortOrder}
          class="border-surface-container-high bg-surface text-on-surface flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border transition-colors hover:bg-gray-50"
        >
          <div
            class="text-primary transition-transform duration-300 {reviewSortOrder ===
            'asc'
              ? 'rotate-180'
              : 'rotate-0'}"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              ><path d="M12 5v14M19 12l-7 7-7-7" /></svg
            >
          </div>
        </button>
      </div>
    </div>

    {#if reviewsLoading && reviews.length === 0}
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
          onclick={() => fetchReviews(reviewsPage)}
        >
          ลองใหม่
        </Button>
      </div>
    {:else if reviews.length === 0}
      <div
        class="mt-12 flex flex-col items-center justify-center gap-4 py-12 text-center"
      >
        <NotebookPen size={140} strokeWidth={2.2} class="text-[#4A70C6]" />
        <div class="text-on-surface text-base font-semibold sm:text-2xl">
          คุณยังไม่มีรีวิว
        </div>
        <p class="text-on-surface/70 max-w-lg text-sm">
          เริ่มเขียนรีวิวแรกของคุณเพื่อแบ่งปันประสบการณ์ที่น่าสนใจกับวิชานั้น
          ๆ ให้กับเพื่อน ๆ
        </p>
      </div>
    {:else}
      <div class="mt-6 flex flex-col gap-6">
        {#each reviews as review (review.id)}
          {@const courseSearchParams = new URLSearchParams({
            "studyProgram" : review.studyProgram as string,
            "academicYear" : review.academicYear.toString(),
            "semester" : review.semester as string,
          })}
          <div class="flex flex-col gap-3">
            <Comment
              course={`${review.courseNo} ${review.courseAbbrName}`}
              redirectTo={`/course-page/${review.courseNo}?${courseSearchParams.toString()}`}
              genEdType={review.genEdType as GenEdType}
              rating={review.rating / 2}
              semester={SEMESTER_LABEL_LONG[review.semester]}
              year={review.academicYear}
              section={review.sectionNo}
              content={review.content}
              likesCount={review.stats?.likeCount ?? 0}
              dislikesCount={review.stats?.dislikeCount ?? 0}
              status={review.status}
              isOwner
              reaction={review.reaction}
              onLike={() => handleReactReview(review.id, 'L')}
              onDislike={() => handleReactReview(review.id, 'D')}
              onEdit={() => handleEditReview(review)}
              onDelete={() => requestDeleteReview(review.id)}
            />
          </div>
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
              setReviewsPage(Math.min(totalReviewPages, reviewsPage + 1))}
          >
            ›
          </button>
        </nav>
      </div>
    {/if}
  </div>

  <div class="mt-auto w-full border-t bg-white">
    <Footer />
  </div>

  <Modal
    exitOnEsc
    exitOnBackgroundClick
    centered
    dim
    bind:show={
      () => deletingReviewId !== null,
      (show) => {
        if (!show && !reviewDeleting) deletingReviewId = null;
      }
    }
  >
    <ConfirmDeleteReview
      loading={reviewDeleting}
      onCancel={() => {
        if (!reviewDeleting) deletingReviewId = null;
      }}
      onConfirm={confirmDeleteReview}
    />
  </Modal>

  <ReportProblem href={GOOGLE_FORM_URL} />
</div>
