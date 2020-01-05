package com.example.pxapp;

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import java.util.*;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

public class FragmentInfoReader extends Fragment {
    private TextView txtTitle, txtText;
    LinearLayout linearLayout;
    String currentTextString, textChunkText, imageText, typeCheck;
    int counter;
    String image = "image";

    public FragmentInfoReader() {

    }

    public static FragmentInfoReader newInstance(String title, String text) {
        FragmentInfoReader fir = new FragmentInfoReader();
        Bundle args = new Bundle();
        args.putString("title", title);
        args.putString("text", text);
        fir.setArguments(args);

        return fir;
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View rootView = inflater.inflate(R.layout.fragment_info_reader, container, false);
        txtTitle = rootView.findViewById(R.id.txtTitle);
        linearLayout = rootView.findViewById(R.id.linearLayout);
        //txtText = rootView.findViewById(R.id.txtText);

        Bundle args = getArguments();
        if (args != null) {
            txtTitle.setText(args.getString("title"));
            currentTextString = args.getString("text");
            // txtText.setText(args.getString("text"));
            //       counter = 0;

            StringTokenizer st = new StringTokenizer(currentTextString, "|");
            int tokenSize = st.countTokens();
            while (tokenSize > 0) {
                typeCheck = st.nextToken();
                if (typeCheck.equals(image)) {
                    imageText = st.nextToken();
                    imageText = imageText.replaceAll("[\\n\\t ]", "");
                    int drawableId = getResources().getIdentifier(imageText, "drawable", getActivity().getPackageName());
                    final ImageView image = new ImageView(getContext());
                    image.setLayoutParams(new ViewGroup.LayoutParams(
                            ViewGroup.LayoutParams.MATCH_PARENT,
                            ViewGroup.LayoutParams.WRAP_CONTENT
                    ));
                    image.setImageResource(drawableId);
                    linearLayout.addView(image);
                    tokenSize--;
                    tokenSize--;
                } else {
                    final TextView textChunk = new TextView(getContext());
                    textChunk.setLayoutParams(new ViewGroup.LayoutParams(
                            ViewGroup.LayoutParams.MATCH_PARENT,
                            ViewGroup.LayoutParams.WRAP_CONTENT
                    ));
                    textChunkText = st.nextToken();
                    textChunk.setText(textChunkText);
                    textChunk.setTextIsSelectable(true);
                    textChunk.setTextSize(20);
                    linearLayout.addView(textChunk);
                    tokenSize--;
                    tokenSize--;
                }
            }
        }
        return rootView;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }
}
