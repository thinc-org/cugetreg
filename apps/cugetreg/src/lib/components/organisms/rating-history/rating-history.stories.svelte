<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";

    import { RatingHistory } from "./index.js";

    const { Story } = defineMeta({
        title: "Organism/Rating History",
        component: RatingHistory,
        tags: ["autodocs"],
        argTypes: {
            overviewTitle: {
                control: "text",
            },
            latestTitle: {
                control: "text",
            },
            histogram: {
                control: false,
            },
            overallRating: {
                control: false,
            },
            reviews: {
                control: false,
            },
        },
    });
</script>

<Story
    name="Default"
    args={{
        overviewTitle: "ภาพรวมรีวิว",
        latestTitle: "รีวิวล่าสุด",
        reviews: [
            {
                code: "0123104",
                name: "CON PDG PEACE CONFWV",
                tag: "หมวดมนุษย์",
                rating: 4,
                term: "ภาคต้น 2566",
            },
            {
                code: "0123101",
                name: "PARAGRAPH WRITING",
                tag: "หมวดมนุษย์",
                rating: 3,
                term: "ภาคปลาย 2565",
            },
            {
                code: "0123101",
                name: "PARAGRAPH WRITING",
                tag: "หมวดมนุษย์",
                rating: 3,
                term: "ภาคปลาย 2566",
            },
            {
                code: "2190201",
                name: "COM PROG",
                tag: "หมวดวิทย์",
                rating: 2.5,
                term: "ภาคปลาย 2566",
            },
        ],
    }}
/>
