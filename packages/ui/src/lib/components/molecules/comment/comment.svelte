<script lang="ts">
	import StatusChip from '$lib/components/atoms/status-chip/status-chip.svelte';

	import { Pencil, ThumbsDown, ThumbsUp, Trash2 } from '@lucide/svelte';
	import DOMPurify from 'isomorphic-dompurify';
	import { marked } from 'marked';

	import { GenedChip } from '@cugetreg/ui/atoms/gened-chip';
	import type { GenEdType } from '@cugetreg/utils/types';

	import { RatingStar } from '../../atoms/rating-star';

	interface CommentProps {
		course?: string;
		redirectTo: string;
		genEdType?: GenEdType;
		content: string;
		semester: string;
		year: number;
		section?: number | null;
		rating: number;
		likesCount: number;
		dislikesCount: number;
		facultyMajor?: string;
		reaction?: 'L' | 'D';
		status: 'REJECTED' | 'PENDING' | 'APPROVED';
		/** Whether the review belongs to the current user. */
		isOwner?: boolean;

		onLike: () => void;
		onDislike: () => void;
		onEdit?: () => void;
		onDelete?: () => void;
	}

	let {
		course,
		redirectTo,
		genEdType,
		content,
		semester,
		year,
		section,
		rating,
		likesCount,
		dislikesCount,
		facultyMajor,
		status,
		isOwner = false,

		reaction,

		onLike,
		onDislike,
		onEdit,
		onDelete
	}: CommentProps = $props();

	// Owners can remove their review whatever its moderation status; editing
	// only makes sense once it has been rejected.
	const canDelete = $derived(isOwner && Boolean(onDelete));
	const canEdit = $derived(isOwner && status === 'REJECTED' && Boolean(onEdit));
	let hasHalfStar: boolean = $derived(rating % 1 !== 0); // Determine if there's a half star
	let isExpanded: boolean = $state(false);

	// Reviews are stored as markdown. Render to HTML with marked, then sanitize
	// with DOMPurify (allowlist of formatting tags only) so user-authored content
	// — including the underline <u> that tiptap-markdown emits — is shown safely.
	const renderedContent = $derived(
		DOMPurify.sanitize(marked.parse(content, { async: false, gfm: true, breaks: true }) as string, {
			ALLOWED_TAGS: [
				'p',
				'br',
				'strong',
				'em',
				'del',
				's',
				'u',
				'code',
				'pre',
				'blockquote',
				'ul',
				'ol',
				'li',
				'h1',
				'h2',
				'h3',
				'h4',
				'h5',
				'h6',
				'a',
				'hr'
			],
			ALLOWED_ATTR: ['href']
		})
	);
</script>

<div
	class="border-surface-container box-border flex h-[320px] w-full flex-col gap-y-2 rounded-xl border px-6 py-5 lg:h-auto lg:gap-y-4
  lg:px-12 lg:py-10"
	class:h-auto={isExpanded}
>
	{#if course}
		{@const showGenedChip = ['SC', 'SO', 'HU', 'IN', 'GENED'].includes(genEdType ?? 'NO')}
		<div class="flex flex-row items-center justify-between">
			<div class="flex flex-wrap items-center justify-start gap-4">
				<a
					href={course ? redirectTo : undefined}
					class="text-primary sm:text-h3 flex flex-row justify-center text-lg font-bold hover:underline"
				>
					{course}
				</a>
				{#if showGenedChip}
					<GenedChip type={genEdType} class="px-3 py-1 text-xs" />
				{/if}
			</div>
			<div class={status === 'APPROVED' ? 'hidden' : ''}>
				<StatusChip variant={status} class="px-3 py-1 text-xs" />
			</div>
		</div>
	{/if}
	<div class="flex flex-row items-center justify-between">
		<div class="flex flex-row items-center gap-x-6">
			<div class="text-h3 text-primary font-bold">
				{#if !hasHalfStar}
					<span>{rating}.0</span>
				{:else}
					<span>{rating}</span>
				{/if}
			</div>

			<RatingStar {rating} />

			<div class="text-subtitle font-sans font-medium">
				{semester}
				{year}
				{#if section}
					Section {section}
				{/if}
			</div>
		</div>

		{#if !course}
			<div class={status === 'APPROVED' ? 'hidden' : ''}>
				<StatusChip variant={status} />
			</div>
		{/if}
	</div>

	<div
		class="flex flex-col gap-2 lg:h-auto lg:flex-none lg:overflow-visible"
		class:h-[220px]={!isExpanded}
		class:h-auto={isExpanded}
	>
		{#if facultyMajor}
			<div class="text-on-surface/60 text-body2 font-sans">
				{facultyMajor}
			</div>
		{/if}

		<div
			class="h-full w-full flex-1 lg:h-auto lg:overflow-visible"
			class:overflow-hidden={!isExpanded}
		>
			<div
				class="prose prose-sm text-body2 font-sarabun text-on-surface prose-headings:font-sarabun prose-headings:text-on-surface prose-headings:mt-2 prose-headings:mb-1 prose-headings:text-base prose-p:my-1 prose-strong:text-on-surface w-full max-w-none"
			>
				<!-- eslint-disable-next-line svelte/no-at-html-tags -- content is sanitized with DOMPurify above -->
				{@html renderedContent}
			</div>
		</div>

		<div class="mt-auto flex flex-col gap-4">
			<!-- Button to toggle view -->
			<button
				class="text-button1 text-primary self-start underline lg:hidden"
				onclick={() => (isExpanded = !isExpanded)}
			>
				{#if isExpanded}
					ดูน้อยลง
				{:else}
					ดูเพิ่มเติม
				{/if}
			</button>
		</div>
	</div>
	<div class="text-subtitle flex w-full flex-row items-center justify-between font-sans">
		<div class="flex flex-row gap-6">
			<div class="flex flex-row gap-x-2 font-medium">
				<button class="hover:cursor-pointer" onclick={onLike}>
					<ThumbsUp
						data-fill={reaction === 'L'}
						class="text-neutral-400 data-[fill=true]:fill-neutral-400"
					/>
				</button>
				{likesCount}
			</div>
			<div class="flex flex-row gap-x-2 font-medium">
				<button class="hover:cursor-pointer" onclick={onDislike}>
					<ThumbsDown
						data-fill={reaction === 'D'}
						class="text-neutral-400 data-[fill=true]:fill-neutral-400"
					/>
				</button>
				{dislikesCount}
			</div>
		</div>
		{#if canDelete || canEdit}
			<div class="flex flex-row items-center gap-3">
				{#if canDelete}
					<button
						class="rounded-md p-1 transition-colors hover:cursor-pointer hover:bg-red-50"
						aria-label="Delete review"
						onclick={onDelete}
					>
						<Trash2 size={20} class="text-[#FF4D4F]" />
					</button>
				{/if}
				{#if canEdit}
					<button
						class="rounded-md p-1 transition-colors hover:cursor-pointer hover:bg-blue-50"
						aria-label="Edit review"
						onclick={onEdit}
					>
						<Pencil size={20} class="text-[#4A70C6]" />
					</button>
				{/if}
			</div>
		{/if}
	</div>
</div>
