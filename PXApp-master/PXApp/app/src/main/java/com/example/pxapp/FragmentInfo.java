package com.example.pxapp;

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentTransaction;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ExpandableListView;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.Objects;

public class FragmentInfo extends Fragment {
    private final String TAG = "FragmentInfo";
    private ExpandableListAdapter adapter;
    private ExpandableListView expListView;
    private LinkedHashMap<ExpandableListAdapter.Holder, ArrayList<String>> listGroup = new LinkedHashMap<>();
    // Maps titles to their raw resource ID.
    private LinkedHashMap<GroupChildPair, Integer> titleIDs = new LinkedHashMap<>();

    public FragmentInfo() {}

    public static FragmentInfo newInstance() {
        return new FragmentInfo();
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View rootView = inflater.inflate(R.layout.fragment_info, container, false);

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
            listGroup.put(new ExpandableListAdapter.Holder("The Relationship between Music and Dementia: An Overview", false), null);
            listGroup.put(new ExpandableListAdapter.Holder("How to Use these Guidelines", false), null);
            listGroup.put(new ExpandableListAdapter.Holder("Quick Reference Guide to Music Selection for People with Dementia", false), null);
            ArrayList<String> children1 = new ArrayList<>();
            children1.add("Mental Health History & Current Symptoms");
            listGroup.put(new ExpandableListAdapter.Holder("Chapter 1 – Vulnerability to Negative Responses", true), children1);
            listGroup.put(new ExpandableListAdapter.Holder("Chapter 2 – Creating the Playlists & How Music Interacts with Particular Symptoms", false), null);
            ArrayList<String> children2 = new ArrayList<>();
            children2.add("Time of Day, Dosage and Listening Environment");
            listGroup.put(new ExpandableListAdapter.Holder("Chapter 3 – Identifying the Key Challenges to Care", true), children2);
            listGroup.put(new ExpandableListAdapter.Holder("Chapter 4 – Personal Taste and Preferences", false), null);
            listGroup.put(new ExpandableListAdapter.Holder("Chapter 5 – Selecting Music", false), null);
            listGroup.put(new ExpandableListAdapter.Holder("Chapter 6 – Monitoring and Managing Adverse Reactions", false), null);
            listGroup.put(new ExpandableListAdapter.Holder("References", false), null);
            listGroup.put(new ExpandableListAdapter.Holder("Acknowledgements", false), null);
            listGroup.put(new ExpandableListAdapter.Holder("Author Contact Details", false), null);

            titleIDs.put(new GroupChildPair(0), R.raw.the_relationship);
            titleIDs.put(new GroupChildPair(1), R.raw.how_to_use);
            titleIDs.put(new GroupChildPair(2), R.raw.reference_guide);
            titleIDs.put(new GroupChildPair(3), R.raw.chapter_1);
            titleIDs.put(new GroupChildPair(3, 0), R.raw.chapter_1_mental_health);
            titleIDs.put(new GroupChildPair(4), R.raw.chapter_2);
            titleIDs.put(new GroupChildPair(5), R.raw.chapter_3);
            titleIDs.put(new GroupChildPair(5, 0), R.raw.chapter_3_time_of_day);
            titleIDs.put(new GroupChildPair(6), R.raw.chapter_4);
            titleIDs.put(new GroupChildPair(7), R.raw.chapter_5);
            titleIDs.put(new GroupChildPair(8), R.raw.chapter_6);
            titleIDs.put(new GroupChildPair(9), R.raw.references);
            titleIDs.put(new GroupChildPair(10), R.raw.acknowledgements);
            titleIDs.put(new GroupChildPair(11), R.raw.author);
        }

        adapter = new ExpandableListAdapter(getContext(), listGroup);

        expListView.setAdapter(adapter);
        expListView.setOnGroupClickListener(new ExpandableListView.OnGroupClickListener() {
            @Override
            public boolean onGroupClick(ExpandableListView expandableListView, View view,
                                        int groupPos, long l) {
                ExpandableListAdapter.Holder holder = adapter.getGroup(groupPos);
                GroupChildPair key = new GroupChildPair(groupPos);
                int id = titleIDs.containsKey(key) ? titleIDs.get(key) : R.raw.the_relationship;
                FragmentInfoReader fir = FragmentInfoReader.newInstance(
                    holder.txtHeader, readRawTextFile(id)
                );
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
                    int id = titleIDs.containsKey(key) ? titleIDs.get(key) : R.raw.the_relationship;
                    FragmentInfoReader fir = FragmentInfoReader.newInstance(
                        title, readRawTextFile(id)
                    );
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
                getResources().openRawResource(rawTextID)
        );
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