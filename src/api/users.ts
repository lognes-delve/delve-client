import { getIdToken } from "firebase/auth";
import { wrappedFetch } from "./fetchWrapper.ts";
import { User } from "./models.ts";
import { useFirebaseAuth } from "vuefire";

export async function getMe() : Promise<User> {

    // Check the sessionStorage to see if the currentUser in there
    const cachedCurrentUser = sessionStorage.getItem("currentUser");

    // If the user isn't cached, get the user
    if(!cachedCurrentUser){
        const resp : Response = await wrappedFetch("/users/me");

        const userData : User = await resp.json() as User; // what the hell

        // Cache the current user's data to the session storage so I don't continuously query it
        sessionStorage.setItem("currentUser", JSON.stringify(userData));

        return userData as User;
    }

    return JSON.parse(cachedCurrentUser) as User;
}

export async function getUserJWT() : Promise<String> {

    const firebaseAuth = useFirebaseAuth();

    const token = await firebaseAuth?.currentUser?.getIdToken(true);

    if (!token) {
        throw Error("Failed to get token? WHAT?")
    }

    return token;

}

export async function getUser(userId : String) : Promise<User> {
    const resp : Response = await wrappedFetch(`/users/${userId}`);

    return await resp.json() as Promise<User>;
}

type UserUpdateParams = {
    display_name? : String,
    username? : String,
    bio? : String,
    pronouns? : String
}

// Updates the user and returns the new user record
export async function updateUser(update_params : UserUpdateParams) : Promise<User> {
    const resp : Response = await wrappedFetch("/users/", {
        method: "PATCH",
        data : JSON.stringify({
            display_name : (update_params.display_name) ? update_params.display_name : {},
            username : (update_params.username) ? update_params.username : {},
            bio : (update_params.bio) ? update_params.bio : {},
            pronouns : (update_params.pronouns) ? update_params.pronouns : {}
        })
    });

    return await resp.json() as Promise<User>;
}

export async function usernameCheck(username : String) : Promise<boolean> {
    const resp : Response = await wrappedFetch(
        "/users/username_check", {params: {"username" : username}});

    return resp.status == 200;
}