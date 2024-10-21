<script setup lang="js">
import { ref } from 'vue';
import ChatViewHeader from './ChatViewHeader.vue';
import ChatMessageView from './ChatMessageView.vue';
import ChatControl from './ChatControl.vue';

const currentChannelName = ref("general");

</script>

<template>
    <div class="flex flex-col w-full">

        <ChatViewHeader :name="currentChannelName"/>

        <div class="flex-grow">
            <ChatMessageView />
        </div>

        <ChatControl />
        
    </div>
</template>