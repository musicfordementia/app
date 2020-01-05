package com.example.pxapp.server;

import java.io.Serializable;

public class PXSong implements Serializable {
    public int id;
    public String name, artist, link;
    public int tempo;
    public String mode, genre;
    public int length, year;
    public String lyricType;

    public PXSong(int id, String name, String artist, String link, int tempo, String mode,
                  String genre, int length, int year, String lyricType) {
        this.id = id;
        this.name = name;
        this.artist = artist;
        this.link = link;
        this.tempo = tempo;
        this.mode = mode;
        this.genre = genre;
        this.length = length;
        this.year = year;
        this.lyricType = lyricType;
    }
}
