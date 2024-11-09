import { wrappedFetch } from "./fetchWrapper";
import { Member } from "./models";

export async function joinCommunity(
    communityId : String
) : Promise<Member> {

    const resp : Response = await wrappedFetch(
        `/communities/${communityId}/members`,
        {method : "POST"}
    );

    return await resp.json() as Promise<Member>;
}

export async function leaveCommunity(
    communityId : String
) : Promise<boolean> {

    const resp : Response = await wrappedFetch(
        `/communities/${communityId}/members`,
        {method : "DELETE"}
    );

    return resp.status == 200;
}

export async function getMemberList(
    communityId : String
) : Promise<Member[]> {

    const resp : Response = await wrappedFetch(
        `/communities/${communityId}/members`,
    );

    return await resp.json() as Promise<Member[]>;
}

type UpdateMemberParams = {
    nickname? : String
}

export async function updateMember(
    communityId : String,
    userId : String, // Not a member_id, do not mix this up
    update_params : UpdateMemberParams
) : Promise<Member> {

    const resp : Response = await wrappedFetch(
        `/communities/${communityId}/members/${userId}`,
        {
            method : "PATCH",
            data : JSON.stringify(update_params)
        }
    );

    return await resp.json() as Promise<Member>;
}

export async function getMemberById(
    communityId : String,
    userId : String
) : Promise<Member> {

    const resp : Response = await wrappedFetch(
        `/communities/${communityId}/members/${userId}`,
    );

    return await resp.json() as Promise<Member>;
}