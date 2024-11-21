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
    <div class="h-[100vh] flex flex-col items-center flex-grow w-24 gap-2 py-4 bg-base-300">
        <CommunityHomeIcon 
            :active="stateStore.getters.isNoActiveCommunity" 
            @click="goHome"
            />

        <div class="mx-2.5 my-0 divider" />
        
        <div class="flex flex-col items-center w-full gap-2 py-2 overflow-y-scroll no-scrollbar relative z-[9999] overflow-x-hidden h-full">

            <CommunitySidebarCommunityIcon 
                v-for="c in communities"
                :name="c.name"
                :badge="c.badge"
                :active="stateStore.state.currentViewingCommunity == c.id"
                @click="stateStore.dispatch('viewThisCommunityIdcWhatChannel', c.id)"
            />
        </div>

        <CommunityCreateIcon />
    </div>
</template>