<script setup lang="js">
import { Icon } from '@iconify/vue/dist/iconify.js';
import { ref } from 'vue';
import { faker } from '@faker-js/faker';

const conversationStartersEnabled = ref(true);

/* 
    The data within this array was generated with AI. However this has no impact
    on the functionality of my application and only offers more variety for
    demonstration purposes.
*/
const conversationStarters = ref([
    {text: "Lovely weather we're having today, isn't it?", icon: "mdi:weather-partly-rainy"},
    {text: "Did you guys see the game last night?", icon: "mdi:football"},
    {text: "Anybody here play video games?", icon: "mdi:gamepad-variant"},
    {text: "Hello World!", icon: "mdi:human-greeting-variant"},
    {text: "What's everyone listening to these days?", icon: "mdi:music"},
    {text: "Anyone here into movies? What's your favorite?", icon: "mdi:movie"},
    {text: "Got any fun plans for the weekend?", icon: "mdi:calendar-weekend"},
    {text: "Who's into cooking? Any recipes to share?", icon: "mdi:chef-hat"},
    {text: "Anyone here traveled anywhere interesting lately?", icon: "mdi:airplane"},
    {text: "What's everyone's favorite TV show right now?", icon: "mdi:television-classic"},
    {text: "Read any good books recently?", icon: "mdi:book-open-page-variant"},
    {text: "Who here loves concerts? What's the best one you've been to?", icon: "mdi:guitar-acoustic"},
    {text: "What do you all do for fun?", icon: "mdi:emoticon-happy-outline"},
    {text: "What's everyone's favorite kind of food?", icon: "mdi:food"},
    {text: "Any coffee enthusiasts in the room?", icon: "mdi:coffee"},
    {text: "What new hobbies have you picked up lately?", icon: "mdi:palette"},
    {text: "Anyone here enjoy being outdoors? Favorite outdoor activities?", icon: "mdi:pine-tree"},
    {text: "What's something new you've learned recently?", icon: "mdi:lightbulb-on"},
    {text: "Anyone here into sports? Which ones?", icon: "mdi:soccer"},
    {text: "Anyone listening to any interesting podcasts?", icon: "mdi:podcast"},
    {text: "What's everyone's favorite city to visit?", icon: "mdi:city"},
    {text: "Who's into fitness here? How do you stay active?", icon: "mdi:weight-lifter"},
    {text: "Do you guys prefer movies or books?", icon: "mdi:movie-open"},
    {text: "Anyone enjoy puzzles or board games?", icon: "mdi:puzzle"},
    {text: "How's everyone doing today?", icon: "mdi:emoticon-happy"}
])

const fetchRandomConversationStarters = () => {
    return faker.helpers.arrayElements(conversationStarters.value, 3);
}

</script>

<template>
    <div class="flex flex-col gap-8">
        <div class="flex flex-row gap-4">
            <div class="flex flex-col items-center justify-center w-24 h-24 rounded-full max-w-24 max-h-24 bg-base-300">
                <Icon icon="mdi:hand-wave" inline height="3rem"/>
            </div>
    
            <div class="flex flex-col justify-center">
                <h1 class="text-2xl font-bold">Welcome to #channel</h1>
                <p>Looks like you've reached the start of this channel, send a message and start a conversation!</p>        
            </div>
        </div>
          
    <div v-if="conversationStartersEnabled" class="flex flex-col gap-2">
        <h2 class="flex flex-row gap-4 text-lg font-semibold">
            <Icon class="text-accent" icon="mdi:sparkles" height="auto" inline />
            <span>Don't know where to start?</span>
        </h2>

        <div class="flex flex-row gap-2 overflow-x-scroll overflow-y-hidden no-scrollbar">
            <button v-for="cs in fetchRandomConversationStarters()" class="flex flex-row text-base-content btn btn-sm">
                <Icon :icon="cs.icon" inline height="auto" />
                <span>{{ cs.text }}</span>
            </button>
        </div>

    </div>

    </div>
</template>