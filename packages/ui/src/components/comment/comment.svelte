<script>
  import { ThumbsUp } from 'lucide-svelte';
  import { ThumbsDown } from 'lucide-svelte';
  export let content = `ส่วนตัวคิดว่าค่อนข้างสบาย
มีงานสัปดาห์ละครั้ง ปกติจะมีวิดีโอให้ดู ไม่ยาวมาก แต่จะไม่ดูก็ได้ เพราะปกติเราแค่อ่านตัวอย่างที่ให้มาแล้วก็ลองเขียนเลย งานส่วนใหญ่จะให้ Topic กว้างๆมา ถ้าอาจารย์ประจำ sec ไม่ strict มาก ก็เขียนตามใจไปเลย แค่เอาเรื่องที่เรียนในสัปดาห์นั้นมาปรับๆนิดหน่อย ปกติจะไม่อยากเสียเวลามาก ก็เขียนครั้งเดียวแล้วส่งไปเลย เลยเสียเวลาแค่ 1-2 ชม. ต่อสัปดาห์ แต่ถ้าใครจริงจังกับงานเขียนหน่อยก็อาจใช้เวลาเพิ่มขึ้น
สอบเหมือนกับงานที่ทำ จะไม่อ่านไปสอบก็ได้ถ้าจำพวกงานที่ทำส่งได้ แต่ก่อนสอบมีคลิปรีวิวให้ดูก่อน พึ่งตัวนี้เอาก็ได้
อันนี้ก็ขึ้นอยู่กับ sec ของเราอาจารย์ให้คะแนนงานค่อนข้างง่าย แต่จะให้คะแนนสอบยากหน่อย แต่เฉลี่ยๆรวมๆกันก็ได้ A
เพราะเขียนตามใจตัวเองเป็นหลัก ไม่ค่อยยึดกับเรื่องที่เรียนมาเลยรู้สึกไม่ค่อยได้อะไรใหม่ ที่ช่วยน่าจะเป็นการจัดระเบียบความคิดและสรุปให้อยู่ในย่อหน้า`;
  export let semester = `ภาคต้น 2565`;
  export let rating = 4.0;
  export let likesCount = 2;
  export let dislikesCount = 0;
</script>
  
<style>
  .fontcolor {
    color: #353745;
  }
  .comment {
    width: 968px;
    height: 444px;
    border: 1px solid #D6D7E1; /* 1px border */
    padding: 16px; /* Optional padding */
    box-sizing: border-box; /* Ensure padding doesn't affect dimensions */
    color: #353745;
  }
  .rating {
    font-weight: bold;
    color: #4A70C6;
  }
</style>

<div class="comment rounded-lg flex flex-col place-content-center">
  <div class="ml-8 flex flex-row">
    <div class="mr-2 rating">
      {rating}
    </div>
    <div>
      
    </div>
    <div class="fontcolor">
      {semester}
    </div>
  </div>
  <div class="w-[872px] h-[252px] self-center mt-6">
    {content}
  </div>
  <div class="ml-8 flex flex-row">
    <div class="flex flex-row">
      <ThumbsUp class="mx-2" />
      {likesCount}
    </div>
    <div class="flex flex-row ml-4">
      <ThumbsDown class="mx-2"/>
      {dislikesCount}
    </div>
  </div>
</div>
