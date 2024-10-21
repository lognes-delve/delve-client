<script setup lang="js">
import { ref } from 'vue';
import ChatMessage from './ChatMessage.vue';
import ChatChannelWelcomeHeader from './ChatChannelWelcomeHeader.vue';

const showWelcomeHeader = ref(true);

</script>

<template>
    <div class="flex flex-col justify-end w-full h-full p-4 overflow-y-scroll">

        <div v-if="showWelcomeHeader">
            <ChatChannelWelcomeHeader />
        </div>
        
    </div>
</template>