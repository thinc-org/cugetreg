<script lang="ts">
  import { CUGetRegWhiteFull } from '../../logo/cugetreg/index.js'
  import { ThincOnDark } from '../../logo/thinc/index.js'
  import { GitHubMark } from '../../logo/vendor/index.js'
</script>

<footer
  class="bg-on-primary-container text-on-primary w-full font-sans flex flex-col items-center gap-6 py-14 px-10 sm:p-20 text-subtitle"
>
  <CUGetRegWhiteFull class="h-8 sm:h-16 w-fit" />

  <div class="flex flex-col sm:flex-row gap-2 sm:gap-6 items-center">
    <div class="flex gap-2 sm:gap-6 items-center">
      <ThincOnDark class="h-8 sm:h-10 w-fit" />
      <p>จุฬาลงกรณ์มหาวิทยาลัย</p>
    </div>

    <div class="h-10 w-[0.0625rem] bg-on-primary hidden sm:inline"></div>

    <div class="flex items-center gap-2">
      <p>Open Source on</p>
      <a
        href="https://github.com/thinc-org/cugetreg"
        target="_blank"
        rel="noreferrer"
      >
        <GitHubMark class="text-white w-fit h-6 sm:h-10" />
      </a>
    </div>
  </div>

  <div class="flex gap-6 items-center underline">
    <a href="/">Privacy Policy</a>
    <a href="/">Privacy Preferences</a>
  </div>
</footer>
