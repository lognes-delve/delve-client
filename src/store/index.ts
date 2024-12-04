import Vuex from 'vuex';
import { User, Community, Channel, Member, MemberWithEmbeddedUser, FullMember } from "../api/models";
import { getAllChannels } from '../api/channels';
import { getMemberList } from '../api/members';
import { GatewayWebSocket } from '../api/gateway/gateway';
import { StateResponse } from '../api/gateway/events';
import { getUser } from '../api/users';

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
        userCommunityList : {} as Record<string, Community>,
        communityChannelList: {} as Record<string, Channel>,
        memberList : {} as Record<string, MemberWithEmbeddedUser>,
        showMemberListView : false,

        gatewayWebsocket : new GatewayWebSocket(),
        isGatewayReady : false,
    },
    mutations: {
        toggleMemberListView(state : any) : void {
            state.showMemberListView = (!state.showMemberListView);
        },

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

        popCommunityList(state : any, communityId : String) : void {
            delete state.userCommunityList[communityId as any];
        },

        pushCommunityList(state : any, list : Record<string, Community>) : void {
            state.userCommunityList = list;
        },

        appendCommunityList(state : any, c : Community) : void {
            const newCommunityRef : Record<string, Community> = {[c.id as string] : c}; 
            state.userCommunityList = {...newCommunityRef, ...state.userCommunityList};
        },

        pushChannelList(state : any, list : Channel[]) : void {
            state.communityChannelList = Object.fromEntries(list.map(c => [c.id, c]));
        },

        clearChannelList(state : any) : void {
            state.communityChannelList = {};
        },

        appendChannelList(state : any, channel : Channel) : void {
            state.communityChannelList = {...state.communityChannelList, ...{[channel.id as string] : channel}};
        },

        popChannelList(state : any, channelId : String) : void {
            delete state.communityChannelList[channelId as string];
        },

        pushMemberList(state : any, list : MemberWithEmbeddedUser[]) : void {
            state.memberList = Object.fromEntries(list.map(mem => [mem.user_id, mem]));
        },

        clearMemberList(state : any) : void {
            state.memberList = {};
        },

        appendMemberList(state : any, m : MemberWithEmbeddedUser) : void {
            const newMemberPart : Record<string, MemberWithEmbeddedUser> = {[m.user_id as string] : m};
            state.memberList = {...state.memberList, ...newMemberPart};
        },

        removeMemberList(state : any, user_id : String) : void {
            delete state.memberList[user_id as string];
        }
    },
    getters: {
        currentChannel(state : any) : Channel {
            return state.communityChannelList[state.currentViewingChannel];
        },
        currentCommunity(state : any) : Community {
            return state.userCommunityList[state.currentViewingCommunity];
        },
        isNoActiveCommunity(state : any) : Boolean {
            return !state.currentViewingCommunity && !state.currentViewingChannel
        },
        communityMemberLookup : (state: any) => (userId : String) : Member | undefined => {
            return state.memberList[userId as string];
        }
    },
    actions : {
        async ohMyGodFindAChannelPlease(context : any) : Promise<Boolean> {

            const selectedCommunity : Community = Object.values(context.state.userCommunityList)[0] as Community;

            if(!selectedCommunity)
            {
                context.commit("updateChannelView", {channelId : null, communityId : null});
                return false;
            }

            await context.dispatch("ensureSyncedCommunity", selectedCommunity.id);

            const selectedChannel = (Object.values(context.state.communityChannelList) as Channel[])[0];

            context.commit(
                "updateChannelView",
                {
                    channelId : selectedChannel ? selectedChannel.id : null,
                    communityId : selectedCommunity.id
                }
            );

            await context.dispatch("pushViewContextToGateway");

            return true;
            
        },
        async viewThisCommunityIdcWhatChannel(context : any, communityId : String) : Promise<void> {
            
            await context.dispatch("ensureSyncedCommunity", communityId);
            
            const channel = (Object.values(context.state.communityChannelList) as Channel[])[0];

            context.commit(
                "updateChannelView",
                {
                    channelId : channel ? channel.id : null,
                    communityId : communityId
                }
            );

            await context.dispatch("pushViewContextToGateway");
        },
        async ensureSyncedCommunity(context : any, newCommunityId : String) : Promise<Boolean> {
            // Returns true if the community was re-synced
            // If the community ids dont match, re-sync member list + channel list
            if (newCommunityId !== context.state.currentViewingCommunity) {
                console.log("Syncing Community");
                const updatedMemberList = await getMemberList(newCommunityId);
                
                context.commit("pushMemberList", updatedMemberList);
                
                const channels = await getAllChannels(newCommunityId);
                
                context.commit("pushChannelList", channels);
                return true;
            }
            return false;
        },
        async viewThisCommunityAndChannel(context : any, payload : UpdateChannelViewPayload) : Promise<void> {
            /*
            This method is very important because it will 
            also fetch the member list if the before community 
            is different than the current 
            */
           
            await context.dispatch("ensureSyncedCommunity", payload.communityId);            

            context.commit(
                "updateChannelView",
                {
                    channelId: payload.channelId,
                    communityId : payload.communityId
                }
            );

            await context.dispatch("pushViewContextToGateway");
        },
        async pushViewContextToGateway(context : any) : Promise<void> {
            const websocket : GatewayWebSocket = context.state.gatewayWebsocket;

            await websocket.ensureWebsocketConnected();

            await websocket.sendEvent(
                new StateResponse(
                    context.state.currentViewingChannel,
                    context.state.currentViewingCommunity
                )
            );
        },
        async upsertMemberList(context : any, m : MemberWithEmbeddedUser | Member) : Promise<void> {
            
            let user; 

            if ((m as Object).hasOwnProperty("user")) { // must be a MemberWithEmbeddedUser type
                user = (m as MemberWithEmbeddedUser).user;
                delete (m as { user? : User }).user;
            }
            else if((m.user_id as string) in context.state.memberList) { // must be a Member, check for already existing key
                user = context.state.memberList[m.user_id as string].user
            }
            else { // Otherwise, query the user resource directly
                user = await getUser(m.user_id);
            }

            const memberRef = {
                ...m,
                ...new Object({"user": user})
            }

            context.state.memberList[m.user_id as string] = memberRef;

        },
        checkForPermission(context : any, permission_key : String) : Boolean {

            const currentUserMember : FullMember = context.getters.communityMemberLookup(
                context.state.currentUserData.id
            )

            if(!currentUserMember) {
                return false;
            }

            const comm : Community = context.getters.currentCommunity;

            if(!comm) {
                return false;
            }

            return (comm.owner_id === currentUserMember.user_id || (currentUserMember.permissions as Record<string, boolean>)[permission_key as string] === true)

        }
    }
});