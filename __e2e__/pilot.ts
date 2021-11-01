import 'expect-puppeteer'

describe('Google', () => {
    beforeAll(async () => {
        await page.goto('https://beta.cugetreg.com')
    })

    it('should be able to switch to International program 2564/1', async () => {
        await expect(page).toMatch('ค้นหาวิชาเรียน')
        await page.select('select:nth-of-type(1)', 'I');

        await page.evaluate(
            () => document.querySelectorAll('select')[1].id = 'blank_id'
        );
        await page.select('#blank_id', "2564/1");
        await expect(page).toMatch('0201172 SELF/CAREER MGT')

        await page.click("input[name='หมวดวิทย์']");
        await page.waitForTimeout(500)
        await expect(page).not.toMatch('0201172 SELF/CAREER MGT')
        await expect(page).toMatch('0201287 MAP APPLN')

        await page.click("input[name='วันอังคาร']");
        await expect(page).not.toMatch('0201172 SELF/CAREER MGT')
        await expect(page).not.toMatch('0201287 MAP APPLN')

        await page.click("input[name='วันพฤหัสบดี']");
        await expect(page).not.toMatch('0201172 SELF/CAREER MGT')
        await expect(page).toMatch('0201287 MAP APPLN')

        await page.click("input[name='เวลาเรียน']");
        await page.click("input[value='06:00']");
        await page.click(`li[data-value="15:30"]`);
        await expect(page).not.toMatch('0201172 SELF/CAREER MGT')
        await expect(page).not.toMatch('0201287 MAP APPLN')

        await page.waitForTimeout(500)
        await page.click("input[name='ไม่ใช่ GenEd']");
        await expect(page).toMatch('2145490 AERO ENG SEM III')
        await expect(page).not.toMatch('0201172 SELF/CAREER MGT')
        await expect(page).not.toMatch('0201287 MAP APPLN')


        await page.click("input[name='ไม่ใช่ GenEd']");
        await page.click("input[name='วันพฤหัสบดี']");
        await page.click("input[name='วันอังคาร']");
        await page.click("input[name='หมวดวิทย์']");
        await expect(page).not.toMatch('2145290 AERO ENG SEM I')
        await expect(page).not.toMatch('0201172 SELF/CAREER MGT')
        await expect(page).not.toMatch('0201287 MAP APPLN')
        await expect(page).toMatch('2145217 SCI PROG')


        await expect(page).toClick("input[value='15:30']");
        await expect(page).toClick(`li[data-value="18:00"]`);
        await expect(page).not.toMatch('2145290 AERO ENG SEM I')
        await expect(page).not.toMatch('0201172 SELF/CAREER MGT')
        await expect(page).not.toMatch('0201287 MAP APPLN')
        await expect(page).not.toMatch('2141491 RES METHODO')
        await expect(page).toMatch('2189570 ELEC MAT')

    })
})