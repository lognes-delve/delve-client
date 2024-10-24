<script setup lang="js">
import BaseCard from './BaseCard.vue';
</script>

<template>
    <BaseCard>
        <div id="awesome-header" class="flex flex-col gap-2 text-center">
            <h1 class="text-3xl font-bold text-primary">Welcome to Delve!</h1>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem culpa quis, corporis vero amet illo sit debitis quisquam architecto sapiente libero veritatis, porro velit odit saepe ex eligendi maiores minima?</p>
        </div>
        <div class="divider">Select an option to get started</div>
        <div id="lame-buttons" class="flex flex-row flex-grow w-full gap-3 *:flex-grow">
            <button class="btn btn-neutral" @click="$emit('jumpToCard', 1)">Login</button>
            <button class="btn btn-primary" @click="$emit('jumpToCard', 2)">Sign-Up</button>
        </div>
    </BaseCard>
</template>