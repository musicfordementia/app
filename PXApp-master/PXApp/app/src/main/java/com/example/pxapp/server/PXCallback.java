package com.example.pxapp.server;

public interface PXCallback {
    void onSuccess(String message);
    void onFailure(String message);
}
