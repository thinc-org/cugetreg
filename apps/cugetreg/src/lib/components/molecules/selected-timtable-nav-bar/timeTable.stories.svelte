<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";

    import { timeTable } from "./index";

    const { Story } = defineMeta<typeof timeTable>({
        title: "Molecule/timetable",
        component: timeTable,
        tags: ["autodocs"],
        argTypes: {
            class: {
                control: false,
            },
        },
    });
</script>

<!--👇 Each story then reuses that template-->

<Story name="Default" />