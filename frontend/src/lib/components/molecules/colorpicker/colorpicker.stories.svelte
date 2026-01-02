<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";

    import { ColorPicker } from ".";
    import { courseColorVariants } from "../../../../constants";

    const { Story } = defineMeta({
        title: "Molecule/Color Picker",
        component: ColorPicker,
        tags: ["autodocs"],
        argTypes: {
            class: {
                control: false,
            },
            onChange: {
                control: false,
            },
            options: {
                control: false,
                defaultValue: courseColorVariants,
            },
        },
        args: {
            options: courseColorVariants,
            onCancel: () => alert("Cancel"),
            onConfirmSelected: (option) => alert(option),
            class: "w-[350px]",
        },
    });
</script>

<Story name="Default" />
