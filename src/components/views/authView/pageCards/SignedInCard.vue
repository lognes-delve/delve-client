<script setup lang="js">
import { onBeforeMount, onMounted, ref } from 'vue';
import BaseCard from './BaseCard.vue';
import { useCookies } from '@vueuse/integrations/useCookies';

const cookies = useCookies();
const userData = ref(null);

/* onBeforeMount to get the user's data before the webpage is mounted at all */
onBeforeMount(async () => {

    let accessToken = cookies.get("token");

    if(!accessToken) {
        this.$emit("jumpToCard", 0);
        return; // TODO: Redirect to the welcome card in the case of an error
    }

    let resp = await fetch(
        "https://delve.lognes.dev/users/me",
        {
            headers: {
                "Content-Type" : "application/json",
                "Authorization" : `Bearer ${accessToken}`
            }
        }
    );

    let jsonResp = await resp.json();

    // Push the response we got into the ref
    userData.value = jsonResp;

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

        <div v-else>
            loading..
        </div>

    </BaseCard>
</template>