<script lang="ts">
    import { BookOpen, BookPlus, ChevronDown, Plus, Trash2 } from "@lucide/svelte";

    import { Button } from "../../atoms/button";
    import { Switch } from "../../atoms/switch";
    import { ConfirmDeleteSchedule } from "../../molecules/confirm-delete-schedule";

    interface ScheduleItem {
        title: string;
        subtitle: string;
        isPublic: boolean;
    }

    interface Props {
        heading?: string;
        selectedTerm?: string;
        terms?: string[];
        items?: ScheduleItem[];
        onSelectTerm?: (term: string) => void;
        onDelete?: (index: number) => void;
        onAdd?: () => void;
    }

    const defaultItems: ScheduleItem[] = [
        {
            title: "ทวิภาค 2567 ภาคต้น",
            subtitle: "ทวิภาค 2567 / ภาคต้น",
            isPublic: true,
        },
        {
            title: "ทวิภาค 2566 ภาคต้น",
            subtitle: "ทวิภาค 2566 / ภาคต้น",
            isPublic: false,
        },
        {
            title: "ทวิภาค 2566 ภาคต้น",
            subtitle: "ทวิภาค 2566 / ภาคต้น",
            isPublic: false,
        },
    ];

    let {
        heading = "",
        selectedTerm = $bindable("ทวิภาค 2567 ภาคต้น"),
        terms = ["ทวิภาค 2567 ภาคต้น", "ทวิภาค 2566 ภาคต้น"],
        items = defaultItems,
        onSelectTerm,
        onDelete,
        onAdd,
    }: Props = $props();

    const getYear = (value: string) => {
        const match = value.match(/\d{4}/);
        return match?.[0] ?? "";
    };

    let visibleItems = $derived(
        items.filter((item) => item.title.includes(getYear(selectedTerm))),
    );
    let hasItems = $derived(items.length > 0);

    let isDropdownOpen = $state(false);
    let confirmIndex = $state<number | null>(null);

    const closeDropdown = () => {
        isDropdownOpen = false;
    };

    const openConfirm = (index: number) => {
        confirmIndex = index;
    };

    const closeConfirm = () => {
        confirmIndex = null;
    };
</script>

<div class="w-full max-w-md text-on-surface">
    {#if heading}
        <div class="flex items-center gap-3 text-h3 font-bold">
            <BookOpen size="18" strokeWidth="2.5" />
            <p>{heading}</p>
        </div>
    {/if}

    {#if hasItems}
        <div class="mt-4 relative">
            <button
                type="button"
                class="flex w-full items-center justify-between rounded-2xl border border-surface-container-low bg-surface px-4 py-4 text-body2 font-semibold underline underline-offset-4 text-on-surface"
                onclick={() => (isDropdownOpen = !isDropdownOpen)}
            >
                <span>{selectedTerm}</span>
                <ChevronDown
                    size="18"
                    strokeWidth="2.5"
                    class={isDropdownOpen ? "text-on-surface/70 rotate-180 transition-transform" : "text-on-surface/70 transition-transform"}
                />
            </button>
            {#if isDropdownOpen}
                <div
                    class="fixed inset-0 bg-neutral-500/60 z-10"
                    role="button"
                    tabindex="0"
                    aria-label="Close schedule dropdown"
                    onclick={closeDropdown}
                    onkeydown={(e) => e.key === "Enter" && closeDropdown()}
                ></div>
                <div
                    class="absolute right-0 z-20 mt-2 w-full rounded-2xl border border-surface-container-low bg-surface shadow-lg"
                >
                    <div class="flex flex-col">
                        {#each terms as term}
                            <button
                                type="button"
                                class="px-4 py-3 text-left text-body2 font-medium text-on-surface hover:bg-surface-container-lowest"
                                onclick={() => {
                                    selectedTerm = term;
                                    onSelectTerm?.(selectedTerm);
                                    closeDropdown();
                                }}
                            >
                                {term}
                            </button>
                        {/each}
                    </div>
                    <div class="border-t border-surface-container-low">
                        <button
                            type="button"
                            class="flex w-full items-center justify-center gap-2 px-4 py-3 text-body2 font-semibold text-on-surface"
                            onclick={() => {
                                onAdd?.();
                                closeDropdown();
                            }}
                        >
                            <Plus size="16" strokeWidth="2.5" />
                            เพิ่มตาราง
                        </button>
                    </div>
                </div>
            {/if}
        </div>

        <div class="mt-4 flex flex-col gap-4">
            {#each visibleItems as item, index}
                <div class="rounded-3xl border border-surface-container-low bg-surface px-6 py-6">
                    <div class="flex items-start justify-between gap-3">
                        <div class="flex flex-col gap-1">
                            <p class="text-body2 font-semibold underline underline-offset-4">
                                {item.title}
                            </p>
                            <p class="text-body2 text-on-surface/50">
                                {item.subtitle}
                            </p>
                        </div>
                        <button
                            type="button"
                            class="text-error hover:text-error-hover"
                            onclick={() => openConfirm(index)}
                            aria-label="Delete schedule"
                        >
                            <Trash2 size="18" strokeWidth="2.5" />
                        </button>
                    </div>
                    <div class="mt-5 flex items-center gap-3">
                        <Switch checked={item.isPublic} label={null} />
                        <p class="text-body2 font-medium text-on-surface/70">
                            เป็นสาธารณะ
                        </p>
                    </div>
                </div>
            {/each}
        </div>
    {:else}
        <div class="mt-6 flex flex-col items-center gap-4 px-8 py-10 text-center">
            <BookPlus size="56" strokeWidth="1.5" class="text-primary" />
            <div class="space-y-2">
                <p class="text-h3 font-semibold text-on-surface">
                    เริ่มเพิ่มตารางเรียน
                </p>
                <p class="text-body2 text-on-surface/60">
                    เริ่มสร้างตารางเรียนแรกของคุณเพื่อวางแผนการลงทะเบียนเรียน
                    และดูภาพรวมตารางเรียนทั้งหมดที่คุณสร้างไว้ในหน้าโปรไฟล์นี้
                </p>
            </div>
            <Button
                class="w-full max-w-md bg-primary/10 text-primary hover:bg-primary/15"
                onclick={() => onAdd?.()}
            >
                เพิ่มตารางเรียน
            </Button>
        </div>
    {/if}
</div>

{#if confirmIndex !== null}
    <ConfirmDeleteSchedule
        scheduleName={visibleItems[confirmIndex]?.title ?? "ตารางเรียน"}
        onCancel={closeConfirm}
        onConfirm={() => {
            if (confirmIndex === null) return;
            onDelete?.(confirmIndex);
            closeConfirm();
        }}
    />
{/if}
