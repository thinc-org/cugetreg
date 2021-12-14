import { ReviewInteractionType } from '@/common/types/reviews'

export interface ReviewReactionProps {
  type: ReviewInteractionType
  pressed: boolean
  reactionCount: number
  onClick?: () => void
}
