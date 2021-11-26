import { ReviewInteraction } from '@/common/types/reviews'

export interface ReviewReactionProps {
  type: ReviewInteraction
  pressed: boolean
  reactionCount: number
  onClick: () => void
}
