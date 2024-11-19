<script setup lang="ts">
import { onBeforeMount, PropType, ref } from 'vue';
import BaseModal from './BaseModal.vue';
import { Channel } from '../../../../api/models';
import { updateChannel } from '../../../../api/channels';
import { reset } from '@formkit/vue';

const props = defineProps({
    channel : Object as PropType<Channel>
});
const emit = defineEmits(["closeMe"]);

const submitHandler = async (data : any) => {

    await updateChannel(
        props.channel?.community_id as string,
        props.channel?.id as string,
        {
            name: data.name
        }
    );

    reset("update_channel_form");
    emit("closeMe");

}

const channelName = ref(props.channel?.name as string);

const formatChannelName = (v : any) => {
    channelName.value = v.toLowerCase().replace(/\s+|-+/g, '-');
}

</script>

<template>
    <BaseModal>

        <FormKit
            type="form"
            method="dialog"
            id="update_channel_form"
            :actions="false"
            :classes="{
                form: {
                    'gap-2' : true,
                    'flex' : true,
                    'flex-col' : true
                }
            }"
            @submit="submitHandler"
            >

            <h1 class="text-2xl font-semibold">
                Edit "#{{ props.channel?.name }}"
            </h1>

            <div class="my-0 divider"/>
            
            <FormKit 
                type="text"
                name="name"
                label="Channel name"
                :classes="{
                    input: {
                        'input' : true,
                        'input-bordered' : true,
                        'w-full' : true                    
                    },
                    outer: {
                        'w-full' : true
                    },
                    message: {
                        'text-sm' : true,
                        'text-error' : true
                    }
                }"
                v-model="channelName"
                validation="required|matches:/^[0-9a-z]+(-[0-9a-z]+)*$/"
                @update:modelValue="formatChannelName"

            />
            
            <div class="my-0 divider"/>

            <FormKit
                type="submit"
                label="Update"
                :classes="{
                    input : {
                        'btn' : true,
                        'btn-primary' : true,
                    },
                    wrapper: {
                        'flex' : true,
                        'flex-row' : true,
                        'justify-end' : true,
                    }
                }"
            >

            </FormKit>

        </FormKit>
        
    </BaseModal>
</template>
