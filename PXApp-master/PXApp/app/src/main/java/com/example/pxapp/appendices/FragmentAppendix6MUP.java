package com.example.pxapp.appendices;

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentTransaction;
import android.view.LayoutInflater;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import com.example.pxapp.R;
import com.example.pxapp.server.PXObjectCallback;
import com.example.pxapp.server.PXPlaylist;
import com.example.pxapp.server.PXServer;

import java.util.ArrayList;

public class FragmentAppendix6MUP extends Fragment {
    private TextView txtError;
    private Button btnAdd;
    private PXServer server;
    private ArrayList<PXPlaylist> playlists = new ArrayList<>();

    public FragmentAppendix6MUP() {
        server = PXServer.getInstance(getContext());
    }

    public static FragmentAppendix6MUP newInstance() {
        return new FragmentAppendix6MUP();
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View rootView = inflater.inflate(R.layout.fragment_appendix_6mup, container, false);

        txtError = rootView.findViewById(R.id.txtError);
        btnAdd = rootView.findViewById(R.id.btnAdd);

        server.getPlaylists(new PXObjectCallback<ArrayList<PXPlaylist>>() {
            @Override
            public void onSuccess(String message, ArrayList<PXPlaylist> data) {
                playlists = data;
            }

            @Override
            public void onFailure(String message) {
                txtError.setText(getResources().getText(R.string.usage_plan_error_message));
                txtError.setVisibility(View.VISIBLE);
                btnAdd.setVisibility(View.GONE);
            }
        });

        btnAdd.setOnClickListener(new OnClickListener() {
            public void onClick(View v) {
                if (playlists.size() == 0) {
                    Toast.makeText(
                        getContext(),
                        "No playlists found - Please complete a pre-survey to get your playlists",
                        Toast.LENGTH_SHORT
                    ).show();
                    return;
                }

                Fragment fragment = FragmentAppendix6MUPForm.newInstance(playlists);
                FragmentManager fm = getFragmentManager();
                fm.popBackStackImmediate();
                fm.beginTransaction()
                  .replace(R.id.fragment_content, fragment)
                  .setTransition(FragmentTransaction.TRANSIT_FRAGMENT_OPEN)
                  .addToBackStack(null)
                  .commit();
            }
        });

        return rootView;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }
}