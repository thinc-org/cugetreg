<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";

    import { RenameSchedule } from "./index";

    const { Story } = defineMeta({
        title: "Organism/Rename Schedule",
        component: RenameSchedule
    })
</script>

<Story name="default" />
