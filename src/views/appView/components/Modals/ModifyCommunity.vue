<script setup lang="ts">
import { onBeforeMount, PropType, ref, watch } from 'vue';
import BaseModal from './BaseModal.vue';
import { Community } from '../../../../api/models';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { reset } from '@formkit/vue';
import { updateCommunity } from '../../../../api/communities';

const props = defineProps({
    community : Object as PropType<Community>,
    isOpen : Boolean
});
const emit = defineEmits(["closeMe"]);

const submitHandler = async (data : any) => {

    await updateCommunity(
        props.community?.id as string,
        {
            name: data.name,
        }
    )

    reset("community_modify_form");
    emit("closeMe");
}

const communityName = ref(props.community?.name as String);

</script>

<template>
    <BaseModal classes="max-w-2xl w-3/4" @close="() => reset('community_modify_form')">

        <div class="flex flex-row gap-4">

            <div class="flex flex-col basis-36">
                <div class="flex flex-col items-center justify-center font-semibold text-7xl w-36 h-36 bg-base-300 rounded-box ring ring-primary">
                    {{ props.community?.name[0] }}
                </div>

                <div v-if="false">
                    <div class="mt-3 mb-1 divider"/>
    
                    <span class="mb-1 text-xs font-bold">COMMUNITY STATS</span>
    
                    <div class="flex flex-col gap-1 stats-container">
                        <span class="flex flex-row gap-1 text-sm">
                            <Icon icon="mdi:user" inline height="1.25rem"/> 100 Members
                        </span>
                        <span class="flex flex-row gap-1 text-sm">
                            <Icon icon="mdi:hashtag" inline height="1.25rem"/> 20 Channels
                        </span>
                    </div>

                </div>
                
            </div>

            <div class="flex flex-col flex-grow">

                <h1 class="mb-1 text-xl font-semibold">
                    Edit "{{ props.community?.name }}"
                </h1>

                <FormKit
                    v-if="props.isOpen"
                    type="form"
                    id="community_modify_form"
                    method="dialog"
                    :actions="false"
                    :classes="{
                        form: {
                            'h-full' : true,
                            'flex' : true,
                            'flex-col' : true,
                            'flex-grow' : true
                        }
                    }"
                    @submit="submitHandler"
                >

                    <FormKit
                        type="text"
                        name="name"
                        label="Community Name"
                        validation="required"
                        v-model="communityName"
                        :classes="{
                            input: {
                                'input' : true,
                                'input-bordered' : true,
                                'w-full' : true,
                                'my-0.5' : true                  
                            },
                            outer: {
                                'w-full' : true
                            },
                            message: {
                                'text-sm' : true,
                                'text-error' : true
                            }
                        }"               
                    >

                    </FormKit>

                    <div class="my-2 divider"/>

                    <FormKit
                        type="submit"
                        label="Update"
                        :classes="{
                            input: {
                                'btn' : true,
                                'btn-primary' : true,
                            },
                            wrapper: {
                                'flex' : true,
                                'flex-row' : true,
                                'justify-end' : true,
                                'h-full' : true,
                                'place-self-end' : true
                            }
                        }"
                    >

                    </FormKit>



                </FormKit>


            </div>

        </div>
        
    </BaseModal>
</template>
