<script setup lang="ts">
import { PropType } from 'vue';


const props = defineProps({
    classes : {
        type: String,
        default: ""
    },
})

const emit = defineEmits(["close"])

</script>

<template>
    <dialog class="modal" ref="modal" @close="(...n) => emit('close', ...n)">
        <div class="flex flex-col modal-box" :class="classes">
            <slot />
        </div>
    </dialog>
</template>