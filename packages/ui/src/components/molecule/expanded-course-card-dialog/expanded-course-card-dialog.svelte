<script lang="ts">
  import CourseInfo from './CourseInfo.svelte'
  import { type Course } from './index'
  import SectionFilter from './SectionFilter.svelte'
  import SectionTable from './SectionTable.svelte'

  let {
    course,
    haveSection,
  }: { course: Course; haveSection: { value: string; label: string }[] } =
    $props()
  let value2 = $state<string[]>([])
</script>

<div class="w-fit h-fit rounded-xl p-6 space-y-4">
  <div class="flex justify-between">
    <CourseInfo {course} />
    <SectionFilter bind:selectedSections={value2} {haveSection} />
  </div>
  <SectionTable {course} bind:selectedSections={value2} />
</div>
