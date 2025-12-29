<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";

    import { SelectedCourse } from "./index";
    import type { Course } from "./index";

    let courses: Course[] = [
        {
            id: 0,
            name: "COM PROG",
            code: "2190101",
            credit: 3,
            gened: [],
            seat: 300,
            maxseat: 3000,
            review: 100,
            days: ["MO", "TU"],
            sections: [1, 2, 3, 4, 71],
            selectedSection: "4",
            hidden: false,
        },
        {
            id: 1,
            name: "DATA SCI",
            code: "2190101",
            credit: 3,
            gened: [],
            seat: 300,
            maxseat: 3000,
            review: 100,
            days: ["MO", "TU"],
            sections: [1, 3, 4, 71],
            selectedSection: "71",
            hidden: true,
        },
    ];

    const { Story } = defineMeta({
        title: "Organism/Selected Course",
        component: SelectedCourse,
        tags: ["autodocs"],
        argTypes: {
            courses: {
                defaultValue: courses,
            },
        },
        args: {
            courses,
        },
    });
</script>

<Story name="Default" />
