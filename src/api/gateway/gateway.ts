import { useCookies } from "@vueuse/integrations/useCookies";
import { GatewayEvent } from "./events";

const WEBSOCKET_ENDPOINT = "wss://delve.lognes.dev/gateway"

export class GatewayWebSocket {

    private event_handlers : Record<string, Array<(event : Object) => Promise<void>>>
    private websocket? : WebSocket
    private isInErrorState : boolean

    constructor() {
        this.event_handlers = {};
        this.websocket = undefined;

        this.isInErrorState = false;
    }

    public registerEventHandler(
        event_key : String, 
        cb : (event : Object) => Promise<void>
    ) : void {
        
        if(!Object.keys(this.event_handlers).includes(event_key as string)) {
            this.event_handlers = {...this.event_handlers, ...{[event_key as string] : []}}
        }

        this.event_handlers[event_key as string]
            .push(cb);

    }

    public async connectWebsocket() : Promise<void> {

        const cookies = useCookies()
        const token = cookies.get("token");

        console.log(token);

        if (!token) {
            throw Error("Failed to authenticate user in gateway");
        }

        if (!this.websocket) {
            this.websocket = new WebSocket(
                WEBSOCKET_ENDPOINT + "?" + new URLSearchParams({"token" : token})
            )
        }

        this.websocket.addEventListener(
            "message", async (event : MessageEvent<any>) => {
                return await this.internalEventCallback(JSON.parse(event.data as string));
            }
        )

        this.websocket.addEventListener(
            "close", async (event) => {
                console.log(`WS Close: ${event}`);

                // If the websocket doesn't think it's in an error state, then
                // just restart the websocket.
                if (!this.isInErrorState) {
                    await this.ensureWebsocketConnected();
                }
            }
        )

        this.websocket.addEventListener(
            "error", (event) => {
                console.log(`WS Err: ${event}`);
                this.isInErrorState = true;
            }
        )

    }

    public async ensureWebsocketConnected() : Promise<void> {
        if (this.websocket === undefined) {
            await this.connectWebsocket();
        }

        await new Promise(async (resolve) => {
            while(true) {
                if(this.websocket?.readyState == WebSocket.OPEN){
                    resolve(null);
                }

                await new Promise((resolve) => setTimeout(resolve, 250));
            }
        })
    }

    public async sendEvent(event : GatewayEvent) : Promise<void> {
        await this.ensureWebsocketConnected();
        this.websocket?.send(JSON.stringify(event));
    }

    private async internalEventCallback(event : GatewayEvent) : Promise<void> {
        if(!event.hasOwnProperty("event")) {
            throw Error(`Invalid event recieved! ${event.toString()}`);
        }

        if(!Object.keys(this.event_handlers).includes(event["event"] as string)) {
            return; // No callbacks found for this event.
        }

        this.event_handlers[event['event'] as string].forEach(
            async (cb) => {
                return await cb(event);
            }
        );

    }

}