<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import { CourseSearchPage } from "./index.js";

    const { Story } = defineMeta({
        title: "Pages/CourseSearchPage",
        component: CourseSearchPage,
        tags: ["autodocs"],
    });
</script>

<Story
    name="FullView"
    args={{
        courses: [
            {
                course: {
                    code: "0123101",
                    name: "PARAGRAPH WRITING",
                    credit: 3,
                    gened: ["HU", "LA"],
                    seat: 24,
                    maxseat: 305,
                    review: 14,
                    days: ["MO", "TU", "WE"]
                },
                recommended: true,
                selected: false
            },
            {
                course: {
                    code: "0123102",
                    name: "DIGITAL LITERACY",
                    credit: 2,
                    gened: ["SO", "SC"],
                    seat: 50,
                    maxseat: 500,
                    review: 8,
                    days: ["WE", "TH"]
                },
                recommended: true,
                selected: true
            },
            {
                course: {
                    code: "0123103",
                    name: "CRITICAL THINKING",
                    credit: 3,
                    gened: ["HU"],
                    seat: 0,
                    maxseat: 100,
                    review: 25,
                    days: ["FR"]
                },
                recommended: false,
                selected: false
            },
            {
                course: {
                    code: "2110101",
                    name: "COMP PROG",
                    credit: 3,
                    gened: ["SC"],
                    seat: 15,
                    maxseat: 200,
                    review: 120,
                    days: ["TU", "TH"]
                },
                recommended: false,
                selected: false
            },
            {
                course: {
                    code: "5500111",
                    name: "EXP ENG I",
                    credit: 3,
                    gened: ["SC"],
                    seat: 2,
                    maxseat: 40,
                    review: 42,
                    days: ["MO", "WE"]
                },
                recommended: true,
                selected: false
            },
            {
                course: {
                    code: "0201101",
                    name: "MU LIFE",
                    credit: 2,
                    gened: ["HU"],
                    seat: 150,
                    maxseat: 150,
                    review: 300,
                    days: ["FR"]
                },
                recommended: false,
                selected: false
            },
            {
                course: {
                    code: "2112341",
                    name: "DISCRETE MATH",
                    credit: 3,
                    gened: ["SC"],
                    seat: 45,
                    maxseat: 120,
                    review: 15,
                    days: ["WE", "FR"]
                },
                recommended: false,
                selected: true
            },
            {
                course: {
                    code: "3800101",
                    name: "GEN PSYCHO",
                    credit: 3,
                    gened: ["SO"],
                    seat: 12,
                    maxseat: 250,
                    review: 88,
                    days: ["TH"]
                },
                recommended: true,
                selected: false
            },
            {
                course: {
                    code: "3800101",
                    name: "GEN PSYCHO",
                    credit: 3,
                    gened: ["SO"],
                    seat: 12,
                    maxseat: 250,
                    review: 88,
                    days: ["TH"]
                },
                recommended: true,
                selected: false
            },
            {
                course: {
                    code: "3800101",
                    name: "GEN PSYCHO",
                    credit: 3,
                    gened: ["SO"],
                    seat: 12,
                    maxseat: 250,
                    review: 88,
                    days: ["TH"]
                },
                recommended: true,
                selected: false
            },
            {
                course: {
                    code: "3800101",
                    name: "GEN PSYCHO",
                    credit: 3,
                    gened: ["SO"],
                    seat: 12,
                    maxseat: 250,
                    review: 88,
                    days: ["TH"]
                },
                recommended: true,
                selected: false
            },
            {
                course: {
                    code: "3800101",
                    name: "GEN PSYCHO",
                    credit: 3,
                    gened: ["SO"],
                    seat: 12,
                    maxseat: 250,
                    review: 88,
                    days: ["TH"]
                },
                recommended: true,
                selected: false
            },
            {
                course: {
                    code: "3800101",
                    name: "GEN PSYCHO",
                    credit: 3,
                    gened: ["SO"],
                    seat: 12,
                    maxseat: 250,
                    review: 88,
                    days: ["TH"]
                },
                recommended: true,
                selected: false
            },
            {
                course: {
                    code: "3800101",
                    name: "GEN PSYCHO",
                    credit: 3,
                    gened: ["SO"],
                    seat: 12,
                    maxseat: 250,
                    review: 88,
                    days: ["TH"]
                },
                recommended: true,
                selected: false
            }
        ]
    }}
/>