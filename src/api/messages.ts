import { wrappedFetch } from "./fetchWrapper";
import { Message } from "./models";

type MessageContent = {
    text : String
}

export async function createMessage(
    communityId : String,
    channelId : String,
    content : MessageContent
) : Promise<Message> {

    const resp : Response = await wrappedFetch(
        `/communities/${communityId}/channels/${channelId}/messages`,
        {
            method: "POST",
            body : JSON.stringify(content)
        }
    );

    return await resp.json() as Promise<Message>;
}

type GetMessageQueryOptions = {
    limit? : Number; // (lte 100)
    sent_before? : Date;
    sent_after? : Date;
    sort_order? : "ASC" | "DSC";
}

export async function getChannelMessages(
    communityId : String,
    channelId : String,
    options : GetMessageQueryOptions
) : Promise<Message[]> {

    const resp : Response = await wrappedFetch(
        `/communities/${communityId}/channels/${channelId}/messages?` 
            + new URLSearchParams(options as Record<string, string>).toString()
    );

    return await resp.json() as Promise<Message[]>;

}

export async function getMessageById(
    communityId : String,
    channelId : String,
    messageId : String
) : Promise<Message> {

    const resp : Response = await wrappedFetch(
        `/communities/${communityId}/channels/${channelId}/messages/${messageId}`
    )

    return await resp.json() as Promise<Message>;
}

export async function deleteMessage(
    communityId : String,
    channelId : String,
    messageId : String
) : Promise<Boolean> {

    const resp : Response = await wrappedFetch(
        `/communities/${communityId}/channels/${channelId}/messages/${messageId}`,
        {method : "DELETE"}
    )
    
    return resp.status == 200;
}

type MessageUpdateParams = {
    text? : String;
}

export async function updateMessage(
    communityId : String,
    channelId : String,
    messageId : String,
    update_params : MessageUpdateParams
) : Promise<Message> {
    
    const resp : Response = await wrappedFetch(
        `/communities/${communityId}/channels/${channelId}/messages/${messageId}`,
        {
            method : "PATCH",
            body : JSON.stringify(update_params)
        }
    );

    return await resp.json() as Promise<Message>;

}