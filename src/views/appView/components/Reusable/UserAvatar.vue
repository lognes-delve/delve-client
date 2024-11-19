<script setup lang="ts">
import { computed, onBeforeMount, onMounted, PropType, ref, useTemplateRef } from 'vue';
import { Member, MemberWithEmbeddedUser, User } from '../../../../api/models';

const props = defineProps({
    user : Object as PropType<MemberWithEmbeddedUser | User>,
    size : {
        type: Number,
        default: 12
    },
    fontSize : {
        type: String,
        default: 'text-2xl'
    }
})

const name_to_show = computed(() => {

    if((props.user as Object).hasOwnProperty("community_id")) {
        // must be a member...
        const u = props.user as MemberWithEmbeddedUser;
        return (u.nickname ? u.nickname : u.user.display_name);
    }
    
    const u = props.user as User;
    return u.display_name;
})

const user_ref = computed(() => {
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

    if (!user_ref.value || !user_ref.value.id) {
        return 0;
    }

    const hue = user_ref.value.id.split("").reduce((s, n) => s + n.charCodeAt(0), 0) % 360;

    coloured_div.value?.style.setProperty("--hue", hue.toString());
}

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
                    {{ name_to_show ? name_to_show![0] : '?' }}
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
  background-color: hsl(var(--hue) 80% 20%);
  color: hsl(calc(var(--hue) + 180) 100% 80%);
}

</style>