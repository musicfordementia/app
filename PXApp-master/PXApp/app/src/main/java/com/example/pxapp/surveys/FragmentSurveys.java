package com.example.pxapp.surveys;

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentTransaction;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import com.example.pxapp.R;
import com.example.pxapp.server.PXQuestionnaireType;

public class FragmentSurveys extends Fragment {
    private Button pre, post;

    public FragmentSurveys() {
    }

    public static FragmentSurveys newInstance() {
        return new FragmentSurveys();
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View rootView = inflater.inflate(R.layout.fragment_surveys, container, false);
        pre = rootView.findViewById(R.id.preSurveys);
        post = rootView.findViewById(R.id.postSurveys);

        pre.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                FragmentSurveyList fragment = FragmentSurveyList.newInstance(PXQuestionnaireType.PRE);
                FragmentManager fm = getFragmentManager();
                fm.beginTransaction()
                  .replace(R.id.fragment_content, fragment)
                  .setTransition(FragmentTransaction.TRANSIT_FRAGMENT_OPEN)
                  .addToBackStack(null)
                  .commit();
            }
        });

        post.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                FragmentSurveyList fragment = FragmentSurveyList.newInstance(PXQuestionnaireType.POST);
                FragmentManager fm = getFragmentManager();
                fm.beginTransaction()
                  .replace(R.id.fragment_content, fragment)
                  .setTransition(FragmentTransaction.TRANSIT_FRAGMENT_OPEN)
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
