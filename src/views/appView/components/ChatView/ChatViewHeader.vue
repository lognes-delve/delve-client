<script setup lang="js">
import { Icon } from '@iconify/vue/dist/iconify.js';
import { stateStore } from '../../../../store';

const props = defineProps({
    name: String
})

const toggleMemberListView = () => {
    stateStore.commit('toggleMemberListView');

    console.log(stateStore.state.showMemberListView);
}

</script>

<template>
    <div class="relative flex flex-row items-center w-full h-12 gap-2 px-4 shadow-md justify-left bg-base-300">
        <Icon icon="mdi:hashtag" inline height="1.25rem" />
        <span>{{ props.name }}</span>

        <button class="ml-auto btn-ghost btn drawer-button" @click="toggleMemberListView">
            <Icon icon="mdi:users" height="1.5rem" inline/>
        </button>
    </div>
</template>