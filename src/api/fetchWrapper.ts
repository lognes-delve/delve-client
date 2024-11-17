import { useCookies } from "@vueuse/integrations/useCookies";
import { useFirebaseAuth } from "vuefire";

const BASE_URL = "https://delve.lognes.dev"

const refreshCookie = async () => {

    const firebaseAuth = useFirebaseAuth();
    const cookies = useCookies();

    // It may be significantly easier to just use this in place of the manual cookie
    // assignment but I don't want to break anything
    const refreshed_jwt = await firebaseAuth?.currentUser?.getIdToken(true);

    if (!refreshed_jwt) {
        throw new Error("Failed to refresh token. Something has gone really wrong.")
    }

    cookies.set("token", refreshed_jwt);

    return;
}

export async function wrappedFetch(endpoint : String, options : object = {}) : Promise<Response> {

    // Do some wacky auth injection stuff here
    let additionalHeaders : Record<string, string> = {};
    const cookies = useCookies();

    
    let resp = undefined;
    
    while (!resp)
        {

        if (cookies.get("token")) {
            additionalHeaders["Authorization"] = `Bearer ${cookies.get("token")}`;
        };

        resp = await fetch(
            `${BASE_URL}${endpoint}`,
            {
                ...options,
                headers: {
                    "Content-Type" : "application/json",
                    ...additionalHeaders
                }
            }
        );

        if (!resp.ok && resp.status === 401) {
            refreshCookie()
                .catch((err) => {throw err;})
        };
    }

    return resp;

}
