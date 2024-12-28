<script>
  import { Star } from 'lucide-svelte'
  let rating = $props()
  // Calculate the number of filled and unfilled stars
  const totalStars = 5
  let filledStars = $derived(Math.floor(rating)) // Number of fully filled stars
  let hasHalfStar = $derived(rating % 1 !== 0) // Determine if there's a half star
  let emptyStars = $derived(totalStars - filledStars - (hasHalfStar ? 1 : 0))
</script>
