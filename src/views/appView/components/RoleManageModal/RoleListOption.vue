<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js';
import { computed, onMounted, PropType, useTemplateRef, watch } from 'vue';


const props = defineProps({
    role : Object as PropType<{name : string, colour : number}>,
    active : Boolean
})

const emit = defineEmits([
    "delete"
])

const roleBall = useTemplateRef('role-ball');

onMounted(() => {
    console.log(props.role);

    roleBall.value?.style.setProperty('--role-colour', "#" + props.role?.colour.toString(16))    

})

const colourRef = computed<number>(() => props.role?.colour || 0)

watch(colourRef, (nv) => {
    roleBall.value?.style.setProperty('--role-colour', "#" + nv.toString(16))    
})

</script>

<template>
    <div class="container" :data-active="active">
        <span class="justify-center flex-shrink-0 w-3 h-3 rounded-full bg-neutral-content role-colour-ball" ref="role-ball" />
        <span class="flex-grow line-clamp-1">
            {{ props.role?.name }}
        </span>
        <span class="role-delete-button" @click="emit('delete', props.role)">
            <Icon icon="mdi:close" inline height="1.05rem"/>
        </span>
    </div>
</template>

<style lang="scss">

:root {
    --role-colour: 0;
}

.role-colour-ball {
    background: var(--role-colour)
}

.container {
    @apply flex flex-row items-center w-full gap-2 p-2 line-clamp-1 bg-base-300 rounded-lg my-2;
}

.container:hover {
    @apply bg-base-200 cursor-pointer;
}

.container[data-active=true] {
    @apply border-primary border;
}

.role-delete-button {
    @apply text-base-content self-end flex-shrink-0 flex-grow-0 px-1 h-full justify-self-center;
    visibility: hidden;
    display: none;
}

.container:hover .role-delete-button {
    visibility: visible;
    display: flex;
}

</style>