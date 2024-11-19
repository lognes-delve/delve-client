<script setup lang="ts">
import { onBeforeMount, PropType, ref } from 'vue';
import BaseModal from './BaseModal.vue';
import { MemberWithEmbeddedUser } from '../../../../api/models';
import { updateMember } from '../../../../api/members';
import { reset } from '@formkit/vue';

const props = defineProps({
    user : Object as PropType<MemberWithEmbeddedUser>
});
const emit = defineEmits(["closeMe"]);

const submitHandler = async (data : any) => {
    await updateMember(
        props.user?.community_id as string,
        props.user?.user_id as string,
        {
            nickname: data.nick ? data.nick : ""
        }
    );

    reset("edit_member_form")
    emit("closeMe");
}

const memberNick = ref(props.user?.nickname as string);


</script>

<template>
    <BaseModal @close="() => reset('edit_member_form')">

        <FormKit
            type="form"
            method="dialog"
            id="edit_member_form"
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
                Change Nickname
            </h1>

            <div class="my-0 divider"/>
            
            <FormKit 
                type="text"
                name="nick"
                label="Nickname"
                :classes="{
                    input: {
                        'input' : true,
                        'input-bordered' : true,
                        'w-full' : true                    
                    },
                    outer: {
                        'w-full' : true
                    }
                }"
                v-model="memberNick"
                :placeholder="(props.user?.nickname ? props.user?.nickname : props.user?.user.display_name) as string || '?'"
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
