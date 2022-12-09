import { ReviewInteractionType } from '@libs/codegen'

export interface ReviewReactionProps {
  type: ReviewInteractionType
  pressed: boolean
  reactionCount: number
  onClick?: () => void
}
