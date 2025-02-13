<script lang="ts">
  import * as Table from '../../atom/table/index'
  import { type Course } from './index'
  import SectionRow from './SectionRow.svelte'

  export let course: Course
  export let selectedSections: string[]

  $: sectionsToShow = selectedSections.length
    ? course.sections.filter((section) =>
        selectedSections.includes(section.section.toString()),
      )
    : course.sections
  // console.log('selectedSection', selectedSections)
  // console.log('selection to show', sectionsToShow)
</script>

<Table.Root>
  <Table.Header>
    <Table.Row>
      <Table.Head>เซคชัน</Table.Head>
      <Table.Head>จำนวนที่รับ</Table.Head>
      <Table.Head>ผู้สอน</Table.Head>
      <Table.Head>กลุ่ม</Table.Head>
      <Table.Head>วันเวลาเรียน</Table.Head>
      <Table.Head>ห้องเรียน</Table.Head>
      <Table.Head>รูปแบบ</Table.Head>
      <Table.Head></Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {console.log('select', selectedSections)}
    {console.log('show', sectionsToShow)}
    {#each sectionsToShow as section}
      <SectionRow {section} />
    {/each}
  </Table.Body>
</Table.Root>
