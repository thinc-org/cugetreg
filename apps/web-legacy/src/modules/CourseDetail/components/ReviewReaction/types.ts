import { ReviewInteractionType } from '@cgr/codegen'

export interface ReviewReactionProps {
  type: ReviewInteractionType
  pressed: boolean
  reactionCount: number
  onClick?: () => void
}
