<script setup lang="js">
import { ref, computed, useTemplateRef } from 'vue';
import ChannelOption from './ChannelOption.vue';
import ChannelSidebarHeader from './ChannelSidebarHeader.vue';
import { stateStore } from '../../../../store';
import { Icon } from '@iconify/vue/dist/iconify.js';
import ConfirmationDeletionModal from '../Modals/ConfirmationDeletionModal.vue';
import { deleteChannel } from '../../../../api/channels';

const activeChannel = computed(
    () => {
        return stateStore.state.currentViewingChannel;
    }
)

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
const setActiveChannel = async (channelId) => {
    await stateStore.dispatch("viewThisCommunityAndChannel", {
        channelId : channelId,
        communityId : stateStore.state.currentViewingCommunity
    })
}

const deletingChannel = ref(null);
const deleteChannelModal = useTemplateRef("delete_channel_modal");

const showChannelDeletionModal = (channel) => {
    deletingChannel.value = channel;

    console.log(deleteChannelModal);

    deleteChannelModal.value.$el.showModal();
}

const doDeleteChannel = async () => {
    
    await deleteChannel(
        deletingChannel.value.community_id,
        deletingChannel.value.id
    );

    stateStore.commit("popChannelList", deletingChannel.value.id);

    await stateStore.dispatch("viewThisCommunityIdcWhatChannel", stateStore.getters.currentCommunity.id);
    
    deletingChannel.value = null;

}

</script>

<template>
    <div class="relative flex flex-col flex-grow w-full bg-base-200">

        <div v-if="communityRef">
            <ChannelSidebarHeader :name="communityRef.name" :communityId="communityRef.id" />
    
            <div
                id="channel-list-container" 
                class="relative flex flex-col flex-grow mt-1"
            >
    
                <ChannelOption 
                    v-for="chan in Object.values(stateStore.state.communityChannelList)"
                    :channel="chan"
                    @click="setActiveChannel(chan.id)"
                    @deleteChannel="showChannelDeletionModal"
                />
    
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

    </div>
</template>