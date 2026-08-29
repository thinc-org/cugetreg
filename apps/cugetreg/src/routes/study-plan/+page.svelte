<script lang="ts">
  import { Button } from '@cugetreg/ui/atoms/button';
  import {
    FACULTIES,
    type FacultyId,
    UNKNOWN_FACULTY,
  } from '@cugetreg/utils/faculty';

  import type { PageProps } from './$types';

  const { data }: PageProps = $props();

  const faculty = $derived(
    FACULTIES[data.user.faculty as FacultyId] ?? UNKNOWN_FACULTY,
  );
</script>

<div class="flex h-full flex-row justify-between gap-6 bg-white px-6 py-8 md:px-12">
  <div class="flex flex-col gap-4">
    <h1 class="text-3xl font-bold text-black">จัดตารางเรียน</h1>
    <div class="flex flex-row gap-6 text-black text-[16px]">
      <p>คณะ{faculty.th}</p>
      <p>สาขา{data.user.department || '-'}</p>
    </div>
  </div>

  <div class="flex flex-wrap gap-3">
    <Button
      variant="outlined"
      color="neutral"
      class="text-[#4A70C6] ring-[#4A70C6] hover:bg-[#4A70C6] hover:text-white"
    >
      คืนค่าเดิม
    </Button>
    <Button class="bg-[#4A70C6] text-white hover:ring-[#4A70C6]">
      คำนวนเกรด
    </Button>
  </div>
</div>
