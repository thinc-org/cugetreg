<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";

    import { Arrow } from "./index";

    const { Story } = defineMeta<typeof Arrow>({
        title: "Atom/Sort Direction Arrow",
        component: Arrow,
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