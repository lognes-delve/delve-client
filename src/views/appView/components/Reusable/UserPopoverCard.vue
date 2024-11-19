<script setup lang="ts">
import { computed, PropType } from 'vue';
import UserAvatar from './UserAvatar.vue';
import { MemberWithEmbeddedUser, User } from '../../../../api/models';
import { Icon } from '@iconify/vue/dist/iconify.js';

const props = defineProps({
    user : Object as PropType<MemberWithEmbeddedUser | User>
});

const name_to_show = computed(() => {

    if((props.user as Object).hasOwnProperty("community_id")) {
        // must be a member...
        const u = props.user as MemberWithEmbeddedUser;
        return (u.nickname ? u.nickname : u.user.display_name);
    }
    
    const u = props.user as User;
    return u.display_name;
})

const user_ref = computed(() => {
    if((props.user as Object).hasOwnProperty("community_id")) {
        // must be a member...
        const u = props.user as MemberWithEmbeddedUser;
        return u.user;
    }
    
    const u = props.user as User;
    return u
})

</script>

<template>
    <div class="relative z-0 flex flex-col w-64 overflow-hidden shadow-lg bg-base-300 rounded-box">
        
        <div class="relative z-10 w-full h-16 mb-10 bg-primary">
            <div class="flex relative z-20 mx-2.5 border-base-300 w-fit rounded-full my-10 border-[6px]">
                <UserAvatar :user="props.user" :size="12" font-size="text-2xl"/>
            </div>
        </div>


        <div class="relative flex flex-col px-4 mb-4">
            <span class="text-lg font-semibold">
                {{ name_to_show }}
            </span>
            <span class="text-sm">
                @{{ user_ref.username }}
            </span>
        </div>

    </div>
</template>