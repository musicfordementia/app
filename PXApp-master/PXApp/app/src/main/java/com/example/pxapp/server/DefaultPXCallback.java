package com.example.pxapp.server;

import android.content.Context;
import android.widget.Toast;

public class DefaultPXCallback implements PXCallback {
    private Context ctx;

    public DefaultPXCallback(Context ctx) {
        this.ctx = ctx.getApplicationContext();
    }

    @Override
    public void onSuccess(String message) {
        Toast.makeText(ctx, message, Toast.LENGTH_SHORT).show();
    }

    @Override
    public void onFailure(String message) {
        Toast.makeText(ctx, message, Toast.LENGTH_LONG).show();
    }
}
