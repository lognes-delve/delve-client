<script setup lang="ts">
import { ref } from 'vue';
import BaseModal from './BaseModal.vue';
import { stateStore } from '../../../../store';
import { createCommunity, getCommunity } from '../../../../api/communities';
import { useInviteCode } from '../../../../api/invites'
import { reset } from '@formkit/vue';

const tabInView = ref<'create' | 'join'>('join');

const templates : Record<string, Object> = {
    "Clean Slate" : {
        channels : [{"name" : "general"}],
        roles : []
    },
    "Gaming Hub" : {
        channels : [
            {name : "lfg"},
            {name : "clips"},
            {name : "off-topic"}
        ],
        roles : []
    },
    "School Club" : {
        channels : [
            {name : "studying"},
            {name : "notes"},
            {name : "off-topic"},
        ],
        roles : []
    }
}

const createThatCommunity = async (data : {name : string, template : string}) => {

    const newCommunity = await createCommunity({
        name : data.name,
        template: (templates[data.template] as any)
    });

    if (newCommunity) {
        stateStore.commit("appendCommunityList", newCommunity);
        
        stateStore.dispatch("viewThisCommunityIdcWhatChannel", newCommunity.id)
        reset("create_community_form");
    }

    emit("closeMe");

}

const joinThatCommunity = async (data : {code : string}) => {

    const memberResp = await useInviteCode(
        data.code
    );

    if (memberResp.id) {
        
        const comm = await getCommunity(memberResp.community_id);

        stateStore.commit("appendCommunityList", comm);

        stateStore.dispatch("viewThisCommunityIdcWhatChannel", memberResp.community_id);
        reset("join_community_form");
        emit("closeMe");
    }
    
}

const resetBothForms = () => {
    reset("create_community_form");
    reset("join_community_form");
}

const emit = defineEmits(["closeMe"]);

</script>

<template>

    <BaseModal 
        class="absolute flex flex-col items-center justify-center"
        @close="() => resetBothForms()"
    >
        
        <div role="tablist" class="tabs tabs-bordered">
            <div 
                class="tab" 
                :class="{'tab-active' : tabInView === 'join'}"
                @click="tabInView = 'join'"
            >
                Join via Code
            </div>
            
            <div 
                class="tab" 
                :class="{'tab-active' : tabInView === 'create'}"
                @click="tabInView = 'create'"
            >
                Create a Community
            </div>
        </div>

        <div class="w-full pt-4 delve-tab-container">

            <Transition name="switch" mode="out-in">

            <div
                class="flex flex-col"
                v-if="tabInView === 'create'"
                >

                <FormKit
                    type="form"
                    method="dialog"
                    :actions="false"
                    id="create_community_form"
                    :classes="{
                        form: {
                            'flex' : true,
                            'flex-col' : true,
                            'gap-2.5' : true,
                        }
                    }"
                    @submit="createThatCommunity"
                >

                    <FormKit
                        type="text"
                        name="name"
                        label="Community Name"
                        :classes="{
                            input: {
                                'input' : true,
                                'input-bordered' : true,
                                'w-full' : true
                            },
                            inner: {
                                'pt-1' : true
                            },
                            message: {
                                'text-sm' : true,
                                'text-error' : true
                            }
                        }"
                        validation="required"
                        :value="`${stateStore.state.currentUserData.display_name}'s Community`"
                        :placeholder="`${stateStore.state.currentUserData.display_name}'s Community`"
                    />
                    

                    <FormKit 
                        type="select"
                        label="Community Template"
                        name="template"
                        validation="required"
                        :classes="{
                            input: {
                                'select' : true,
                                'select-bordered' : true,
                                'w-full' : true
                            },
                            inner: {
                                'pt-1' : true
                            },
                        }"
                        :options="Object.keys(templates)"
                    />

                    <div class="my-1 divider"/>

                    <FormKit 
                        :classes="{
                            input : {
                                'btn' : true,
                                'btn-primary' : true
                            },
                            wrapper : {
                                'flex' : true,
                                'flex-row' : true,
                                'justify-end' : true,
                                'mt-2' : true
                            }
                        }"
                        label="Create Community"
                        type="submit"
                    />

                </FormKit>
                
            </div>
            <div
                v-else-if="tabInView === 'join'"
            >

                <FormKit
                    type="form"
                    id="join_community_form"
                    method="dialog"
                    :actions="false"
                    :classes="{
                        form: {
                            'w-full' : true,
                            'gap-2.5' : true
                        }
                    }"
                    @submit="joinThatCommunity"
                >

                    <FormKit
                        type="text"
                        name="code"
                        validation="required|length:6,6"
                        label="Invite Code"
                        placeholder="wDnFeX"
                        :classes="{
                            input: {
                                'input' : true,
                                'input-bordered' : true,
                                'w-full' : true
                            },
                            message : {
                                'text-error' : true,
                                'text-sm' : true
                            }
                        }"
                    />

                    <div class="py-1 divider"/>

                    <FormKit 
                        :classes="{
                            input : {
                                'btn' : true,
                                'btn-primary' : true
                            },
                            wrapper : {
                                'flex' : true,
                                'flex-row' : true,
                                'justify-end' : true,
                                'mt-2' : true
                            }
                        }"
                        label="Join"
                        type="submit"
                    />

                </FormKit>

            </div>            

            </Transition>

        </div>

    </BaseModal>

</template>

<style lang="scss" scoped>

.tab {
    transition: border-color 0.25s ease-in-out;
}

.switch-enter-from {
    opacity: 0;
}
.switch-leave-to {
    opacity: 0;
}

.switch-enter-to {
    opacity: 1;
}

.switch-leave-from {
    opacity: 1;
}

.switch-enter-active {
    transition: all 0.3s ease;
}

.switch-leave-active {
    transition: all 0.5s ease;
}

</style>