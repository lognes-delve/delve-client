<script setup lang="ts">
import { computed, onMounted, PropType, useTemplateRef } from 'vue';
import UserAvatar from './UserAvatar.vue';
import { FullMember, MemberWithEmbeddedUser, User } from '../../../../api/models';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { stateStore } from '../../../../store';

const props = defineProps({
    user : Object as PropType<MemberWithEmbeddedUser | User>
});

const name_to_show = computed(() => {
    
    if (props.user === undefined) {
        return "?";
    }

    if((props.user as Object).hasOwnProperty("community_id")) {
        // must be a member...
        const u = props.user as MemberWithEmbeddedUser;
        return (u.nickname ? u.nickname : u.user.display_name);
    }
    
    const u = props.user as User;
    return u.display_name;
})

const user_ref = computed(() => {

    if (props.user === undefined) {
        return "?";
    }

    if((props.user as Object).hasOwnProperty("community_id")) {
        // must be a member...
        const u = props.user as MemberWithEmbeddedUser;
        return u.user;
    }
    
    const u = props.user as User;
    return u
})

const bannerDiv = useTemplateRef("banner")
onMounted(() => {

    if(user_ref.value !== '?' && user_ref.value.icon_primary != null) {
        bannerDiv.value?.style.setProperty('--banner-colour', "#" + user_ref.value.icon_primary?.toString(16).padStart(6, "0"));
    }
})

</script>

<template>
    <div class="relative z-0 flex flex-col w-64 pb-4 overflow-hidden shadow-lg bg-base-300 rounded-box">
        
        <div class="relative z-10 w-full h-16 mb-10 bg-primary banner" ref="banner">
            <div class="flex relative z-20 mx-2.5 border-base-300 w-fit rounded-full my-10 border-[6px]">
                <UserAvatar :user="props.user" :size="12" font-size="text-2xl"/>
            </div>
        </div>


        <div class="relative flex flex-col px-4">
            <span class="text-lg font-semibold">
                <span v-if="user_ref !== '?'">
                    {{ name_to_show }}
                </span>
                <span v-else>
                    Unknown User
                </span>
            </span>
            <span class="text-sm" v-if="user_ref !== '?'">
                @{{ user_ref.username }}
            </span>
            <span class="text-sm" v-else>
                @unknown-user
            </span>
        </div>

        <div class="px-4 mt-2" v-if="(props.user as Object).hasOwnProperty('roles')">
            <div class="my-0 divider"/>
            <span class="text-sm font-bold">ROLES</span>

            <div class="flex flex-wrap gap-1">
                <div class="flex flex-row items-center gap-1 px-2 truncate border rounded-badge border-primary text-ellipsis" v-for="r in (props.user as FullMember).roles">
                    <div class="flex-shrink-0 w-4 h-4 bg-red-500 rounded-full" />
                    <span class="truncate">
                        {{ r.name }}
                    </span>
                </div>

                <div 
                    v-if="false"
                    class="items-center justify-center p-1 font-mono border rounded-full border-primary aspect-square hover:cursor-pointer">
                    <Icon icon="mdi:plus" inline height="1rem"/>
                </div>

                <div class="text-xs italic" v-if="(props.user as FullMember).roles.length < 1">
                    <span>This user has no roles</span>
                </div>
            </div>
        </div>

        <div class="px-2 text-error" v-if="user_ref === '?'">
            <span>
                This member is no longer here...
            </span>
        </div>

    </div>
</template>

<style lang="scss" scoped>

.banner {
    --banner-colour: oklch(var(--p));
    background-color: var(--banner-colour);
}

</style>