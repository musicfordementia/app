package com.example.pxapp.server;

import android.util.Log;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

public class PXLDEntry {
    public int id;
    public Date dateTime;
    public String mood, situation, reaction, comments;
    public ArrayList<Integer> songs;

    public PXLDEntry(int id, Date dateTime, String mood, String situation, String reaction,
                     String comments, ArrayList<Integer> songs) {
        this.id = id;
        this.dateTime = dateTime;
        this.mood = mood;
        this.situation = situation;
        this.reaction = reaction;
        this.comments = comments;
        this.songs = songs;
    }

    public JSONObject toJSON() {
        try {
            JSONObject obj = new JSONObject();
            obj.put("id", id);
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            obj.put("dateTime", sdf.format(dateTime));
            obj.put("mood", mood);
            obj.put("situation", situation);
            obj.put("reaction", reaction);
            obj.put("comments", comments);
            JSONArray arr = new JSONArray();
            for (int s : songs) arr.put(s);
            obj.put("songs", arr);

            return obj;
        }
        catch (JSONException e) {
            Log.i("PXLDEntry", "toJSON: " + e.getMessage());
            return null;
        }
    }
}
