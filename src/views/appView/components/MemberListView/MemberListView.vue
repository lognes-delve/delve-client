<script setup>
import Popper from 'vue3-popper';
import { computed } from 'vue';
import { stateStore } from '../../../../store';
import MemberListItem from './MemberListItem.vue';
import UserPopoverCard from '../Reusable/UserPopoverCard.vue';

const members = computed(() => {
    return Object.values(stateStore.state.memberList);
})

</script>

<template>
    <div class="flex flex-col w-full h-full gap-1 p-2 overflow-x-hidden overflow-y-scroll">
        
        <Popper v-for="m in members" :key="`ml-i-${stateStore.state.currentViewingCommunity}-${m.id}`" placement="left-start">
            <MemberListItem 
                :member="m"
            />
            <template #content>
                <UserPopoverCard :user="m" />
            </template>
        </Popper>
    </div>
</template>