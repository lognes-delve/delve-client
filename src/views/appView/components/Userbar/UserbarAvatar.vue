<script setup lang="js">

const props = defineProps({
    display_name : String
});

</script>

<template>
    <div class="flex items-center flex-shrink align-middle">
        <div class="flex avatar">
            <div class="flex w-12 h-12 rounded-full bg-base-100">
                <div class="inline-flex items-center justify-center w-full h-full text-2xl font-semibold">
                    A
                </div>

            </div>

        </div>
    </div>
</template>