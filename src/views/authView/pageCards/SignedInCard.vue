<script setup lang="js">
import { onBeforeMount, onMounted, ref } from 'vue';
import BaseCard from './BaseCard.vue';
import { useCookies } from '@vueuse/integrations/useCookies';
import { useRouter } from 'vue-router';
import { stateStore } from '../../../store';
import { getMe } from '../../../api/users';

const cookies = useCookies();
const userData = ref(null);
const router = useRouter(); 

/* onBeforeMount to get the user's data before the webpage is mounted at all */
onBeforeMount(async () => {

    let accessToken = cookies.get("token");

    if(!accessToken) {
        this.$emit("jumpToCard", 0);
        return; // TODO: Redirect to the welcome card in the case of an error
    }

    const resp = await getMe();

    stateStore.commit('updateCurrentUserData', resp);

    // Push the response we got into the ref
    userData.value = stateStore.state.currentUserData;

    // We do a little fake loading segment for aesthetics
    // ( Also just to welcome to user politely :) 
    setTimeout(
        () => {
            router.push('/app')
                .catch((err) => {
                    console.log(err); // Something went horribly wrong here
                })
        },
        500 * 5 // 500ms * 5 = 5 seconds
    )

});

</script>

<template>
    <BaseCard>
    
        <div v-if="userData" class="flex flex-col items-center">
            <div class="avatar placeholder">
                <div class="w-24 mb-4 rounded-full shadow-2xl bg-primary-content ring-primary ring-2 shadow-primary-content">
                    <span class="text-3xl text-primary">{{ userData.display_name[0] }}</span>
                </div>
            </div>

            <h1 class="text-2xl">Welcome, <span class="text-primary">{{ userData.display_name }}</span>!</h1>
            <h2 class="text-lg">We're logging you in now, Happy Delving!</h2>

            <span class="my-8 loading loading-spinner"></span>
        </div>

        <div v-else
            class="flex flex-col items-center">
            <span class="my-8 loading loading-spinner"></span>
        </div>

    </BaseCard>
</template>