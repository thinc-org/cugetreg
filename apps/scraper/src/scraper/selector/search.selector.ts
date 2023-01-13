import cheerio from "cheerio"

export async function searchSelector(response: string) {
  const $ = await cheerio.load(response)
  // collect all course number
  return await $("a")
    .text()
    .trim()
    .split("\n")
    .map(courseNo => courseNo.trim())
}
