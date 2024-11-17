import { wrappedFetch } from "./fetchWrapper";
import { Community } from "./models";

type ChannelTemplateSpec = {
    name : String
}

type RoleTemplateSpec = {
    name : String,
    colour? : Number // hex repr
}

type CommunityTemplate = {
    channels : ChannelTemplateSpec[]
    roles : RoleTemplateSpec[] 
}

type CreateCommunityParams = {
    name : String,
    template : CommunityTemplate
}

export async function createCommunity(
    create_params : CreateCommunityParams
) : Promise<Community> {

    const resp : Response = await wrappedFetch(
        "/communities",
        {
            method: "POST",
            body : JSON.stringify(create_params)
        }
    );

    return await resp.json() as Promise<Community>;
}

export async function getJoinedCommunities() : Promise<Community[]> {
    
    const resp : Response = await wrappedFetch(
        "/communities/list",
    );

    return await resp.json() as Promise<Community[]>;
}

export async function getCommunity(communityId : String) : Promise<Community> {

    const resp : Response = await wrappedFetch(
        `/communities/${communityId}`
    );

    return await resp.json() as Promise<Community>;
}

type UpdateCommunityParams = {
    name? : String,
    owner_id? : String
}

export async function updateCommunity(communityId : String, update_params : UpdateCommunityParams) : Promise<Community> {

    const resp : Response = await wrappedFetch(
        `/communities/${communityId}`,
        {
            method: "PATCH",
            data : JSON.stringify(update_params)
        }
    );

    return await resp.json() as Promise<Community>;
}

export async function deleteCommunity(communityId : String) : Promise<Boolean> {
    
    const resp : Response = await wrappedFetch(
        `/communities/${communityId}`,
        {method : "DELETE"}
    );


    // Returns true if the response is 200 (indicates a succesful deletion)
    return resp.status == 200;
}