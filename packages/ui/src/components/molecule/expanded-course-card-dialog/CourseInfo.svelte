<script lang="ts">
  import { ArrowRight, Dot } from 'lucide-svelte'

  import { Button } from '../../atom/button/index'
  import { type Course } from './index'

  export let course: Course
</script>

<div class="flex justify-between">
  <div class="flex gap-8">
    <div class="space-y-1">
      <p class="text-on-surface text-h2">{course.code} {course.name}</p>
      <p
        class="flex text-on-surface-placeholder text-body2 font-normal font-sarabun"
      >
        {course.credits} หน่วยกิต
        <span><Dot class="text-surface-container-lowest" /></span>
        {course.reviews} รีวิว
      </p>
    </div>
    <Button variant="outlined">
      ข้อมูลรายวิชา <ArrowRight
        class="text-on-primary-container size-4 ml-1 stroke-[3]"
      />
    </Button>
  </div>
</div>
