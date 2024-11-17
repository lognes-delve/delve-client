<script setup lang="js">
import CommunitySidebarIcon from './CommunitySidebarIcon.vue';
import CreateCommunity from '../Modals/CreateCommunity.vue';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { useTemplateRef } from 'vue';

const create_community_modal = useTemplateRef('create_community_modal');

</script>

<template>
    <CommunitySidebarIcon @click="create_community_modal.$el.showModal()">
        <CreateCommunity ref="create_community_modal"/>
        <span>
            <Icon icon="mdi:plus-circle" inline height="auto"></Icon>
        </span>
    </CommunitySidebarIcon>
</template>