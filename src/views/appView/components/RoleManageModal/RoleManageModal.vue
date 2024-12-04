<!--Yes, this is such a big piece that it requires its own folder-->

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import BaseModal from '../Modals/BaseModal.vue';
import RoleListOption from './RoleListOption.vue';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { FormKit } from '@formkit/vue';
import RoleColourSwatch from './RoleColourSwatch.vue';
import draggableComponent from 'vuedraggable';

type ClientSideRole = {name : String, colour : string, id : number, permission_overrides : Record<string, "unset" | "allow" | "disallow">}; 
type BackendRole = {name : String, colour : number, id : number, permission_overrides : Record<string, boolean>}

const roles = ref<BackendRole[]>([]);

type PermissionDefinition = {
    id : String,
    name : String,
    description : String
}

const PERMISSIONS : PermissionDefinition[] = [
    {
        id : 'kick_members',
        name: "Kick Members",
        description: "Allows the user to kick members who are in this community. This should only ever be given to trusted individuals. (THIS CURRENTLY DOES NOT DO ANYTHING)"
    },
    {
        id : 'ban_members',
        name: "Ban Members",
        description: "Allows the user to ban members who are in this community. This should only ever be given to trusted individuals. (THIS CURRENTLY DOES NOT DO ANYTHING)"
    },
    {
        id : 'send_messages',
        name: "Send Messages",
        description: "Allows the user to send messages to channels. Denying a user this permission will still allow them to see messages, but will not allow their messages to be sent to other users. You can set this permission override on channels to specifically prevent users from messaging in those channels, while still providing read-only access."
    },
    {
        id : 'read_messages',
        name : "Read Messages",
        description: "Allows the user to read messages in channels. Denying this permission will prevent the user from seeing any messages. You can deny this permission on specific channels in order to create \"staff-only\" channels"
    },
    {
        id : 'manage_channels',
        name : "Manage Channels",
        description: "Allows the user to manage channels. When a user has this permission they will be able to create new channels and modify or delete existing ones."
    },
    {
        id : 'manage_messages',
        name: "Manage Messages",
        description: "Allows the user to manage all the messages within a community, regardless of whether or not they are the author or said message."
    }
]

const form_data = ref();
const drag = ref(false);

const addRole = async () => {

    console.log(roles.value);

    const newRoleId = roles.value.length > 0 ? Math.max(...roles.value.map(r => r.id)) + 1 : 0

    roles.value.push({
        name: "New Role",
        colour: Math.ceil(Math.random() * 0xffffff),
        id: newRoleId,
        permission_overrides : {}
    })

    await new Promise((resolve) => setTimeout(resolve, 50))

    selectedRole.value = newRoleId;
    hasBeenModified.value = true;
}

const shrinkwrapRole = (
    role : ClientSideRole
) : BackendRole => {

    return {
        id : role.id,
        name : role.name,
        colour : parseInt(role.colour.substring(1), 16),
        permission_overrides : Object.fromEntries(
            Object
            .entries(role.permission_overrides)     // turn into kv pair
            .filter((e) => e[1] !== "unset")      // remove nulls
            .map((v) => [v[0], v[1] === "allow"])   // turn string to bool
        )
    }
}

const unwrapRole = (
    role : BackendRole
) : ClientSideRole => {

    return {
        id : role.id,
        name : role.name,
        colour : "#" + role.colour.toString(16),
        permission_overrides : Object.fromEntries(
            PERMISSIONS.map(
                (v) => [
                    v.id,
                    role.permission_overrides[v.id as string]
                    ? (
                        role.permission_overrides[v.id as string]
                        ? "allow"
                        : "disallow"
                    )
                    : "unset"
                ]
            )
        )
    }

}

const deleteRole = async (role : BackendRole) => {
    
    console.log(selectedRole.value, role.id);
    if(selectedRole.value === role.id) {
        selectedRole.value = null;
    }

    roles.value = roles.value.filter((v) => v.id !== role.id);
    hasBeenModified.value = true;

}

const selectedRole = ref<number | null>(roles.value.length ? roles.value[0].id : null);

const hasBeenModified = ref<boolean>(false);

watch(selectedRole, (nv, ov) => {

    // Push changes to cache
    if (ov !== null) {
        hasBeenModified.value = true;

        roles.value[roles.value.findIndex((v) => v.id === ov)] = shrinkwrapRole(form_data.value);
    }

    form_data.value = unwrapRole(
        roles.value[roles.value.findIndex((v) => v.id === nv)]
    );

    console.log(form_data.value)
});

</script>

<template>
    <BaseModal classes="max-w-4xl h-full">
        <div class="flex flex-row h-full">

            <div class="flex flex-col flex-shrink-0 w-1/4">
                <h4 class="pl-1 font-bold text-md">ROLES</h4>

                
                <div class="flex flex-col flex-grow">

                    <draggableComponent
                        v-model="roles"
                        @start="drag=true"
                        @end="drag=false"
                        ghost-class="totally-not-just-an-opacity-attr"
                        item-key="id"
                    >
                        <template #item="{element}">
                            <RoleListOption 
                                :role="element" 
                                :active="element.id === selectedRole"
                                @delete="deleteRole"
                                @click="selectedRole = element.id" 
                            />
                        </template>

                        <template #footer>
                            <button 
                                class="flex flex-row justify-center w-full p-2 border-2 border-dashed rounded-lg border-base-content hover:bg-base-300"
                                @click="addRole"
                                >
                                <Icon icon="mdi:plus" inline height="1.25rem"/>
                            </button>
                        </template>

                    </draggableComponent>

                </div>

            </div>
            
            <div class="flex-grow-0 flex-shrink-0 mx-1 divider divider-horizontal"/>
            
            <div class="flex flex-col flex-grow-0 w-full" v-if="selectedRole !== null">

                <div class="flex-grow px-2 overflow-y-scroll">

                    <FormKit
                        type="form"
                        method="dialog"
                        :actions="false"
                        v-model="form_data"
                    >

                    <div>
                        <h4 class="mb-2 font-bold text-md">ROLE CONFIG</h4>
    
                        <div class="flex flex-col gap-4">
                            
                            <FormKit
                                type="text"
                                label="Role Name"
                                name="name"
                                :classes="{
                                    label: {
                                        'font-bold' : true,
                                        'uppercase' : true,
                                        'text-sm' : true
                                    },
                                    input: {
                                        'input' : true,
                                        'input-bordered' : true,
                                        'w-full' : true,
                                        'mt-1' : true
                                    }
                                }"
                            />
    
                            <RoleColourSwatch
                                value="#deadbf"
                            />

                        </div>

    
                        </div>
                        
                        <div class="w-full my-2 divider" />
                        
                        <div>
                            <h4 class="mb-2 text-sm font-bold">PERMISSIONS</h4>
                            
                            <div class="flex flex-col gap-2.5 mb-6">
                                <FormKit
                                    type="group"
                                    name="permission_overrides"
                                >
    
                                    <div v-for="p in PERMISSIONS" class="flex flex-row items-center gap-2 py-2 permission-div">
                                        
                                        <div class="flex flex-col">
                                            <h4 class="font-bold uppercase text-md">{{ p.name }}</h4>
                                        
                                            <p class="text-sm break-words whitespace-break-spaces">{{ p.description }}</p>
                                        </div>
                                        
                                        <FormKit 
                                        type="select"
                                        :id="(p.id as string)"
                                        :name="(p.id as string)"
                                        :options="{
                                            allow: 'Allowed',
                                            unset: 'Unset',
                                            disallow: 'Disallow'
                                        }"
                                        value="unset"
                                        :classes="{
                                            input: {
                                                'select' : true,
                                                'select-bordered' : true
                                            },
                                            outer: {
                                                'items-center' : true,
                                                'flex' : true,
                                                'flex-col' : true
                                            }
                                        }"
                                    />
                                    
                                    </div>
                                    
                                </FormKit>

                            </div>


                        </div>

                    </FormKit>
                </div>

            </div>

            <div v-else class="flex flex-col flex-grow-0 w-full">
                <div class="flex flex-col items-center justify-center w-full h-full gap-2">
                    <Icon icon="mdi:tag" height="2rem"/>
                    <span>Select a role on the left to get started</span>
                </div>
            </div>

        </div>
    </BaseModal>
</template>

<style lang="scss" scoped>

.permission-div:not(:first-child) {
    @apply border-t-base-content/15 border-t
}

.totally-not-just-an-opacity-attr {
    opacity: 50%;
}

</style>