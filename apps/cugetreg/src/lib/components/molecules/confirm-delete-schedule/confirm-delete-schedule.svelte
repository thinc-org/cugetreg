<script lang="ts">
    import { Button } from "../../atoms/button";

    interface Props {
        scheduleName?: string;
        onCancel?: () => void;
        onConfirm?: () => void;
        variant?: "overlay" | "card";
    }

    let {
        scheduleName = "ตารางเรียนแสนสนุก",
        onCancel,
        onConfirm,
        variant = "overlay",
    }: Props = $props();

    const handleCancel = () => {
        onCancel?.();
    };

    const handleConfirm = () => {
        onConfirm?.();
    };

    const wrapperClass =
        variant === "overlay"
            ? "fixed inset-0 flex items-center justify-center bg-surface-container-highest/60 p-4"
            : "w-full flex items-center justify-center p-4";
</script>

<div class={wrapperClass} role="presentation">
    <div
        class="w-full max-w-md rounded-2xl border-2 border-surface-container-low bg-surface px-8 py-10 text-center shadow-[0_10px_30px_rgba(0,0,0,0.15)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-title"
        aria-describedby="delete-description"
    >
        <h2 id="delete-title" class="text-h2 font-bold text-on-surface">
            ลบตารางเรียน
        </h2>
        <p
            id="delete-description"
            class="mt-4 text-body2 font-medium text-on-surface/70"
        >
            คุณต้องการลบ<br />
            '{scheduleName}'<br />
            ใช่หรือไม่
        </p>
        <div class="mt-8 flex items-center justify-center gap-4">
            <Button color="neutral" class="w-32 h-9" onclick={handleCancel}>
                ยกเลิก
            </Button>
            <Button color="error" class="w-32 h-9" onclick={handleConfirm}>
                ลบตาราง
            </Button>
        </div>
    </div>
</div>
