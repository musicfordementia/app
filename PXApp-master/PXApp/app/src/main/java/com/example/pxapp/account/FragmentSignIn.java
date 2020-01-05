package com.example.pxapp.account;

import android.content.Context;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentTransaction;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import com.example.pxapp.server.PXCallback;
import com.example.pxapp.server.PXServer;
import com.example.pxapp.R;

import java.util.regex.Pattern;

public class FragmentSignIn extends Fragment {
    View rootView;
    private EditText edtEmail, edtPassword;
    private Button btnSignIn;

    public FragmentSignIn() {

    }

    public static FragmentSignIn newInstance() {
        return new FragmentSignIn();
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View rootView = inflater.inflate(R.layout.fragment_sign_in, container, false);

        TextWatcher tw = new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {

            }

            @Override
            public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {

            }

            @Override
            public void afterTextChanged(Editable editable) {
                validate();
            }
        };

        View.OnFocusChangeListener listener = new View.OnFocusChangeListener() {
            @Override
            public void onFocusChange(View view, boolean hasFocus) {
                int id = 0;
                switch (view.getId()) {
                    case R.id.edtEmail: id = R.string.email_hint; break;
                    case R.id.edtPassword: id = R.string.password_hint; break;
                }

                EditText edt = (EditText)view;
                edt.setHint(hasFocus ? getResources().getString(id) : "");
            }
        };

        edtEmail = rootView.findViewById(R.id.edtEmail);
        int padding = (int)(20 * getResources().getDisplayMetrics().density + 0.5);
        edtEmail.setPadding(padding, 2*padding, padding, 2*padding);
        edtEmail.addTextChangedListener(tw);
        edtEmail.setOnFocusChangeListener(listener);

        edtPassword = rootView.findViewById(R.id.edtPassword);
        edtPassword.setPadding(padding, 2*padding, padding, 2*padding);
        edtPassword.addTextChangedListener(tw);
        edtPassword.setOnFocusChangeListener(listener);

        btnSignIn = rootView.findViewById(R.id.btnSignIn);
        btnSignIn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                signIn();
            }
        });

        return rootView;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    private void signIn() {
        if (!validate()) {
            Toast.makeText(getContext(), "Invalid fields", Toast.LENGTH_SHORT).show();
            return;
        }

        PXServer server = PXServer.getInstance(getContext());
        server.signIn(edtEmail.getText().toString(), edtPassword.getText().toString(),
            new PXCallback() {
                @Override
                public void onSuccess(String message) {
                    Toast.makeText(getContext(), message, Toast.LENGTH_SHORT).show();

                    FragmentManager fm = getFragmentManager();
                    fm.beginTransaction()
                      .replace(R.id.fragment_content, FragmentProfile.newInstance())
                      .setTransition(FragmentTransaction.TRANSIT_FRAGMENT_FADE)
                      .commit();

                    // Hide the keyboard.
                    InputMethodManager imm = (InputMethodManager)getContext()
                            .getSystemService(Context.INPUT_METHOD_SERVICE);
                    imm.hideSoftInputFromWindow(getView().getRootView().getWindowToken(), 0);
                }

                @Override
                public void onFailure(String message) {
                    Toast.makeText(getContext(), message, Toast.LENGTH_LONG).show();
                }
        });
    }

    private boolean validateEmail() {
        Pattern emailRegex = Pattern.compile("^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,6}$",
                Pattern.CASE_INSENSITIVE);
        return emailRegex.matcher(edtEmail.getText().toString()).find();
    }

    private boolean validate() {
        boolean valid = true;

        if (edtEmail.getText().length() == 0) {
            edtEmail.setError("Email can not be empty");
            valid = false;
        }
        else if(!validateEmail()) {
            edtEmail.setError("Invalid email");
            valid = false;
        }
        else edtEmail.setError(null);

        if (edtPassword.getText().length() == 0) {
            edtPassword.setError("Password can not be empty");
            valid = false;
        }
        else edtPassword.setError(null);

        return valid;
    }
}
