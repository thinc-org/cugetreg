<script lang="ts">
  import './select.css'

  export let state: 'default' | 'error' | 'success' | 'disable' = 'default'

  export let placeholder: string = 'none'
  export let label: string = 'ตัวเลือก'
  export let desc: string = 'เลือกตัวเลือกที่กำหนด'
</script>

<div>
  <label>
    {label}
    <select
      class="{['storybook-input', `storybook-input--${state}`].join(' ')}"
      on:click
      disabled="{state === 'disable'}"
    >
      <option>{placeholder}</option>
    </select>
    <svg
      width="10"
      height="14"
      viewBox="0 0 12 14"
      class="relative bottom-[30px] left-[15px]"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.6666 13V11.6667C10.6666 10.9594 10.3856 10.2811 9.88554 9.78105C9.38544 9.28095 8.70716 9 7.99992 9H3.99992C3.29267 9 2.6144 9.28095 2.1143 9.78105C1.6142 10.2811 1.33325 10.9594 1.33325 11.6667V13M8.66659 3.66667C8.66659 5.13943 7.47268 6.33333 5.99992 6.33333C4.52716 6.33333 3.33325 5.13943 3.33325 3.66667C3.33325 2.19391 4.52716 1 5.99992 1C7.47268 1 8.66659 2.19391 8.66659 3.66667Z"
        stroke="#898EA7"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
    </svg>
    <p
      class="{state == 'error'
        ? 'text-error'
        : state == 'success'
          ? 'text-success'
          : ''}"
    >
      {desc}
    </p>
  </label>
</div>
