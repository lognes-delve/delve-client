<script setup>
import { Icon } from '@iconify/vue/dist/iconify.js';
import CreateChannel from '../Modals/CreateChannel.vue';
import ConfirmationDeletionModal from '../Modals/ConfirmationDeletionModal.vue';
import { useTemplateRef, ref } from 'vue';
import { deleteCommunity } from '../../../../api/communities';
import { stateStore } from '../../../../store';

const createChannelModal = useTemplateRef("create_channel_modal");
const deleteCommunityModal = useTemplateRef("delete_community_modal");

const pendingDeletion = ref(false);

const doDeleteTheCommunity = async () => {
    pendingDeletion.value = true;

    const resp = await deleteCommunity(props.communityId)
        .catch((e) => {
            throw Error("Failed to delete community");
        });

    stateStore.commit("popCommunityList", props.communityId)
    stateStore.commit("clearChannelList");

    await stateStore.dispatch("ohMyGodFindAChannelPlease");

    pendingDeletion.value = false;
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
            <span class="relative">
                <Icon class="text-primary" icon="mdi:verified" height="1.25rem" inline/>
            </span>
            <h1 class="line-clamp-1">
                {{ props.name }}
            </h1>
        </div>

        <div class="dropdown dropdown-end">
            <div tabindex="0" class="min-h-0 p-1 btn btn-ghost h-fit" role="button"><Icon icon="mdi-cog" height="auto" inline/></div>
            <ul tabindex="0" class="menu dropdown-content bg-base-100 rounded-box z-[1000] w-52 p-2 shadow">
                <li><a><Icon icon="mdi:user-edit" inline height="1.25rem"/> Change Nickname</a></li>
                
                <div class="my-0 divider" />
                
                <li><a @click="createChannelModal.$el.showModal()"><Icon icon="mdi:plus" inline height="1.25rem"/>
                    Create Channel
                </a></li>
                
                <li><a><Icon icon="mdi:cog" inline height="1.25rem"/> Modify Community</a></li>

                <li><a class="text-error" @click="deleteCommunityModal.$el.showModal()">
                    <Icon icon="mdi:trash" inline height="1.25rem"/> Delete Community
                </a></li>
                
            </ul>
            
        </div>
        
        <CreateChannel ref="create_channel_modal"/>
        <ConfirmationDeletionModal 
            :title="`Delete ${props.name}?`"
            body="This action cannot be undone, and will remove all members of this community without notification!"
            ref="delete_community_modal"
            submitButtonText="Delete"
            @confirmed="doDeleteTheCommunity"
            @cancelled="console.log('cancelled deletion of community')"
            />
    </div>
</template>