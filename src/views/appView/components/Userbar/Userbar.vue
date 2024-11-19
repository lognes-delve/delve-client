<script setup lang="js">
import UserbarNameplate from './UserbarNameplate.vue';
import UserbarSettingsButtonGroup from './UserbarSettingsButtonGroup.vue';
import { getMe } from '../../../../api/users';
import { onBeforeMount, onMounted, ref } from 'vue';
import UserAvatar from '../Reusable/UserAvatar.vue';
import Popper from 'vue3-popper';
import UserPopoverCard from '../Reusable/UserPopoverCard.vue';

const currentUser = ref({});

onBeforeMount(async () => {
    const me = await getMe();

    currentUser.value = me;
})

</script>

<template>
    <div class="flex flex-row items-center flex-shrink w-full gap-2 px-3 align-middle min-h-16 bg-base-300">
        
        <Popper placement="right">
            <UserAvatar :user="currentUser" />
            <template #content>
                <UserPopoverCard :user="currentUser" />
            </template>
        </Popper>
        
        <UserbarNameplate :display_name="currentUser.display_name" :username="currentUser.username" />

        <UserbarSettingsButtonGroup />

    </div>
</template>