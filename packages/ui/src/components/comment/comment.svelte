<script>
  export let content = "This is a comment"; // Example prop
</script>

<style>
  .comment {
    width: 968px;
    height: 444px;
    border: 1px solid #D6D7E1; /* 1px border */
    padding: 16px; /* Optional padding */
    box-sizing: border-box; /* Ensure padding doesn't affect dimensions */
  }
</style>

<div class="comment">
  <p>{content}</p>
</div>
