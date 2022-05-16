export enum AnnouncementComponentType {
  Paragraph = 'ComponentArticleParagraph',
  Media = 'ComponentArticleMedia',
}

export interface AnnouncementComponentArticleParagraph {
  text: string
}

export interface AnnouncementComponentArticleMedia {
  media: {
    id: string
    url: string
    width: number
    height: number
  }
}

export type AnnouncementContentType =
  | ({
      id: string
      __typename: AnnouncementComponentType.Media
    } & AnnouncementComponentArticleMedia)
  | ({
      id: string
      __typename: AnnouncementComponentType.Paragraph
    } & AnnouncementComponentArticleParagraph)

export interface Announcement {
  id: string
  created_at: string
  updated_at: string
  title: string
  contents: Array<AnnouncementContentType>
}
