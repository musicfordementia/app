package com.example.pxapp.surveys;

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentTransaction;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.TextView;
import android.widget.Toast;
import android.widget.Spinner;
import android.widget.ArrayAdapter;
import android.widget.LinearLayout.LayoutParams;

import android.widget.AdapterView;
import android.widget.AdapterView.OnItemSelectedListener;

import com.example.pxapp.R;
import com.example.pxapp.server.PXAnswer;
import com.example.pxapp.server.PXCallback;
import com.example.pxapp.server.PXQuestion;
import com.example.pxapp.server.PXQuestionnaire;
import com.example.pxapp.server.PXQuestionnaireType;
import com.example.pxapp.server.PXServer;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.Map;

public class FragmentQuestionPage extends Fragment {
    private LinearLayout linearLayout;
    private PXQuestionnaire questionnaire;
    private ArrayList<PXQuestion> questions;
    // For each question, store the answer.
    // A question can have more than 1 answer, so store the ID and the answer.
    // An answer with an empty string means it was unchecked in the case of a Checkbox.
    private LinkedHashMap<Integer, LinkedHashMap<Integer, String>> answers = new LinkedHashMap<>();
    // Map visibleIfChoiceID to the LinearLayouts that needs to be shown/hidden.
    private LinkedHashMap<Integer, ArrayList<LinearLayout>> visibleMap = new LinkedHashMap<>();
    private ArrayList<LinearLayout> textListRows = new ArrayList<>();
    private ArrayList<Spinner> rankingSpinners;
    private ArrayList<PXAnswer> allAnswers;

    public static FragmentQuestionPage newInstance(PXQuestionnaire questionnaire, int currPage,
                                                   ArrayList<PXAnswer> allAnswers) {
        FragmentQuestionPage f = new FragmentQuestionPage();
        Bundle args = new Bundle();
        args.putSerializable("questionnaire", questionnaire);
        args.putInt("currPage", currPage);
        args.putSerializable("allAnswers", allAnswers);
        f.setArguments(args);
        return f;
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View rootView = inflater.inflate(R.layout.fragment_question_page, container, false);
        linearLayout = rootView.findViewById(R.id.linearLayout);
        TextView txtQuestion = rootView.findViewById(R.id.txtQuestion);
        Button btnNext = rootView.findViewById(R.id.btnNext);

        Bundle args = getArguments();
        questionnaire = (PXQuestionnaire)args.getSerializable("questionnaire");
        final int currPage = args.getInt("currPage"), lastPage = getLastPageNumber(questionnaire);
        allAnswers = (ArrayList<PXAnswer>)args.getSerializable("allAnswers");

        questions = getQuestions(questionnaire, currPage);
        txtQuestion.setText(String.format("%02d. %s", currPage, questions.get(0).str));
        txtQuestion.setTextSize(25);
        txtQuestion.setGravity(Gravity.CENTER);

        //txtQuestion.setPadding(10, 100, 10, 100);
        int padding = (int)(30 * getResources().getDisplayMetrics().density + 0.5);
        txtQuestion.setPadding(padding, 2*padding, padding, padding);

        for (PXQuestion q : questions) {
            if (q.visibleIfChoiceID == 0) {
                addChoices(linearLayout, q);
            }
            else {
                LinearLayout layout = new LinearLayout(getContext());
                layout.setLayoutParams(new ViewGroup.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.WRAP_CONTENT
                ));
                layout.setOrientation(LinearLayout.VERTICAL);
                layout.setVisibility(View.GONE);

                TextView txt = new TextView(getContext());
                txt.setLayoutParams(new ViewGroup.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.WRAP_CONTENT
                ));
                txt.setTextSize(25);
                txt.setText(q.str);
                txt.setPadding(padding, padding, padding, padding);
                txt.setGravity(Gravity.CENTER);

                layout.addView(txt);

                addChoices(layout, q);

                linearLayout.addView(layout);
                ArrayList<LinearLayout> layouts = visibleMap.get(q.visibleIfChoiceID);
                if (layouts == null) layouts = new ArrayList<>();
                layouts.add(layout);
                visibleMap.put(q.visibleIfChoiceID, layouts);
            }
        }

        btnNext.setText(currPage == lastPage ? "Submit" : "Next");
        btnNext.setTextSize(25);
        btnNext.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (validateAnswers(linearLayout)) {
                    // Add answers.
                    for (Map.Entry<Integer, LinkedHashMap<Integer, String>> e : answers.entrySet()) {
                        for (Map.Entry<Integer, String> e2 : e.getValue().entrySet()) {
                            if (!e2.getValue().equals("")) {
                                allAnswers.add(new PXAnswer(e.getKey(), e2.getValue()));
                            }
                        }
                    }

                    if (currPage == lastPage) submitAnswers();
                    else nextPage(currPage);
                }
            }
        });

        return rootView;
    }

    // Returns the questions on the specified page number.
    private ArrayList<PXQuestion> getQuestions(PXQuestionnaire questionnaire, int page) {
        ArrayList<PXQuestion> questions = new ArrayList<>();

        for (PXQuestion q : questionnaire.questions) {
            if (q.pageNo == page) questions.add(q);
        }

        return questions;
    }

    private int getLastPageNumber(PXQuestionnaire questionnaire) {
        int last = -1;
        for (PXQuestion q : questionnaire.questions) {
            if (q.pageNo > last) last = q.pageNo;
        }

        return last;
    }

    // TODO: Move these to a layout file.
    // TODO: Implement hasOther.
    private void addChoices(final LinearLayout layout, final PXQuestion q) {
        switch (q.type) {
            case Checkbox: {
                for (final PXQuestion.Choice c : q.choices) {
                    final CheckBox cb = new CheckBox(getContext());
                    cb.setLayoutParams(new ViewGroup.LayoutParams(
                        ViewGroup.LayoutParams.WRAP_CONTENT,
                        ViewGroup.LayoutParams.WRAP_CONTENT
                    ));
                    cb.setText(c.str);
                    int padding = (int)(20 * getResources().getDisplayMetrics().density + 0.5);
                    cb.setPadding(padding, padding, padding, padding);
                    cb.setOnClickListener(new View.OnClickListener() {
                        @Override
                        public void onClick(View view) {
                            // Show the question.
                            if (visibleMap.containsKey(c.id)) {
                                for (LinearLayout ll : visibleMap.get(c.id)) {
                                    ll.setVisibility(View.VISIBLE);
                                }
                            }
                            else {
                                // Find the choice whose ID equals to visibleIfChoiceID and hide the
                                // question and clear the answers.
                                for (PXQuestion.Choice ch : q.choices) {
                                    if (visibleMap.containsKey(ch.id)) {
                                        for (LinearLayout ll : visibleMap.get(ch.id)) {
                                            ll.setVisibility(View.GONE);
                                        }
                                        for (PXQuestion pxq : findQuestions(ch.id)) {
                                            clearAnswer(pxq.id);
                                        }
                                    }
                                }
                            }

                            updateAnswer(q.id, c.id, cb.isSelected() ? c.str : "");
                        }
                    });
                    layout.addView(cb);
                }
                break;
            }

            case RadioGroup: {
                RadioGroup rg = new RadioGroup(getContext());
                rg.setLayoutParams(new ViewGroup.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.WRAP_CONTENT
                ));
                rg.setOrientation(RadioGroup.VERTICAL);

                for (final PXQuestion.Choice c : q.choices) {
                    final RadioButton rb = new RadioButton(getContext());
                    rb.setLayoutParams(new ViewGroup.LayoutParams(
                        ViewGroup.LayoutParams.WRAP_CONTENT,
                        ViewGroup.LayoutParams.WRAP_CONTENT
                    ));
                    rb.setText(c.str);
                    rb.setTextSize(25);
                    rb.setGravity(Gravity.CENTER);
                    int padding = (int)(20 * getResources().getDisplayMetrics().density + 0.5);
                    rb.setPadding(padding, padding, padding, padding);

                    rb.setOnClickListener(new View.OnClickListener() {
                        @Override
                        public void onClick(View view) {
                            // Show the question.
                            if (visibleMap.containsKey(c.id)) {
                                for (LinearLayout ll : visibleMap.get(c.id)) {
                                    ll.setVisibility(View.VISIBLE);
                                }
                            }
                            else {
                                // Find the choice whose ID equals to visibleIfChoiceID and hide the
                                // question and clear the answers.
                                for (PXQuestion.Choice ch : q.choices) {
                                    if (visibleMap.containsKey(ch.id)) {
                                        for (LinearLayout ll : visibleMap.get(ch.id)) {
                                            ll.setVisibility(View.GONE);
                                        }
                                        for (PXQuestion pxq : findQuestions(ch.id)) {
                                            clearAnswer(pxq.id);
                                        }
                                    }
                                }
                            }
                            updateAnswer(q.id, q.id, c.str);
                        }
                    });
                    rg.addView(rb);
                }

                layout.addView(rg);
                break;
            }

            // e.g. Choose top 3 song genres.
            case Ranking: {
                final ArrayList<String> rankings = new ArrayList<>();
                for (final PXQuestion.Choice c : q.choices) {
                    rankings.add(c.str);
                }

                ArrayAdapter<String> adapter = new ArrayAdapter<>(
                    getContext(),
                    R.layout.spinner_item,
                    rankings
                );
                adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);

                rankingSpinners = new ArrayList<>();
                for (int i = 0; i < 3; i++) {
                    LinearLayout row = new LinearLayout(getContext());
                    row.setLayoutParams(new ViewGroup.LayoutParams(
                            ViewGroup.LayoutParams.MATCH_PARENT,
                            ViewGroup.LayoutParams.WRAP_CONTENT
                    ));
                    row.setOrientation(LinearLayout.HORIZONTAL);

                    // 10dp padding all around.
                    int padding = (int)(20 * getResources().getDisplayMetrics().density + 0.5);
                    row.setPadding(padding, padding, padding, padding);


                    TextView txtRank = new TextView(getContext());
                    txtRank.setLayoutParams(new ViewGroup.LayoutParams(
                            ViewGroup.LayoutParams.WRAP_CONTENT,
                            ViewGroup.LayoutParams.WRAP_CONTENT
                    ));
                    txtRank.setText(String.valueOf(i + 1));
                    txtRank.setTextSize(25);
                    row.addView(txtRank);

                    Spinner spnRank = new Spinner(getContext());
                    spnRank.setLayoutParams(new ViewGroup.LayoutParams(
                        ViewGroup.LayoutParams.MATCH_PARENT,
                        ViewGroup.LayoutParams.WRAP_CONTENT
                    ));
                    spnRank.setAdapter(adapter);

                    final int index = i;
                    spnRank.setOnItemSelectedListener(new OnItemSelectedListener() {
                        public void onItemSelected(AdapterView<?> parent, View view, int position,
                                                   long id) {
                            updateAnswer(
                                q.id,
                                index,
                                parent.getItemAtPosition(position).toString()
                            );
                        }

                        public void onNothingSelected(AdapterView<?> arg0) {

                        }
                    });
                    rankingSpinners.add(spnRank);
                    row.addView(spnRank);

                    layout.addView(row);
                }

                break;
            }

            case Rating: {
                final Spinner spnRating = new Spinner(getContext());
                spnRating.setLayoutParams(new ViewGroup.LayoutParams(
                        ViewGroup.LayoutParams.MATCH_PARENT,
                        ViewGroup.LayoutParams.WRAP_CONTENT
                ));

                ArrayList<String> ratings = new ArrayList<>();
                for (final PXQuestion.Choice c : q.choices) {
                    ratings.add(c.str);
                }
                ArrayAdapter<String> adapter = new ArrayAdapter<>(
                    getContext(),
                    R.layout.spinner_item,
                    ratings
                );
                adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
                spnRating.setAdapter(adapter);
                int padding = (int)(20 * getResources().getDisplayMetrics().density + 0.5);
                spnRating.setPadding(padding, padding, padding, padding);

                spnRating.setOnItemSelectedListener(new OnItemSelectedListener() {
                    public void onItemSelected(AdapterView<?> parent, View view, int position,
                                               long id) {
                        updateAnswer(q.id, 0, parent.getItemAtPosition(position).toString());
                    }

                    public void onNothingSelected(AdapterView<?> arg0) {

                    }
                });

                layout.addView(spnRating);
                break;
            }

            case Text: {
                final EditText edtInput = new EditText(getContext());
                edtInput.setLayoutParams(new ViewGroup.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.WRAP_CONTENT
                ));
                int padding = (int)(20 * getResources().getDisplayMetrics().density + 0.5);
                edtInput.setPadding(padding, padding, padding, padding);
                edtInput.setTextSize(25);

                edtInput.addTextChangedListener(new TextWatcher() {
                    @Override
                    public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {

                    }

                    @Override
                    public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {

                    }

                    @Override
                    public void afterTextChanged(Editable editable) {
                        updateAnswer(q.id, 0, edtInput.getText().toString());
                    }
                });

                layout.addView(edtInput);
                break;
            }

            case TextList: {
                addTextListRow(q.id);
                break;
            }

            default: {
                TextView txt = new TextView(getContext());
                txt.setLayoutParams(new ViewGroup.LayoutParams(
                        ViewGroup.LayoutParams.MATCH_PARENT,
                        ViewGroup.LayoutParams.WRAP_CONTENT
                ));
                txt.setText(String.format("Invalid choice type: %s", q.type.name()));

                layout.addView(txt);
            }
        }
    }

    private boolean validateAnswers(LinearLayout layout) {
        // Ensure that at least 1 checkbox is checked.
        boolean hasCheckBox = false, isChecked = false;
        for (int i = 0; i < layout.getChildCount(); i++) {
            View v = layout.getChildAt(i);
            if (v instanceof CheckBox) {
                hasCheckBox = true;
                if (((CheckBox)v).isChecked()) isChecked = true;
            }
        }
        if (hasCheckBox && !isChecked) {
            Toast.makeText(
                getContext(),
                "No selection made. Please choose an option",
                Toast.LENGTH_SHORT
            ).show();

            return false;
        }

        for (int i = 0; i < layout.getChildCount(); i++) {
            View v = layout.getChildAt(i);
            if (v instanceof EditText) {
                if (((EditText)v).getText().toString().equals("")) {
                    Toast.makeText(
                        getContext(),
                        "No text input. Please type a response",
                        Toast.LENGTH_SHORT
                    ).show();

                    return false;
                }
            }
            else if (v instanceof RadioGroup) {
                if (((RadioGroup)v).getCheckedRadioButtonId() == -1) {
                    Toast.makeText(
                        getContext(),
                        "No selection made. Please choose an option",
                        Toast.LENGTH_SHORT
                    ).show();

                    return false;
                }
            }
            else if (v instanceof LinearLayout) {
                LinearLayout ll = (LinearLayout)v;
                if (ll.getVisibility() == View.VISIBLE) {
                    if (!validateAnswers((LinearLayout)v)) return false;
                }
            }
        }

        return true;
    }

    private void updateAnswer(int qid, int id, String ans) {
        LinkedHashMap<Integer, String> answerMap = answers.get(qid);
        if (answerMap == null) answerMap = new LinkedHashMap<>();
        answerMap.put(id, ans);
        answers.put(qid, answerMap);
    }

    private void clearAnswer(int qid) {
        answers.put(qid, new LinkedHashMap<Integer, String>());
    }

    private ArrayList<PXQuestion> findQuestions(int visibleIfChoiceID) {
        ArrayList<PXQuestion> qs = new ArrayList<>();
        for (PXQuestion q : questions) {
            if (q.visibleIfChoiceID == visibleIfChoiceID)
                qs.add(q);
        }

        return qs;
    }

    private void addTextListRow(final int qid) {
        final LinearLayout row = new LinearLayout(getContext());
        row.setLayoutParams(new ViewGroup.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.WRAP_CONTENT
        ));
        row.setOrientation(LinearLayout.HORIZONTAL);
        int padding = (int)(20 * getResources().getDisplayMetrics().density + 0.5);
        row.setPadding(padding, padding, padding, padding);

        final EditText edtInput = new EditText(getContext());
        edtInput.setLayoutParams(new LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.WRAP_CONTENT,
            1
        ));
        edtInput.setPadding(padding, padding, padding, padding);
        edtInput.setTextSize(25);
        edtInput.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {

            }

            @Override
            public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {

            }

            @Override
            public void afterTextChanged(Editable editable) {
                updateAnswer(qid, edtInput.hashCode(), edtInput.getText().toString());
            }
        });

        row.addView(edtInput);

        ImageButton btnAdd = new ImageButton(getContext());
        btnAdd.setLayoutParams(new LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.WRAP_CONTENT,
            ViewGroup.LayoutParams.WRAP_CONTENT,
            0
        ));
        btnAdd.setImageResource(R.drawable.ic_add);
        btnAdd.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                addTextListRow(qid);
            }
        });
        row.addView(btnAdd);

        ImageButton btnDelete = new ImageButton(getContext());
        btnDelete.setLayoutParams(new LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.WRAP_CONTENT,
            ViewGroup.LayoutParams.WRAP_CONTENT,
            0
        ));
        btnDelete.setImageResource(R.drawable.ic_delete);
        btnDelete.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (textListRows.size() > 1) {
                    row.setVisibility(View.GONE);
                    textListRows.remove(row);
                    updateAnswer(qid, edtInput.hashCode(), "");
                }
            }
        });
        row.addView(btnDelete);

        linearLayout.addView(row);
        textListRows.add(row);
    }

    private void submitAnswers() {
        PXServer server = PXServer.getInstance(getContext());
        server.answerQuestionnaire(questionnaire.id, allAnswers, new PXCallback() {
            @Override
            public void onSuccess(String message) {
                FragmentSurveyList f = FragmentSurveyList.newInstance(PXQuestionnaireType.PRE);
                FragmentManager fm = getFragmentManager();
                // TODO: Only clear back stack for the current questionnaire.
                fm.popBackStack(null, FragmentManager.POP_BACK_STACK_INCLUSIVE);
                FragmentTransaction ft = fm.beginTransaction();
                ft.replace(R.id.fragment_content, f)
                  .setTransition(FragmentTransaction.TRANSIT_FRAGMENT_FADE)
                  .commit();

                Toast.makeText(getContext(), "Finished", Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onFailure(String message) {
                Toast.makeText(getContext(), message, Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void nextPage(int currPage) {
        // Go to next page.
        FragmentQuestionPage f = FragmentQuestionPage.newInstance(
            questionnaire,
            currPage + 1,
            allAnswers
        );
        FragmentTransaction ft = getFragmentManager().beginTransaction();
        ft.replace(R.id.fragment_content, f)
          .setTransition(FragmentTransaction.TRANSIT_FRAGMENT_FADE)
          .addToBackStack(null)
          .commit();
    }
}
