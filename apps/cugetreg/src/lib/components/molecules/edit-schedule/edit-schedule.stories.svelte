<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";

    import { EditSchedule } from "./index";

    const { Story } = defineMeta({
            title: "Molecule/Edit Schedule",
            component: EditSchedule,
            tags: ["autodocs"],
            argTypes: {
        },
    });
</script>

<!--👇 Each story then reuses that template-->

<Story name="Default" />
