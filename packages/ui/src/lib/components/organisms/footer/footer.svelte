<script lang="ts">
	import { defineMessages, useTranslations } from '$lib/i18n';

	import { CUGetRegWhiteFull } from '../../logo/cugetreg/index.js';
	import ThincOnDark from '../../logo/thinc/OnDark.svelte';
	import { GitHubMark } from '../../logo/vendor/index.js';

	const t = useTranslations(
		defineMessages({
			th: {
				university: 'จุฬาลงกรณ์มหาวิทยาลัย',
				openSource: 'โอเพนซอร์สบน',
				privacyPolicy: 'นโยบายความเป็นส่วนตัว',
				terms: 'ข้อกำหนดและเงื่อนไข',
				privacyPreferences: 'การตั้งค่าความเป็นส่วนตัว'
			},
			en: {
				university: 'Chulalongkorn University',
				openSource: 'Open Source on',
				privacyPolicy: 'Privacy Policy',
				terms: 'Terms & Conditions',
				privacyPreferences: 'Privacy Preferences'
			}
		})
	);
</script>

<footer
	class="bg-on-primary-container text-on-primary text-subtitle flex w-full flex-col items-center gap-6 px-10 py-14 font-sans sm:p-20"
>
	<CUGetRegWhiteFull class="h-8 w-auto max-w-full sm:h-16" />

	<div class="flex flex-col items-center gap-2 sm:flex-row sm:gap-6">
		<div class="flex items-center gap-2 sm:gap-6">
			<ThincOnDark class="h-8 w-auto shrink-0 sm:h-10" />
			<p>{t('university')}</p>
		</div>

		<div class="bg-on-primary hidden h-10 w-[0.0625rem] sm:inline"></div>

		<div class="flex items-center gap-2">
			<p>{t('openSource')}</p>
			<a href="https://github.com/thinc-org/cugetreg" target="_blank" rel="noreferrer">
				<GitHubMark class="h-6 w-auto text-white sm:h-10" />
			</a>
		</div>
	</div>

	<div class="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 underline">
		<a href="/privacy-policy">{t('privacyPolicy')}</a>
		<a href="/terms-and-conditions">{t('terms')}</a>
		<a href="/">{t('privacyPreferences')}</a>
	</div>
</footer>
