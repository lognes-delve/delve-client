<script setup lang="ts">
import { onMounted, PropType } from 'vue';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { MemberWithEmbeddedUser } from '../../../../api/models';
import { stateStore } from '../../../../store';
import UserAvatar from '../Reusable/UserAvatar.vue';

const props = defineProps({
    member : Object as PropType<MemberWithEmbeddedUser>
});

</script>

<template>
    <div class="flex flex-row w-full gap-2 p-2 rounded-md bg-base-100">
        
        <UserAvatar :user="props.member" />

        <div class="flex flex-col justify-center w-full h-full items-left py-0.5">
            <span class="flex flex-row gap-2">
                {{ member?.nickname ? member.nickname : member?.user.display_name }}
            </span>
            <span class="text-xs">
                @{{ member?.user.username }}
            </span>
        </div>
        
    </div>
</template>