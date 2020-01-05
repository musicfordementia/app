package com.example.pxapp;

import android.content.Context;
import android.support.v4.app.FragmentActivity;
import android.support.v4.app.FragmentTransaction;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.example.pxapp.server.PXPlaylist;

import java.util.ArrayList;

public class PlaylistsAdapter extends RecyclerView.Adapter<PlaylistsAdapter.ViewHolder> {
    private Context ctx;
    private ArrayList<PXPlaylist> playlists;

    public PlaylistsAdapter(Context ctx, ArrayList<PXPlaylist> playlists) {
        this.ctx = ctx;
        this.playlists = playlists;
    }

    @Override
    public PlaylistsAdapter.ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        LayoutInflater inflater = LayoutInflater.from(ctx);

        View row = inflater.inflate(R.layout.rvplaylists_child, parent, false);
        return new PlaylistsAdapter.ViewHolder(row);
    }

    @Override
    public void onBindViewHolder(final PlaylistsAdapter.ViewHolder holder, final int pos) {
        final PXPlaylist playlist = playlists.get(pos);

        holder.row.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                FragmentTransaction ft = ((FragmentActivity)ctx).getSupportFragmentManager()
                                                                .beginTransaction();
                ft.replace(R.id.fragment_content, FragmentSongs.newInstance(playlist.songs))
                  .setTransition(FragmentTransaction.TRANSIT_FRAGMENT_OPEN)
                  .addToBackStack(null)
                  .commit();
            }
        });

        holder.txtName.setText(playlist.name);
        holder.txtDescription.setText(playlist.description);
        holder.txtSongCount.setText(String.format("%d songs", playlist.songs.size()));
    }

    @Override
    public int getItemCount() {
        return playlists.size();
    }

    public class ViewHolder extends RecyclerView.ViewHolder {
        public View row;
        public TextView txtName, txtDescription, txtSongCount;

        public ViewHolder(View v) {
            super(v);

            row = v;
            txtName = v.findViewById(R.id.txtName);
            txtDescription = v.findViewById(R.id.txtDescription);
            txtSongCount = v.findViewById(R.id.txtSongCount);
        }
    }
}
