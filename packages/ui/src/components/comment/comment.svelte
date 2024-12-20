<script>
  import { ThumbsUp } from 'lucide-svelte'
  import { ThumbsDown } from 'lucide-svelte'
  import { Star } from 'lucide-svelte'
  export let content = `ส่วนตัวคิดว่าค่อนข้างสบาย
มีงานสัปดาห์ละครั้ง ปกติจะมีวิดีโอให้ดู ไม่ยาวมาก แต่จะไม่ดูก็ได้ เพราะปกติเราแค่อ่านตัวอย่างที่ให้มาแล้วก็ลองเขียนเลย งานส่วนใหญ่จะให้ Topic กว้างๆมา ถ้าอาจารย์ประจำ sec ไม่ strict มาก ก็เขียนตามใจไปเลย แค่เอาเรื่องที่เรียนในสัปดาห์นั้นมาปรับๆนิดหน่อย ปกติจะไม่อยากเสียเวลามาก ก็เขียนครั้งเดียวแล้วส่งไปเลย เลยเสียเวลาแค่ 1-2 ชม. ต่อสัปดาห์ แต่ถ้าใครจริงจังกับงานเขียนหน่อยก็อาจใช้เวลาเพิ่มขึ้น
สอบเหมือนกับงานที่ทำ จะไม่อ่านไปสอบก็ได้ถ้าจำพวกงานที่ทำส่งได้ แต่ก่อนสอบมีคลิปรีวิวให้ดูก่อน พึ่งตัวนี้เอาก็ได้
อันนี้ก็ขึ้นอยู่กับ sec ของเราอาจารย์ให้คะแนนงานค่อนข้างง่าย แต่จะให้คะแนนสอบยากหน่อย แต่เฉลี่ยๆรวมๆกันก็ได้ A
เพราะเขียนตามใจตัวเองเป็นหลัก ไม่ค่อยยึดกับเรื่องที่เรียนมาเลยรู้สึกไม่ค่อยได้อะไรใหม่ ที่ช่วยน่าจะเป็นการจัดระเบียบความคิดและสรุปให้อยู่ในย่อหน้า`
  export let semester = `ภาคต้น 2565`
  export let rating = 4.0
  export let likesCount = 2
  export let dislikesCount = 0
  // Calculate the number of filled and unfilled stars
  const totalStars = 5
  const filledStars = Math.floor(rating) // Number of fully filled stars
  const hasHalfStar = rating % 1 !== 0 // Determine if there's a half star
  const emptyStars = totalStars - filledStars - (hasHalfStar ? 1 : 0)
</script>

<div
  class="w-[968px] h-[444px] border border-[#d6d7e1] py-10 px-12 box-border rounded-xl flex flex-col place-content-center"
>
  <div class="flex flex-row">
    <div class="mr-4 font-bold text-h3 text-primary">
      {#if !hasHalfStar}
        <span>{rating}.0</span>
      {/if}
      {#if hasHalfStar}
        <span>{rating}</span>
      {/if}
    </div>
    <div class="flex flex-row mr-4 text-h3 text-primary gap-1.5">
      <!-- Render filled stars -->
      {#each Array(filledStars) as _, i}
        <Star fill="currentColor" stroke="none" />
      {/each}

      <!-- Optionally render a half star (if applicable) -->
      {#if hasHalfStar}
        <div class="flex gap-0">
          <div class="relative inline-block w-6 h-6 overflow-hidden max-w-3">
            <Star fill="currentColor" />
          </div>
          <div
            class="relative inline-block w-6 h-6 overflow-hidden max-w-3 transform scale-x-[-1]"
          >
            <Star />
          </div>
        </div>
      {/if}

      <!-- Render unfilled stars -->
      {#each Array(emptyStars) as _, i}
        <Star />
      {/each}
    </div>
    <div class="text-subtitle font-sans font-medium">
      {semester}
    </div>
  </div>
  <div
    class="w-[872px] h-[252px] self-center mt-6 text-body1 font-sarabun font-regular"
  >
    {content}
  </div>
  <div class="gap-6 flex flex-row text-subtitle font-sans">
    <div class="flex flex-row font-medium">
      <ThumbsUp class="mr-2 text-neutral-400" />
      {likesCount}
    </div>
    <div class="flex flex-row font-medium">
      <ThumbsDown class="mr-2 text-neutral-400" />
      {dislikesCount}
    </div>
  </div>
</div>
