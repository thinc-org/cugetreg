<script lang="ts">
  import type { PageData } from './$types'

  interface Props {
    data: PageData
  }

  let { data }: Props = $props()
</script>

<h1 class="text-h1">DB Demo</h1>

<p class="whitespace-pre">
  {JSON.stringify(data.course, null, 2)}
</p>
