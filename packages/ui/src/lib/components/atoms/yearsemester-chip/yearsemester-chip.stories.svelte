<script module lang="ts">
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import { YearSemesterChip } from './index.js';

    const { Story } = defineMeta({
        title: 'Atom/YearSemester Chip',
        component: YearSemesterChip,
        tags: ['autodocs'],
        argTypes: {
            year: {
                control: 'number',
                defaultValue: 2566
            },
            semester: {
                control: {
                    type: 'select'
                },
                options: ['FIRST', 'SECOND', 'SUMMER'],
                defaultValue: 'FIRST'
            },
            closable: {
                control: 'boolean'
            },
            onClose: {
                action: 'onClose'
            },
            class: {
                control: false
            }
        }
    });
</script>

<Story name="FIRST" args={{ year: 2569, semester: 'FIRST', closable: false }} />

<Story name="FIRST Closable" args={{ year: 2569, semester: 'FIRST', closable: true }} />

<Story name="SECOND" args={{ year: 2569, semester: 'SECOND', closable: false }} />

<Story name="SECOND Closable" args={{ year: 2569, semester: 'SECOND', closable: true }} />

<Story name="SUMMER" args={{ year: 2569, semester: 'SUMMER', closable: false }} />

<Story name="SUMMER Closable" args={{ year: 2569, semester: 'SUMMER', closable: true }} />