package com.example.pxapp.appendices;

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentTransaction;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.TableLayout;
import android.widget.TableRow;
import android.widget.TextView;
import android.widget.Toast;

import com.example.pxapp.R;
import com.example.pxapp.server.PXObjectCallback;
import com.example.pxapp.server.PXServer;
import com.example.pxapp.server.PXSong;
import com.example.pxapp.server.PXSongRating;

import java.text.SimpleDateFormat;
import java.util.ArrayList;

public class FragmentAppendix5 extends Fragment{
    private Button addRating;
    private TableLayout tblSongRatings;
    private PXServer server;

    public FragmentAppendix5() {
        server = PXServer.getInstance(getContext());
    }

    public static FragmentAppendix5 newInstance() {
        return new FragmentAppendix5();
    }

    @Override
    public View onCreateView(final LayoutInflater inflater, final ViewGroup container,
                             Bundle savedInstanceState) {
        View rootView = inflater.inflate(R.layout.fragment_appendix_5, container, false);

        tblSongRatings = rootView.findViewById(R.id.tblSongRatings);

        server.getSongRatings(new PXObjectCallback<ArrayList<PXSongRating>>() {
            @Override
            public void onSuccess(String message, ArrayList<PXSongRating> data) {
                final ArrayList<PXSongRating> songRatings = data;

                server.getAllSongs(new PXObjectCallback<ArrayList<PXSong>>() {
                    @Override
                    public void onSuccess(String message, ArrayList<PXSong> data) {
                        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                        for (PXSongRating sr : songRatings) {
                            TableRow row = (TableRow)inflater.inflate(R.layout.song_ratings_table_row, container, false);

                            TextView txtDate = row.findViewById(R.id.txtDate);
                            txtDate.setText(sdf.format(sr.date));

                            TextView txtSongName = row.findViewById(R.id.txtSongName);
                            txtSongName.setText(getSongName(sr.songID, data));

                            TextView txtRating = row.findViewById(R.id.txtRating);
                            txtRating.setText(String.valueOf(sr.rating));

                            tblSongRatings.addView(row);
                        }
                    }

                    @Override
                    public void onFailure(String message) {
                        Toast.makeText(getContext(), message, Toast.LENGTH_SHORT).show();
                    }
                });
            }

            @Override
            public void onFailure(String message) {
                Toast.makeText(getContext(), message, Toast.LENGTH_SHORT).show();
            }
        });

        addRating = rootView.findViewById(R.id.addRating);
        addRating.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View v) {
                Fragment fragment = new FragmentAppendix5Form();
                FragmentManager fm = getFragmentManager();
                /*
                 * https://stackoverflow.com/a/14295368
                 *
                 * After clicking on Post-surveys then "Template for Rating..."
                 *
                 * Back stack:
                 * rem(List), add(App5)
                 * rem(Home), add(List)
                 * (App5 in view)
                 *
                 * After clicking "Add New Rating"
                 * popBackStack() -> rem(App5), add(List)
                 *
                 * rem(Home), add(List)
                 * (List in view)
                 *
                 * commit()
                 *
                 * Now in FragmentAppendix5Form
                 *
                 * rem(List), add(App5Form)
                 * rem(Home), add(List)
                 * (App5Form in view)
                 *
                 * popBackStack() -> remove(App5Form), add(List)
                 *
                 * rem(Home), add(List)
                 * (List in view)
                 *
                 * commit()
                 *
                 * rem(List), add(App5)
                 * rem(Home), add(List)
                 * (App5 in view)
                 */
                fm.popBackStackImmediate();
                fm.beginTransaction()
                  .replace(R.id.fragment_content, fragment)
                  .setTransition(FragmentTransaction.TRANSIT_FRAGMENT_FADE)
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

    private String getSongName(int id, ArrayList<PXSong> songs) {
        for (PXSong s : songs) {
            if (s.id == id) return s.name;
        }

        return "";
    }
}