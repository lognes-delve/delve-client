<script setup lang="js">
import CommunitySidebarIcon from './CommunitySidebarIcon.vue';

const props = defineProps({
    name : String,
    badge: Number | Boolean
});

</script>

<template>

    <CommunitySidebarIcon :badge="props.badge">
        <span class="text-2xl font-bold">
            {{ name[0] }}
        </span>
    </CommunitySidebarIcon>

</template>