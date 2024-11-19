<script setup lang="ts">
import CommunitySidebar from './components/CommunitySidebar/CommunitySidebar.vue';
import ChannelSidebar from './components/ChannelSidebar/ChannelSidebar.vue';
import Userbar from './components/Userbar/Userbar.vue';
import ChatView from './components/ChatView/ChatView.vue';
import { computed, onBeforeMount, onMounted, ref } from 'vue';
import { getJoinedCommunities } from '../../api/communities';
import { getAllChannels } from '../../api/channels';
import { stateStore } from '../../store';
import { Icon } from '@iconify/vue/dist/iconify.js';
import MemberListView from './components/MemberListView/MemberListView.vue';
import { GatewayWebSocket } from '../../api/gateway/gateway';
import { Community } from '../../api/models';
import { HeartbeatResponse } from '../../api/gateway/events';

const stateIsReady = ref(false);
const specialStateEmptyUser = computed(
    () => {return Object.keys(stateStore.state.userCommunityList).length === 0;}
);

onBeforeMount(async () => {
    const comms = await getJoinedCommunities();

    stateStore.commit(
        "pushCommunityList",
        Object.fromEntries(
            comms.map(z => [z.id, z])
        )
    );

    await stateStore.dispatch("ohMyGodFindAChannelPlease");


    // a really crappy way of doing an async sleep
    // just to make the loading actually feel like its loading, and to give
    // the client some time to resolve any straggling reactive stuff
    await new Promise(resolve => setTimeout(resolve, 250))

    stateIsReady.value = true;
})

const gatewayWS : GatewayWebSocket = stateStore.state.gatewayWebsocket;

gatewayWS.registerEventHandler(
    "gateway_ready",
    async (event) => {
        stateStore.state.isGatewayReady = true;
    }
);

gatewayWS.registerEventHandler(
    "gateway_not_ready",
    async (event) => {
        stateStore.state.isGatewayReady = false;
    }
);

gatewayWS.registerEventHandler(
    "member_modified",
    async (event) => {
        stateStore.dispatch(
            "upsertMemberList",
            (event as { after: any}).after
        )
    }
);

gatewayWS.registerEventHandler(
    "community_modified",
    async (event) => {
        stateStore.state.userCommunityList[(event as { community_id : string}).community_id] = (event as { after : Community}).after;
    }
);

gatewayWS.registerEventHandler(
    "heartbeat_request",
    async (event) => {
        await stateStore.state.gatewayWebsocket.sendEvent(
            new HeartbeatResponse()
        );
    }
)

</script>

<template>
    <div id="app-view" class="relative flex flex-row w-full h-full overflow-hidden bg-base-100">

        <Transition>
            <div 
                class="absolute z-[1000] w-full h-full bg-base-100 flex flex-col justify-center items-center gap-2"
                v-if="!stateIsReady || !stateStore.state.isGatewayReady"
            >
                
                <span class="text-3xl loading loading-spinner" />
                <span>Getting everything ready for you...</span>
            </div>
        </Transition>

        <div class="relative z-50 flex flex-col">
            <CommunitySidebar />
        </div>


        <div class="relative z-20 flex flex-col max-w-1/5 min-w-72">
            <ChannelSidebar />

            <Userbar />
        </div>

        <div class="relative z-0 flex flex-grow overflow-y-hidden base-100">
            <ChatView v-if="!specialStateEmptyUser && !stateStore.getters.isNoActiveCommunity" />

            <div v-else-if="specialStateEmptyUser"
                class="flex flex-col items-center justify-center w-full gap-2">
                    <Icon icon="mdi:ghost" inline height="3.5rem" id="bill"/>
                    <div class="flex flex-col items-center">
                        <span class="text-lg">You haven't joined a community yet!</span>
                        <span class="flex text-sm">Click on the <span class="mx-1 font-bold">+</span> on the far left to join one!</span>
                    </div>
            </div>

            <div v-else
                class="flex flex-col items-center justify-center w-full gap-2"
            >
                <Icon icon="mdi:hand-wave" inline height="3.5rem"/>
                <div class="flex flex-col items-center">
                    <span>Welcome back!</span>
                </div>
            </div>
        </div>

        <Transition name="member-list-slide">
            <div class="z-20 w-64 max-w-1/5 min-w-64 bg-base-300 overflow-show" id="memberListViewContainer" 
                v-if="stateStore.state.showMemberListView && !stateStore.getters.isNoActiveCommunity">
                <MemberListView />
            </div>
        </Transition>
        
    </div>
</template>

<style lang="scss" scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.75s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.member-list-slide-enter-active,
.member-list-slide-leave-active {
    transition: all 1s ease;
}

.member-list-slide-enter-from,
.member-list-slide-leave-to {
    width: 0;
    max-width: 0;
    min-width: 0;
}


// we love bill
#bill {
    animation: 3s alternate bill-be-groovin ease-in-out;
    animation-iteration-count: 12; // bill needs a break sometimes too
}

@keyframes bill-be-groovin {
    from {
        transform: translateX(-0.5rem);
    }
    to {
        transform: translateX(0.5rem);
    }
}
</style>