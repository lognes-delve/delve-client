import { useCookies } from "@vueuse/integrations/useCookies";

const BASE_URL = "https://delve.lognes.dev"

export async function wrappedFetch(endpoint : String, options : object = {}) : Promise<Response> {

    // Do some wacky auth injection stuff here
    let additionalHeaders : Record<string, string> = {};
    const cookies = useCookies();

    if (cookies.get("token")) {
        additionalHeaders["Authorization"] = `Bearer ${cookies.get("token")}`;
    };

    const resp = await fetch(
        `${BASE_URL}${endpoint}`,
        {
            ...options,
            headers: {
                "Content-Type" : "application/json",
                ...additionalHeaders
            }
        }
    );

    console.log(resp.status);

    if (!resp.ok) {
        throw new Error(`Something went wrong! ${resp.statusText}`)
    };

    return await resp.json() as Promise<Response>;

}
