<script module lang="ts">
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import { StudyProgramChip } from './index.js';

    const { Story } = defineMeta({
        title: 'Atom/StudyProgram Chip',
        component: StudyProgramChip,
        tags: ['autodocs'],
        argTypes: {
            type: {
                control: {
                    type: 'select'
                },
                options: ['S', 'I', 'T'],
                defaultValue: 'S'
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

<Story name="Semester (S)" args={{ type: 'S', closable: false }} />

<Story name="Semester Closable" args={{ type: 'S', closable: true }} />

<Story name="International (I)" args={{ type: 'I', closable: false }} />

<Story name="International Closable" args={{ type: 'I', closable: true }} />

<Story name="Trimester (T)" args={{ type: 'T', closable: false }} />

<Story name="Trimester Closable" args={{ type: 'T', closable: true }} />