<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";

    import { ColorPicker } from ".";

    const placeholder_option = [
        "bg-neutral-100 border-neutral-500 text-neutral-700",
        "bg-pink-300 border-pink-500 text-pink-700",
        "bg-tangerine-300 border-tangerine-500 text-tangerine-700",
        "bg-orange-300 border-orange-500 text-orange-700",
        "bg-yellow-300 border-yellow-500 text-yellow-700",
        "bg-green-300 border-green-500 text-green-700",
        "bg-teal-300 border-teal-500 text-teal-700",
        "bg-sky-300 border-sky-500 text-sky-700",
        "bg-indigo-300 border-indigo-500 text-indigo-700",
        "bg-purple-300 border-purple-500 text-purple-700",
    ];

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
                defaultValue: placeholder_option,
            },
        },
        args: {
            options: placeholder_option,
            onCancel: () => alert("Cancel"),
            onConfirmSelected: (option) => alert(option),
        },
    });
</script>

<Story name="Default" />
