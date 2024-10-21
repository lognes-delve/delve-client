<script setup lang="js">
import BaseCard from './BaseCard.vue';
import { onMounted, ref, useTemplateRef } from 'vue';
import { Icon } from "@iconify/vue";
import { faker } from "@faker-js/faker";
import { useCookies } from '@vueuse/integrations/useCookies';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useFirebaseAuth } from 'vuefire';

const cookies = useCookies();
const firebaseAuth = useFirebaseAuth();

const emit = defineEmits(["jumpToCard"]);

const formUsername = ref('');
const formPassword = ref('');
const formPasswordConf = ref('');
const formEmail = ref('');

const registerPending = ref(false);

const emailInput = useTemplateRef("emailInput");

/**
 * Formats a username string, capitalizing it, and removing hyphens
 * @param {string} s
 * @returns {string} - `s` but capitalized
 */
const formatUsernameString = (s) => {
    return s
        .replace("-", " ")  // replace hyphens with spaces
        .split(" ")         // split the whole string by spaces
        .map(
            (w) => (        // for every word in the phrase
                w[0].toUpperCase() +    // make the first char upper case
                w.substring(1).toLowerCase()) // and everything from the 2nd char lowercase
        )
        .join(""); // and then join the array back together into a string
}

/**
 * Returns a random username, similar to the old Xbox gamertag format
 * @returns {string} The generated username
 */
const randomUsername = () => {

    // Suffix number to include
    let suffixNumber = faker.number.int(99);

    let adjective = "";

    // Ensure that the adjective is not hyphonated (invalid username)
    while (adjective.length < 1 || adjective.includes("-"))
    {   
        adjective = formatUsernameString(faker.word.adjective());
    }
    
    let animal = formatUsernameString(faker.animal.type());

    return adjective + animal + (suffixNumber != 0 ? suffixNumber : "").toString();
}

/**
 * Performs the registration
 */
const doRegister = async () => {
    // Lock the registration form
    registerPending.value = true;

    if(!(formPassword.value == formPasswordConf.value)) {
        return; // TODO: Need to make an error stack
    }

    let resp = await fetch(
        "https://delve.lognes.dev/users/register",
        {
            method: "POST",
            headers: {
            'Content-Type': 'application/json'
            },
            body : JSON.stringify({
                email : formEmail.value,
                username : formUsername.value.toLowerCase(),
                display_name : formUsername.value,
                password : formPassword.value
            })
        }
    ).catch((err) => {
        console.log(err); // TODO: Need to make an error stack
    });

    // NOTE: This status code might be better as a 201 (Created)
    if(resp.status != 200){
        return; // TODO: Need to make an error stack
    }


    // Login and set the cookie
    let userCred = await signInWithEmailAndPassword(firebaseAuth, formEmail.value, formPassword.value);
    
    cookies.set("token", userCred.user.accessToken);

    // Unlock the registration form
    registerPending.value = false;

    // Jumps to the "Signed In" card for redirection
    emit("jumpToCard", 3);

}

onMounted(() => {
    // When the component is mounted, generate a random username for the user
    formUsername.value = randomUsername();

    // Focus on the email input when the component loads
    emailInput.value.focus();
})

</script>

<template>
    <BaseCard>
        <div class="mb-4">
            <h1 class="text-3xl font-bold text-accent">Create your Account</h1>
        </div>

        <div class="divider"></div>

        <div class="flex flex-col flex-grow w-full gap-3">

            <label class="w-full gap-3 form-control">

                <div class="flex flex-col flex-grow">
                    <div class="label">
                        <span class="label-text">Username</span>
                    </div>
                    <label class="flex items-center gap-2 input input-bordered">
                        <span class="font-bold">@</span>
                        <input class="grow" placeholder="AReallyCoolUsername123" v-model="formUsername" v-bind:disabled="registerPending"/>
                        <div class="tooltip" data-tip="Generate Random Username">
                            <button class="btn btn-ghost btn-sm" @click="formUsername = randomUsername()" v-bind:disabled="registerPending">
                                <Icon icon="mdi:refresh" inline height="auto"/>
                            </button>
                        </div>
                    </label>
                </div>

                <div class="flex flex-col flex-grow">
                    <div class="label">
                        <span class="label-text">Email</span>
                    </div>
                    <input class="input input-bordered" placeholder="ilovedelve@delve.com" ref="emailInput" 
                        v-bind:disabled="registerPending" v-model="formEmail"/>
                </div>

                <div class="flex flex-col flex-grow">
                    <div class="label">
                        <span class="label-text">Password</span>
                    </div>
                    <input class="input input-bordered" placeholder="************" type="password" 
                        v-bind:disabled="registerPending" v-model="formPassword"/>
                </div>

                <div class="flex flex-col flex-grow">
                    <div class="label">
                        <span class="label-text">Confirm Password</span>
                    </div>
                    <input class="input input-bordered" placeholder="************" type="password" 
                        v-bind:disabled="registerPending" v-model="formPasswordConf"/>
                </div>

                <button class="btn btn-accent" :disabled="registerPending" @click="doRegister">
                    <span v-if="!registerPending">Register</span>
                    <span v-else class="loading loading-spinner"></span>
                </button>
                <a 
                    class="self-center hover:underline hover:cursor-pointer" 
                    @click="$emit('jumpToCard', 1)"
                >
                    I already have an account!
                </a>
            </label>


        </div>
    </BaseCard>
</template>