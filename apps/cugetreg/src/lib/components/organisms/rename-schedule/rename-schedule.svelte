<script lang="ts">
    import { untrack } from "svelte"
    import { Button } from "../../atoms/button";
    import { Input } from "../../atoms/input";

    interface RenameScheduleProp {
        onCancel: () => void;
        onConfirm: () => void;
        name?: string;
    }

    let {
        name = $bindable(),
        onCancel = () => {},
        onConfirm = () => {},
    }: RenameScheduleProp = $props();

    function handleConfirm() {
        name = nameDraft;
        onConfirm();
    }

    const LENGTH_CAP = 30;

    let nameDraft = $state(untrack(() => name));
    let length = $derived(nameDraft?.length ?? 0);

    $effect(() => {
        nameDraft = nameDraft?.slice(0, LENGTH_CAP);
    });
</script>

<div class="p-5 border border-neutral-200 bg-surface w-[300px] rounded-lg">
    <span class="text-xl font-bold">แก้ไขชื่อ</span>
    <div class="my-5">
        <Input 
            bind:value={nameDraft}
        />
        <span class="text-caption leading-caption text-neutral-400">จำนวนตัวอักษร {length} / {LENGTH_CAP}</span>
    </div>
    <div class="flex justify-between gap-3">
        <Button class="flex-1" variant="outlined" onclick={onCancel}>ยกเลิก</Button>
        <Button class="flex-1" onclick={handleConfirm}>ยืนยัน</Button>
    </div>
</div>
