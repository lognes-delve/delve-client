<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js';
import { computed, PropType } from 'vue';
import { Channel } from '../../../../api/models';
import { stateStore } from '../../../../store';


const props = defineProps({
    channel : Object as PropType<Channel>
});

const emit = defineEmits(["deleteChannel", "modifyChannel"]);

const isCurrentUserOwner = computed(() => {
    const currentCommunity = stateStore.getters.currentCommunity;
    const currentUser = stateStore.state.currentUserData;

    return currentCommunity.owner_id === currentUser.id;
})

</script>

<template>
    <button 
        class="self-start justify-start w-full h-10 min-h-10 btn channel-button" 
        v-bind:data-active="stateStore.state.currentViewingChannel === props.channel?.id"
    >
        <div class="flex flex-row flex-grow gap-2 line-clamp-1">
            <Icon icon="mdi:hashtag" inline height="1rem" /> {{ props.channel?.name }}
        </div>

        <div class="dropdown dropdown-end" v-if="isCurrentUserOwner">
            <button class="btn btn-sm channel-settings-button" v-on:click.stop>
                <Icon icon="mdi:dots-horizontal" inline height="1.25rem"/>
            </button>
            <ul tabindex="0" class="menu dropdown-content bg-base-100 text-primary rounded-box z-[1000] p2 w-52 shadow">
                <li><a v-on:click.stop="$emit('modifyChannel', props.channel)"><Icon icon="mdi:cog" inline height="1.25rem"/> Edit Channel</a></li>
                <li><a v-on:click.stop="$emit('deleteChannel', props.channel)" class="text-error"><Icon icon="mdi:trash" inline height="1.25rem"/> Delete Channel</a></li>
            </ul>

        </div>
    </button>
</template>

<style lang="scss">

.channel-button[data-active=true] {
    @apply btn-primary;
}

.channel-button .channel-settings-button {
    @apply duration-700 transition-opacity;
    visibility: hidden;
}

.channel-button:hover .channel-settings-button {
    visibility: visible;
}

.channel-button[data-active=false] .channel-settings-button {
    @apply text-base-content;
}

.channel-button[data-active=true] .channel-settings-button {
    @apply text-primary-content;
}

.channel-button[data-active=false] .channel-settings-button:hover {
    @apply text-primary-content btn-primary;
}

.channel-button[data-active=true] .channel-settings-button:hover {
    @apply text-base-content btn-neutral;
}


</style>