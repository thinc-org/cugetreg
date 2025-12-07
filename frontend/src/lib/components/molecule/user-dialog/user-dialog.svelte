<script lang="ts">
  import { DoorOpen, Settings } from 'lucide-svelte'

  import { getShortenName } from '@repo/utils'

  interface Props {
    imageUrl?: string
    name?: string
    id?: string
  }

  let {
    imageUrl = 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg',
    name = '',
    id = '',
  }: Props = $props()

  let shortenedName = $derived(getShortenName(name))

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

<div class="w-60 rounded-xl border-2 border-[#EDEDF1] bg-surface">
  <div class="flex flex-col justify-center items-center p-4 gap-4">
    <img
      src={imageUrl}
      alt="Profile"
      class="rounded-full w-20 h-20 object-cover"
    />
    <div class="flex flex-col gap-2 items-center">
      <p class="text-on-surface text-h3 font-bold">{shortenedName}</p>
      <p class="text-on-surface text-body2 font-medium">ID: {id}</p>
    </div>
  </div>
  {#each items as { icon: Icon, name }}
    <div class="flex flex-row p-4 gap-3 items-center border-t border-[#EDEDF1]">
      <Icon size="16" color="#353745" strokeWidth="2.5" />
      <p class="text-on-surface font-medium text-button2">{name}</p>
    </div>
  {/each}
</div>
