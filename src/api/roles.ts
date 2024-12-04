import { wrappedFetch } from "./fetchWrapper";
import { Role } from "./models";

type CreateRoleParams = {
    name : string;
    colour? : number
}

export async function createRole(
    communityId : string,
    create_params : CreateRoleParams
) : Promise<Role> {
    const resp : Response = await wrappedFetch(
        `/communities/${communityId}/roles`,
        {
            method : "POST",
            body : JSON.stringify(create_params)
        }
    )

    return await resp.json() as Promise<Role>;
}

export async function getAllRoles(
    communityId : string
) : Promise<Role[]> {

    const resp : Response = await wrappedFetch(
        `/communities/${communityId}/roles`,
        {
            method : "GET"
        }
    );

    return await resp.json() as Promise<Role[]>;

}

export async function getRoleById(
    communityId : string,
    roleId : string
) : Promise<Role> {

    const resp : Response = await wrappedFetch(
        `/communities/${communityId}/roles/${roleId}`
    );

    return await resp.json() as Promise<Role>;

}

type RolePositionPair = {
    role_id : string,
    position : number
};

export async function updateRolePositions(
    communityId : string,
    positionPairs : Array<RolePositionPair>
) : Promise<Role[]> {

    const resp : Response = await wrappedFetch(
        `/communities/${communityId}/roles`,
        {
            method: "PATCH",
            body : JSON.stringify(positionPairs)
        }
    );

    return resp.json() as Promise<Role[]>;

}

type UpdateRoleParams = {
    name : string,
    colour? : number,
    permission_overrides : Record<string, boolean> 
}

export async function updateRole(
    communityId : string,
    roleId : string,
    updateParams : UpdateRoleParams
) : Promise<Role> {

    const resp : Response = await wrappedFetch(
        `/communities/${communityId}/roles/${roleId}`,
        {
            method : "PATCH",
            body : JSON.stringify(updateParams)
        }
    );

    return await resp.json() as Promise<Role>;

}

export async function deleteRole(
    communityId : string,
    roleId : string
) : Promise<boolean> {

    const resp : Response = await wrappedFetch(
        `/communities/${communityId}/roles/${roleId}`,
        {
            method : "DELETE"
        }
    );

    return resp.status === 200;

}