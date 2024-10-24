<script setup lang="js">
import { Icon } from '@iconify/vue/dist/iconify.js';


const props = defineProps({
    name: String
})

</script>

<template>
    <div class="flex flex-row items-center w-full h-12 gap-2 px-4 shadow-md justify-left bg-base-300">
        <Icon icon="mdi:hashtag" inline height="1.25rem" />
        <span>{{ props.name }}</span>
    </div>
</template>