<script setup>
import { computed, onMounted, useTemplateRef, ref, onBeforeMount } from 'vue';
import { stateStore } from '../../../../store';
import { createCommunity } from '../../../../api/communities';

const modal = useTemplateRef("modal");

const userData = ref(null)

const communityName = ref("");
const communityTemplateName = ref("")
const communityTemplateTemplate = computed(() => templates[communityTemplateName.value])
const shouldCommunityBeCreated = ref(false);

const templates = {
    "Clean Slate (default)" : {
        channels : [{"name" : "general"}],
        roles : []
    },
    "Gaming Hub" : {
        channels : [
            {name : "lfg"},
            {name : "clips"},
            {name : "off-topic"}
        ],
        roles : []
    },
    "School Club" : {
        channels : [
            {name : "studying"},
            {name : "notes"},
            {name : "off-topic"},
        ],
        roles : []
    }
}

const createThatCommunity = async () => {
    console.log(shouldCommunityBeCreated.value);

    // Prompt must have been cancelled if the value of this variable is false
    if (!shouldCommunityBeCreated.value){
        return;
    }

    const newCommunity = await createCommunity({
        name : communityName.value,
        template : communityTemplateTemplate.value
    })
    .catch((err) => {
        console.log(err);
    });

    if (newCommunity) {
        stateStore.commit("appendCommunityList", newCommunity);
        
        stateStore.dispatch("viewThisCommunityIdcWhatChannel", newCommunity.id)
    }
}

onBeforeMount(() => {
    userData.value = stateStore.state.currentUserData;
    communityName.value = `${userData.value.display_name}'s Community`;
})

</script>

<template>
    <dialog class="modal" ref="modal">
        <div class="flex flex-col modal-box">
            <h1 class="text-xl font-bold">Create a Community</h1>

            <label class="flex-col flex-grow w-full gap-2 my-2 form-control">

                <div class="flex flex-col">
                    <div class="label">
                        <span class="label-text">Community Name</span>
                    </div>
                    
                    <input 
                        class="input input-bordered" 
                        v-model="communityName" 
                        placeholder="My really awesome community">
                </div>
                
                <div class="flex flex-col">
                    
                    <div class="label">
                        <span class="label-text">Community Template</span>
                    </div>
                    
                    <select class="select select-bordered" v-model="communityTemplateName">

                        <option 
                        v-for="[t, _] in Object.entries(templates)" 
                        :selected="t.includes('(default)')">
                            {{ t }}
                        </option>
                    
                    </select>

                </div>

            </label>

            <div class="divider" />
            
            <form 
                method="dialog" 
                class="flex flex-row justify-end w-full gap-2"
                @submit="createThatCommunity()"
            >
                <button class="btn btn-neutral" aria-label="close" type="close" formnovalidate @click="shouldCommunityBeCreated = false">Cancel</button>
                <button class="btn btn-primary" @click="shouldCommunityBeCreated = true">Create</button>
            </form>
        </div>
    </dialog>
</template>
