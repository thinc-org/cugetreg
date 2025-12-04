<script lang="ts">
  import { Check, Plus } from 'lucide-svelte'

  import { Button } from '../../atom/button/index'
  import { SeatChip } from '../../atom/seat-chip/index'
  import * as Table from '../../atom/table/index'

  export let section
</script>

{#each section.schedule as schedule, i}
  <Table.Row class={i === 0 ? 'border-b-0' : ''}>
    {#if i === 0}
      <Table.Cell rowspan={section.schedule.length}
        >{section.section}</Table.Cell
      >
      <Table.Cell rowspan={section.schedule.length}>
        <SeatChip class="text-body2 px-4 py-0.5" status={section.seats.status}>
          {section.seats.count}
        </SeatChip>
      </Table.Cell>
    {/if}
    <Table.Cell>{section.instructors[0]}</Table.Cell>
    <Table.Cell>{section.group}</Table.Cell>
    <Table.Cell>{schedule.day} {schedule.time}</Table.Cell>
    <Table.Cell>{schedule.room}</Table.Cell>
    <Table.Cell>{schedule.type}</Table.Cell>
    {#if i === 0 && section.selectable}
      <Table.Cell>
        <Button
          variant={section.seats.status === 'avaliable' ? 'outlined' : 'solid'}
        >
          เลือก {#if section.seats.status === 'avaliable'}
            <Plus />
          {:else}
            <Check />
          {/if}
        </Button>
      </Table.Cell>
    {/if}
  </Table.Row>
{/each}
