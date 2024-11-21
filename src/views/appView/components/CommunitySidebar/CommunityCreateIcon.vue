<script setup lang="js">
import CommunitySidebarIcon from './CommunitySidebarIcon.vue';
import JoinCommunity from '../Modals/JoinCommunity.vue';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { useTemplateRef, ref } from 'vue';

const createCommunityModal = useTemplateRef('create_community_modal');

const dialogCounter = ref(0);

const closeModal = async () => {
    createCommunityModal.value.$el.close();
    dialogCounter.value = (dialogCounter.value + 1);
}

</script>

<template>
    <CommunitySidebarIcon @click="createCommunityModal.$el.showModal()">
        <JoinCommunity 
            ref="create_community_modal" 
            :key="dialogCounter"
            @closeMe="closeModal"
        />
        <span>
            <Icon icon="mdi:plus-circle" inline height="auto"></Icon>
        </span>
    </CommunitySidebarIcon>
</template>