package com.example.pxapp;

import android.content.DialogInterface;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v7.app.AlertDialog;
import android.support.v7.widget.DividerItemDecoration;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ProgressBar;
import android.widget.Toast;

import com.example.pxapp.server.PXCallback;
import com.example.pxapp.server.PXObjectCallback;
import com.example.pxapp.server.PXPlaylist;
import com.example.pxapp.server.PXServer;

import java.util.ArrayList;

public class FragmentPlaylists extends Fragment {
    private PlaylistsAdapter adapter;
    private RecyclerView rvPlaylists;
    private ProgressBar progressBar;
    private PXServer server;
    private ArrayList<PXPlaylist> playlists = new ArrayList<>();
    private MenuItem refreshPlaylistsItem;

    public FragmentPlaylists() { this.server = PXServer.getInstance(getContext()); }

    public static FragmentPlaylists newInstance() { return new FragmentPlaylists(); }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setHasOptionsMenu(true);
    }

    @Override
    public void onCreateOptionsMenu(Menu menu, MenuInflater inflater) {
        menu.clear();
        inflater.inflate(R.menu.options_playlists, menu);
        refreshPlaylistsItem = menu.getItem(0);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case R.id.action_refresh_playlists: {
                AlertDialog.Builder builder = new AlertDialog.Builder(getContext());
                builder.setTitle("Refresh Playlists");
                builder.setMessage(
                    "Are you sure you want to refresh your playlists?\n" +
                    "Doing so will delete your current playlists and new playlists will be generated."
                );

                builder.setPositiveButton("Yes", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialogInterface, int i) {
                        refreshPlaylistsItem.setEnabled(false);
                        refreshPlaylists();
                    }
                });
                builder.setNegativeButton("No", null);

                AlertDialog dialog = builder.create();
                dialog.show();

                return true;
            }
        }

        return super.onOptionsItemSelected(item);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_playlists, container, false);
    }

    @Override
    public void onViewCreated(View view, Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        progressBar = view.findViewById(R.id.progressBar);
        rvPlaylists = view.findViewById(R.id.rvPlaylists);

        if (playlists == null || playlists.isEmpty()) {
            server.getPlaylists(new PXObjectCallback<ArrayList<PXPlaylist>>() {
                @Override
                public void onSuccess(String message, ArrayList<PXPlaylist> data) {
                    playlists = data;

                    initRvPlaylists();

                    rvPlaylists.setVisibility(View.VISIBLE);
                    progressBar.setVisibility(View.GONE);

                    Toast.makeText(getContext(), message, Toast.LENGTH_SHORT).show();
                }

                @Override
                public void onFailure(String message) {
                    Toast.makeText(getContext(), message, Toast.LENGTH_SHORT).show();
                }
            });
        }
        else initRvPlaylists();
    }

    private void initRvPlaylists() {
        if (adapter == null) {
            adapter = new PlaylistsAdapter(getContext(), playlists);
        }

        rvPlaylists.setAdapter(adapter);
        rvPlaylists.setLayoutManager(new LinearLayoutManager(getContext()));
        RecyclerView.ItemDecoration dec = new DividerItemDecoration(
            getContext(),
            DividerItemDecoration.VERTICAL
        );
        rvPlaylists.addItemDecoration(dec);
    }

    private void replacePlaylists(ArrayList<PXPlaylist> newPlaylists) {
        if (playlists == null) playlists = new ArrayList<>();
        playlists.clear();
        playlists.addAll(newPlaylists);

        if (adapter == null) initRvPlaylists();
        else adapter.notifyDataSetChanged();
    }

    private void refreshPlaylists() {
        rvPlaylists.setVisibility(View.GONE);

        server.runQuestionAnswerRules(new PXCallback() {
            @Override
            public void onSuccess(String message) {
                server.runPlaylistRules(new PXCallback() {
                    @Override
                    public void onSuccess(String message) {
                        server.getPlaylists(new PXObjectCallback<ArrayList<PXPlaylist>>() {
                            @Override
                            public void onSuccess(String message, ArrayList<PXPlaylist> data) {
                                replacePlaylists(data);

                                rvPlaylists.setVisibility(View.VISIBLE);
                                progressBar.setVisibility(View.GONE);
                                refreshPlaylistsItem.setEnabled(true);

                                Toast.makeText(getContext(), message, Toast.LENGTH_SHORT).show();
                            }

                            @Override
                            public void onFailure(String message) {
                                Toast.makeText(getContext(), message, Toast.LENGTH_SHORT).show();
                                progressBar.setVisibility(View.GONE);
                                refreshPlaylistsItem.setEnabled(true);
                            }
                        });
                    }

                    @Override
                    public void onFailure(String message) {
                        Toast.makeText(getContext(), message, Toast.LENGTH_SHORT).show();
                        progressBar.setVisibility(View.GONE);
                        refreshPlaylistsItem.setEnabled(true);
                    }
                });
            }

            @Override
            public void onFailure(String message) {
                Toast.makeText(getContext(), message, Toast.LENGTH_SHORT).show();
                progressBar.setVisibility(View.GONE);
                refreshPlaylistsItem.setEnabled(true);
            }
        });
    }
}
