<script lang="ts">
    import type { ClassValue } from "clsx";
    import type { Snippet } from "svelte";
    import { cn } from "../../../../utils";

    interface QuestionAnswerProp {
        question: string;
        children?: Snippet;
        class?: ClassValue;
    }

    const {
        question,
        children,
        class: className = undefined,
    }: QuestionAnswerProp = $props();
</script>

<div class={cn("flex-1 flex my-5", className)}>
    <div class="flex-1 text-lg font-bold">{question}</div>
    <div class="flex-1 font-sarabun wrap-break-word">
        {@render children?.()}
    </div>
</div>
