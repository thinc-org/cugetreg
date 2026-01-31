<script lang="ts">
	import { CUGetRegWhiteFull } from '../../logo/cugetreg/index.js';
	import ThincOnDark from '../../logo/thinc/OnDark.svelte';
	import { GitHubMark } from '../../logo/vendor/index.js';
</script>

<footer
	class="bg-on-primary-container text-on-primary text-subtitle flex w-full flex-col items-center gap-6 px-10 py-14 font-sans sm:p-20"
>
	<CUGetRegWhiteFull class="h-8 w-fit sm:h-16" />

	<div class="flex flex-col items-center gap-2 sm:flex-row sm:gap-6">
		<div class="flex items-center gap-2 sm:gap-6">
			<ThincOnDark class="h-8 w-fit sm:h-10" />
			<p>จุฬาลงกรณ์มหาวิทยาลัย</p>
		</div>

		<div class="bg-on-primary hidden h-10 w-[0.0625rem] sm:inline"></div>

		<div class="flex items-center gap-2">
			<p>Open Source on</p>
			<a href="https://github.com/thinc-org/cugetreg" target="_blank" rel="noreferrer">
				<GitHubMark class="h-6 w-fit text-white sm:h-10" />
			</a>
		</div>
	</div>

	<div class="flex items-center gap-6 underline">
		<a href="/">Privacy Policy</a>
		<a href="/">Privacy Preferences</a>
	</div>
</footer>
