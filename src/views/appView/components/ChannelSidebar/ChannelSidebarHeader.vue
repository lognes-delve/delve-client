<script setup>
import { Icon } from '@iconify/vue/dist/iconify.js';
import CreateChannel from '../Modals/CreateChannel.vue';
import ConfirmationDeletionModal from '../Modals/ConfirmationDeletionModal.vue';
import { useTemplateRef, ref, computed } from 'vue';
import { deleteCommunity } from '../../../../api/communities';
import { stateStore } from '../../../../store';
import ModifyMember from '../Modals/ModifyMember.vue';
import ModifyCommunity from '../Modals/ModifyCommunity.vue';
import { reset } from '@formkit/vue';
import { leaveCommunity } from '../../../../api/members';
import CreateInviteModal from '../Modals/CreateInviteModal.vue';

const createChannelModal = useTemplateRef("create_channel_modal");
const deleteCommunityModal = useTemplateRef("delete_community_modal");
const leaveCommunityModal = useTemplateRef("leave_community_modal");
const modifyMemberModal = useTemplateRef("modify_member_modal");
const modifyCommunityModal = useTemplateRef("modify_community_modal");
const createInviteModal = useTemplateRef("invite_users_modal")


const currentUserIsOwner = computed(() => {
    return stateStore.getters.currentCommunity.owner_id === stateStore.state.currentUserData.id;
})

const doDeleteTheCommunity = async () => {

    const resp = await deleteCommunity(props.communityId)
        .catch((e) => {
            throw Error("Failed to delete community");
        });

    stateStore.commit("popCommunityList", props.communityId)
    stateStore.commit("clearChannelList");

    await stateStore.dispatch("ohMyGodFindAChannelPlease");

}

const doLeaveThatCommunity = async () => {

    const resp = await leaveCommunity(
        props.communityId
    )

    stateStore.commit("popCommunityList", props.communityId);
    stateStore.commit("clearChannelList");

    await stateStore.dispatch("ohMyGodFindAChannelPlease");

} 

const isCommunityModifyModalOpen = ref(false);
const openCommunityModifyModal = async () => {
    modifyCommunityModal.value.$el.showModal();
    isCommunityModifyModalOpen.value = true;
}

const closeCommunityModifyModal = async () => {
    modifyCommunityModal.value.$el.close();
    isCommunityModifyModalOpen.value = false;
}

const props = defineProps({
    communityId : String,
    name : String,
})

</script>

<template>
    <div class="relative z-20 flex flex-row p-4 mb-5 overflow-visible line-clamp-1 bg-base-300">
        
        <!-- The actual community title -->
        <div class="relative flex flex-row items-center flex-grow gap-1.5 font-semibold align-middle overflow-ellipsis">
            <h1 class="line-clamp-1">
                {{ props.name }}
            </h1>
        </div>

        <div class="dropdown dropdown-end">
            <div tabindex="0" class="min-h-0 p-1 btn btn-ghost h-fit" role="button"><Icon icon="mdi-cog" height="auto" inline/></div>
            <ul tabindex="0" class="menu dropdown-content bg-base-100 rounded-box z-[1000] w-52 p-2 shadow">
                <li><a  @click="modifyMemberModal.$el.showModal()"><Icon icon="mdi:user-edit" inline height="1.25rem"/> Change Nickname</a></li>
                <li><a @click="createInviteModal.$el.showModal()"><Icon icon="mdi:user-add" inline height="1.25rem"/> Invite Users</a></li>
                <li v-if="!currentUserIsOwner"><a class="text-error" @click="leaveCommunityModal.$el.showModal()"><Icon icon="mdi:home-export-outline" inline height="1.25rem"/> Leave Community</a></li>

                <div v-if="currentUserIsOwner">
                    <div class="my-0 divider" />
                    
                    <li><a @click="createChannelModal.$el.showModal()"><Icon icon="mdi:plus" inline height="1.25rem"/>
                        Create Channel
                    </a></li>
                    
                    <li><a @click="openCommunityModifyModal"><Icon icon="mdi:cog" inline height="1.25rem"/> Modify Community</a></li>
    
                    <li><a class="text-error" @click="deleteCommunityModal.$el.showModal()">
                        <Icon icon="mdi:trash" inline height="1.25rem"/> Delete Community
                    </a></li>
                </div>
                
            </ul>
            
        </div>
        
        <CreateChannel 
            ref="create_channel_modal"
        />
        <ConfirmationDeletionModal 
            :title="`Delete ${props.name}?`"
            body="This action cannot be undone, and will remove all members of this community without notification!"
            ref="delete_community_modal"
            submitButtonText="Delete"
            @confirmed="doDeleteTheCommunity"
            @cancelled="console.log('cancelled deletion of community')"
            />

        <ConfirmationDeletionModal
            :title="`Leave ${props.name}?`"
            :body="`You're about to leave ${props.name}, you'll be able to join back at any time using an invite link, but your membership will be reset. Are you sure you want to do this?`"
            ref="leave_community_modal"
            submitButtonText="Confirm"
            @confirmed="doLeaveThatCommunity"
            @cancelled="console.log('cancelled deletion of community')"
        />

        <CreateInviteModal 
            ref="invite_users_modal"
            :community="stateStore.getters.currentCommunity"
            :key="`com-inv-${stateStore.getters.currentCommunity.id}`"
            @closeMe="createInviteModal.$el.close()"
        />

        <ModifyMember
            ref="modify_member_modal"
            :user="stateStore.getters.communityMemberLookup(stateStore.state.currentUserData.id)"
            :key="`mem-mod-${stateStore.getters.communityMemberLookup(stateStore.state.currentUserData.id).id}`"
            @closeMe="modifyMemberModal.$el.close()"
            />

        <ModifyCommunity 
            ref="modify_community_modal"
            :isOpen="isCommunityModifyModalOpen"
            :community="stateStore.getters.currentCommunity"
            :key="`com-mod-${stateStore.getters.currentCommunity.id}`"
            @closeMe="closeCommunityModifyModal"
        />
    </div>
</template>