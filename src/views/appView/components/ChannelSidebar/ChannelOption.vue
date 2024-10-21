<script setup lang="js">
import { Icon } from '@iconify/vue/dist/iconify.js';


const props = defineProps({
    name: String,
    active: Boolean
})

console.log(props.name, props.active)

</script>

<template>
    <button class="self-start justify-start w-full h-10 min-h-10 btn" :class="(props.active)?'btn-primary':''">
        <div class="flex flex-row gap-2">
            <Icon icon="mdi:hashtag" /> {{ props.name }}
        </div>
    </button>
</template>