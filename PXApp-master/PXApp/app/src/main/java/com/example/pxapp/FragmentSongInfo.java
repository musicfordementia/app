package com.example.pxapp;

import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.example.pxapp.server.PXSong;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class FragmentSongInfo extends Fragment {
    private PXSong song;

    public FragmentSongInfo() {

    }

    public static FragmentSongInfo newInstance(PXSong song) {
        FragmentSongInfo f = new FragmentSongInfo();
        Bundle args = new Bundle();
        args.putSerializable("song", song);
        f.setArguments(args);
        return f;
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View rootView = inflater.inflate(R.layout.fragment_song_info, container, false);

        Bundle args = getArguments();
        if (args != null) {
            song = (PXSong)args.getSerializable("song");

            TextView txtName = rootView.findViewById(R.id.txtName);
            txtName.setText(song.name);

            TextView txtArtist = rootView.findViewById(R.id.txtArtist);
            txtArtist.setText(song.artist != null ? song.artist : "");

            TextView txtTempo = rootView.findViewById(R.id.txtTempo);
            txtTempo.setText(String.valueOf(song.tempo));

            TextView txtMode = rootView.findViewById(R.id.txtMode);
            txtMode.setText(song.mode != null ? song.mode : "");

            TextView txtGenre = rootView.findViewById(R.id.txtGenre);
            txtGenre.setText(song.genre != null ? song.genre : "");

            TextView txtYear = rootView.findViewById(R.id.txtYear);
            txtYear.setText(song.year != 0 ? String.valueOf(song.year) : "");

            TextView txtLyricType = rootView.findViewById(R.id.txtLyricType);
            txtLyricType.setText(song.lyricType != null ? song.lyricType : "");

            Button btnPlay = rootView.findViewById(R.id.btnPlay);
            if (song.link == null) {
                btnPlay.setVisibility(View.GONE);
            }
            else {
                btnPlay.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View view) {
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
                });
            }
        }

        return rootView;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
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
