<script setup lang="js">
import CommunitySidebar from './components/CommunitySidebar/CommunitySidebar.vue';
import ChannelSidebar from './components/ChannelSidebar/ChannelSidebar.vue';
import Userbar from './components/Userbar/Userbar.vue';
import ChatView from './components/ChatView/ChatView.vue';

</script>

<template>
    <div id="app-view" class="flex flex-row w-full h-full bg-base-100">
        <CommunitySidebar />


        <div class="flex flex-col w-1/5 min-w-48 max-w-72">
            <ChannelSidebar />

            <Userbar />

        </div>

        <div class="flex flex-grow">
            <ChatView />
        </div>
        
    </div>
</template>