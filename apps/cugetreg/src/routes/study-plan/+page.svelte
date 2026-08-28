<script lang="ts">
  import { Button } from '@cugetreg/ui/atoms/button';
</script>

<div class="flex h-full flex-row justify-between gap-6 bg-white px-6 py-8 md:px-12">
  <h1 class="text-3xl font-bold">จัดตาางเรียน</h1>
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
