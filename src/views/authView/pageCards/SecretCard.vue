<script setup>
import BaseCard from './BaseCard.vue';
import burgerImg from './../../../assets/images/secrets/burger.png';
</script>

<template>
    <BaseCard>
        <div class="flex flex-col items-center flex-grow w-full gap-8">
            <img :src="burgerImg" class="animate-spin">
            <button class="btn btn-lg btn-error" @click="$emit('jumpToCard', 0)">Get me out of here!</button>
        </div>
    </BaseCard>
</template>