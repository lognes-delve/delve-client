<script setup lang="js">
import CommunitySidebarCommunityIcon from "./CommunitySidebarCommunityIcon.vue"
import CommunityCreateIcon from "./CommunityCreateIcon.vue";
import CommunityHomeIcon from "./CommunityHomeIcon.vue";
import { onMounted, ref, computed } from 'vue';
import { getJoinedCommunities } from "../../../../api/communities";
import { getAllChannels } from "../../../../api/channels";
import { stateStore } from "../../../../store";

const communities = computed(() => {
    return stateStore.state.userCommunityList;
})

const goHome = async () => {
    stateStore.commit("clearChannelList");
    stateStore.commit("updateChannelView", {communityId : null, channelId : null});
}

</script>

<template>
    <div class="flex flex-col items-center w-24 h-full gap-2 py-4 overflow-x-hidden overflow-y-scroll bg-base-300 no-scrollbar">
        <CommunityHomeIcon 
            :active="stateStore.getters.isNoActiveCommunity" 
            @click="goHome"
            />

        <div class="mx-2.5 my-0 divider" />
        
        <CommunitySidebarCommunityIcon 
            v-for="c in communities"
            :name="c.name"
            :badge="c.badge"
            :active="stateStore.state.currentViewingCommunity == c.id"
            @click="stateStore.dispatch('viewThisCommunityIdcWhatChannel', c.id)"
        />

        <CommunityCreateIcon />
    </div>
</template>