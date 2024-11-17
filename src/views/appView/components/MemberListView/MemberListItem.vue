<script setup lang="ts">
import { onMounted, PropType } from 'vue';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { MemberWithEmbeddedUser } from '../../../../api/models';
import { stateStore } from '../../../../store';

const props = defineProps({
    member : Object as PropType<MemberWithEmbeddedUser>
});

</script>

<template>
    <div class="flex flex-row w-full gap-2 p-2 rounded-md bg-base-100">
        <div class="flex items-center flex-shrink align-middle">
            <div class="flex avatar">
                <div class="flex w-10 h-10 rounded-full bg-primary">
                    <div class="inline-flex items-center justify-center w-full h-full text-2xl font-semibold text-primary-content">
                        {{ ((member?.nickname ? member.nickname : member?.user.display_name) || "?")[0] }}
                    </div>

                </div>

            </div>
        </div>

        <div class="flex flex-col justify-center w-full h-full items-left text-ellipsis">
            <span class="flex flex-row gap-2">
                {{ member?.nickname ? member.nickname : member?.user.display_name }}
            </span>
        </div>
    </div>
</template>