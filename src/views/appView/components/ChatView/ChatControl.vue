<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js';
import { computed, ref, useTemplateRef } from 'vue';
import { stateStore } from '../../../../store';
import { createMessage } from '../../../../api/messages';

const chatbox = useTemplateRef("chatbox");

const generateTextboxPlaceholder = () => {
    return "Say Hello!";
}

const isChatboxDisabled = ref(false);

const chatboxState = computed({
    set: (value : String) => stateStore.commit("setChatboxContent", value),
    get: () => stateStore.state.currentChatboxContent
})

const doMessageSend = async () => {
    
    // Disable the chatbox because we dont want the user to edit the message while it's being sent
    isChatboxDisabled.value = true;

    // Just don't do anything if the user isn't viewing a community
    if (stateStore.getters.isNoActiveCommunity) {
        return;
    }
    
    const newMessage = await createMessage(
        stateStore.state.currentViewingCommunity,
        stateStore.state.currentViewingChannel,
        {
            text : stateStore.state.currentChatboxContent
        }
    );

    if (!newMessage) {
        isChatboxDisabled.value = false; // Unlock the chatbox
        throw Error("Failed to send message :(");
    }

    // If the message is sent, then we clear the chatbox
    stateStore.commit("clearChatboxContent");

    // Unlock the chatbox because we cool like that
    isChatboxDisabled.value = false;

    await new Promise((resolve) => setTimeout(resolve, 50))

    if (chatbox.value) {
        chatbox.value?.focus();
    }

}

</script>

<template>
    <div class="flex w-full p-2 bg-base-300 min-h-12">

        <div class="relative flex w-full gap-2">
            <input 
                class="w-full h-10 textarea max-h-64" 
                type="text"
                ref="chatbox" 
                v-model="chatboxState" 
                :placeholder="generateTextboxPlaceholder()" 
                :disabled="isChatboxDisabled"
                @keyup.enter="doMessageSend"
            />

            <!--
            
            It would've been cool to add this but there's no time 

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
            -->

        </div>

    </div>
</template>