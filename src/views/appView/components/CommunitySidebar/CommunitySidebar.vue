<script setup lang="js">
import CommunitySidebarCommunityIcon from "./CommunitySidebarCommunityIcon.vue"
import CommunityCreateIcon from "./CommunityCreateIcon.vue";
import CommunityHomeIcon from "./CommunityHomeIcon.vue";
import { ref } from 'vue';

const communities = ref([
    {name: "Benny's Loft", badge : 8},
    {name: "Shake Shack", badge : 1}
]);

</script>

<template>
    <div class="flex flex-col items-center w-24 h-full gap-2 py-4 overflow-x-hidden overflow-y-scroll border-r bg-base-300 no-scrollbar border-r-accent-content">
        <CommunityHomeIcon />

        <div class="mx-2.5 my-0 divider" />
        
        <CommunitySidebarCommunityIcon 
            v-for="c in communities"
            :name="c.name"
            :badge="c.badge"
        />

        <CommunityCreateIcon />
    </div>
</template>