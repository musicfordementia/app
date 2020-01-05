package com.example.pxapp.appendices;

import android.app.DatePickerDialog;
import android.app.TimePickerDialog;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentTransaction;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.AutoCompleteTextView;
import android.widget.Button;
import android.widget.DatePicker;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.TimePicker;
import android.widget.Toast;

import com.example.pxapp.InstantAutoComplete;
import com.example.pxapp.R;
import com.example.pxapp.server.PXCallback;
import com.example.pxapp.server.PXLDEntry;
import com.example.pxapp.server.PXObjectCallback;
import com.example.pxapp.server.PXServer;
import com.example.pxapp.server.PXSong;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;

public class FragmentAppendix6LDForm extends Fragment {
    EditText edtMood, edtSituation, edtReaction, edtComments;
    private Button btnChoose, submitEntry;
    private PXServer server;
    private ArrayList<PXSong> allSongs;
    private ArrayList<Integer> inputSongs = new ArrayList<>();
    private LinearLayout llSongs;
    private ArrayList<LinearLayout> songRows = new ArrayList<>();
    private SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    private Calendar cal = Calendar.getInstance();

    public FragmentAppendix6LDForm() {
        server = PXServer.getInstance(getContext());
    }

    public static FragmentAppendix6LDForm newInstance() {
        return new FragmentAppendix6LDForm();
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        final View rootView = inflater.inflate(R.layout.fragment_appendix_6ld_form, container, false);

        cal.set(Calendar.SECOND, 0);
        btnChoose = rootView.findViewById(R.id.btnChoose);
        final TextView txtDateTime = rootView.findViewById(R.id.txtDateTime);
        txtDateTime.setText(sdf.format(cal.getTime()));
        final DatePickerDialog dp = new DatePickerDialog(
            getContext(),
            new DatePickerDialog.OnDateSetListener() {
                @Override
                public void onDateSet(DatePicker datePicker, int i, int i1, int i2) {
                    cal.set(Calendar.YEAR, i);
                    cal.set(Calendar.MONTH, i1);
                    cal.set(Calendar.DAY_OF_MONTH, i2);

                    new TimePickerDialog(
                        getContext(),
                        new TimePickerDialog.OnTimeSetListener() {
                            @Override
                            public void onTimeSet(TimePicker timePicker, int i, int i1) {
                                cal.set(Calendar.HOUR_OF_DAY, i);
                                cal.set(Calendar.MINUTE, i1);
                                txtDateTime.setText(sdf.format(cal.getTime()));
                            }
                        },
                        cal.get(Calendar.HOUR_OF_DAY),
                        cal.get(Calendar.MINUTE),
                        false
                    ).show();
                }
            },
            cal.get(Calendar.YEAR),
            cal.get(Calendar.MONTH),
            cal.get(Calendar.DAY_OF_MONTH)
        );
        btnChoose.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                dp.show();
            }
        });

        edtMood = rootView.findViewById(R.id.edtMood);
        edtSituation = rootView.findViewById(R.id.edtSituation);
        edtReaction = rootView.findViewById(R.id.edtReaction);
        edtComments = rootView.findViewById(R.id.edtComments);

        llSongs = rootView.findViewById(R.id.llSongs);
        server.getAllSongs(new PXObjectCallback<ArrayList<PXSong>>() {
            @Override
            public void onSuccess(String message, ArrayList<PXSong> data) {
                allSongs = data;

                addSongRow();

                submitEntry = rootView.findViewById(R.id.submitEntry);
                submitEntry.setOnClickListener(new View.OnClickListener() {
                    public void onClick(View v) {
                        if (!validate()) return;

                        PXLDEntry entry = new PXLDEntry(
                            0,
                            cal.getTime(),
                            edtMood.getText().toString(),
                            edtSituation.getText().toString(),
                            edtReaction.getText().toString(),
                            edtComments.getText().toString(),
                            inputSongs
                        );
                        server.addLDEntry(entry, new PXCallback() {
                            @Override
                            public void onSuccess(String message) {
                                Fragment fragment = new FragmentAppendix6LD();
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

    private void addSongRow() {
        LayoutInflater inflater = LayoutInflater.from(getContext());
        final LinearLayout row = (LinearLayout)inflater.inflate(R.layout.ld_song_row, null, false);
        ImageButton btnAdd = row.findViewById(R.id.btnAdd),
                    btnDelete = row.findViewById(R.id.btnDelete);
        InstantAutoComplete txtSong = row.findViewById(R.id.txtSong);
        ArrayList<String> songNames = new ArrayList<>();
        for (PXSong s : allSongs) songNames.add(s.name);
        ArrayAdapter<String> adapter = new ArrayAdapter<>(
            getContext(), android.R.layout.simple_dropdown_item_1line, songNames
        );
        txtSong.setAdapter(adapter);

        btnAdd.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                addSongRow();
            }
        });

        btnDelete.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (songRows.size() > 1) {
                    row.setVisibility(View.GONE);
                    songRows.remove(row);
                }
            }
        });

        llSongs.addView(row);
        songRows.add(row);
    }

    private boolean validate() {
        boolean isValid = true;
        if (edtMood.getText().toString().trim().length() == 0) {
            edtMood.setError("Please input the mood");
            isValid = false;
        }
        else edtMood.setError(null);

        if (edtSituation.getText().toString().trim().length() == 0) {
            edtSituation.setError("Please input the situation");
            isValid = false;
        }
        else edtSituation.setError(null);

        if (edtReaction.getText().toString().trim().length() == 0) {
            edtReaction.setError("Please input the reaction");
            isValid = false;
        }
        else edtReaction.setError(null);

        if (edtComments.getText().toString().trim().length() == 0) {
            edtComments.setError("Please input some comments");
            isValid = false;
        }
        else edtComments.setError(null);

        for (LinearLayout row : songRows) {
            AutoCompleteTextView txtSong = row.findViewById(R.id.txtSong);
            String songName = txtSong.getText().toString().trim();
            if (songName.length() == 0) {
                txtSong.setError("Please input a song");
                isValid = false;
                continue;
            }

            boolean found = false;
            for (PXSong s : allSongs) {
                if (s.name.equals(songName)) {
                    inputSongs.add(s.id);
                    found = true;
                }
            }

            txtSong.setError(found ? null : "Invalid song");
        }

        if (inputSongs.size() == 0) {
            Toast.makeText(getContext(), "Please input some songs", Toast.LENGTH_SHORT).show();
            isValid = false;
        }

        return isValid;
    }
}