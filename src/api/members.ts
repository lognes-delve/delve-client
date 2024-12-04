import { wrappedFetch } from "./fetchWrapper";
import { FullMember, Member, MemberWithEmbeddedUser } from "./models";


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
) : Promise<FullMember[]> {

    const resp : Response = await wrappedFetch(
        `/communities/${communityId}/members`,
    );

    return await resp.json() as Promise<FullMember[]>;
}

type UpdateMemberParams = {
    nickname? : string | null
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
            body : JSON.stringify(update_params)
        }
    );

    return await resp.json() as Promise<Member>;
}

export async function getMemberById(
    communityId : String,
    userId : String
) : Promise<FullMember> {

    const resp : Response = await wrappedFetch(
        `/communities/${communityId}/members/${userId}`,
    );

    return await resp.json() as Promise<FullMember>;
}