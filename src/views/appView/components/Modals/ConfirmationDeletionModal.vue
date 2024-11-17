<script setup>

import { ref } from 'vue';
import BaseModal from './BaseModal.vue';

const props = defineProps({
    title : String,
    body : String,
    submitButtonText : {
        type : String,
        default : "Submit"
    },
    cancelButtonText : {
        type : String,
        default : "Cancel"
    },
    submitButtonIsLoading : {
        type : Boolean,
        default : false
    },
    cancelButtonIsLoading : {
        type : Boolean,
        default : false
    },
})

const emit = defineEmits(["cancelled", "confirmed"]);

const isConfirmed = ref(false);

const formSubmit = () => {
    emit(isConfirmed.value ? "confirmed" : "cancelled");
}

</script>

<template>
    <BaseModal>
    
        <div class="flex flex-col gap-2">
            <h1 class="text-xl font-bold" v-if="props.title">{{ props.title }}</h1>
            <p v-if="props.body">{{ props.body }}</p>

            <div class="my-0 divider"/>
            <form
                method="dialog"
                class="flex flex-row justify-end w-full gap-2"
                @submit="formSubmit"
                >
                <button class="btn" @click="isConfirmed = false" :disabled="cancelButtonIsLoading || submitButtonIsLoading">
                    <span v-if="!cancelButtonIsLoading">
                        {{ props.cancelButtonText }}
                    </span>
                    <span v-else class="loading loading-spinner" />
                </button>
                
                <button class="btn btn-error" @click="isConfirmed = true" :disabled="cancelButtonIsLoading || submitButtonIsLoading">
                    <span v-if="!submitButtonIsLoading">
                        {{ props.submitButtonText }}
                    </span>
                    <span v-else class="loading loading-spinner" />
                </button>
            </form>
        </div>

    </BaseModal>
</template>