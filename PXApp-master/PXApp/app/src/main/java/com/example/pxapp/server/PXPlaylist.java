package com.example.pxapp.server;

import java.util.ArrayList;

public class PXPlaylist {
    public int id;
    public String name, description;
    public ArrayList<PXSong> songs;

    public PXPlaylist(int id, String name, String description, ArrayList<PXSong> songs) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.songs = songs;
    }
}
