import { wrappedFetch } from "./fetchWrapper";
import { Channel } from "./models";

export async function getAllChannels(
    communityId : String
) : Promise<Channel[]> {

    const resp : Response = await wrappedFetch(
        `/communities/${communityId}/channels`
    );

    return await resp.json() as Promise<Channel[]>;

}

type CreateChannelParams = {
    name? : String;
}

export async function createChannel(
    communityId : String,
    create_params : CreateChannelParams
) : Promise<Channel> {

    const resp : Response = await wrappedFetch(
        `/communities/${communityId}/channels`,
        {
            method : "POST",
            body : JSON.stringify(create_params)
        }
    );

    return await resp.json() as Promise<Channel>;
}

export async function getChannelById(
    communityId : String,
    channelId : String
) : Promise<Channel> {

    const resp : Response = await wrappedFetch(
        `/communities/${communityId}/channels/${channelId}`
    );

    return await resp.json() as Promise<Channel>;

}

type UpdateChannelParams = {
    name? : String;
}

export async function updateChannel(
    communityId : String,
    channelId : String,
    update_params : UpdateChannelParams
) : Promise<Channel> {

    const resp : Response = await wrappedFetch(
        `/communities/${communityId}/channels/${channelId}`,
        {
            method : "PATCH",
            body : JSON.stringify(update_params)
        }
    );
    
    return await resp.json() as Promise<Channel>
    
}

export async function deleteChannel(
    communityId : String,
    channelId : String
) : Promise<Boolean> {
    
    const resp : Response = await wrappedFetch(
        `/communities/${communityId}/channels/${channelId}`,
        {method : "DELETE"}
    );

    return resp.status == 200;
}