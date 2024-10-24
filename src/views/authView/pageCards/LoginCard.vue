<script setup lang="js">
import { onMounted, ref, useTemplateRef } from 'vue';
import BaseCard from './BaseCard.vue';
import { useFirebaseAuth } from 'vuefire';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useCookies } from "@vueuse/integrations/useCookies";

const firebaseAuth = useFirebaseAuth();
const cookies = useCookies();

const emit = defineEmits(["jumpToCard"]);

const loginPending = ref(false);

const emailData = ref(null);
const passwordData = ref(null);

const emailInput = useTemplateRef("emailInput");

const doLogin = async () => {
    // Indicate that something is happening
    loginPending.value = true;

    let userCred = await signInWithEmailAndPassword(firebaseAuth, emailData.value, passwordData.value).catch((err) => {
        console.log(err);
    })

    if(!userCred.user.accessToken) {
        return;
    }

    // Set the authentication token from firebase into a cookie
    // httpOnly being true makes it so the user cant view their token
    cookies.set("token", userCred.user.accessToken);

    // Cleanup
    loginPending.value = false;

    // Jumps to the "Signed In" card for redirection
    emit("jumpToCard", 3);

}

onMounted(() => {
    emailInput.value.focus();
})

</script>

<template>
    <BaseCard>
        <div class="mb-4">
            <h1 class="text-3xl font-bold text-primary">Login to Delve</h1>
        </div>

        <div class="divider"></div>

        <div class="flex flex-col flex-grow w-full gap-3">

            <label class="w-full gap-3 form-control">

                <div class="flex flex-col flex-grow">
                    <div class="label">
                        <span class="label-text">Email</span>
                    </div>
                    <input class="input input-bordered" placeholder="ilovedelve@delve.com"
                        v-bind:disabled="loginPending" ref="emailInput" v-model="emailData"/>
                </div>

                <div class="flex flex-col flex-grow">
                    <div class="label">
                        <span class="label-text">Password</span>
                    </div>
                    <input class="input input-bordered" placeholder="************" type="password"
                        v-bind:disabled="loginPending" v-model="passwordData"/>
                </div>

                <div>
                    <label class="justify-center gap-3 cursor-pointer label">
                        <input type="checkbox" class="checkbox" v-bind:disabled="loginPending" />
                        <span class="label-text">Remember me</span>
                    </label>
                </div>

                <button class="btn btn-primary" v-bind:disabled="loginPending" @click="doLogin">
                    <span v-if="!loginPending">Login</span>
                    <span class="loading loading-spinner" v-else></span>
                </button>
                <a class="self-center hover:underline hover:cursor-pointer" @click="$emit('jumpToCard', 2)">
                    I don't have an account!
                </a>
            </label>


        </div>
    </BaseCard>
</template>