package com.example.pxapp.appendices;

import android.os.Bundle;
import android.support.design.widget.TextInputEditText;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentTransaction;
import android.text.Editable;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.Toast;

import com.example.pxapp.InstantAutoComplete;
import com.example.pxapp.R;
import com.example.pxapp.server.PXCallback;
import com.example.pxapp.server.PXObjectCallback;
import com.example.pxapp.server.PXPlaylist;
import com.example.pxapp.server.PXServer;
import com.example.pxapp.server.PXUsagePlan;

import java.util.ArrayList;

public class FragmentAppendix6MUPForm extends Fragment {
    private InstantAutoComplete txtPlaylistName;
    private TextInputEditText edtTimeOfDay, edtSymptoms, edtHowOften, edtHowLong;
    private Button submitMUP;
    private ArrayList<PXPlaylist> playlists;
    private PXServer server;

    public FragmentAppendix6MUPForm() {
        server = PXServer.getInstance(getContext());
    }

    public static FragmentAppendix6MUPForm newInstance(ArrayList<PXPlaylist> playlists) {
        Bundle args = new Bundle();
        args.putSerializable("playlists", playlists);
        FragmentAppendix6MUPForm f = new FragmentAppendix6MUPForm();
        f.setArguments(args);
        return f;
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        final View rootView = inflater.inflate(R.layout.fragment_appendix_6mup_form, container, false);

        Bundle args = getArguments();
        playlists = (ArrayList<PXPlaylist>)args.getSerializable("playlists");
        ArrayList<String> playlistNames = new ArrayList<>();
        for (PXPlaylist p : playlists) playlistNames.add(p.name);
        ArrayAdapter<String> adapter = new ArrayAdapter<>(
            getContext(), android.R.layout.simple_dropdown_item_1line, playlistNames
        );
        txtPlaylistName = rootView.findViewById(R.id.txtPlaylistName);
        txtPlaylistName.setAdapter(adapter);

        edtTimeOfDay = rootView.findViewById(R.id.edtTimeOfDay);
        edtSymptoms = rootView.findViewById(R.id.edtSymptoms);
        edtHowOften = rootView.findViewById(R.id.edtHowOften);
        edtHowLong = rootView.findViewById(R.id.edtHowLong);

        submitMUP = rootView.findViewById(R.id.submitMUP);
        submitMUP.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                if (!validate()) return;

                PXUsagePlan plan = new PXUsagePlan(
                    0,
                    getPlaylistID(getTrimmed(txtPlaylistName.getText())),
                    getTrimmed(edtTimeOfDay.getText()),
                    getTrimmed(edtSymptoms.getText()),
                    getTrimmed(edtHowOften.getText()),
                    getTrimmed(edtHowLong.getText())
                );
                server.addUsagePlan(plan, new PXCallback() {
                    @Override
                    public void onSuccess(String message) {
                        Toast.makeText(getContext(), message, Toast.LENGTH_SHORT).show();
                        goBack();
                    }

                    @Override
                    public void onFailure(String message) {
                        Toast.makeText(getContext(), message, Toast.LENGTH_SHORT).show();
                    }
                });
            }
        });

        return rootView;
    }

    private void goBack() {
        Fragment fragment = new FragmentAppendix6MUP();
        FragmentManager fm = getFragmentManager();
        fm.popBackStackImmediate();
        fm.beginTransaction()
          .replace(R.id.fragment_content, fragment)
          .setTransition(FragmentTransaction.TRANSIT_FRAGMENT_OPEN)
          .addToBackStack(null)
          .commit();
    }

    private boolean validate() {
        boolean isValid = true;

        String playlistName = txtPlaylistName.getText().toString().trim();
        if (playlistName.isEmpty()) {
            txtPlaylistName.setError("Please input a playlist name");
            isValid = false;
        }
        else txtPlaylistName.setError(null);

        if (getPlaylistID(playlistName) == -1) {
            txtPlaylistName.setError("Invalid playlist");
            isValid = false;
        }
        else txtPlaylistName.setError(null);

        if (edtTimeOfDay.getText().toString().trim().isEmpty()) {
            edtTimeOfDay.setError("Please input the time of day");
            isValid = false;
        }
        else edtTimeOfDay.setError(null);

        if (edtSymptoms.getText().toString().trim().isEmpty()) {
            edtSymptoms.setError("Please input the symptoms");
            isValid = false;
        }
        else edtSymptoms.setError(null);

        if (edtHowOften.getText().toString().trim().isEmpty()) {
            edtHowOften.setError("Please input how often to be used for");
            isValid = false;
        }
        else edtHowOften.setError(null);

        if (edtHowLong.getText().toString().trim().isEmpty()) {
            edtHowLong.setError("Please input how long to be used for");
            isValid = false;
        }
        else edtHowLong.setError(null);

        return isValid;
    }

    private int getPlaylistID(String name) {
        for (PXPlaylist p : playlists) {
            if (p.name.equals(name)) return p.id;
        }

        return -1;
    }

    private String getTrimmed(Editable e) {
        return e != null ? e.toString().trim() : "";
    }
}