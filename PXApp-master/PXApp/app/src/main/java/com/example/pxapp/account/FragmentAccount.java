package com.example.pxapp.account;

import android.os.Bundle;
import android.support.design.widget.TabLayout;
import android.support.v4.app.Fragment;
import android.support.v4.view.ViewPager;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.example.pxapp.R;
import com.example.pxapp.TabAdapter;

public class FragmentAccount extends Fragment {
    private TabAdapter tabAdapter;

    public FragmentAccount() {

    }

    public static FragmentAccount newInstance() {
        return new FragmentAccount();
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View rootView = inflater.inflate(R.layout.fragment_account, container, false);

        tabAdapter = new TabAdapter(getFragmentManager());
        tabAdapter.addFragment(FragmentSignIn.newInstance(), "SIGN IN");
        tabAdapter.addFragment(FragmentSignUp.newInstance(), "SIGN UP");

        TabLayout tabs = rootView.findViewById(R.id.accountTabs);
        ViewPager pager = rootView.findViewById(R.id.viewPager);
        pager.setAdapter(tabAdapter);
        tabs.setupWithViewPager(pager);

        return rootView;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }
}
