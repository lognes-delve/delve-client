<script setup lang="js">

const props = defineProps({
    badge :  Number | Boolean
})

console.log(props.badge, props.badge instanceof Number);

</script>

<template>

    <div 
        class="relative flex flex-col items-center justify-center w-16 h-16 transition-all duration-500 rounded-3xl bg-base-100 hover:ring-1 hover:ring-primary hover:rounded-md hover:cursor-pointer"
        >

        <!-- Adds an interface for a little tiny little cutesy notification badge in the bottom-right corner of the icon in the sidebar -->
        <div v-if="!isNaN(props.badge) && props.badge > 0" class="absolute -bottom-0.5 -right-0.5 w-full h-full px-2 font-semibold text-base-300 badge badge-primary badge-md max-w-5 max-h-5">
            <span v-if="!isNaN(props.badge) && !(props.badge === true)">{{ props.badge < 10 ? props.badge : "9+"  }}</span>
        </div>
        
        <slot />
    </div>

</template>