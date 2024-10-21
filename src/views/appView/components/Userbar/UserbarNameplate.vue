<script setup lang="js">

const props = defineProps({
    display_name : String,
    username : String
});

</script>

<template>
    <div class="flex flex-col flex-grow whitespace-pre-wrap overflow-ellipsis">
        <span class="text-sm font-semibold line-clamp-1">{{ props.display_name }}</span>
        <span class="text-xs line-clamp-1">@{{ props.username }}</span>
    </div>
</template>