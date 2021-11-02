import { NETWORK_PRESETS } from './network'
import { setDefaultOptions } from 'expect-puppeteer'
import isCI from 'is-ci'

describe('Course query', () => {
    jest.setTimeout(20000)
    beforeAll(async () => {

        setDefaultOptions({ timeout: 1000 })

        await page.goto('https://beta.cugetreg.com')

        if (!isCI) {
            // Set throttling property
            const client = await page.target().createCDPSession()
            await client.send('Network.emulateNetworkConditions', NETWORK_PRESETS['Regular3G'])
        }
    })

    it('should be able query search by changing filter correctly', async () => {
        const DEFAULT_SUBJECT = '0201172 SELF/CAREER MGT'
        const SCIENCE_THURSDAY_SUBJECT = '0201287 MAP APPLN'
        const NON_GENED_1617_SUBJECT = '2145490 AERO ENG SEM III'
        const DEFAULT_1720_SUBJECT = '2145217 SCI PROG'
        const DEFAULT_185215_SUBJECT = '2189570 ELEC MAT'

        const SCIENCE_CHECKBOX_SELECTOR = "input[name='หมวดวิทย์']"
        const NOT_GENED_SELECTOR = "input[name='ไม่ใช่ GenEd']"
        const TUESDAY_CHECKBOX_SELECTOR = "input[name='วันอังคาร']"
        const THRUSDAY_CHECKBOX_SELECTOR = "input[name='วันพฤหัสบดี']"
        const PERIOD_RANGE_SELECTOR = "input[name='เวลาเรียน']"

        await expect(page).toMatch('ค้นหาวิชาเรียน')
        await page.select('select:nth-of-type(1)', 'I');

        await page.evaluate(
            () => document.querySelectorAll('select')[1].id = 'test_id'
        );
        await page.select('#test_id', "2564/1");
        await expect(page).toMatch(DEFAULT_SUBJECT)

        await page.click(SCIENCE_CHECKBOX_SELECTOR);
        await expect(page).not.toMatch(DEFAULT_SUBJECT)
        await expect(page).toMatch(SCIENCE_THURSDAY_SUBJECT)

        await page.click(TUESDAY_CHECKBOX_SELECTOR);
        await expect(page).not.toMatch(DEFAULT_SUBJECT)
        await expect(page).not.toMatch(SCIENCE_THURSDAY_SUBJECT)

        await page.click(THRUSDAY_CHECKBOX_SELECTOR);
        await expect(page).not.toMatch(DEFAULT_SUBJECT)
        await expect(page).toMatch(SCIENCE_THURSDAY_SUBJECT)

        await page.click(PERIOD_RANGE_SELECTOR);
        await page.click("input[value='06:00']");
        await page.click(`li[data-value="15:30"]`);
        await expect(page).not.toMatch(DEFAULT_SUBJECT)
        await expect(page).not.toMatch(SCIENCE_THURSDAY_SUBJECT)

        await page.waitForTimeout(500)
        await page.click(NOT_GENED_SELECTOR);
        await expect(page).toMatch(NON_GENED_1617_SUBJECT)
        await expect(page).not.toMatch(DEFAULT_SUBJECT)
        await expect(page).not.toMatch(SCIENCE_THURSDAY_SUBJECT)


        await page.click(NOT_GENED_SELECTOR);
        await page.click(THRUSDAY_CHECKBOX_SELECTOR);
        await page.click(TUESDAY_CHECKBOX_SELECTOR);
        await page.click(SCIENCE_CHECKBOX_SELECTOR);
        await expect(page).not.toMatch(NON_GENED_1617_SUBJECT)
        await expect(page).not.toMatch(DEFAULT_SUBJECT)
        await expect(page).not.toMatch(SCIENCE_THURSDAY_SUBJECT)
        await expect(page).toMatch(DEFAULT_1720_SUBJECT)


        await expect(page).toClick("input[value='15:30']");
        await expect(page).toClick(`li[data-value="18:00"]`);
        await expect(page).not.toMatch(NON_GENED_1617_SUBJECT)
        await expect(page).not.toMatch(DEFAULT_SUBJECT)
        await expect(page).not.toMatch(SCIENCE_THURSDAY_SUBJECT)
        await expect(page).not.toMatch(DEFAULT_1720_SUBJECT)
        await expect(page).toMatch(DEFAULT_185215_SUBJECT)

        await page.click(PERIOD_RANGE_SELECTOR);
        await expect(page).not.toMatch(NON_GENED_1617_SUBJECT)
        await expect(page).toMatch(DEFAULT_SUBJECT)
        await expect(page).not.toMatch(DEFAULT_1720_SUBJECT)
        await expect(page).not.toMatch(DEFAULT_185215_SUBJECT)
    })
})