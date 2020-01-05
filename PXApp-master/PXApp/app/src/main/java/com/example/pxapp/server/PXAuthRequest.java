package com.example.pxapp.server;

import com.android.volley.Response;
import com.android.volley.toolbox.JsonObjectRequest;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

// Wrapper class to send user's token on every request.
public class PXAuthRequest extends JsonObjectRequest {
    private String token;

    PXAuthRequest(int method, String url, JSONObject data, String token,
                  Response.Listener l, Response.ErrorListener el) {
        super(method, url, data, l, el);
        this.token = token;
    }

    @Override
    public Map<String, String> getHeaders() {
        HashMap<String, String> headers = new HashMap<>();
        headers.put("Authorization", "Bearer " + token);
        return headers;
    }
}
