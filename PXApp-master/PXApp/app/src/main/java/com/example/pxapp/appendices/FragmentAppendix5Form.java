package com.example.pxapp.appendices;

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentTransaction;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.Spinner;
import android.widget.Button;
import android.widget.Toast;

import com.example.pxapp.InstantAutoComplete;
import com.example.pxapp.R;
import com.example.pxapp.server.PXCallback;
import com.example.pxapp.server.PXObjectCallback;
import com.example.pxapp.server.PXServer;
import com.example.pxapp.server.PXSong;
import com.example.pxapp.server.PXSongRating;

import java.util.ArrayList;

public class FragmentAppendix5Form extends Fragment {
    private PXServer server;
    private Spinner spnRating;
    private Button submitRating;
    private InstantAutoComplete txtName;
    private ArrayList<PXSong> allSongs;

    public FragmentAppendix5Form() {
        server = PXServer.getInstance(getContext());
    }

    public static FragmentAppendix5Form newInstance() {
        return new FragmentAppendix5Form();
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        final View rootView = inflater.inflate(R.layout.fragment_appendix_5_form, container, false);

        txtName = rootView.findViewById(R.id.txtName);
        server.getAllSongs(new PXObjectCallback<ArrayList<PXSong>>() {
            @Override
            public void onSuccess(String message, ArrayList<PXSong> songs) {
                allSongs = songs;

                ArrayList<String> songNames = new ArrayList<>();
                for (PXSong s : songs) songNames.add(s.name);
                ArrayAdapter<String> namesAdapter = new ArrayAdapter<>(
                    getContext(), android.R.layout.simple_dropdown_item_1line, songNames
                );
                txtName.setAdapter(namesAdapter);

                String[] ratings = { "1", "2", "3", "4", "5", "6" };
                ArrayAdapter<String> adapter = new ArrayAdapter<>(
                    getContext(),
                    R.layout.spinner_item,
                    ratings
                );
                adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
                spnRating = rootView.findViewById(R.id.spnRating);
                spnRating.setAdapter(adapter);

                submitRating = rootView.findViewById(R.id.submitRating);
                submitRating.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        if (!validate()) return;

                        PXSongRating sr = new PXSongRating(
                            getSongID(txtName.getText().toString()),
                            Integer.valueOf((String)spnRating.getSelectedItem())
                        );
                        server.addSongRating(sr, new PXCallback() {
                            @Override
                            public void onSuccess(String message) {
                                Fragment fragment = new FragmentAppendix5();
                                FragmentManager fm = getFragmentManager();
                                fm.popBackStackImmediate();
                                fm.beginTransaction()
                                  .replace(R.id.fragment_content, fragment)
                                  .setTransition(FragmentTransaction.TRANSIT_FRAGMENT_FADE)
                                  .addToBackStack(null)
                                  .commit();
                                Toast.makeText(getContext(), message, Toast.LENGTH_SHORT).show();
                            }

                            @Override
                            public void onFailure(String message) {
                                Toast.makeText(getContext(), message, Toast.LENGTH_SHORT).show();
                            }
                        });
                    }
                });
            }

            @Override
            public void onFailure(String message) {
                Toast.makeText(getContext(), message, Toast.LENGTH_SHORT).show();
            }
        });

        return rootView;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    private boolean validate() {
        boolean isValid = true;

        String songName = txtName.getText().toString().trim();

        if (songName.length() == 0) {
            txtName.setError("Please input a song");
            isValid = false;
        }
        else txtName.setError(null);

        if (getSongID(songName) == -1) {
            txtName.setError("Invalid song");
            isValid = false;
        }
        else txtName.setError(null);

        return isValid;
    }

    private int getSongID(String name) {
        for (PXSong s : allSongs) {
            if (s.name.equals(name)) return s.id;
        }

        return -1;
    }
}