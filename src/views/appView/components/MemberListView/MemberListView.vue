<script setup>
import { stateStore } from '../../../../store';
import MemberListItem from './MemberListItem.vue';

</script>

<template>
    <div class="flex flex-col w-full h-full gap-1 p-2 overflow-x-hidden overflow-y-scroll">
        <MemberListItem 
            v-for="m in Object.values(stateStore.state.memberList)"
            :member="m"
        />
    </div>
</template>