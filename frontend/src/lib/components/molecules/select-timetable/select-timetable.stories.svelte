<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";

    import { SelectTimetable } from "./index";

    const { Story } = defineMeta({
        title: "Molecule/Select Timetable",
        component: SelectTimetable,
        tags: ["autodocs"],
        argTypes: {
        },
    });
</script>

<Story name="Default" />
