<script setup lang="ts">
import { onBeforeMount, onMounted, ref, watch, computed } from 'vue';
import { getChannelMessages, getMessageById } from '../../../../api/messages';
import { getChannelById } from '../../../../api/channels';
import { getMemberById } from '../../../../api/members';
import ChatMessage from './ChatMessage.vue';
import ChatChannelWelcomeHeader from './ChatChannelWelcomeHeader.vue';
import { stateStore } from '../../../../store';
import { GatewayWebSocket } from '../../../../api/gateway/gateway';
import {
    isPermissionGranted,
    requestPermission,
    sendNotification
} from "@tauri-apps/plugin-notification";

const showWelcomeHeader = ref(true);

const channelMessages = ref(new Array());
const isMessagesLoading = ref(false);
const notifPermsGranted = ref<Boolean | null>(null);

const channelIdRef = computed(() => {return stateStore.state.currentViewingChannel;})

watch(channelIdRef, async (nv, ov) => {
    
    if (nv === ov) {
        return;
    }

    channelMessages.value = new Array(0);

    await pullRecentMessagesForNewChannel();
})

const pullRecentMessagesForNewChannel = async () => {

    isMessagesLoading.value = true;

    if(stateStore.getters.isNoActiveCommunity){
        channelMessages.value = []; // Keep the array empty
        isMessagesLoading.value = false;
        return;
    }
    
    const recentChannelMessages = await getChannelMessages(
        stateStore.getters.currentCommunity.id,
        stateStore.getters.currentChannel.id,
        {
            limit: 50
        }
    );
    
    // Append the recent channel messages to the end of the list
    channelMessages.value = recentChannelMessages.concat(channelMessages.value);
    
    isMessagesLoading.value = false;
}

onBeforeMount(async () => {
    await pullRecentMessagesForNewChannel();

    const gatewayWS : GatewayWebSocket = stateStore.state.gatewayWebsocket ;

    gatewayWS.registerEventHandler(
        "community_message_created",
        async (event : any) => {
            channelMessages.value.unshift(event["message"]);
        }
    )

    notifPermsGranted.value = await isPermissionGranted();

    if (!notifPermsGranted.value) {
        console.log("Requesting....");
        const permRequest = await requestPermission();
        notifPermsGranted.value = permRequest === "granted";
    }

    console.log(notifPermsGranted.value);

    if (true)
    {
        gatewayWS.registerEventHandler(
            "community_message_ping",
            async (event : any) => {
                
                const messageInfo = await getMessageById(
                    event?.community_id,
                    event?.channel_id,
                    event?.message_id
                );

                const memberInfo = await getMemberById(
                    event?.community_id,
                    messageInfo.author_id
                );

                const channelInfo = await getChannelById(
                    event?.community_id,
                    event?.channel_id
                );

                sendNotification(
                    {
                        title: `${memberInfo.nickname ? memberInfo.nickname : memberInfo.user.display_name} (#${channelInfo.name})`,
                        body : `${messageInfo.content.text}`
                    }
                );
            }
        )
    }

})

</script>

<template>
    <div class="relative flex w-full h-full overflow-auto">
        <div class="flex flex-col-reverse w-full h-full gap-1 p-4 overflow-x-hidden overflow-y-scroll" v-if="!isMessagesLoading">
            
            <div v-if="showWelcomeHeader && !(channelMessages.length > 0)">
                <ChatChannelWelcomeHeader />
            </div>
            
            <TransitionGroup>
                <ChatMessage v-for="m in channelMessages" :message="m" :key="m.id"/>
            </TransitionGroup>
        </div>
        <div v-else class="flex flex-col items-center justify-center w-full h-full">
            <span class="loading loading-spinner"></span>
        </div>
    </div>
</template>

<style lang="scss">
.v-enter-active,
.v-leave-active {
  transition: all 0.2s cubic-bezier(0.215, 0.610, 0.355, 1);
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>