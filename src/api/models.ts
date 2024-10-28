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

    channel_ids : Array<String>[];
    role_ids : Array<String>[];

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

export type MessageContent = {
    text : String;
}

export type Message = {
    id : String;
    author_id : String;
    channel_id : String;
    community_id : String;
    
    content : MessageContent;
    mentions : String[];
    
    created_at : Date;
    edited_at : Date;
}

export type Member = {
    id : String;
    community_id : String;
    
    role_ids : Array<String>[];
    nickname? : String;
    
    created_at : Date;
    edited_at : Date;
}