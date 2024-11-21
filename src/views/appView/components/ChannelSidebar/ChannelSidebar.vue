<script setup lang="ts">
import { ref, computed, useTemplateRef } from 'vue';
import ChannelOption from './ChannelOption.vue';
import ChannelSidebarHeader from './ChannelSidebarHeader.vue';
import { stateStore } from '../../../../store';
import { Icon } from '@iconify/vue/dist/iconify.js';
import ConfirmationDeletionModal from '../Modals/ConfirmationDeletionModal.vue';
import { deleteChannel } from '../../../../api/channels';
import { Channel } from '../../../../api/models';
import { GatewayWebSocket } from '../../../../api/gateway/gateway';
import ModifyChannel from '../Modals/ModifyChannel.vue';

const communityRef = computed(
    () => {

        // Small hack that prevents an undefined error when rendering the name before the
        // client actually has the data to do so.
        if (!stateStore.state.currentViewingCommunity && Object.keys(stateStore.state.userCommunityList).length === 0){
            return false;
        }

        const currentCommunityId = stateStore.state.currentViewingCommunity;

        return stateStore.state.userCommunityList[currentCommunityId];
    }
)

// TODO: swap this for the good dispatch thing 
const setActiveChannel = async (channelId : String) => {
    await stateStore.dispatch("viewThisCommunityAndChannel", {
        channelId : channelId,
        communityId : stateStore.state.currentViewingCommunity
    })
}

const deletingChannel = ref<Channel | null>(null);
const deleteChannelModal = useTemplateRef("delete_channel_modal");

const showChannelDeletionModal = (channel : Channel) => {
    deletingChannel.value = channel;

    
    deleteChannelModal.value.$el.showModal();
}

const modifyingChannel = ref<Channel | null>(null);
const modifyingChannelModal = useTemplateRef("modify_channel_modal");
const showChannelModifyModal = async (channel : Channel) => {

    modifyingChannel.value = channel;

    // Giving the ref some time to propogate will help remount the modal
    // to prevent a weird glitch where you cant open it "immediately"
    await new Promise((resolve) => setTimeout(resolve, 75));

    modifyingChannelModal.value?.$el.showModal();

}

const doDeleteChannel = async () => {
    
    if(!deletingChannel.value) {
        return;
    }

    await deleteChannel(
        deletingChannel.value.community_id as string,
        deletingChannel.value.id as string
    );

    stateStore.commit("popChannelList", deletingChannel.value.id);

    await stateStore.dispatch("viewThisCommunityIdcWhatChannel", stateStore.getters.currentCommunity.id);
    
    deletingChannel.value = null;

}

const gatewayWS : GatewayWebSocket = stateStore.state.gatewayWebsocket;

gatewayWS.registerEventHandler(
    "channel_created",
    async (event) => {

        // If the channel is already in the store, don't add it
        if ((event as { channel_id : string}).channel_id in stateStore.state.communityChannelList) {
            return;
        }

        // Push the channel to the list
        stateStore.commit("appendChannelList", (event as { channel : Channel }).channel);
    }
)

gatewayWS.registerEventHandler(
    "channel_deleted",
    async (event) => {

        const channel_id = (event as {channel_id : string}).channel_id;

        if (!(channel_id in stateStore.state.communityChannelList)) {
            return;
        }

        stateStore.commit("popChannelList", channel_id);

        if(channel_id === stateStore.state.currentViewingChannel) {
            await stateStore.dispatch("viewThisCommunityIdcWhatChannel", stateStore.state.currentViewingCommunity);
        }
    }
)

gatewayWS.registerEventHandler(
    "channel_modified",
    async (event) => {

        const channel_id = (event as {channel_id : string}).channel_id;

        stateStore.state.communityChannelList[channel_id] = (event as {after : Channel}).after;

    }
)

</script>

<template>
    <div class="relative flex flex-col flex-grow w-full bg-base-200">

        <div v-if="communityRef">
            <ChannelSidebarHeader :name="communityRef.name" :communityId="communityRef.id" />
    
            <div
                id="channel-list-container" 
                class="relative flex flex-col flex-grow mt-1"
                v-if="Object.values(stateStore.state.communityChannelList).length > 0"
            >
    
                <ChannelOption 
                    v-for="chan in Object.values(stateStore.state.communityChannelList)"
                    :channel="chan"
                    :key="chan.id"
                    @click="setActiveChannel(chan.id)"
                    @deleteChannel="showChannelDeletionModal"
                    @modifyChannel="showChannelModifyModal"
                />
    
            </div>
            <div
                class="flex flex-col items-center justify-center w-full h-full" 
                v-else
            >
                <div class="flex flex-col items-center justify-center gap-1">
                    <Icon icon="mdi:circular-saw" inline height="2rem"/>
                    <span class="text-md">Uh Oh! There's no channels in here!</span>
                    <span class="text-xs">You can have a circular saw for your troubles.</span>
                </div>
            </div>
        </div>
        <div
            v-else
            class="flex flex-col items-center justify-center w-full h-full gap-2"
            >
            <Icon icon="mdi:home-flood" inline height="1.75rem"/>
            <div class="flex flex-col items-center gap-1">
                <span>Nobody is home...</span>
                <span class="text-xs">Weird...</span>
            </div>
        </div>

        <ConfirmationDeletionModal
            v-show="deletingChannel !== null" 
            :title="`Delete #${deletingChannel ? deletingChannel.name : ''}?`"
            body="This action cannot be undone, and will clear all the messages from the channel!"
            ref="delete_channel_modal"
            submitButtonText="Delete"
            @confirmed="doDeleteChannel"
            @cancelled="console.log('cancelled deletion of community')"
            />

        <ModifyChannel 
            :channel="(modifyingChannel as Channel)"
            :key="(modifyingChannel?.id as string)"
            ref="modify_channel_modal"
            @closeMe="modifyingChannelModal?.$el.close()"
        />

    </div>
</template>