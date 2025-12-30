<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";

    import { ConfirmDeleteSchedule } from "./index.js";

    const { Story } = defineMeta({
        title: "Molecule/Confirm Delete Schedule",
        component: ConfirmDeleteSchedule,
        tags: ["autodocs"],
        argTypes: {
            scheduleName: {
                control: "text",
            },
            variant: {
                control: {
                    type: "select",
                },
                options: ["overlay", "card"],
                defaultValue: "card",
            },
            onCancel: {
                action: "onCancel",
            },
            onConfirm: {
                action: "onConfirm",
            },
        },
    });
</script>

<Story
    name="Default"
    args={{
        scheduleName: "ตารางเรียนแสนสนุก",
        variant: "card",
    }}
/>
