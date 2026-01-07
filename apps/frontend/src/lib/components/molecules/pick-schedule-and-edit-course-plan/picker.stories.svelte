<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";

    import { PickSchedule } from "./index";

    const { Story } = defineMeta<typeof PickSchedule>({
        title: "Molecule/PickSchedule",
        component: PickSchedule,
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