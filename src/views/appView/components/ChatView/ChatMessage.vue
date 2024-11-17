<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js';
import { computed, onMounted, useTemplateRef, ref, PropType } from 'vue';
import moment from 'moment';
import 'moment-timezone';
import { stateStore } from '../../../../store';
import { Message } from '../../../../api/models';

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

const authorName = computed(() => {
    const m = stateStore.getters.communityMemberLookup(props.message?.author_id);

    return m.nickname ? m.nickname : m.user.display_name;
})

const hasControlPermissions = computed(() => {
    const currentUser = stateStore.state.currentUserData;

    return (currentUser.id == props.message?.author_id && props.message?.author_id);
})

const messageContentElem = useTemplateRef('message-content-ref')

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

</script>

<template>
    <div class="flex flex-row gap-2 p-2.5 hover:bg-base-200 hover:cursor-pointer message rounded-md relative" v-bind:data-mention="mentionsYou">
        <div class="">
            <div class="flex avatar">
                <div class="flex w-12 h-12 rounded-full bg-primary text-primary-content">
                    <div class="inline-flex items-center justify-center w-full h-full text-2xl font-semibold">
                        A
                    </div>
                </div>
            </div>
        </div>

        <div class="flex flex-col">
            <div class="flex flex-row items-baseline w-full gap-2">
                <!-- TODO: Member display name lookup is needed here -->
                <h3 class="font-semibold">{{ authorName }}</h3> 
                <span class="text-sm">{{ rTime }}</span>
            </div>
            
            <div class="message-content" ref="message-content-ref"></div>
        </div>
        
        <div class="absolute -top-4 right-4 message-control-pane">
            <div class="join">
                <button class="btn btn-sm join-item"><Icon icon="mdi:content-copy" inline height="1rem"/></button>
                <button class="btn btn-sm join-item" v-if="hasControlPermissions"><Icon icon="mdi:pencil" inline height="1rem"/></button>
                <button class="btn btn-sm join-item" v-if="hasControlPermissions"><Icon icon="mdi:trash" /></button>
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