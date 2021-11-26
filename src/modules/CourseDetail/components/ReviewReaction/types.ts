import { ReviewInteraction } from '@/common/types/reviews'

export interface ReviewReactionProps {
  type: ReviewInteraction
  defaultPressed: boolean
  reactionCount: number
}
