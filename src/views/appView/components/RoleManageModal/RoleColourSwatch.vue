<script setup lang="ts">
import { FormKit } from '@formkit/vue';

const props = defineProps({
    value: String
})

</script>

<template>
    <div class="flex flex-row w-full gap-2">

        <div class="flex-grow">
            <span class="text-sm font-bold uppercase">Role Colour</span>

            <p class="text-sm">
                Setting this will set the role colour and will make it easier to distinguish users
            </p>
        </div>

        <div class="flex-shrink-0">
            <FormKit 
                type="color"
                name="colour"
                id="colour"
                :value="props.value"
            />
        </div>

    </div>
</template>