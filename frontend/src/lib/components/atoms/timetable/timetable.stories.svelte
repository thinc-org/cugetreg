<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";

    import { TimeTable, type Period, type Schedule } from "./index";
    import type { Course } from "../../molecules/course-card";

    const emptySchedule: Schedule = {
        MO: Array.from({ length: 12 }),
        TU: Array.from({ length: 12 }),
        WE: Array.from({ length: 12 }),
        TH: Array.from({ length: 12 }),
        FR: Array.from({ length: 12 }),
        SA: Array.from({ length: 12 }),
        SU: Array.from({ length: 12 }),
    };

    let mockCourse: Course = {
        name: "COM PROG",
        code: "2190101",
        credit: 3,
        gened: [],
        seat: 100,
        maxseat: 999,
        review: 12,
        days: [],
    };

    let noConflict: Schedule = {
        MO: Array.from({ length: 12 }),
        TU: Array.from({ length: 12 }),
        WE: Array.from({ length: 12 }),
        TH: Array.from({ length: 12 }),
        FR: Array.from({ length: 12 }),
        SA: Array.from({ length: 12 }),
        SU: Array.from({ length: 12 }),
    };

    noConflict["TU"][1] = {
        course: mockCourse,
        length: 1,
    } as Period;

    noConflict["WE"][1] = {
        course: mockCourse,
        length: 2,
    } as Period;

    noConflict["TH"][1] = {
        course: mockCourse,
        length: 3,
    } as Period;

    noConflict["FR"][1] = {
        course: mockCourse,
        length: 4,
    } as Period;

    let conflicted: Schedule = {
        MO: Array.from({ length: 12 }),
        TU: Array.from({ length: 12 }),
        WE: Array.from({ length: 12 }),
        TH: Array.from({ length: 12 }),
        FR: Array.from({ length: 12 }),
        SA: Array.from({ length: 12 }),
        SU: Array.from({ length: 12 }),
    };

    conflicted["MO"][3] = [
        {
            course: mockCourse,
            length: 1,
        },
        {
            course: mockCourse,
            length: 1,
        },
    ] as Period[];

    conflicted["TU"][1] = {
        course: mockCourse,
        length: 2,
    } as Period;

    conflicted["TU"][2] = {
        course: mockCourse,
        length: 2,
    } as Period;

    conflicted["WE"][1] = {
        course: mockCourse,
        length: 3,
    } as Period;

    conflicted["WE"][3] = {
        course: mockCourse,
        length: 3,
    } as Period;

    conflicted["TH"][5] = {
        course: mockCourse,
        length: 3,
    } as Period;

    conflicted["TH"][6] = {
        course: mockCourse,
        length: 3,
    } as Period;

    conflicted["FR"][1] = {
        course: mockCourse,
        length: 3,
    } as Period;

    conflicted["FR"][3] = {
        course: mockCourse,
        length: 3,
    } as Period;

    conflicted["FR"][5] = {
        course: mockCourse,
        length: 3,
    } as Period;

    const { Story } = defineMeta({
        title: "Atom/Time Table",
        component: TimeTable,
        tags: ["autodocs"],
        argTypes: {
            periodPerDay: {
                defaultValue: 12,
            },
            schedule: {
                control: false,
                defaultValue: emptySchedule,
            },
        },
    });
</script>

<Story name="Default" />
<Story name="Populated" args={{ schedule: noConflict }} />
<Story name="Conflicted" args={{ schedule: conflicted }} />
