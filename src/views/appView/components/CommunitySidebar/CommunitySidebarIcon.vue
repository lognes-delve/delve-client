<script setup lang="js">

const props = defineProps({
    badge :  Number | Boolean,
    active : Boolean
})

</script>

<template>

    <div 
        class="relative flex flex-col items-center justify-center flex-grow flex-shrink-0 w-16 h-16 transition-all duration-500 max-w-16 max-h-16 comm-sidebar-icon rounded-3xl bg-base-100 hover:ring-1 hover:ring-primary hover:rounded-md hover:cursor-pointer"
        :data-active="active"
        >

        <!-- Adds an interface for a little tiny little cutesy notification badge in the bottom-right corner of the icon in the sidebar -->
        <div v-if="!isNaN(props.badge) && props.badge > 0" class="absolute -bottom-0.5 -right-0.5 w-full h-full px-2 font-semibold text-base-300 badge badge-primary badge-md max-w-5 max-h-5">
            <span v-if="!isNaN(props.badge) && !(props.badge === true)">{{ props.badge < 10 ? props.badge : "9+"  }}</span>
        </div>
        
        <slot />
    </div>

</template>

<style scoped lang="scss">

.comm-sidebar-icon[data-active="true"] {
    @apply rounded-lg bg-primary text-primary-content;
}

</style>