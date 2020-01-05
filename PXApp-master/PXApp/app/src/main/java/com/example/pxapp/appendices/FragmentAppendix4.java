package com.example.pxapp.appendices;

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentTransaction;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ExpandableListView;

import com.example.pxapp.ExpandableListAdapter;
import com.example.pxapp.FragmentInfoReader;
import com.example.pxapp.R;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.Objects;

public class FragmentAppendix4 extends Fragment {
    private final String TAG = "FragmentAppendix4";
    private ExpandableListAdapter adapter;
    private ExpandableListView expListView;
    private LinkedHashMap<ExpandableListAdapter.Holder, ArrayList<String>> listGroup = new LinkedHashMap<>();
    // Maps titles to their raw resource ID.
    private LinkedHashMap<GroupChildPair, Integer> titleIDs = new LinkedHashMap<>();

    public FragmentAppendix4() {

    }

    public static FragmentAppendix4 newInstance() {
        return new FragmentAppendix4();
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View rootView = inflater.inflate(R.layout.fragment_appendix_4, container, false);

        expListView = rootView.findViewById(R.id.expListView);
        fillExpListView();

        return rootView;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    private void fillExpListView() {
        // Replacing fragments will destroy the current fragment then recreate it once returned to.
        // This means the list items will be added again.
        // https://stackoverflow.com/a/21684520
        if (listGroup.isEmpty()) {
            listGroup.put(new ExpandableListAdapter.Holder("Classical Music", false), null);
            listGroup.put(new ExpandableListAdapter.Holder("Country Music", false), null);
            listGroup.put(new ExpandableListAdapter.Holder("Popular, Easy Listening, RNB, Soundtrack", false), null);
            listGroup.put(new ExpandableListAdapter.Holder("Folk Music", false), null);
            listGroup.put(new ExpandableListAdapter.Holder("Jazz & Swing", false), null);
            listGroup.put(new ExpandableListAdapter.Holder("Hymns & Religious", false), null);

            titleIDs.put(new GroupChildPair(0), R.raw.classical);
            titleIDs.put(new GroupChildPair(1), R.raw.country);
            titleIDs.put(new GroupChildPair(2), R.raw.popular_easy_listening_rnb_soundtrack);
            titleIDs.put(new GroupChildPair(3), R.raw.folk);
            titleIDs.put(new GroupChildPair(4), R.raw.jazz_swing);
            titleIDs.put(new GroupChildPair(5), R.raw.hymns_religious);
        }

        adapter = new ExpandableListAdapter(getContext(), listGroup);

        expListView.setAdapter(adapter);
        expListView.setOnGroupClickListener(new ExpandableListView.OnGroupClickListener() {
            @Override
            public boolean onGroupClick(ExpandableListView expandableListView, View view,
                                        int groupPos, long l) {
                ExpandableListAdapter.Holder holder = adapter.getGroup(groupPos);
                GroupChildPair key = new GroupChildPair(groupPos);
                int id = titleIDs.containsKey(key) ? titleIDs.get(key) : R.raw.classical;
                FragmentInfoReader fir = FragmentInfoReader.newInstance(holder.txtHeader,
                                                                        readRawTextFile(id));
                FragmentManager fm = getFragmentManager();
                fm.beginTransaction()
                  .replace(R.id.fragment_content, fir)
                  .addToBackStack(null)
                  .setTransition(FragmentTransaction.TRANSIT_FRAGMENT_OPEN)
                  .commit();

                return true;
            }
        });
        expListView.setOnChildClickListener(new ExpandableListView.OnChildClickListener() {
            @Override
            public boolean onChildClick(ExpandableListView expandableListView, View view,
                                        int groupPos, int childPos, long l) {
                String title = adapter.getChild(groupPos, childPos);
                if (title != null) {
                    GroupChildPair key = new GroupChildPair(groupPos, childPos);
                    int id = titleIDs.containsKey(key) ? titleIDs.get(key) : R.raw.classical;
                    FragmentInfoReader fir = FragmentInfoReader.newInstance(title,
                                                                            readRawTextFile(id));
                    FragmentManager fm = getFragmentManager();
                    fm.beginTransaction()
                      .replace(R.id.fragment_content, fir)
                      .addToBackStack(null)
                      .setTransition(FragmentTransaction.TRANSIT_FRAGMENT_OPEN)
                      .commit();

                    return true;
                }

                return false;
            }
        });
    }

    private String readRawTextFile(int rawTextID) {
        InputStreamReader isr = new InputStreamReader(
                getResources().openRawResource(rawTextID));
        BufferedReader br = new BufferedReader(isr);
        StringBuilder sb = new StringBuilder();
        try {
            String line;
            while((line = br.readLine()) != null)
                sb.append(line).append("\n");
        }
        catch (IOException e) {
            Log.e(TAG, e.getMessage());
        }

        return sb.toString();
    }

    // To represent each list item.
    // (0, -1) is a group with no children.
    // (0, 0) is the first child of group 0.
    private class GroupChildPair {
        public static final int NO_CHILDREN = -1;
        public int groupPos, childPos;

        public GroupChildPair(int groupPos) {
            this.groupPos = groupPos;
            childPos = NO_CHILDREN;
        }

        public GroupChildPair(int groupPos, int childPos) {
            this.groupPos = groupPos;
            this.childPos = childPos;
        }

        @Override
        public boolean equals(Object o) {
            if (!(o instanceof GroupChildPair)) return false;
            GroupChildPair other = (GroupChildPair)o;
            return groupPos == other.groupPos && childPos == other.childPos;
        }

        @Override
        public int hashCode() {
            return Objects.hash(groupPos, childPos);
        }
    }
}