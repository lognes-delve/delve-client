<script setup lang="ts">
import { computed, onBeforeMount, onMounted, PropType, ref, useTemplateRef } from 'vue';
import { Member, MemberWithEmbeddedUser, User } from '../../../../api/models';
import { Icon } from '@iconify/vue/dist/iconify.js';

const iconSelection = [
    "mdi:leaf",
    "mdi:fish",
    "mdi:chess-bishop",
    "mdi:cat",
    "mdi:baguette",
    "mdi:egg-fried",
    "mdi:noodles",
    "mdi:head",
    "mdi:star-shooting",
    "mdi:mower",
    "mdi:circular-saw", // real ones know
]

const props = defineProps({
    user : Object as PropType<MemberWithEmbeddedUser | User>,
    size : {
        type: Number,
        default: 12
    },
    fontSize : {
        type: String,
        default: 'text-2xl'
    },
    fallback_id : {
        type: String,
        default: ""
    }
})

const algo_val = computed<number>(() => {
    if(user_ref.value === "?") {
        return (props.fallback_id).split("").reduce((s, n) => s + n.charCodeAt(0), 0)
    }
    return user_ref.value.id.split("").reduce((s, n) => s + n.charCodeAt(0), 0)
})

const user_ref = computed(() => {

    if (props.user === undefined) {
        return "?"
    }

    if((props.user as Object).hasOwnProperty("community_id")) {
        // must be a member...
        const u = props.user as MemberWithEmbeddedUser;
        return u.user;
    }
    
    const u = props.user as User;
    return u
})

const coloured_div = useTemplateRef("coloured_div");
const findAvatarColour = () => {
    
    const hue = algo_val.value % 360;

    coloured_div.value?.style.setProperty("--hue", hue.toString());

    // We get a little silly and allow custom colours    
    if (user_ref.value !== "?") {
        if(user_ref.value.icon_primary != null) {
            coloured_div.value?.style.setProperty('--primary-colour', "#" + user_ref.value.icon_primary?.toString(16).padStart(6, "0"));
        }
        if(user_ref.value.icon_secondary != null) {
            coloured_div.value?.style.setProperty('--secondary-colour', "#" + user_ref.value.icon_secondary?.toString(16).padStart(6, "0"));
        }
    }
}

const avatarIcon = computed(() => {
    if (!user_ref.value || !user_ref.value.id || user_ref.value === "?") {
        return iconSelection[0];
    }

    if (user_ref.value.icon_key) {
        return user_ref.value.icon_key;
    }

    const mod = algo_val.value % iconSelection.length;
    return iconSelection[mod];
})

onMounted(async () => {
    await new Promise((resolve) => setTimeout(resolve, 100))
    findAvatarColour();
})

const divAClasses = computed(() => {
    return [`w-${props.size}`, `h-${props.size}`]
})

</script>

<template>
<div class="flex items-center flex-shrink align-middle">
        <div class="flex avatar">
            <div class="flex rounded-full coloured-bg-div" :class="[divAClasses]" ref="coloured_div">
                <div class="inline-flex items-center justify-center w-full h-full font-semibold" :class="`${fontSize}`">
                    <Icon :icon="avatarIcon" inline height="1.75rem"/>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>

:root {
    --hue: 0;
}

.coloured-bg-div {
    --primary-colour : hsl(var(--hue) 100% 75%);
    --secondary-colour : hsl(calc(var(--hue) + 180) 100% 50%);
    
    background-color: var(--primary-colour);
    color: var(--secondary-colour);
}

</style>