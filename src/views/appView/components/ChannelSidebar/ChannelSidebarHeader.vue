<script setup>
import { Icon } from '@iconify/vue/dist/iconify.js';


const props = defineProps({
    name : String,
    isVerified : Boolean
})

</script>

<template>
    <div class="flex flex-row p-4 border-b line-clamp-1 bg-base-300 border-b-accent-content">
        
        <!-- The actual community title -->
        <div class="relative flex flex-row items-center flex-grow gap-1.5 font-semibold align-middle overflow-ellipsis line-clamp-1">
            <span class="relative">
                <Icon class="text-primary" icon="mdi:verified" height="1.25rem" inline/>
            </span>
            {{ props.name }}
        </div>

        <button class="min-h-0 p-1 btn btn-ghost h-fit">
            <Icon icon="mdi-cog" height="auto" inline/>
        </button>
    </div>
</template>