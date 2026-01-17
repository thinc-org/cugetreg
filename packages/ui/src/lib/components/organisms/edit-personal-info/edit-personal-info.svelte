<script lang="ts">
    import { Button } from "../../atoms/button";
    import { Input } from "../../atoms/input";
    import { GoogleMark } from "../../logo/vendor";

    interface Props {
        username?: string;
        firstName?: string;
        lastName?: string;
        faculty?: string;
        department?: string;
        accountProvider?: string;
        accountEmail?: string;
        onCancel?: () => void;
        onConfirm?: () => void;
    }

    let {
        username = "6534344444",
        firstName = "Wanrudee",
        lastName = "Kittichaiyakorn",
        faculty = "วิศวกรรมศาสตร์",
        department = $bindable(""),
        accountProvider = "Google",
        accountEmail = "6534344444@student.chula.ac.th",
        onCancel,
        onConfirm,
    }: Props = $props();
</script>

<div
    class="w-full max-w-md rounded-2xl border border-surface-container-low bg-surface-container-lowest p-7 text-on-surface"
>
    <div class="flex flex-col gap-1 pb-5 text-center">
        <p class="text-h3 font-bold">แก้ไขข้อมูลส่วนตัว</p>
    </div>

    <div class="flex flex-col gap-3">
        <div class="flex flex-col gap-1">
            <p class="text-caption uppercase tracking-wide text-on-surface/50">
                username
            </p>
            <p class="text-body2 font-medium">{username}</p>
        </div>
        <div class="grid grid-cols-2 gap-x-6 gap-y-4">
            <div class="flex flex-col gap-1">
                <p class="text-caption uppercase tracking-wide text-on-surface/50">
                    ชื่อจริง
                </p>
                <p class="text-body2 font-medium">{firstName}</p>
            </div>
            <div class="flex flex-col gap-1">
                <p class="text-caption uppercase tracking-wide text-on-surface/50">
                    นามสกุล
                </p>
                <p class="text-body2 font-medium">{lastName}</p>
            </div>
        </div>
        <div class="flex flex-col gap-1">
            <p class="text-caption uppercase tracking-wide text-on-surface/50">
                คณะ
            </p>
            <p class="text-body2 font-medium">{faculty}</p>
        </div>

        <div class="flex flex-col gap-2">
            <p class="text-body2 font-semibold">ภาควิชา</p>
            <Input
                placeholder="ใส่รายชื่อภาควิชา..."
                class="bg-surface-container-low h-12"
                value={department}
                oninput={(e) =>
                    (department = (e.currentTarget as HTMLInputElement).value)}
            />
        </div>
    </div>

    <div class="pt-4 mt-4">
        <p class="text-body2 text-on-surface/60">เชื่อมต่อบัญชี</p>
        <div class="mt-3 flex items-center gap-3 rounded-xl border border-surface-container-low bg-surface-container-low px-4 py-3">
            <div class="flex h-8 w-8 items-center justify-center">
                <GoogleMark aria-label={accountProvider} />
            </div>
            <p class="text-body2 font-medium">{accountEmail}</p>
        </div>
    </div>

    <div class="mt-6 flex items-center justify-center gap-4 w-full">
        <Button
            color="neutral"
            class="flex-1 h-10 bg-surface-container text-on-surface/70"
            onclick={() => onCancel?.()}
        >
            ยกเลิก
        </Button>
        <Button class="flex-1 h-10" onclick={() => onConfirm?.()}>
            ยืนยัน
        </Button>
    </div>
</div>
