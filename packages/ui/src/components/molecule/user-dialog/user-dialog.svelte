<script lang="ts">
  import { DoorOpen, Settings } from 'lucide-svelte'

  interface Props {
    imageUrl: string
    name: string
    id: string
  }

  let {
    imageUrl = undefined,
    name = undefined,
    id = undefined,
  }: Props = $props()

  let shortenedName = `${name?.split(' ')[0]} ${name?.split(' ')[1]?.charAt(0)}.`

  const items = [
    {
      icon: Settings,
      name: 'ตั้งค่า',
    },
    {
      icon: DoorOpen,
      name: 'ออกจากระบบ',
    },
  ]
</script>

<div class="w-60 rounded-lg border-2 border-[#EDEDF1]">
  <div class="flex flex-col justify-center items-center p-4 gap-4">
    <img src={imageUrl} alt="Profile" class="rounded-full w-[72px] h-20" />
    <div class="flex flex-col gap-2 items-center">
      <p class="text-on-surface text-h3 font-bold">{shortenedName}</p>
      <p class="text-on-surface text-body2 font-medium">ID: {id}</p>
    </div>
  </div>
  <div class="flex flex-row p-4 gap-3 items-center border-t border-[#EDEDF1]">
    <Settings size="16" color="#353745" strokeWidth="2.5" />
    <p class="text-on-surface font-medium text-button2">ตั้งค่า</p>
  </div>
  <div class="flex flex-row p-4 gap-3 items-center border-t border-[#EDEDF1]">
    <DoorOpen size="16" color="#353745" strokeWidth="2.5" />
    <p class="text-on-surface font-medium text-button2">ออกจากระบบ</p>
  </div>
</div>
