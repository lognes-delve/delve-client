<script setup lang="ts">
import { onBeforeMount, onMounted, ref, watch, computed, useTemplateRef } from 'vue';
import { deleteMessage, getChannelMessages, getMessageById } from '../../../../api/messages';
import { getChannelById } from '../../../../api/channels';
import { getMemberById, getMemberList } from '../../../../api/members';
import ChatMessage from './ChatMessage.vue';
import ChatChannelWelcomeHeader from './ChatChannelWelcomeHeader.vue';
import { stateStore } from '../../../../store';
import { GatewayWebSocket } from '../../../../api/gateway/gateway';
import {
    isPermissionGranted,
    requestPermission,
    sendNotification
} from "@tauri-apps/plugin-notification";
import { MemberWithEmbeddedUser, Message } from '../../../../api/models';
import ConfirmationDeletionModal from '../Modals/ConfirmationDeletionModal.vue';
import UserPopoverCard from '../Reusable/UserPopoverCard.vue';

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

const deletingMessage = ref<Message | null>(null);
const deleteMessageModal = useTemplateRef("delete_message_modal")
watch(deletingMessage, async (nv, ov) => {
    
    // If the new value detected is the act of clearing the variable, don't do anything
    if (nv === null) {
        return;
    }

    // Otherwise, the new value must be a new message id, so clean the channel
    deleteMessageModal.value.$el.showModal();

})

const doDeleteMessage = async () => {
    await deleteMessage(
        deletingMessage.value?.community_id as string,
        deletingMessage.value?.channel_id as string,
        deletingMessage.value?.id as string
    );

    // reset the ref
    deletingMessage.value = null;
}

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
});

const gatewayWS : GatewayWebSocket = stateStore.state.gatewayWebsocket ;

gatewayWS.registerEventHandler(
    "community_message_created",
    async (event : any) => {
        channelMessages.value.unshift(event["message"]);
    }
);

gatewayWS.registerEventHandler(
    "community_message_deleted",
    async (event : any) => {
        const index = channelMessages.value.findIndex((value : Message) => {
            return value.id === event?.message_id;
        });

        // Failed to find message? Do nothing.
        if (index === -1) {
            return;
        }

        channelMessages.value.splice(index, 1);
    }
)

gatewayWS.registerEventHandler(
    "community_message_ping",
    async (event : any) => {

        let notifPermissions = await isPermissionGranted();

        if (!notifPermissions) {
            const reqResult = await requestPermission();
            if (reqResult !== "granted") {
                return;
            }
        }
        
        const messageInfo = await getMessageById(
            event?.community_id,
            event?.channel_id,
            event?.message_id
        );

        const memberInfo = await getMemberList(
            event?.community_id
        );

        const memberLookupTable : Record<string, MemberWithEmbeddedUser> = Object.fromEntries(memberInfo.map(o => [o.user_id as string, o]));

        const channelInfo = await getChannelById(
            event?.community_id,
            event?.channel_id
        );

        function mentionReplacer (match : any, p1 : any, offset : any, string : any) : string {
            if (!Object.keys(memberLookupTable).includes(p1)) {
                return "@unknown-user"; // fallback if the mention is faulty
            };

            return "@" + (memberLookupTable[p1].nickname ? memberLookupTable[p1].nickname : memberLookupTable[p1].user.display_name)
        }

        const serialized_body = messageInfo.content.text.replace(
            /<@([0-9a-f]{24})>/g, mentionReplacer
        )

        sendNotification(
            {
                title: `${memberLookupTable[messageInfo.author_id as string].nickname ? memberLookupTable[messageInfo.author_id as string].nickname : memberLookupTable[messageInfo.author_id as string].user.display_name} (#${channelInfo.name})`,
                body : `${serialized_body}`
            }
        );
    }
)

</script>

<template>
    <div class="relative flex w-full h-full overflow-auto">

        <div class="flex flex-col-reverse w-full h-full gap-1 p-4 overflow-x-hidden overflow-y-scroll" v-if="!isMessagesLoading">
            
            <div v-if="showWelcomeHeader && !(channelMessages.length > 0)">
                <ChatChannelWelcomeHeader />
            </div>
            
            <TransitionGroup>
                <ChatMessage 
                    v-for="m in channelMessages" 
                    :message="m" 
                    :key="m.id"
                    @promptDeleteMessage="(m) => {deletingMessage = m}"
                />
            </TransitionGroup>
        </div>
        <div v-else class="flex flex-col items-center justify-center w-full h-full">
            <span class="loading loading-spinner"></span>
        </div>

        <ConfirmationDeletionModal
            ref="delete_message_modal"
            title="Deleting message..."
            body="Are you sure you want to delete this message? This is an act that cannot be undone!"
            @confirmed="doDeleteMessage"
            @cancelled="deletingMessage = null"
        />

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