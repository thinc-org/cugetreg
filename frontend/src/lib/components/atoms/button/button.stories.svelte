<script module lang="ts">
    import { defineMeta, Template } from "@storybook/addon-svelte-csf";

    import { Button } from "./index";

    const { Story } = defineMeta({
        title: "Atom/Button",
        component: Button,
        tags: ["autodocs"],
        argTypes: {
            variant: {
                control: {
                    type: "select",
                },
                options: ["solid", "outline"],
                defaultValue: "solid",
            },
            size: {
                control: {
                    type: "select",
                },
                options: ["sm", "default", "lg"],
                defaultValue: "default",
            },
            color: {
                control: {
                    type: "select",
                },
                options: ["primary", "neutral", "error", "secondary"],
                defaultValue: "primary",
            },
            builders: {
                control: false,
            },
            class: {
                control: false,
            },
        },
        args: {
            onclick: () => alert("Hello world"),
        },
    });
</script>

<Story
    name="Primary Solid"
    args={{ variant: "solid", size: "default", color: "primary" }}
>
    Button
</Story>

<Story
    name="Primary Outline"
    args={{ variant: "outlined", size: "default", color: "primary" }}
>
    Button
</Story>

<Story
    name="Neutral Solid"
    args={{ variant: "solid", size: "default", color: "neutral" }}
>
    Button
</Story>

<Story
    name="Neutral Outline"
    args={{ variant: "outlined", size: "default", color: "neutral" }}
>
    Button
</Story>

<Story
    name="Error Solid"
    args={{ variant: "solid", size: "default", color: "error" }}
>
    Button
</Story>

<Story
    name="Error Outline"
    args={{ variant: "outlined", size: "default", color: "error" }}
>
    Button
</Story>

<Story
    name="Secondary Solid"
    args={{ variant: "solid", size: "default", color: "secondary" }}
>
    Button
</Story>

<Story
    name="Secondary Outline"
    args={{ variant: "outlined", size: "default", color: "secondary" }}
>
    Button
</Story>
