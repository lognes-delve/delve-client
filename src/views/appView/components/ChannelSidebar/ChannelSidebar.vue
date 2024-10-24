<script setup lang="js">
import { ref } from 'vue';
import ChannelOption from './ChannelOption.vue';
import ChannelSidebarHeader from './ChannelSidebarHeader.vue';

const channels = ref([
    {name: "general"},
    {name: "memes"},
    {name: "computer-talk"}
])

const activeChannel = ref("general")

const communityName = ref("Benny's Den")

</script>

<template>
    <div class="flex flex-col flex-grow w-full bg-base-200">

        <ChannelSidebarHeader :name="communityName" />

        <div id="channel-list-container" class="flex flex-col flex-grow mt-1">

            <ChannelOption 
                v-for="chan in channels"
                :name="chan.name"
                :active="(activeChannel === chan.name)"
            />

        </div>

    </div>
</template>