package com.example.pxapp.server;

import android.util.Log;

import org.json.JSONException;
import org.json.JSONObject;

public class PXUsagePlan {
    public int id, playlistID;
    public String timeOfDay, symptoms, howOften, howLong;

    public PXUsagePlan(int id, int playlistID, String timeofDay, String symptoms, String howOften, String howLong) {
        this.id = id;
        this.playlistID = playlistID;
        this.timeOfDay = timeofDay;
        this.symptoms = symptoms;
        this.howOften = howOften;
        this.howLong = howLong;
    }

    public JSONObject toJSON() {
        try {
            JSONObject obj = new JSONObject();
            obj.put("id", id);
            obj.put("playlistID", playlistID);
            obj.put("timeOfDay", timeOfDay);
            obj.put("symptoms", symptoms);
            obj.put("howOften", howOften);
            obj.put("howLong", howLong);

            return obj;
        }
        catch (JSONException e) {
            Log.i("PXUsagePlan", "toJSON: " + e.getMessage());
            return null;
        }
    }

    public static PXUsagePlan fromJSON(JSONObject obj) {
        if (obj == null) return null;
        try {
            return new PXUsagePlan(
                obj.getInt("id"),
                obj.getInt("playlistID"),
                obj.getString("timeOfDay"),
                obj.getString("symptoms"),
                obj.getString("howOften"),
                obj.getString("howLong")
            );
        }
        catch (JSONException e) {
            Log.i("PXUsagePlan", "fromJSON: " + e.getMessage());
            return null;
        }
    }
}
