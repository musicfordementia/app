export class UsagePlan {
    id: number;
    userID: number;
    playlistID: number;
    timeOfDay: string;
    symptoms: string;
    howOften: string;
    howLong: string;

    constructor(id = 0, userID = 0, playlistID = 0, timeOfDay = '', symptoms = '', howOften = '',
                howLong = '') {
        this.id = id;
        this.userID = userID;
        this.playlistID = playlistID;
        this.timeOfDay = timeOfDay;
        this.symptoms = symptoms;
        this.howOften = howOften;
        this.howLong = howLong;
    }
}