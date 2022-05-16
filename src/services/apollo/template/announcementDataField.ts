export const ANNOUNCEMENT_DATA_FIELDS = `
    id
    title
    created_at
    updated_at
    contents {
      ... on ComponentArticleParagraph {
        __typename
        id
        text
      }
      ... on ComponentArticleMedia {
        __typename
        id
        media {
          id
          url
          width
          height
        }
      }
    }
`
