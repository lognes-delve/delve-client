import { wrappedFetch } from "./fetchWrapper";
import { Member, Invite } from "./models"

export class InviteCreateParams {
    valid_days : number = 7;
}

export async function createInviteCode(
    communityId : string,
    params : InviteCreateParams = new InviteCreateParams()
) : Promise<Invite> {
    
    const resp : Response = await wrappedFetch(
        `/communities/${communityId}/invites`,
        {
            method: "POST",
            body : JSON.stringify(params)
        }
    );

    return await resp.json() as Promise<Invite>;
}

export async function getCommunityInvites(
    communityId : string
) : Promise<Invite[]> {

    const resp : Response = await wrappedFetch(
        `/communities/${communityId}/invites`,
        {
            method: "GET"
        }
    );

    return await resp.json() as Promise<Invite[]>
}

export async function getInviteByCode(
    communityId : string,
    code : string
) : Promise<Invite> {

    const resp : Response = await wrappedFetch(
        `/communities/${communityId}/invites/${code}`
    );

    return await resp.json() as Promise<Invite>
}

export async function deleteInviteByCode(
    communityId : string,
    code : string
) : Promise<boolean> {

    const resp : Response = await wrappedFetch(
        `/communities/${communityId}/invites/${code}`,
        {
            method: "DELETE"
        }
    );

    return resp.status === 200;

}

export async function useInviteCode(
    code : string
) : Promise<Member> {

    const resp : Response = await wrappedFetch(
        `/communities/invite/${code}`,
        {
            method: "POST"
        }
    );

    return await resp.json() as Promise<Member>;

}