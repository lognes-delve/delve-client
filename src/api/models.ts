/*
    This file just holds the typescript version of the models for the backend
    data transfer objects (DTOs).
*/

export type User = {
    id : String;
    username : String;

    display_name? : String;
    bio? : String;
    pronouns? : String;

    created_at : Date;
    edited_at : Date;
}

export type Community = {
    id : String;
    name : String;
    owner_id : String;

    channels : Array<Channel>[];
    roles : Array<Role>[];

    member_count : Number;
    channel_count : Number;
    role_count : Number;

    created_at : Date;
    edited_at : Date;
}

export type Channel = {
    id : String;
    community_id : String;
    name : String;
    
    created_at : Date;
    edited_at : Date;
}

export type Role = {
    id : String;
    community_id : String;
    colour? : Number;
    name : String;
    
    created_at : Date;
    edited_at : Date;
}