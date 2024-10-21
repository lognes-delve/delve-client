<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js';

const generateTextboxPlaceholder = () => {
    return "Say Hello!";
}

</script>

<template>
    <div class="flex w-full p-2 bg-base-300 min-h-12">

        <div class="relative flex w-full gap-2">
            <textarea class="w-full h-10 textarea max-h-64" type="text"
                :placeholder="generateTextboxPlaceholder()" />

            <div class="join">
                <button class="btn btn-ghost join-item">
                    <Icon icon="mdi:emoticon" inline height="1.75rem" />    
                </button>
                <button class="btn btn-ghost join-item">
                    <Icon icon="mdi:file-gif-box" inline height="1.75rem" />    
                </button>
                <button class="btn btn-ghost join-item">
                    <Icon icon="mdi:file-plus" inline height="1.75rem" />    
                </button>
            </div>

        </div>

    </div>
</template>