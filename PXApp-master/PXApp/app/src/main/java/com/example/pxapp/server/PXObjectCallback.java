package com.example.pxapp.server;

public interface PXObjectCallback<T> {
    void onSuccess(String message, T data);
    void onFailure(String message);
}
