package com.example.pxapp;

import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentTransaction;
import android.support.v7.widget.DividerItemDecoration;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ProgressBar;
import android.widget.Toast;

import com.example.pxapp.server.PXObjectCallback;
import com.example.pxapp.server.PXServer;
import com.example.pxapp.server.PXSong;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class FragmentSongs extends Fragment {
    private SongsAdapter adapterSongs;
    private RecyclerView rvSongs;
    private ProgressBar progressBar;
    private PXServer server;
    private ArrayList<PXSong> songs;

    public FragmentSongs() {
        server = PXServer.getInstance(getContext());
    }

    public static FragmentSongs newInstance() {
        return new FragmentSongs();
    }

    public static FragmentSongs newInstance(ArrayList<PXSong> songs) {
        FragmentSongs f = new FragmentSongs();
        Bundle args = new Bundle();
        args.putSerializable("songs", songs);
        f.setArguments(args);
        return f;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        Bundle args = getArguments();
        if (args != null) {
            this.songs = (ArrayList<PXSong>)args.getSerializable("songs");
        }
        super.onCreate(savedInstanceState);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_songs, container, false);
    }

    @Override
    public void onViewCreated(View view, Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        progressBar = view.findViewById(R.id.progressBar);
        rvSongs = view.findViewById(R.id.rvSongs);

        if (songs == null || songs.isEmpty()) {
            server.getAllSongs(new PXObjectCallback<ArrayList<PXSong>>() {
                @Override
                public void onSuccess(String message, final ArrayList<PXSong> songs) {
                    FragmentSongs.this.songs = songs;

                    initRvSongs();

                    rvSongs.setVisibility(View.VISIBLE);
                    progressBar.setVisibility(View.GONE);

                    Toast.makeText(getContext(), message, Toast.LENGTH_SHORT).show();
                }

                @Override
                public void onFailure(String message) {
                    progressBar.setVisibility(View.GONE);
                    Toast.makeText(getContext(), message, Toast.LENGTH_LONG).show();
                }
            });
        }
        else initRvSongs();
    }

    private void initRvSongs() {
        if (adapterSongs == null) {
            adapterSongs = new SongsAdapter(
                getContext(),
                songs,
                new SongsAdapter.ItemClickListener() {
                    @Override
                    public void onClick(int listPos) {
                        PXSong song = songs.get(listPos);

                        if (song.link == null) {
                            Toast.makeText(getContext(), "No link found", Toast.LENGTH_SHORT).show();
                            return;
                        }

                        String videoId = parseYouTubeURL(song.link);
                        if (videoId == null) {
                            Toast.makeText(getContext(), "Invalid link", Toast.LENGTH_SHORT).show();
                            return;
                        }

                        // Try opening in YouTube app. Fallback to browser if YouTube app not installed.
                        Intent app = new Intent(Intent.ACTION_VIEW, Uri.parse("vnd.youtube:" + videoId)),
                            browser = new Intent(Intent.ACTION_VIEW, Uri.parse(song.link));
                        try {
                            getContext().startActivity(app);
                        }
                        catch(ActivityNotFoundException e) {
                            getContext().startActivity(browser);
                        }
                    }
                },
                new SongsAdapter.MenuItemClickListener() {
                    @Override
                    public void onClick(int listPos, int menuItemId) {
                        FragmentSongInfo f = FragmentSongInfo.newInstance(songs.get(listPos));
                        FragmentManager fm = getFragmentManager();
                        fm.beginTransaction()
                          .replace(R.id.fragment_content, f)
                          .setTransition(FragmentTransaction.TRANSIT_FRAGMENT_OPEN)
                          .addToBackStack(null)
                          .commit();
                    }
                }
            );
        }

        rvSongs.setAdapter(adapterSongs);
        rvSongs.setLayoutManager(new LinearLayoutManager(getContext()));
        RecyclerView.ItemDecoration dec = new DividerItemDecoration(getContext(),
                DividerItemDecoration.VERTICAL);
        rvSongs.addItemDecoration(dec);
    }

    // Return the video ID from the URL if found.
    // Otherwise, returns null.
    private String parseYouTubeURL(String url) {
        if (url == null) return null;

        Pattern pattern;
        // Long URL.
        if (url.contains("youtube.com")) {
            pattern = Pattern.compile("\\/watch\\?v=([a-zA-Z0-9_-]{10}[048AEIMQUYcgkosw])");
        }
        // Short URL
        else if (url.contains("youtu.be")){
            pattern = Pattern.compile("\\/([a-zA-Z0-9_-]{10}[048AEIMQUYcgkosw])");
        }
        else return null;

        Matcher matcher = pattern.matcher(url);
        if (matcher.find()) return matcher.group(1);
        else return null;
    }
}

