package com.example.pxapp.appendices;

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentTransaction;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TableLayout;
import android.widget.TableRow;
import android.widget.TextView;
import android.widget.Toast;

import com.example.pxapp.R;
import com.example.pxapp.server.PXLDEntry;
import com.example.pxapp.server.PXObjectCallback;
import com.example.pxapp.server.PXServer;

import java.text.SimpleDateFormat;
import java.util.ArrayList;

public class FragmentAppendix6LD extends Fragment {
    private TableLayout tblDiaryEntries;
    private Button addEntry;
    private PXServer server;

    public FragmentAppendix6LD() {
        server = PXServer.getInstance(getContext());
    }

    public static FragmentAppendix6LD newInstance() {
        return new FragmentAppendix6LD();
    }

    @Override
    public View onCreateView(final LayoutInflater inflater, final ViewGroup container,
                             Bundle savedInstanceState) {
        View rootView = inflater.inflate(R.layout.fragment_appendix_6ld, container, false);

        tblDiaryEntries = rootView.findViewById(R.id.tblDiaryEntries);

        server.getLDEntries(new PXObjectCallback<ArrayList<PXLDEntry>>() {
            @Override
            public void onSuccess(String message, ArrayList<PXLDEntry> data) {
                Log.i("Diary", String.valueOf(data.size()));

                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                for (PXLDEntry entry : data) {
                    TableRow row = (TableRow)inflater.inflate(R.layout.diaries_table_row, container, false);

                    TextView txtDateTime = row.findViewById(R.id.txtDateTime),
                             txtMood = row.findViewById(R.id.txtMood),
                             txtSituation = row.findViewById(R.id.txtSituation),
                             txtReaction = row.findViewById(R.id.txtReaction),
                             txtComments = row.findViewById(R.id.txtComments);
                    txtDateTime.setText(sdf.format(entry.dateTime));
                    txtMood.setText(entry.mood);
                    txtSituation.setText(entry.situation);
                    txtReaction.setText(entry.reaction);
                    txtComments.setText(entry.comments);

                    tblDiaryEntries.addView(row);
                }
            }

            @Override
            public void onFailure(String message) {
                Toast.makeText(getContext(), message, Toast.LENGTH_SHORT).show();
            }
        });

        addEntry = rootView.findViewById(R.id.addEntry);
        addEntry.setOnClickListener(new OnClickListener() {
            public void onClick(View v) {
                Fragment fragment = new FragmentAppendix6LDForm();
                FragmentManager fm = getFragmentManager();
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
}