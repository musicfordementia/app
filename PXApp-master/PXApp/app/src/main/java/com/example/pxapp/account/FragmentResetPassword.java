package com.example.pxapp.account;

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.Toast;

import com.example.pxapp.server.PXCallback;
import com.example.pxapp.server.PXServer;
import com.example.pxapp.R;

import java.util.regex.Pattern;

public class FragmentResetPassword extends Fragment {
    private EditText edtEmail;
    private Button btnResetPassword;
    private ProgressBar progressBar;
    private PXServer server;

    public FragmentResetPassword() {
        server = PXServer.getInstance(getContext());
    }

    public static FragmentResetPassword newInstance() {
        return new FragmentResetPassword();
    }

    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View rootView = inflater.inflate(R.layout.fragment_reset_password, container, false);
        int padding = (int)(20 * getResources().getDisplayMetrics().density + 0.5);
        edtEmail = rootView.findViewById(R.id.edtEmail);
        edtEmail.setPadding(padding, 2*padding, padding, 2*padding);
        edtEmail.addTextChangedListener(new TextWatcher() {
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
        });
        edtEmail.setOnFocusChangeListener(new View.OnFocusChangeListener() {
            @Override
            public void onFocusChange(View view, boolean hasFocus) {
                edtEmail.setHint(hasFocus ? getResources().getString(R.string.email_hint) : "");
            }
        });

        progressBar = rootView.findViewById(R.id.progressBar);
        progressBar.setVisibility(View.GONE);

        btnResetPassword = rootView.findViewById(R.id.btnResetPassword);
        btnResetPassword.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (!validate()) {
                    Toast.makeText(getContext(), "Invalid fields", Toast.LENGTH_SHORT).show();
                    return;
                }

                loading(true);

                server.resetAccountPassword(edtEmail.getText().toString(), new PXCallback() {
                    @Override
                    public void onSuccess(String message) {
                        loading(false);
                        Toast.makeText(getContext(), message, Toast.LENGTH_SHORT).show();
                    }

                    @Override
                    public void onFailure(String message) {
                        loading(false);
                        Toast.makeText(getContext(), message, Toast.LENGTH_LONG).show();
                    }
                });
            }
        });

        return rootView;
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

        return valid;
    }

    private void loading(boolean isLoading) {
        edtEmail.setEnabled(!isLoading);
        btnResetPassword.setVisibility(isLoading ? View.GONE : View.VISIBLE);
        progressBar.setVisibility(isLoading ? View.VISIBLE : View.GONE);
    }
}
