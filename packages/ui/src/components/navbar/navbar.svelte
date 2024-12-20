<!-- To be implemented: add props (isLoggedIn, ...) -->
<!-- To be implemented: make responsive -->
<script lang="ts">
  import { Moon, Search } from 'lucide-svelte'

  import Button from '../button/button.svelte'
  import IconButton from '../icon-button/icon-button.svelte'
  import Input from '../input/input.svelte'
  import Logo from '../logo/cugetreg/DarkFull.svelte'
  import GitHubMark from '../logo/vendor/GitHubMark.svelte'
</script>

<div class="py-3 px-12 flex justify-between items-center z-50">
  <div class="flex flex-row gap-6">
    <Logo class="w-32 h-10" />
    <div class="relative h-full">
      <Search
        class="absolute my-auto right-4 top-[32%]"
        size="16"
        color="hsl(var(--neutral-400) / var(--tw-text-opacity, 1))"
        strokeWidth="3.5"
      />
      <Input
        placeholder="ค้นหาวิชา"
        class="w-56 placeholder:text-neutral-400"
      />
    </div>
  </div>
  <!-- To be fix: this section should be in the middle of the screen -->
  <div class="flex flex-row justify-between items-center gap-4">
    <!-- To be implemented: selectable item (text-neutral-800, text-primary)-->
    <p class="text-neutral-500 text-xl w-28 text-center">ค้นหาวิชา</p>
    <p class="text-neutral-500 text-xl w-28 text-center">จัดตารางเรียน</p>
    <p class="text-neutral-500 text-xl w-28 text-center">เกี่ยวกับ</p>
  </div>
  <div class="flex flex-row justify-between items-center gap-4">
    <GitHubMark class="w-8 h-8 text-neutral-500" />
    <IconButton color="neutral"><Moon strokeWidth="3" size="16" /></IconButton>
    <!-- To be implemented: add real href in Button -->
    <Button href="login" class="font-normal w-28">เข้าสู่ระบบ</Button>
  </div>
</div>
