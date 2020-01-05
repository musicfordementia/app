package com.example.pxapp.surveys;

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentTransaction;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import com.example.pxapp.appendices.FragmentAppendix4;
import com.example.pxapp.appendices.FragmentAppendix5;
import com.example.pxapp.appendices.FragmentAppendix6LD;
import com.example.pxapp.appendices.FragmentAppendix6MUP;
import com.example.pxapp.R;
import com.example.pxapp.server.PXAnswer;
import com.example.pxapp.server.PXObjectCallback;
import com.example.pxapp.server.PXQuestionnaire;
import com.example.pxapp.server.PXQuestionnaireType;
import com.example.pxapp.server.PXServer;

import java.util.ArrayList;
import java.util.Arrays;

public class FragmentSurveyList extends Fragment {
    private PXServer server;
    private ListView lstSurveys;
    private ArrayAdapter<String> adapter;
    private ArrayList<PXQuestionnaire> questionnaires;
    private PXQuestionnaireType type;
    private final String[] STATIC_POST_SURVEY_NAMES = {
        "Examples of Songs by Genre and Decade",
        "Template for Rating Strength of Response to Music",
        "Listening Diary",
        "Music Usage Plan"
    };
    private final Fragment[] STATIC_POST_SURVEY_FRAGMENTS = {
        new FragmentAppendix4(),
        new FragmentAppendix5(),
        new FragmentAppendix6LD(),
        new FragmentAppendix6MUP()
    };

    public FragmentSurveyList() {
        server = PXServer.getInstance(getContext());
    }

    public static FragmentSurveyList newInstance(PXQuestionnaireType type) {
        Bundle args = new Bundle();
        args.putInt("type", type.ordinal());
        FragmentSurveyList f = new FragmentSurveyList();
        f.setArguments(args);
        return f;
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View rootView = inflater.inflate(R.layout.fragment_survey_list, container, false);

        lstSurveys = rootView.findViewById(R.id.lstSurveys);

        Bundle args = getArguments();
        type = PXQuestionnaireType.values()[args.getInt("type")];

        final ArrayList<String> qNames = new ArrayList<>();

        TextView txtSurveyTitle = rootView.findViewById(R.id.txtSurveyTitle);
        if (type == PXQuestionnaireType.PRE)
            txtSurveyTitle.setText(getResources().getString(R.string.pre_survey_title));
        else {
            txtSurveyTitle.setText(getResources().getString(R.string.post_survey_title));
            qNames.addAll(Arrays.asList(STATIC_POST_SURVEY_NAMES));
        }

        server.getAllQuestionnaires(new PXObjectCallback<ArrayList<PXQuestionnaire>>() {
            @Override
            public void onSuccess(String message, ArrayList<PXQuestionnaire> allQuestionnaires) {
                // Filter questionnaires by type.
                questionnaires = filterQuestionnaires(type, allQuestionnaires);

                for (PXQuestionnaire q : questionnaires) {
                    qNames.add(q.name);
                }
                adapter = new ArrayAdapter<>(
                    getActivity(), R.layout.listview_item, R.id.txtName, qNames
                );
                lstSurveys.setAdapter(adapter);
                lstSurveys.setOnItemClickListener(new AdapterView.OnItemClickListener() {
                    @Override
                    public void onItemClick(AdapterView<?> adapterView, View view, int i, long l) {
                        Fragment f;
                        if (type == PXQuestionnaireType.POST) {
                            if (i < STATIC_POST_SURVEY_FRAGMENTS.length)
                                f = STATIC_POST_SURVEY_FRAGMENTS[i];
                            else {
                                PXQuestionnaire q = questionnaires.get(
                                    i - STATIC_POST_SURVEY_FRAGMENTS.length
                                );
                                f = FragmentQuestionPage.newInstance(
                                    q, 1, new ArrayList<PXAnswer>()
                                );
                            }
                        }
                        else {
                            PXQuestionnaire q = questionnaires.get(i);
                            f = FragmentQuestionPage.newInstance(q, 1, new ArrayList<PXAnswer>());
                        }

                        FragmentManager fm = getFragmentManager();
                        fm.beginTransaction()
                          .replace(R.id.fragment_content, f)
                          .setTransition(FragmentTransaction.TRANSIT_FRAGMENT_OPEN)
                          .addToBackStack(null)
                          .commit();
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
    public void onViewCreated(View view, Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
    }

    private ArrayList<PXQuestionnaire> filterQuestionnaires(PXQuestionnaireType type,
                                                            ArrayList<PXQuestionnaire> questionnaires) {
        ArrayList<PXQuestionnaire> filtered = new ArrayList<>();
        for (PXQuestionnaire q : questionnaires) {
            if (q.type.toLowerCase().startsWith(type.toString().toLowerCase()))
                filtered.add(q);
        }

        return filtered;
    }
}
