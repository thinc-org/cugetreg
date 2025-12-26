<script lang="ts">
    import { Pencil, User } from "lucide-svelte";

    import { IconButton } from "../../atoms/icon-button";

    interface Props {
        name?: string;
        id?: string;
        username?: string;
        firstName?: string;
        lastName?: string;
        faculty?: string;
        department?: string;
        accountProvider?: string;
        accountEmail?: string;
        onEdit?: () => void;
    }

    let {
        name = "Wanrudee Kittichaiyakorn",
        id = "6534344444",
        username = "6534344444",
        firstName = "Wanrudee",
        lastName = "Kittichaiyakorn",
        faculty = "วิศวกรรมศาสตร์",
        department = "-",
        accountProvider = "Google",
        accountEmail = "6534344444@student.chula.ac.th",
        onEdit,
    }: Props = $props();

    const infoItems = [
        { label: "username", value: username },
        { label: "ชื่อจริง", value: firstName },
        { label: "นามสกุล", value: lastName },
        { label: "คณะ", value: faculty },
        { label: "ภาควิชา", value: department },
    ];
</script>

<div
    class="w-full max-w-md rounded-2xl bg-surface-container-lowest p-7 text-on-surface"
>
    <div class="flex flex-col gap-2 pb-6">
        <p class="text-h2 font-bold">{name}</p>
        <p class="text-body2 text-on-surface/60">ID: {id}</p>
    </div>

    <div>
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
                <User size="18" strokeWidth="2.5" color="#1F2430" />
                <p class="text-h3 font-bold">ข้อมูลส่วนตัว</p>
            </div>
            <IconButton variant="ghost" onclick={() => onEdit?.()}>
                <Pencil size="18" strokeWidth="2.5" />
            </IconButton>
        </div>
        <div class="mt-4 grid grid-cols-2 gap-x-8 gap-y-4">
            <div class="flex flex-col gap-1">
                <p class="text-caption uppercase tracking-wide text-on-surface/50">
                    username
                </p>
                <p class="text-body2 font-medium">{username}</p>
            </div>
            <div></div>
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
            <div class="flex flex-col gap-1">
                <p class="text-caption uppercase tracking-wide text-on-surface/50">
                    คณะ
                </p>
                <p class="text-body2 font-medium">{faculty}</p>
            </div>
            <div class="flex flex-col gap-1">
                <p class="text-caption uppercase tracking-wide text-on-surface/50">
                    ภาควิชา
                </p>
                <p class="text-body2 font-medium">{department}</p>
            </div>
        </div>
    </div>

    <div class="pt-6 mt-4">
        <div class="flex items-center gap-3">
            <User size="18" strokeWidth="2.5" color="#1F2430" />
            <p class="text-h3 font-bold">เชื่อมต่อบัญชี</p>
        </div>
        <div class="mt-4 flex items-center gap-3 rounded-xl border border-surface-container-low bg-surface-container-low px-4 py-3">
            <div class="flex h-8 w-8 items-center justify-center">
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 48 48"
                    aria-label={accountProvider}
                >
                    <path
                        fill="#EA4335"
                        d="M24 9.5c3.54 0 6.3 1.52 8.01 2.8l5.9-5.9C34.33 3.44 29.6 1 24 1 14.64 1 6.4 6.36 2.6 14.1l6.9 5.36C11.3 13.1 17.2 9.5 24 9.5z"
                    />
                    <path
                        fill="#4285F4"
                        d="M46.5 24.5c0-1.5-.14-2.94-.4-4.32H24v8.2h12.7c-.55 3-2.25 5.54-4.8 7.24l7.1 5.5c4.15-3.82 6.5-9.45 6.5-16.62z"
                    />
                    <path
                        fill="#FBBC05"
                        d="M9.5 28.54a14.5 14.5 0 0 1 0-9.08L2.6 14.1C.98 17.32 0 20.92 0 24.5s.98 7.18 2.6 10.4l6.9-5.36z"
                    />
                    <path
                        fill="#34A853"
                        d="M24 48c5.6 0 10.33-1.84 13.77-5l-7.1-5.5c-1.96 1.32-4.48 2.1-6.67 2.1-6.8 0-12.7-3.6-14.5-9.96l-6.9 5.36C6.4 41.64 14.64 48 24 48z"
                    />
                </svg>
            </div>
            <p class="text-body2 font-medium">{accountEmail}</p>
        </div>
    </div>
</div>
