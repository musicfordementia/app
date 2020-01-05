export class ListeningDiary {
    id: number;
    userID: number;
    dateTime: Date;
    mood: string;
    situation: string;
    reaction: string;
    comments: string;
    songs: number[];

    constructor(id = 0, userID = 0, dateTime = new Date(), mood = '', situation = '', reaction = '',
                comments = '', songs = []) {
        this.id = id;
        this.userID = userID;
        this.dateTime = dateTime;
        this.mood = mood;
        this.situation = situation;
        this.reaction = reaction;
        this.comments = comments;
        this.songs = songs;
    }
}