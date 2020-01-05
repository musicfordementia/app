package com.example.pxapp;

import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentStatePagerAdapter;

import java.util.ArrayList;

public class TabAdapter extends FragmentStatePagerAdapter {
    private ArrayList<Fragment> fragments = new ArrayList<>();
    private ArrayList<String> titles = new ArrayList<>();

    public TabAdapter(FragmentManager fm) {
        super(fm);
    }

    @Override
    public Fragment getItem(int index) {
        return fragments.get(index);
    }

    @Override
    public CharSequence getPageTitle(int index) {
        return titles.get(index);
    }

    @Override
    public int getCount() {
        return fragments.size();
    }

    public void addFragment(Fragment f, String title) {
        fragments.add(f);
        titles.add(title);
    }
}
