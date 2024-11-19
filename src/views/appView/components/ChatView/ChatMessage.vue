<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js';
import { computed, onMounted, useTemplateRef, ref, PropType } from 'vue';
import moment from 'moment';
import 'moment-timezone';
import { stateStore } from '../../../../store';
import { Message } from '../../../../api/models';
import UserAvatar from '../Reusable/UserAvatar.vue';
import Popper from 'vue3-popper';
import UserPopoverCard from '../Reusable/UserPopoverCard.vue';

const props = defineProps({
    message : Object as PropType<Message>
})

// TODO: This needs to actually check and see if the message mentions the current user
const mentionsYou = computed(() => {

    const currentUser = stateStore.state.currentUserData;

    const mentions = props.message?.mentions || [];

    const mentionsYouDirectly = (mentions.includes(`@${currentUser.id}`))
    const mentionsYouByRole = false; // TODO

    return (mentionsYouDirectly || mentionsYouByRole)
})

const rTime = computed(() => {
    // I dont know why the timestamps are off so weirdly, everything is in UTC.
    // so for now, I'm just gonna subtract 4 hours from the timestamp and it'll be fine...
    return moment(props.message?.created_at).subtract("04:00:00").calendar();
})

const author = computed(() => {
    const resp = stateStore.getters.communityMemberLookup(props.message?.author_id);
    return resp;
})

const hasControlPermissions = computed(() => {
    const currentUser = stateStore.state.currentUserData;

    return (currentUser.id == props.message?.author_id && props.message?.author_id);
})

const messageContentElem = useTemplateRef('message-content-ref')

const messageCopiedIndicatorActive = ref(false);
const copyMessageTextToClipboard = async () => {

    // Ensure that the message has content (to avoid any weird errors)
    if(!messageContentElem.value?.textContent){
        return;
    }

    await navigator.clipboard.writeText(
        messageContentElem.value?.textContent
    );

    // Switch to checkmark icon
    messageCopiedIndicatorActive.value = true;

    // Wait a little
    await new Promise((resolve) => setTimeout(resolve, 750));

    // Switch back to "copy" icon
    messageCopiedIndicatorActive.value = false;

    
}

onMounted(() => {
    const splitMentions = props.message?.content.text.split(/<@(\w+)>/g);

    if (!splitMentions){
        throw Error("What");
    }

    splitMentions.forEach((part, i) => {
        if(i % 2 == 1){
            const mentionElem = document.createElement("span");

            /* 
            TODO: This should be a lookup again community members
                  to find the display_name of the user properly, because the thing provided
                  will be an oid and not a display_name (hopefully)
            */ 

            const member = stateStore.getters.communityMemberLookup(part);
            mentionElem.textContent = "@" + (member.nickname ? member.nickname : member.user.display_name);
            mentionElem.classList.add("mention");
            messageContentElem.value?.appendChild(mentionElem);
        }
        else {
            messageContentElem.value?.appendChild(document.createTextNode(part));
        }
    })
})

const emit = defineEmits(["promptDeleteMessage"])

</script>

<template>
    <div class="flex flex-row gap-2 p-2.5 hover:bg-base-200 message rounded-md relative" v-bind:data-mention="mentionsYou">
        
        <Popper placement="right-end">
            <UserAvatar :user="author" v-if="author" class="hover:cursor-pointer"/>
            <template #content>
                <UserPopoverCard :user="author" />
            </template>
        </Popper>

        <div class="flex flex-col">
            <div class="flex flex-row items-baseline w-full gap-2">
                <!-- TODO: Member display name lookup is needed here -->
                <h3 class="font-semibold" v-if="author">{{ author.nickname ? author.nickname : author.user.display_name }}</h3> 
                <span class="text-sm">{{ rTime }}</span>
            </div>
            
            <div class="message-content" ref="message-content-ref"></div>
        </div>
        
        <div class="absolute -top-4 right-4 message-control-pane">
            <div class="join">
                <button class="btn btn-sm join-item" @click="copyMessageTextToClipboard">
                    <div class="swap swap-rotate" :class="messageCopiedIndicatorActive ? 'swap-active' : ''">
                        <Icon class="swap-off" icon="mdi:content-copy" inline height="1rem"/>
                        <Icon class="swap-on" icon="mdi:check" inline height="1rem"/>
                    </div>
                </button>
                <button class="btn btn-sm join-item" v-if="hasControlPermissions"><Icon icon="mdi:pencil" inline height="1rem"/></button>
                <button class="btn btn-sm join-item" v-if="hasControlPermissions" @click="emit('promptDeleteMessage', props.message)"><Icon icon="mdi:trash" /></button>
            </div>
        </div>
    </div>
</template>

<style lang="scss">

.message-content {
    @apply break-all;
}

.mention {
    @apply bg-primary/[.2] text-primary hover:text-primary-content hover:bg-primary/[.95] px-1 rounded-sm transition-all duration-200;
}

.message[data-mention=true] {
    @apply bg-primary/[.2] hover:bg-primary/[.1];
}

.message-control-pane {
    visibility: hidden;
    z-index: 9999;
}

.message:hover .message-control-pane {
    visibility: visible;
}

</style>