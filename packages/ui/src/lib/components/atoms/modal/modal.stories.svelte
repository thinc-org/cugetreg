<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf"
    import Modal from "./modal.svelte";

    const { Story } = defineMeta({
        title: "Atom/Modal",
        component: Modal,
        tags: ['autodocs']
    });
</script>

<Story name="Default Modal">
    <div class="border border-neutral-200 w-50 h-25 flex justify-center items-center rounded-lg bg-surface">
        Hello world
    </div>
</Story>
