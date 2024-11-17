export interface GatewayEvent {
    event : string,
    origin? : string
};

export class StateResponse implements GatewayEvent {
    event : string = "state_response"
    channel_id : string
    community_id : string

    constructor(channel_id : string, community_id : string) {
        this.channel_id = channel_id;
        this.community_id = community_id;
    }
}