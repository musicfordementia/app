package com.example.pxapp.server;

import java.util.Date;

public class PXSongRating {
    public int id;
    public Date date;
    public int songID, rating;

    public PXSongRating(int songID, int rating) {
        this.songID = songID;
        this.rating = rating;
    }

    public PXSongRating(int id, Date date, int songID, int rating) {
        this.id = id;
        this.date = date;
        this.songID = songID;
        this.rating = rating;
    }
}
