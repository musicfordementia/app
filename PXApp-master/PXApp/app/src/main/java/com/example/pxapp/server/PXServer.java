package com.example.pxapp.server;

import android.content.Context;
import android.util.Log;

import com.android.volley.DefaultRetryPolicy;
import com.android.volley.NetworkError;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.TimeoutError;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

public class PXServer {
    public static final String API_URL = //"http://192.168.1.83:3000/api/user/";
                                      "https://ks1908.scem.westernsydney.edu.au/api/user/";
    private static final String TAG = "PXServer";
    private static PXServer instance;
    private static Context ctx;
    private static RequestQueue queue;
    private static String token/* = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ0ZXN0QGVtYWlsLmNvbSIsImlhdCI6MTU3MjQ5MTUwOSwiZXhwIjoxNTcyNTc3OTA5fQ.iOaIIG42ut1Df5tNVdzxUBbEw2PHmFSzqPiVc62rQ1I"*/;

    private PXServer(Context ctx) {
        this.ctx = ctx;
        queue = getRequestQueue();
    }

    public static synchronized PXServer getInstance(Context ctx) {
        if (instance == null) instance = new PXServer(ctx);
        return instance;
    }

    public boolean isSignedIn() {
        return token != null;
    }

    public synchronized void signIn(String email, String password, final PXCallback callback) {
        if (isSignedIn()) {
            callback.onFailure("Already signed in");
            return;
        }

        try {
            String url = API_URL + PXRoutes.SIGN_IN;
            JSONObject data = new JSONObject();
            data.put("email", email);
            data.put("password", password);

            JsonObjectRequest req = new JsonObjectRequest(Request.Method.POST, url, data,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject res) {
                        try {
                            Boolean success = res.getBoolean("success");
                            String message = res.getString("message");

                            if (success) {
                                callback.onSuccess(message);
                                token = res.getString("token");
                            }
                            else callback.onFailure(message);
                        }
                        catch (JSONException e) {
                            callback.onFailure(e.getMessage());
                        }
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        callback.onFailure(parseVolleyError(error));
                    }
                });

            queue.add(req);
        }
        catch (JSONException e) {
            Log.e(TAG, "signIn: " + e.getMessage());
        }
    }

    public synchronized void signUp(PXAccount account, final PXCallback callback) {
        try {
            String url = API_URL + PXRoutes.SIGN_UP;
            JSONObject data = new JSONObject();
            data.put("email", account.email);
            data.put("password", account.password);
            data.put("typeID", account.type.value);
            data.put("firstName", account.firstName);
            data.put("lastName", account.lastName);
            if (account.institution == null) account.institution = "";
            data.put("institution", account.institution);

            JsonObjectRequest req = new JsonObjectRequest(Request.Method.POST, url, data,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject res) {
                        try {
                            Boolean success = res.getBoolean("success");
                            String message = res.getString("message");

                            if (success) callback.onSuccess(message);
                            else callback.onFailure(message);
                        }
                        catch (JSONException e) {
                            callback.onFailure(e.getMessage());
                        }
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        callback.onFailure(parseVolleyError(error));
                    }
                });

            queue.add(req);
        }
        catch (JSONException e) {
            Log.e(TAG, "signUp: " + e.getMessage());
        }
    }

    public synchronized void signOut() {
        token = null;
    }

    public synchronized void getAccountInfo(final PXObjectCallback<PXAccount> callback) {
        if (token == null) {
            callback.onFailure("Not signed in");
            return;
        }

        String url = API_URL + PXRoutes.ACCOUNT_INFO;
        PXAuthRequest req = new PXAuthRequest(Request.Method.GET, url, null, token,
            new Response.Listener<JSONObject>() {
                @Override
                public void onResponse(JSONObject res) {
                    try {
                        Boolean success = res.getBoolean("success");
                        String message = res.getString("message");

                        if (success) {
                            JSONObject account = res.getJSONObject("account");
                            PXAccount acc = new PXAccount(
                                account.getString("email"),
                                "",
                                 PXAccount.Type.valueOf(account.getInt("typeID")),
                                 account.getString("institution"),
                                 account.getString("firstName"),
                                 account.getString("lastName")
                            );
                            callback.onSuccess(message, acc);
                        }
                        else callback.onFailure(message);
                    }
                    catch (JSONException e) {
                        callback.onFailure(e.getMessage());
                    }
                }
            },
            new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    callback.onFailure(parseVolleyError(error));
                }
            });

        queue.add(req);
    }

    // Updates account info (excluding password).
    // Null or empty values will not be updated.
    public synchronized void updateAccountInfo(PXAccount.Type type, String firstName,
                                               String lastName, String institution,
                                               final PXCallback callback) {
        if (token == null) {
            callback.onFailure("Not signed in");
            return;
        }

        try {
            String url = API_URL + PXRoutes.ACCOUNT_UPDATE;
            JSONObject data = new JSONObject();
            if (type != null)
                data.put("typeID", type.value);
            if (firstName != null && firstName.length() > 0)
                data.put("firstName", firstName);
            if (lastName != null && lastName.length() > 0)
                data.put("lastName", lastName);
            if (institution != null && institution.length() > 0)
                data.put("institution", institution);

            PXAuthRequest req = new PXAuthRequest(Request.Method.POST, url, data, token,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject res) {
                        try {
                            Boolean success = res.getBoolean("success");
                            String message = res.getString("message");

                            if (success) callback.onSuccess(message);
                            else callback.onFailure(message);
                        }
                        catch (JSONException e) {
                            callback.onFailure(e.getMessage());
                        }
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        callback.onFailure(error.getMessage());
                    }
                });

            queue.add(req);
        }
        catch (JSONException e) {
            Log.e(TAG, "updateAccountInfo: " + e.getMessage());
        }
    }

    public synchronized void updateAccountPassword(String currentPassword, String newPassword,
                                                   final PXCallback callback) {
        if (token == null) {
            callback.onFailure("Not signed in");
            return;
        }

        try {
            String url = API_URL + PXRoutes.PASSWORD_UPDATE;
            JSONObject data = new JSONObject();
            data.put("currentPassword", currentPassword);
            data.put("newPassword", newPassword);

            PXAuthRequest req = new PXAuthRequest(Request.Method.POST, url, data, token,
                    new Response.Listener<JSONObject>() {
                        @Override
                        public void onResponse(JSONObject res) {
                            try {
                                Boolean success = res.getBoolean("success");
                                String message = res.getString("message");

                                if (success) callback.onSuccess(message);
                                else callback.onFailure(message);
                            }
                            catch (JSONException e) {
                                Log.e(TAG, "updateAccountPassword: " + e.getMessage());
                            }
                        }
                    },
                    new Response.ErrorListener() {
                        @Override
                        public void onErrorResponse(VolleyError error) {
                            callback.onFailure(parseVolleyError(error));
                        }
                    });

            queue.add(req);
        }
        catch (JSONException e) {
            callback.onFailure(e.getMessage());
        }
    }

    public synchronized void resetAccountPassword(String email, final PXCallback callback) {
        try {
            String url = API_URL + PXRoutes.PASSWORD_RESET;
            JSONObject data = new JSONObject();
            data.put("email", email);

            JsonObjectRequest req = new JsonObjectRequest(Request.Method.POST, url, data,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject res) {
                        try {
                            Boolean success = res.getBoolean("success");
                            String message = res.getString("message");

                            if (success) callback.onSuccess(message);
                            else callback.onFailure(message);
                        }
                        catch (JSONException e) {
                            callback.onFailure(e.getMessage());
                        }
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        callback.onFailure(parseVolleyError(error));
                    }
                });
            req.setRetryPolicy(new DefaultRetryPolicy(5000, 0,
                                                      DefaultRetryPolicy.DEFAULT_BACKOFF_MULT));

            queue.add(req);
        }
        catch (JSONException e) {
            Log.e(TAG, "resetAccountPassword: " + e.getMessage());
        }
    }

    public synchronized void getAllSongs(final PXObjectCallback<ArrayList<PXSong>> callback) {
        if (token == null) {
            callback.onFailure("Not signed in");
            return;
        }

        final String url = API_URL + PXRoutes.SONGS;
        PXAuthRequest req = new PXAuthRequest(Request.Method.GET, url, null, token,
            new Response.Listener<JSONObject>() {
                @Override
                public void onResponse(JSONObject res) {
                    try {
                        boolean success = res.getBoolean("success");
                        String message = res.getString("message");

                        if (!success) {
                            callback.onFailure(message);
                            return;
                        }

                        ArrayList<PXSong> songs = new ArrayList<>();
                        JSONArray arrSongs = res.getJSONArray("songs");
                        for (int i = 0; i < arrSongs.length(); i++) {
                            JSONObject obj = arrSongs.getJSONObject(i);
                            PXSong song = parseSong(obj);
                            if (song != null) songs.add(song);
                        }

                        callback.onSuccess(message, songs);
                    }
                    catch (JSONException e) {
                        callback.onFailure(e.getMessage());
                    }
                }
            },
            new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    callback.onFailure(parseVolleyError(error));
                }
            }
        );

        queue.add(req);
    }

    public synchronized void getAllQuestionnaires(final PXObjectCallback<ArrayList<PXQuestionnaire>> callback) {
        if (token == null) {
            callback.onFailure("Not signed in");
            return;
        }

        String url = API_URL + PXRoutes.QUESTIONNAIRES;
        PXAuthRequest req = new PXAuthRequest(Request.Method.GET, url, null, token,
            new Response.Listener<JSONObject>() {
                @Override
                public void onResponse(JSONObject res) {
                    try {
                        boolean success = res.getBoolean("success");
                        String message = res.getString("message");

                        if (success) {
                            JSONArray questionnairesArr = res.getJSONArray("questionnaires");
                            ArrayList<PXQuestionnaire> questionnaires = new ArrayList<>();
                            for (int i = 0; i < questionnairesArr.length(); i++) {
                                PXQuestionnaire q = parseQuestionnaire(questionnairesArr.getJSONObject(i));
                                if (q != null) questionnaires.add(q);
                            }

                            callback.onSuccess(message, questionnaires);
                        }
                        else callback.onFailure(message);
                    }
                    catch (JSONException e) {
                        callback.onFailure(e.getMessage());
                    }
                }
            },
            new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    callback.onFailure(parseVolleyError(error));
                }
            });

        queue.add(req);
    }

    public synchronized void getQuestionnaire(final int id,
                                              final PXObjectCallback<PXQuestionnaire> callback) {
        if (token == null) {
            callback.onFailure("Not signed in");
            return;
        }

        String url = API_URL + PXRoutes.QUESTIONNAIRES + id;
        PXAuthRequest req = new PXAuthRequest(Request.Method.GET, url, null, token,
            new Response.Listener<JSONObject>() {
                @Override
                public void onResponse(JSONObject res) {
                    try {
                        Boolean success = res.getBoolean("success");
                        String message = res.getString("message");

                        if (success) {
                            JSONObject questionnaire = res.getJSONObject("questionnaire");
                            String name = questionnaire.getString("name"),
                                   type = questionnaire.getString("type");

                            JSONArray questions = questionnaire.getJSONArray("questions");
                            ArrayList<PXQuestion> questionsArr = new ArrayList<>();
                            for (int i = 0; i < questions.length(); i++) {
                                JSONObject row = questions.getJSONObject(i);
                                questionsArr.add(parseQuestion(row));
                            }

                            callback.onSuccess(
                                message,
                                new PXQuestionnaire(id, name, type, questionsArr)
                            );
                        }
                        else callback.onFailure(message);
                    }
                    catch (JSONException e) {
                        callback.onFailure(e.getMessage());
                    }
                }
            },
            new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    callback.onFailure(parseVolleyError(error));
                }
            });

        queue.add(req);
    }

    public synchronized void answerQuestionnaire(int id, ArrayList<PXAnswer> answers,
                                                 final PXCallback callback) {
        if (token == null) {
            callback.onFailure("Not signed in");
            return;
        }

        String url = API_URL + PXRoutes.QUESTIONNAIRES + id + "/answer";
        try {
            JSONArray answersArr = new JSONArray();
            for (PXAnswer ans : answers) {
                JSONObject obj = new JSONObject();
                obj.put("questionID", ans.questionID);
                obj.put("str", ans.str);
                answersArr.put(obj);
            }
            JSONObject answersObj = new JSONObject();
            answersObj.put("answers", answersArr);

            PXAuthRequest req = new PXAuthRequest(Request.Method.POST, url, answersObj, token,
                    new Response.Listener<JSONObject>() {
                        @Override
                        public void onResponse(JSONObject res) {
                            try {
                                Boolean success = res.getBoolean("success");
                                String message = res.getString("message");

                                if (success) {
                                    callback.onSuccess(message);
                                }
                                else callback.onFailure(message);
                            }
                            catch (JSONException e) {
                                callback.onFailure(e.getMessage());
                            }
                        }
                    },
                    new Response.ErrorListener() {
                        @Override
                        public void onErrorResponse(VolleyError error) {
                            callback.onFailure(parseVolleyError(error));
                        }
                    });

            queue.add(req);
        }
        catch (JSONException e) {
            callback.onFailure(e.getMessage());
        }
    }

    public synchronized void getPlaylists(final PXObjectCallback<ArrayList<PXPlaylist>> callback) {
        if (token == null) {
            callback.onFailure("Not signed in");
            return;
        }

        String url = API_URL + PXRoutes.PLAYLISTS;
        PXAuthRequest req = new PXAuthRequest(Request.Method.GET, url, null, token,
            new Response.Listener<JSONObject>() {
                @Override
                public void onResponse(JSONObject res) {
                    try {
                        Boolean success = res.getBoolean("success");
                        String message = res.getString("message");

                        if (success) {
                            JSONArray arr = res.getJSONArray("playlists");
                            ArrayList<PXPlaylist> playlists = new ArrayList<>();

                            // Loop over every playlist.
                            for (int i = 0; i < arr.length(); i++) {
                                JSONObject objPlaylist = arr.getJSONObject(i);
                                int id = objPlaylist.getInt("id");
                                String name = objPlaylist.getString("name"),
                                       description = objPlaylist.getString("description");

                                // Loop over every song in the playlist.
                                ArrayList<PXSong> songs = new ArrayList<>();
                                JSONArray arrSongs = objPlaylist.getJSONArray("songs");
                                for (int j = 0; j < arrSongs.length(); j++) {
                                    JSONObject objSong = arrSongs.getJSONObject(j);
                                    PXSong song = parseSong(objSong);
                                    if (song != null) songs.add(song);
                                }

                                playlists.add(new PXPlaylist(id, name, description, songs));
                            }

                            callback.onSuccess(message, playlists);
                        }
                        else callback.onFailure(message);
                    }
                    catch (JSONException e) {
                        callback.onFailure(e.getMessage());
                    }
                }
            },
            new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    callback.onFailure(parseVolleyError(error));
                }
            });

        queue.add(req);
    }

    public synchronized void getSongRatings(final PXObjectCallback<ArrayList<PXSongRating>> callback) {
        if (token == null) {
            callback.onFailure("Not signed in");
            return;
        }

        String url = API_URL + PXRoutes.SONG_RATINGS;
        PXAuthRequest req = new PXAuthRequest(Request.Method.GET, url, null, token,
            new Response.Listener<JSONObject>() {
                @Override
                public void onResponse(JSONObject res) {
                    try {
                        boolean success = res.getBoolean("success");
                        String message = res.getString("message");

                        if (success) {
                            ArrayList<PXSongRating> songRatings = new ArrayList<>();
                            JSONArray arr = res.getJSONArray("songRatings");
                            for (int i = 0; i < arr.length(); i++) {
                                PXSongRating sr = parseSongRating(arr.getJSONObject(i));
                                if (sr != null) songRatings.add(sr);
                            }

                            callback.onSuccess(message, songRatings);
                        }
                        else callback.onFailure(message);
                    }
                    catch (JSONException e) {
                        callback.onFailure(e.getMessage());
                        Log.e(TAG, e.getMessage());
                    }
                }
            },
            new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    callback.onFailure(parseVolleyError(error));
                }
            }
        );

        queue.add(req);
    }

    // Only songID and rating are needed. Date will be generated by the server.
    public synchronized void addSongRating(PXSongRating songRating, final PXCallback callback) {
        if (token == null) {
            callback.onFailure("Not signed in");
            return;
        }

        String url = API_URL + PXRoutes.SONG_RATINGS + "/add";
        try {
            JSONObject data = new JSONObject();
            data.put("songID", songRating.songID);
            data.put("rating", songRating.rating);

            PXAuthRequest req = new PXAuthRequest(Request.Method.POST, url, data, token,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject res) {
                        try {
                            boolean success = res.getBoolean("success");
                            String message = res.getString("message");

                            if (success) callback.onSuccess(message);
                            else callback.onFailure(message);
                        }
                        catch (JSONException e) {
                            callback.onFailure(e.getMessage());
                            Log.e(TAG, e.getMessage());
                        }
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        callback.onFailure(parseVolleyError(error));
                    }
                }
            );

            queue.add(req);
        }
        catch (JSONException e) {
            callback.onFailure(e.getMessage());
            Log.e(TAG, e.getMessage());
        }
    }

    public synchronized void getLDEntries(final PXObjectCallback<ArrayList<PXLDEntry>> callback) {
        if (token == null) {
            callback.onFailure("Not signed in");
            return;
        }

        String url = API_URL + PXRoutes.LISTENING_DIARY;
        PXAuthRequest req = new PXAuthRequest(Request.Method.GET, url, null, token,
            new Response.Listener<JSONObject>() {
                @Override
                public void onResponse(JSONObject res) {
                    try {
                        boolean success = res.getBoolean("success");
                        String message = res.getString("message");

                        if (success) {
                            JSONArray arr = res.getJSONArray("listeningDiary");
                            ArrayList<PXLDEntry> entries = new ArrayList<>();
                            for (int i = 0; i < arr.length(); i++) {
                                PXLDEntry entry = parseLDEntry(arr.getJSONObject(i));
                                if (entry != null) entries.add(entry);
                            }
                            callback.onSuccess(message, entries);
                        }
                        else callback.onFailure(message);
                    }
                    catch (JSONException e) {
                        callback.onFailure(e.getMessage());
                        Log.i(TAG, "getLDEntries: " + e.getMessage());
                    }
                }
            },
            new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    callback.onFailure(parseVolleyError(error));
                }
            });

        queue.add(req);
    }

    public synchronized void addLDEntry(PXLDEntry entry, final PXCallback callback) {
        if (token == null) {
            callback.onFailure("Not signed in");
            return;
        }

        JSONObject obj = entry.toJSON();
        String url = API_URL + PXRoutes.LISTENING_DIARY + "/add";
        PXAuthRequest req = new PXAuthRequest(Request.Method.POST, url, obj, token,
            new Response.Listener<JSONObject>() {
                @Override
                public void onResponse(JSONObject res) {
                    try {
                        boolean success = res.getBoolean("success");
                        String message = res.getString("message");

                        if (success) callback.onSuccess(message);
                        else callback.onFailure(message);
                    }
                    catch (JSONException e) {
                        callback.onFailure(e.getMessage());
                        Log.e(TAG, "addLDEntry: " + e.getMessage());
                    }
                }
            },
            new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    callback.onFailure(parseVolleyError(error));
                }
            });

        queue.add(req);
    }

    public synchronized void getUsagePlans(final PXObjectCallback<ArrayList<PXUsagePlan>> callback) {
        if (token == null) {
            callback.onFailure("Not signed in");
            return;
        }

        String url = API_URL + PXRoutes.USAGE_PLAN;
        PXAuthRequest req = new PXAuthRequest(Request.Method.GET, url, null, token,
            new Response.Listener<JSONObject>() {
                @Override
                public void onResponse(JSONObject res) {
                    try {
                        boolean success = res.getBoolean("success");
                        String message = res.getString("message");

                        if (success) {
                            JSONArray arr = res.getJSONArray("usagePlan");
                            ArrayList<PXUsagePlan> plans = new ArrayList<>();
                            for (int i = 0; i < arr.length(); i++) {
                                PXUsagePlan p = PXUsagePlan.fromJSON(arr.getJSONObject(i));
                                if (p != null) plans.add(p);
                            }

                            callback.onSuccess(message, plans);
                        }
                        else callback.onFailure(message);
                    }
                    catch (JSONException e) {
                        Log.i(TAG, "getUsagePlans: " + e.getMessage());
                        callback.onFailure(e.getMessage());
                    }
                }
            },
            new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    callback.onFailure(parseVolleyError(error));
                }
            });

        queue.add(req);
    }

    public synchronized void addUsagePlan(PXUsagePlan plan, final PXCallback callback) {
        if (token == null) {
            callback.onFailure("Not signed in");
            return;
        }

        String url = API_URL + PXRoutes.USAGE_PLAN + "/add";
        PXAuthRequest req = new PXAuthRequest(Request.Method.POST, url, plan.toJSON(), token,
            new Response.Listener<JSONObject>() {
                @Override
                public void onResponse(JSONObject res) {
                    try {
                        boolean success = res.getBoolean("success");
                        String message = res.getString("message");

                        if (success) callback.onSuccess(message);
                        else callback.onFailure(message);
                    }
                    catch (JSONException e) {
                        Log.e(TAG, "addUsagePlan: " + e.getMessage());
                        callback.onFailure(e.getMessage());
                    }
                }
            },
            new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    callback.onFailure(parseVolleyError(error));
                }
            });

        queue.add(req);
    }

    // Run the rules on all the questionnaires the user has completed.
    public synchronized void runQuestionAnswerRules(final PXCallback callback) {
        if (!isSignedIn()) {
            callback.onFailure("Not signed in");
            return;
        }

        String url = API_URL + PXRoutes.QA_RULES_RUN;
        PXAuthRequest req = new PXAuthRequest(Request.Method.POST, url, null, token,
            new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject res) {
                        try {
                            boolean success = res.getBoolean("success");
                            String message = res.getString("message");

                            if (success) callback.onSuccess(message);
                            else callback.onFailure(message);
                        }
                        catch (JSONException e) {
                            Log.e(TAG, "runQuestionAnswerRules: " + e.getMessage());
                            callback.onFailure(e.getMessage());
                        }
                    }
                },
            new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        callback.onFailure(parseVolleyError(error));
                    }
                });

        queue.add(req);
    }

    public synchronized void runPlaylistRules(final PXCallback callback) {
        if (!isSignedIn()) {
            callback.onFailure("Not signed in");
            return;
        }

        String url = API_URL + PXRoutes.PLAYLIST_RULES_RUN;
        PXAuthRequest req = new PXAuthRequest(Request.Method.POST, url, null, token,
            new Response.Listener<JSONObject>() {
                @Override
                public void onResponse(JSONObject res) {
                    try {
                        boolean success = res.getBoolean("success");
                        String message = res.getString("message");

                        if (success) callback.onSuccess(message);
                        else callback.onFailure(message);
                    }
                    catch (JSONException e) {
                        Log.e(TAG, "runPlaylistRules: " + e.getMessage());
                        callback.onFailure(e.getMessage());
                    }
                }
            },
            new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    callback.onFailure(parseVolleyError(error));
                }
            });

        queue.add(req);
    }

    private RequestQueue getRequestQueue() {
        // Same queue should be used for the entire lifetime of the app.
        if (queue == null) queue = Volley.newRequestQueue(ctx);
        return queue;
    }

    private String parseVolleyError(VolleyError e) {
        if (e instanceof NetworkError)
            return "Not connected to the internet";
        else if (e instanceof TimeoutError)
            return "Request timed out";

        try {
            if (e.networkResponse != null && e.networkResponse.data != null) {
                String res = new String(e.networkResponse.data, StandardCharsets.UTF_8);
                JSONObject data = new JSONObject(res);
                return data.getString("message");
            }
            else return "Something went wrong";
        }
        catch (JSONException ex) {
            Log.e(TAG, "parseVolleyError: " + ex.getMessage());
            return "Unknown error occurred";
        }
    }

    private PXQuestion parseQuestion(JSONObject obj) {
        try {
            ArrayList<PXQuestion.Choice> choicesArr = new ArrayList<>();

            if (obj.has("choices")) {
                // Get the choices.
                JSONArray choices = obj.getJSONArray("choices");
                for (int j = 0; j < choices.length(); j++) {
                    JSONObject choicesRow = choices.getJSONObject(j);
                    choicesArr.add(new PXQuestion.Choice(
                        choicesRow.getInt("id"),
                        choicesRow.getString("str")
                    ));
                }
            }

            int vis = 0;
            if (obj.get("visibleIfChoiceID") != JSONObject.NULL) {
                vis = obj.getInt("visibleIfChoiceID");
            }

            return new PXQuestion(
                obj.getInt("id"),
                obj.getInt("pageNo"),
                obj.getString("str"),
                PXQuestion.ChoiceType.valueOf(obj.getInt("typeID")),
                obj.getInt("hasOther") != 0,
                vis,
                choicesArr
            );
        }
        catch (JSONException e) {
            Log.e(TAG, "parseQuestion: " + e.getMessage());
            return null;
        }
    }

    private PXSong parseSong(JSONObject obj) {
        try {
            PXSong song = new PXSong(
                obj.getInt("id"),
                obj.getString("name"),
                obj.getString("artist"),
                obj.getString("link"),
                obj.getInt("tempo"),
                obj.getString("mode"),
                obj.getString("genre"),
                obj.optInt("length", 0),
                obj.optInt("year", 0),
                obj.getString("lyric")
            );

            if (song.artist.toLowerCase().equals("null")) song.artist = null;
            if (song.link.toLowerCase().equals("null")) song.link = null;

            return song;
        }
        catch(JSONException e) {
            Log.e(TAG, "parseSong: " + e.getMessage());
            return null;
        }
    }

    private PXQuestionnaire parseQuestionnaire(JSONObject obj) {
        try {
            JSONArray questionsArr = obj.getJSONArray("questions");
            ArrayList<PXQuestion> questions = new ArrayList<>();
            for (int i = 0; i < questionsArr.length(); i++) {
                PXQuestion q = parseQuestion(questionsArr.getJSONObject(i));
                if (q == null) return null;
                questions.add(q);
            }

            return new PXQuestionnaire(
                obj.getInt("id"),
                obj.getString("name"),
                obj.getString("type"),
                questions
            );
        }
        catch (JSONException e) {
            Log.e(TAG, "parseQuestionnaire: " + e.getMessage());
            return null;
        }
    }

    private PXSongRating parseSongRating(JSONObject obj) {
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            int id = obj.getInt("id"),
                songID = obj.getInt("songID"),
                rating = obj.getInt("rating");
            Date date = sdf.parse(obj.getString("date"));

            return new PXSongRating(id, date, songID, rating);
        }
        catch (Exception e) {
            Log.e(TAG, "parseSongRating: " + e.getMessage());
            return null;
        }
    }

    private PXLDEntry parseLDEntry(JSONObject obj) {
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
            int id = obj.getInt("id");
            Date dateTime = sdf.parse(obj.getString("dateTime"));
            String mood = obj.getString("mood"),
                situation = obj.getString("situation"),
                reaction = obj.getString("reaction"),
                comments = obj.getString("comments");

            JSONArray arr = obj.getJSONArray("songs");
            ArrayList<Integer> songs = new ArrayList<>();
            for (int i = 0; i < arr.length(); i++) {
                songs.add(arr.getInt(i));
            }

            return new PXLDEntry(id, dateTime, mood, situation, reaction, comments, songs);
        }
        catch (Exception e) {
            Log.e(TAG, "parseLDEntry: " + e.getMessage());
            return null;
        }
    }
}

