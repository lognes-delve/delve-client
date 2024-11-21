<script setup lang="ts">
import BaseModal from './BaseModal.vue';
import { onMounted, PropType, ref } from 'vue';
import { Community } from '../../../../api/models';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { createInviteCode } from '../../../../api/invites';

const props = defineProps({
    community : Object as PropType<Community>
});

const emit = defineEmits(["closeMe"])

const inviteCode = ref<string | null>(null);
const inviteLinkCopied = ref<boolean>(false);

const copyInviteLink = async () => {

    if (inviteCode.value === null) {
        return;
    }

    inviteLinkCopied.value = true;

    await navigator.clipboard.writeText(
        inviteCode.value
    )
    await new Promise((resolve) => setTimeout(resolve, 750));

    inviteLinkCopied.value = false;
}

onMounted(async () => {

    const code = await createInviteCode(
        props.community?.id as string,
        {
            valid_days: 7
        }
    );

    if (!code) {
        inviteCode.value = "error :(";
    }

    inviteCode.value = code.invite_code;

})

</script>

<template>
    <BaseModal >

        <div 
            class="absolute top-0 right-0 m-3 transition-all duration-150 text-primary/50 hover:text-primary/100 hover:cursor-pointer"
            @click="emit('closeMe')"    
        >
            <Icon icon="mdi:close" inline height="1.25rem" />
        </div>
    

        <div class="flex flex-col gap-2">

            <h1 class="text-xl font-semibold">
                Invite Users to {{ props.community?.name }}
            </h1>

            <div
                class="relative content-center w-full font-mono text-2xl font-semibold text-center input-bordered input"
            >

            <span class="relative tracking-[.33rem]" v-if="inviteCode">
                {{ inviteCode }}
            </span>
            <span v-else class="loading loading-spinner" />

            <button class="absolute right-0 mx-2 btn btn-primary btn-sm" :disabled="inviteCode === null" @click="copyInviteLink">
                <div class="swap swap-rotate" :class="inviteLinkCopied ? 'swap-active' : ''">
                    <Icon class="swap-off" icon="mdi:content-copy" inline height="1.25rem"/>
                    <Icon class="swap-on" icon="mdi:check" inline height="1.25rem"/>
                </div>
            </button>

            </div>

            <div class="text-xs">
                <span>Invite codes are case-sensitive!</span>
            </div>

        </div>
    
    </BaseModal>
</template>