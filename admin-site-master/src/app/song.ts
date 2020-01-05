import { SongTag } from './songtag';

export class Song {
    id: number;
    name: string;
    artist: string;
    link: string;
    tempo: number;
    modeID: number;
    genreID: number;
    length: number;
    year: number;
    lyricID: number;
    tags: SongTag[];

    constructor(id = 0, name = '', artist = '', link = '', tempo = 0, modeID = 0, genreID = 0, 
                length = 0, year = 0, lyricID = 0, tags = []) {
        this.id = id;
        this.name = name;
        this.artist = artist;
        this.link = link;
        this.tempo = tempo;
        this.modeID = modeID;
        this.genreID = genreID;
        this.length = length;
        this.year = year;
        this.lyricID = lyricID;
        this.tags = tags;
    }
}