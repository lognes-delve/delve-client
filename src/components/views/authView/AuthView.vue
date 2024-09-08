<script setup>
import WelcomeCard from './pageCards/WelcomeCard.vue';
import LoginCard from './pageCards/LoginCard.vue';
import RegisterCard from './pageCards/RegisterCard.vue';
import SecretCard from './pageCards/SecretCard.vue';
import { ref } from 'vue';

// Holds an id for whatever card is currently being shown
const currentCardId = ref(0);

</script>

<template>
    <div id="card-container"
        class="flex flex-col items-center justify-center w-full h-full *:w-full *:md:max-w-2xl *:shadow-md *:shadow-black p-8">
        <Transition name="switch" mode="out-in">
            <WelcomeCard v-if="currentCardId === 0" @jumpToCard="(n) => currentCardId = n" />
            <LoginCard v-else-if="currentCardId === 1" @jumpToCard="(n) => currentCardId = n" />
            <RegisterCard v-else-if="currentCardId === 2" @jumpToCard="(n) => currentCardId = n" />
            <SecretCard v-else @jumpToCard="(n) => currentCardId = n" />
        </Transition>
    </div>
</template>

<style lang="css" scoped>

#card-container {
    background: url("https://unsplash.com/photos/-heLWtuAN3c/download?force=true");
    background-position: center;
    background-size: cover;
}

.switch-enter-from {
    opacity: 0;
    transform: translateY(-20px);
}
.switch-leave-to {
    opacity: 0;
    transform: translateY(-20px);
}

.switch-enter-to {
    opacity: 1;
    transform: translateY(0);
}

.switch-leave-from {
    opacity: 1;
    transform: translateY(0);
}

.switch-enter-active {
    transition: all 0.3s ease;
}

.switch-leave-active {
    transition: all 0.5s ease;
}

</style>