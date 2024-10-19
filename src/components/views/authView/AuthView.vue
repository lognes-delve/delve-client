<script setup>
import WelcomeCard from './pageCards/WelcomeCard.vue';
import LoginCard from './pageCards/LoginCard.vue';
import RegisterCard from './pageCards/RegisterCard.vue';
import SecretCard from './pageCards/SecretCard.vue';
import { onMounted, ref } from 'vue';
import { useCookies } from '@vueuse/integrations/useCookies';
import SignedInCard from './pageCards/SignedInCard.vue';

// Holds an id for whatever card is currently being shown
const currentCardId = ref(0);
const cookieCheckCompleted = ref(false);
const cookies = useCookies();

const ensureEmptyCookie = async () => {

    let userToken = cookies.get('token');

    if(!userToken) {
        cookieCheckCompleted.value = true;
    }

    /* 
        If this part of the code is ran, the user is already logged in
        and should be redirected inwards into the application
    */
}

onMounted(async () => {
    await ensureEmptyCookie();
})

</script>

<template>
    <div id="card-container"
        class="flex flex-col items-center justify-center w-full h-full *:w-full *:md:max-w-2xl *:shadow-md *:shadow-black p-8 bg-base-300">
        
        <div v-if="!cookieCheckCompleted">
            <span class="loading loading-spinner" />
        </div>

        <div v-else>
            <Transition name="switch" mode="out-in">
                <WelcomeCard v-if="currentCardId === 0" @jumpToCard="(n) => currentCardId = n" />
                <LoginCard v-else-if="currentCardId === 1" @jumpToCard="(n) => currentCardId = n" />
                <RegisterCard v-else-if="currentCardId === 2" @jumpToCard="(n) => currentCardId = n" />
                <SignedInCard v-else-if="currentCardId === 3" @jumpToCard="(n) => currentCardId = n" /> <!-- Has code to redirect to actual app -->
                <SecretCard v-else @jumpToCard="(n) => currentCardId = n" />
            </Transition>
        </div>
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