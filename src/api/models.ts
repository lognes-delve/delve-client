/*
    This file just holds the typescript version of the models for the backend
    data transfer objects (DTOs).
*/

export type User = {
    id : String;
    username : String;

    flags : string[];
    status : "online" | "away" | "dnd" | "invisible";
    last_seen : Date;

    display_name? : String;
    bio? : String;
    pronouns? : String;

    icon_key? : string;
    icon_primary? : number;
    icon_secondary? : number;

    created_at : Date;
    edited_at : Date;
}

export type Community = {
    id : String;
    name : String;
    owner_id : String;

    flags: string[];

    channel_ids : Array<String>[];
    roles : Array<Role>[];

    created_at : Date;
    edited_at : Date;
}

export type Channel = {
    id : String;
    community_id : String;
    name : String;

    // {role_id : {key: bool, ...}, ...}
    permission_overrides : Record<string, Record<string, boolean>>;
    
    created_at : Date;
    edited_at : Date;
}

export type Role = {
    id : String;
    community_id : String;
    colour? : Number;
    name : String;

    permission_overrides : Record<string, boolean>;
    
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
    user_id : String;
    
    role_ids : Array<String>[];
    nickname? : String;
    
    created_at : Date;
    edited_at : Date;
}

export type MemberWithEmbeddedUser = Member & {
    user: User;
}

export type FullMember = Member & {

    user : User;
    roles : Role[];

    highest_role_id : string | null;
    colour : string | null;
    permissions : Permissions;

}

export type Permissions = {
    manage_community : boolean;
    
    kick_members : boolean;
    ban_members : boolean;

    send_messages : boolean;
    read_messages : boolean;
    manage_channels : boolean;
    manage_messages : boolean;
}

export type Invite = {
    id : string;
    community_id : string;
    invite_code : string;
    author_id : string;
    
    valid_days : Number;

    created_at : Date;
    edited_at : Date;
    
}