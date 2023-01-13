import cheerio from "cheerio"

export async function facultySelector(response: string) {
  // declare faculties
  const faculties: string[] = []

  // add faculties
  const $ = await cheerio.load(response)
  $("#faculty")
    .children()
    .each((_, child) => {
      faculties.push(child.attribs.value)
    })
  // remove empty faculty
  faculties.shift()

  //return faculties
  return faculties
}
