<script setup lang="js">
import { ref } from 'vue';
import BaseCard from './BaseCard.vue';

const loginPending = ref(false);

const doLogin = () => {
    // Indicate that something is happening
    loginPending.value = true;

    // TODO: Actual authentication stuff goes here

    // Cleanup
    // loginPending.value = false;
}

</script>

<template>
    <BaseCard>
        <div class="mb-4">
            <h1 class="text-3xl font-bold text-accent">Login to Delve</h1>
        </div>

        <div class="divider"></div>

        <div class="flex flex-col flex-grow w-full gap-3">

            <label class="w-full gap-3 form-control">

                <div class="flex flex-col flex-grow">
                    <div class="label">
                        <span class="label-text">Email</span>
                    </div>
                    <input class="input input-bordered" placeholder="ilovedelve@delve.com"
                        v-bind:disabled="loginPending" />
                </div>

                <div class="flex flex-col flex-grow">
                    <div class="label">
                        <span class="label-text">Password</span>
                    </div>
                    <input class="input input-bordered" placeholder="************" type="password"
                        v-bind:disabled="loginPending" />
                </div>

                <div>
                    <label class="justify-center gap-3 cursor-pointer label">
                        <input type="checkbox" class="checkbox" v-bind:disabled="loginPending" />
                        <span class="label-text">Remember me</span>
                    </label>
                </div>

                <button class="btn btn-accent" v-bind:disabled="loginPending" @click="doLogin">
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