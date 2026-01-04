<script lang="ts">
    import type { createRawSnippet, Snippet } from "svelte"
    import { cn } from "../../../../utils";

    function handleClick(e: MouseEvent) {
        e.preventDefault();

        if (!exitOnBackgroundClick) return;
        show = false;
    }

    function handleKeydown(e: KeyboardEvent) {
        if (e.key === 'Escape' && exitOnEsc) show = false;
    }

    interface ModalProp {
        children?: Snippet;
        show?: boolean;
        centered?: boolean;
        dim?: boolean;
        exitOnBackgroundClick?: boolean;
        exitOnEsc?: boolean;
    }

    let {
        children,
        centered = true,
        dim = false,
        show = $bindable(true),
        exitOnBackgroundClick = false,
        exitOnEsc = false,
    }: ModalProp = $props();
</script>

{#if show}
    <div 
        class={cn(
            "fixed top-0 left-0 w-screen h-screen m-0 p-0 z-50",
            dim && "bg-black/40",
            centered && "flex items-center justify-center"
        )}
        onclick={handleClick}
        onkeydown={handleKeydown}
        tabindex="0"
        role="dialog"

    >
        <div
            class="z-60"
            onclick={(e) => e.stopPropagation()}
            onkeydown={(e) => e.stopPropagation()}
            tabindex="0"
            role="dialog"
        >
            {@render children?.()}
        </div>
    </div>
{/if}
