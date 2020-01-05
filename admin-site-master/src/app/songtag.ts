export class SongTag {
    id: number;
    songID: number;
    tagID: number;

    constructor(id = 0, songID = 0, tagID = 0) {
        this.id = id;
        this.songID = songID;
        this.tagID = tagID;
    }
}