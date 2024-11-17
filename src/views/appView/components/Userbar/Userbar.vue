<script setup lang="js">
import UserbarAvatar from './UserbarAvatar.vue';
import UserbarNameplate from './UserbarNameplate.vue';
import UserbarSettingsButtonGroup from './UserbarSettingsButtonGroup.vue';
import { getMe } from '../../../../api/users';
import { onBeforeMount, onMounted, ref } from 'vue';

const currentUser = ref({});

onBeforeMount(async () => {
    const me = await getMe();

    currentUser.value = me;
})

</script>

<template>
    <div class="flex flex-row items-center flex-shrink w-full gap-2 px-3 align-middle min-h-16 bg-base-300">
        
        <UserbarAvatar :display_name="currentUser.display_name" />
        
        <UserbarNameplate :display_name="currentUser.display_name" :username="currentUser.username" />

        <UserbarSettingsButtonGroup />

    </div>
</template>