<script>
  export let tooltipText = ''
</script>

<div class="group relative top-0.5 inline-block cursor-pointer">
  <!-- SVG Icon -->
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="stroke-gray-800"
  >
    <path
      d="M7.66667 10.3333V7.66667M7.66667 5H7.67333M14.3333 7.66667C14.3333 11.3486 11.3486 14.3333 7.66667 14.3333C3.98477 14.3333 1 11.3486 1 7.66667C1 3.98477 3.98477 1 7.66667 1C11.3486 1 14.3333 3.98477 14.3333 7.66667Z"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>

  <!-- Tooltip -->
  <div
    class="absolute top-5 flex h-8 w-80.25 -translate-x-1/2 transform items-center gap-2.5 rounded bg-gray-200 p-2.5 text-[12px] opacity-0 transition-opacity group-hover:opacity-100"
  >
    {tooltipText}
  </div>
</div>
