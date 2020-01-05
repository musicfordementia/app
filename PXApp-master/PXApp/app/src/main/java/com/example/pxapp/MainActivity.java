package com.example.pxapp;

import android.content.pm.ActivityInfo;
import android.os.Bundle;
import android.support.design.widget.NavigationView;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentTransaction;
import android.support.v4.view.GravityCompat;
import android.support.v4.widget.DrawerLayout;
import android.support.v7.app.ActionBarDrawerToggle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.View;
import android.widget.ExpandableListView;

import com.example.pxapp.account.FragmentAccount;
import com.example.pxapp.account.FragmentChangePassword;
import com.example.pxapp.account.FragmentProfile;
import com.example.pxapp.account.FragmentResetPassword;
import com.example.pxapp.server.PXQuestionnaireType;
import com.example.pxapp.server.PXServer;
import com.example.pxapp.surveys.FragmentSurveyList;
import com.example.pxapp.surveys.FragmentSurveys;


import java.util.ArrayList;
import java.util.LinkedHashMap;

public class MainActivity extends AppCompatActivity {
    private static final String TAG = "MainActivity";
    private ExpandableListAdapter adapterMenu;
    private ExpandableListView elvMenu;
    private LinkedHashMap<ExpandableListAdapter.Holder, ArrayList<String>> listGroup = new LinkedHashMap<>();
    private PXServer server;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);

        server = PXServer.getInstance(this);

        initExpListView();

        FragmentManager fm = getSupportFragmentManager();
        fm.beginTransaction().replace(R.id.fragment_content, FragmentHome.newInstance()).commit();

        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        DrawerLayout drawer = findViewById(R.id.drawer_layout);
        NavigationView navigationView = findViewById(R.id.nav_view);
        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(this, drawer, toolbar,
                R.string.navigation_drawer_open, R.string.navigation_drawer_close);
        drawer.addDrawerListener(toggle);
        toggle.syncState();
    }

    @Override
    public void onBackPressed() {
        DrawerLayout drawer = findViewById(R.id.drawer_layout);
        if (drawer.isDrawerOpen(GravityCompat.START)) {
            drawer.closeDrawer(GravityCompat.START);
        } else {
            super.onBackPressed();
        }
    }

    private void initExpListView() {
        listGroup.put(new ExpandableListAdapter.Holder(R.drawable.ic_home, "Home", false), null);

        listGroup.put(new ExpandableListAdapter.Holder(R.drawable.ic_menu_info, "Info", false), null);

        ArrayList<String> children = new ArrayList<>();
        children.add("Change password");
        // TODO: Fix reset password.
        //children.add("Reset password");
        listGroup.put(new ExpandableListAdapter.Holder(R.drawable.ic_menu_account, "Account", true), children);

        children = new ArrayList<>();
        children.add("Pre-Surveys"); children.add("Post-Surveys");
        listGroup.put(new ExpandableListAdapter.Holder(R.drawable.ic_pen, "Surveys", true), children);

        children = new ArrayList<>();
        children.add("Playlists");
        listGroup.put(new ExpandableListAdapter.Holder(R.drawable.ic_menu_songs, "Songs", true), children);

        adapterMenu = new ExpandableListAdapter(this, listGroup);

        elvMenu = findViewById(R.id.expListView);
        elvMenu.setAdapter(adapterMenu);
        elvMenu.setOnGroupClickListener(new ExpandableListView.OnGroupClickListener() {
            @Override
            public boolean onGroupClick(ExpandableListView expandableListView, View view,
                                        int groupPos, long l) {
                Fragment fragment;
                switch (groupPos) {
                    case 0: fragment = FragmentHome.newInstance(); break;
                    case 1: fragment = FragmentInfo.newInstance(); break;
                    case 2: fragment = server.isSignedIn() ? FragmentProfile.newInstance() :
                                                             FragmentAccount.newInstance();
                        break;
                    case 3: fragment = FragmentSurveys.newInstance(); break;
                    case 4: fragment = FragmentSongs.newInstance(); break;
                    default: fragment = FragmentHome.newInstance();
                }
                FragmentManager fm = getSupportFragmentManager();
                fm.beginTransaction()
                  .replace(R.id.fragment_content, fragment)
                  .setTransition(FragmentTransaction.TRANSIT_FRAGMENT_OPEN)
                  .addToBackStack(null)
                  .commit();

                DrawerLayout drawer = findViewById(R.id.drawer_layout);
                drawer.closeDrawer(GravityCompat.START);

                return true;
            }
        });
        elvMenu.setOnChildClickListener(new ExpandableListView.OnChildClickListener() {
            @Override
            public boolean onChildClick(ExpandableListView expandableListView, View view,
                                        int groupPos, int childPos, long l) {
                Fragment fragment = getFragment(groupPos, childPos);
                FragmentManager fm = getSupportFragmentManager();
                fm.beginTransaction()
                  .replace(R.id.fragment_content, fragment)
                  .setTransition(FragmentTransaction.TRANSIT_FRAGMENT_OPEN)
                  .addToBackStack(null)
                  .commit();

                DrawerLayout drawer = findViewById(R.id.drawer_layout);
                drawer.closeDrawer(GravityCompat.START);

                return true;
            }
        });
    }

    private Fragment getFragment(int groupPos, int childPos) {
        switch (groupPos) {
            // Home
            case 0: return FragmentHome.newInstance();
            // Info
            case 1: return FragmentInfo.newInstance();
            // Account
            case 2:
                if (server.isSignedIn()) {
                    switch (childPos) {
                        // Change password
                        case 0: return FragmentChangePassword.newInstance();
                        // Reset password
                        case 1: return FragmentResetPassword.newInstance();
                    }
                }
                else {
                    // Reset password
                    if (childPos == 1) return FragmentResetPassword.newInstance();
                }
            // Surveys
            case 3:
                return FragmentSurveyList.newInstance(PXQuestionnaireType.values()[childPos]);
            // Songs
            case 4:
                if (childPos == 0) return FragmentPlaylists.newInstance();
        }

        return FragmentHome.newInstance();
    }
}
