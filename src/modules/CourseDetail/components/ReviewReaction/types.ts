export interface ReviewReactionProps {
  type: ReviewReactionType
  defaultPressed: boolean
  reactionCount: number
}

export enum ReviewReactionType {
  Like = 'like',
  Dislike = 'dislike',
}
