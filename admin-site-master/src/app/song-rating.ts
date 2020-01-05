export class SongRating {
    id: number;
    userID: number;
    date: Date;
    songID: number;
    rating: number;

    constructor(id = 0, userID = 0, date = new Date(), songID = 0, rating = 0) {
        this.id = id;
        this.userID = userID;
        this.date = date;
        this.songID = songID;
        this.rating = rating;
    }
}