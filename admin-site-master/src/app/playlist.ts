import { Song } from './song';

export class PlaylistTag {
    id: number;
    playlistID: number;
    tagID: number;

    constructor(id = 0, playlistID = 0, tagID = 0) {
        this.id = id;
        this.playlistID = playlistID;
        this.tagID = tagID;
    }
}

export class Playlist {
    id: number;
    name: string;
    description: string;
    songs: Song[];
    tags: PlaylistTag[];

    constructor(id = 0, name = '', description = '', songs = [], tags = []) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.songs = songs;
        this.tags = tags;
    }
}