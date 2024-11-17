<script setup lang="js">
import { ref, computed } from 'vue';
import ChatViewHeader from './ChatViewHeader.vue';
import ChatMessageView from './ChatMessageView.vue';
import ChatControl from './ChatControl.vue';
import { stateStore } from '../../../../store';

const currentChannelName = computed(
    () => {
        const currentChannel = stateStore.getters.currentChannel;

        if (!currentChannel) {
            return ""; // tmp value to prevent un-init problems
        }

        return currentChannel.name;
    }
)

</script>

<template>
    <div class="relative flex flex-col w-full h-full">

        <div class="relative flex">
            <ChatViewHeader :name="currentChannelName"/>
        </div>

        <div class="relative flex h-full overflow-y-auto">
            <ChatMessageView />
        </div>

        <div class="relative flex">
            <ChatControl />
        </div>
        
    </div>
</template>