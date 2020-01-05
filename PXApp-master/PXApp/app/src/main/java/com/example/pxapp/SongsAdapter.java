package com.example.pxapp;

import android.content.Context;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.PopupMenu;
import android.widget.TextView;

import com.example.pxapp.server.PXSong;

import java.util.ArrayList;

public class SongsAdapter extends RecyclerView.Adapter<SongsAdapter.ViewHolder> {
    private Context ctx;
    private ArrayList<PXSong> songs;
    private ItemClickListener itemListener;
    private MenuItemClickListener menuListener;

    public SongsAdapter(Context ctx, ArrayList<PXSong> songs, ItemClickListener itemListener,
                        MenuItemClickListener menuListener) {
        this.ctx = ctx;
        this.songs = songs;
        this.itemListener = itemListener;
        this.menuListener = menuListener;
    }

    @Override
    public SongsAdapter.ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        LayoutInflater inflater = LayoutInflater.from(ctx);

        View row = inflater.inflate(R.layout.rvsongs_child, parent, false);
        return new ViewHolder(row);
    }

    @Override
    public void onBindViewHolder(final SongsAdapter.ViewHolder holder, final int pos) {
        PXSong song = songs.get(pos);

        holder.row.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                itemListener.onClick(pos);
            }
        });

        if (song.link == null || song.link.isEmpty())
            holder.imgPlay.setImageResource(R.drawable.ic_cancel);
        holder.txtSongName.setText(song.name);
        holder.txtArtist.setText(song.artist != null ? song.artist : "No artist");

        holder.imgOptions.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                PopupMenu popup = new PopupMenu(ctx, holder.imgOptions);
                popup.inflate(R.menu.options_song);
                popup.setOnMenuItemClickListener(new PopupMenu.OnMenuItemClickListener() {
                    @Override
                    public boolean onMenuItemClick(MenuItem menuItem) {
                        menuListener.onClick(pos, menuItem.getItemId());
                        return true;
                    }
                });
                popup.show();
            }
        });
    }

    @Override
    public int getItemCount() {
        return songs.size();
    }

    public class ViewHolder extends RecyclerView.ViewHolder {
        public View row;
        public ImageView imgPlay;
        public TextView txtSongName, txtArtist;
        public ImageView imgOptions;

        public ViewHolder(View v) {
            super(v);

            row = v;
            imgPlay = v.findViewById(R.id.imgPlay);
            txtSongName = v.findViewById(R.id.txtSongName);
            imgOptions = v.findViewById(R.id.imgOptions);
            txtArtist = v.findViewById(R.id.txtArtist);
        }
    }

    public interface ItemClickListener {
        void onClick(int listPos);
    }

    public interface MenuItemClickListener {
        void onClick(int listPos, int menuItemId);
    }
}
