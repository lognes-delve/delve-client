import Vuex from 'vuex';
import { User, Community, Channel } from "../api/models";

type UpdateChannelViewPayload = {
    communityId : String,
    channelId : String
}

export const stateStore = new Vuex.Store({
    state : {
        currentChatboxContent : "",
        currentViewingCommunity : null,
        currentViewingChannel : null,
        currentUserData : null,
        userCommunityList : [],
        communityChannelList: [],
    },
    mutations: {
        setChatboxContent(state : any, body : String) : void {
            state.currentChatboxContent = body;
        },

        appendChatboxContent(state : any, body : String) : void {
            state.currentChatboxContent = (state.currentChatboxContent + body);
        },

        clearChatboxContent(state : any) : void {
            state.currentChatboxContent = "";
        },

        updateChannelView(state : any, payload : UpdateChannelViewPayload) : void {
            state.currentViewingCommunity = payload.communityId;
            state.currentViewingChannel = payload.channelId;
        },
        
        updateCurrentUserData(state : any, user : User) : void {
            state.currentUserData = user;
        },

        pushCommunityList(state : any, list : Community[]) : void {
            state.userCommunityList = list;
        },

        pushChannelList(state : any, list : Channel[]) : void {
            state.communityChannelList = list;
        }
    }
});