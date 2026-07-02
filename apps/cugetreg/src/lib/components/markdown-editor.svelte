<script lang="ts">
  import {
    Bold,
    Code,
    Heading,
    Italic,
    Quote,
    Strikethrough,
    Underline,
  } from '@lucide/svelte';
  import { Editor } from '@tiptap/core';
  import Placeholder from '@tiptap/extension-placeholder';
  import StarterKit from '@tiptap/starter-kit';
  import { onDestroy, onMount } from 'svelte';
  import { Markdown } from 'tiptap-markdown';

  let {
    value = $bindable(''),
    placeholder = '',
  }: { value?: string; placeholder?: string } = $props();

  // tiptap-markdown augments editor.storage with a `markdown` namespace at
  // runtime but doesn't expose it on @tiptap/core's Storage type, so read it
  // through a narrow typed accessor.
  const getMarkdown = (ed: Editor) =>
    (
      ed.storage as unknown as { markdown: { getMarkdown(): string } }
    ).markdown.getMarkdown();

  let element = $state<HTMLDivElement>();
  let editor = $state<Editor>();
  // Bumped on every editor transaction so the toolbar's active-state styling
  // re-evaluates in markup (Tiptap mutates internally, outside Svelte's graph).
  let txn = $state(0);

  onMount(() => {
    const ed = new Editor({
      element,
      extensions: [
        // Underline stays enabled: tiptap-markdown serializes it to <u>…</u>,
        // which the comment display renders after DOMPurify sanitization.
        StarterKit,
        Markdown,
        Placeholder.configure({ placeholder: () => placeholder }),
      ],
      content: value,
      editorProps: {
        attributes: {
          class:
            'prose prose-sm font-sarabun text-on-surface max-w-none min-h-36 px-4 py-3 text-sm focus:outline-none',
        },
      },
      onUpdate: ({ editor }) => {
        value = getMarkdown(editor);
      },
      onTransaction: () => {
        txn++;
      },
    });
    editor = ed;
  });

  onDestroy(() => editor?.destroy());

  export function focus() {
    editor?.commands.focus('end');
  }

  // Sync externally-set markdown (e.g. loading an existing review to edit) into
  // the editor without re-emitting an update (which would cause a loop).
  $effect(() => {
    const md = value;
    if (editor && md !== getMarkdown(editor)) {
      editor.commands.setContent(md, { emitUpdate: false });
    }
  });

  // Reads `txn` so Svelte re-runs this on each transaction.
  function active(name: string, attrs?: Record<string, unknown>) {
    void txn;
    return editor?.isActive(name, attrs) ?? false;
  }

  const btn =
    'rounded p-1 transition-colors hover:cursor-pointer hover:text-on-surface';
  const activeCls = 'text-primary bg-primary-container/40';
</script>

<div class="border-surface-container-high bg-surface rounded-xl border">
  <div
    class="border-surface-container-high text-on-surface/60 flex items-center gap-4 border-b px-4 py-2"
  >
    <button
      type="button"
      aria-label="ตัวหนา"
      class={[btn, active('bold') && activeCls]}
      onclick={() => editor?.chain().focus().toggleBold().run()}
    >
      <Bold size={18} />
    </button>
    <button
      type="button"
      aria-label="ตัวเอียง"
      class={[btn, active('italic') && activeCls]}
      onclick={() => editor?.chain().focus().toggleItalic().run()}
    >
      <Italic size={18} />
    </button>
    <button
      type="button"
      aria-label="ขีดเส้นใต้"
      class={[btn, active('underline') && activeCls]}
      onclick={() => editor?.chain().focus().toggleUnderline().run()}
    >
      <Underline size={18} />
    </button>
    <button
      type="button"
      aria-label="ขีดฆ่า"
      class={[btn, active('strike') && activeCls]}
      onclick={() => editor?.chain().focus().toggleStrike().run()}
    >
      <Strikethrough size={18} />
    </button>
    <button
      type="button"
      aria-label="โค้ด"
      class={[btn, active('code') && activeCls]}
      onclick={() => editor?.chain().focus().toggleCode().run()}
    >
      <Code size={18} />
    </button>
    <div class="bg-surface-container-high h-6 w-px"></div>
    <button
      type="button"
      aria-label="หัวข้อ"
      class={[btn, active('heading', { level: 2 }) && activeCls]}
      onclick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
    >
      <Heading size={18} />
    </button>
    <button
      type="button"
      aria-label="ข้อความอ้างอิง"
      class={[btn, active('blockquote') && activeCls]}
      onclick={() => editor?.chain().focus().toggleBlockquote().run()}
    >
      <Quote size={18} fill="currentColor" strokeWidth={0} />
    </button>
  </div>

  <div bind:this={element}></div>
</div>

<style>
  /* Tiptap renders its editable outside Svelte's style scope, so target the
     placeholder globally. The Placeholder extension marks the empty first node
     with `is-editor-empty` and exposes the text via `data-placeholder`. */
  :global(.tiptap p.is-editor-empty:first-child::before) {
    content: attr(data-placeholder);
    color: var(--color-on-surface);
    opacity: 0.4;
    float: left;
    height: 0;
    pointer-events: none;
  }
</style>
