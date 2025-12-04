<script lang="ts">
  import { Chip } from '../../atom/chip/index'
  import * as Select from '../select/index'

  export let haveSection: { value: string; label: string }[]
  export let selectedSections: string[] = []

  function removeSection(sectionValue: string) {
    selectedSections = selectedSections.filter((item) => item !== sectionValue)
  }

  function getSectionLabel(sectionValue: string) {
    return (
      haveSection.find((item) => item.value === sectionValue)?.label ||
      sectionValue
    )
  }
</script>

<div class="flex-col items-end">
  <p class="text-caption text-on-surface-placeholder font-normal mb-1">
    แสดงเซคชัน
  </p>
  <Select.Root type="multiple" name="sections" bind:value={selectedSections}>
    <div class="relative w-[276px]">
      {#if selectedSections.length}
        <div
          class="absolute flex max-w-[274px] w-auto pl-2 top-1/2 -translate-y-1/2 items-center gap-1 truncate"
        >
          {#each selectedSections as temp}
            <Chip class="z-10" closable onClose={() => removeSection(temp)}>
              {getSectionLabel(temp)}
            </Chip>
          {/each}
        </div>
      {/if}
      <Select.Trigger
        aria-label="Select sections"
        class="w-[276px] h-9 z-0"
        placeholder="เลือก"
      >
        {#if !selectedSections.length}เลือก{/if}
      </Select.Trigger>
    </div>
    <Select.Content role="listbox">
      <Select.Group>
        {#each haveSection as section}
          <Select.Item
            value={section.value}
            label={section.label}
            aria-label={section.label}
            role="option"
            check={true}
          >
            {section.label}
          </Select.Item>
        {/each}
      </Select.Group>
    </Select.Content>
  </Select.Root>
</div>
