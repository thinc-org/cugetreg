<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";

    import Separator from "./separator.svelte";

    const { Story } = defineMeta({
        title: "Atom/Separator",
        component: Separator,
    });
</script>

<Story name="default">
    Hello
    <Separator />
    World
</Story>
