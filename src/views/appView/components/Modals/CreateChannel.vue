<script setup>
import { Icon } from '@iconify/vue/dist/iconify.js';
import { computed, onBeforeMount, ref } from 'vue';
import { createChannel } from '../../../../api/channels';
import { stateStore } from '../../../../store';

const defaultChannelName = "new-channel"
const channelName = ref(defaultChannelName)
const invalidName = computed(() => (channelName.value.length < 1));
const isCreatingChannel = ref(false);
const shouldChannelBeCreated = ref(false);

const formatChannelName = (event) => {
    if (event.type === 'blur') {
        channelName.value = channelName.value.toLowerCase().replace(/(^(-*)|(-*)$)/g, '');
    }
    else {
        channelName.value = channelName.value.toLowerCase().replace(/\s+|-+/g, '-');
    }
}

const cleanupModal = () => {
    channelName.value = defaultChannelName;
}

const createThatChannel = async () => {

    if(!shouldChannelBeCreated.value) {
        return;
    }

    isCreatingChannel.value = true;

    const channel = await createChannel(
        stateStore.state.currentViewingCommunity,
        {
            name: channelName.value
        }
    );

    if (!channel) {
        isCreatingChannel.value = false;
        return;
    }

    stateStore.commit("appendChannelList", channel);
    
    // Cleans up the modal and sets everything back to the default values (hopefully)
    
    await stateStore.dispatch("viewThisCommunityAndChannel", {
        channelId : channel.id,
        communityId : channel.community_id
    })
    
    isCreatingChannel.value = false;
    cleanupModal();
}

</script>

<template>
    <dialog class="modal" ref="modal">
        <div class="flex flex-col modal-box">
            <h1 class="text-xl font-bold">Create a Channel</h1>

            <label class="flex-col flex-grow w-full">
                <div class="flex flex-col">
                    <div class="label">
                        <span class="label-text">Channel Name</span>
                    </div>

                    <div class="flex items-center gap-2 input input-bordered" id="channel-name-input" :data-invalid="invalidName">
                        <Icon icon="mdi:hashtag" inline height="1.25rem"/>
                        <input
                            class="w-full"
                            v-model=channelName
                            placeholder="awesome-channel"
                            @input="formatChannelName"
                            @blur="formatChannelName"
                        />
                    </div>
                    <div class="label">
                        <span class="label-text-alt text-error" v-if="invalidName">This field is required.</span>
                    </div>
                </div>
            </label>

            <div class="divider" />

            <form
                method="dialog"
                class="flex flex-row justify-end w-full gap-2"
                @submit="createThatChannel">
                <button class="btn btn-neutral" @click="shouldChannelBeCreated = false;">Cancel</button>
                <button class="btn btn-primary" @click="shouldChannelBeCreated = true;" :disabled="invalidName">Create</button>
            </form>

        </div>
    </dialog>
</template>

<style lang="scss" scoped>

#channel-name-input[data-invalid="true"] {
    @apply input-error;
}

</style>