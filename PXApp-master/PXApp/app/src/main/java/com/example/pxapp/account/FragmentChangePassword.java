package com.example.pxapp.account;

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import com.example.pxapp.server.PXCallback;
import com.example.pxapp.server.PXServer;
import com.example.pxapp.R;

public class FragmentChangePassword extends Fragment {
    private EditText edtCurrPassword, edtNewPassword, edtNewPasswordConfirm;
    private Button btnChangePassword;
    private PXServer server;

    public FragmentChangePassword() {
        server = PXServer.getInstance(getContext());
    }

    public static FragmentChangePassword newInstance() {
        return new FragmentChangePassword();
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View rootView = inflater.inflate(R.layout.fragment_change_password, container,
                             false);

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
        int padding = (int)(20 * getResources().getDisplayMetrics().density + 0.5);
        edtCurrPassword = rootView.findViewById(R.id.edtCurrPassword);
        edtCurrPassword.setPadding(padding, 2*padding, padding, 2*padding);
        edtCurrPassword.addTextChangedListener(tw);
        edtCurrPassword.setOnFocusChangeListener(new View.OnFocusChangeListener() {
            @Override
            public void onFocusChange(View view, boolean hasFocus) {
                edtCurrPassword.setHint(hasFocus ? "Current Password" : "");
            }
        });

        edtNewPassword = rootView.findViewById(R.id.edtNewPassword);
        edtNewPassword.setPadding(padding, 2*padding, padding, 2*padding);
        edtNewPassword.addTextChangedListener(tw);
        edtNewPassword.setOnFocusChangeListener(new View.OnFocusChangeListener() {
            @Override
            public void onFocusChange(View view, boolean hasFocus) {
                edtNewPassword.setHint(hasFocus ? "New Password" : "");
            }
        });

        edtNewPasswordConfirm = rootView.findViewById(R.id.edtNewPasswordConfirm);
        edtNewPasswordConfirm.setPadding(padding, 2*padding, padding, 2*padding);
        edtNewPasswordConfirm.addTextChangedListener(tw);
        edtNewPasswordConfirm.setOnFocusChangeListener(new View.OnFocusChangeListener() {
            @Override
            public void onFocusChange(View view, boolean hasFocus) {
                edtNewPasswordConfirm.setHint(hasFocus ? "Confirm New Password" : "");
            }
        });

        btnChangePassword = rootView.findViewById(R.id.btnChangePassword);
        btnChangePassword.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                changePassword();
            }
        });

        return rootView;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setHasOptionsMenu(true);
    }

    @Override
    public void onCreateOptionsMenu(Menu menu, MenuInflater inflater) {
        menu.clear();
        inflater.inflate(R.menu.options_account, menu);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case R.id.action_sign_out:
                server.signOut();

                getFragmentManager()
                    .beginTransaction()
                    .replace(R.id.fragment_content, FragmentAccount.newInstance())
                    .commit();

                Toast.makeText(getContext(), "Signed out", Toast.LENGTH_SHORT).show();
                return true;
        }

        return super.onOptionsItemSelected(item);
    }

    private boolean validate() {
        boolean valid = true;
        String currPassword = edtCurrPassword.getText().toString(),
               newPassword = edtNewPassword.getText().toString(),
               newPasswordConfirm = edtNewPasswordConfirm.getText().toString();

        if (currPassword.length() == 0) {
            edtCurrPassword.setError("Password can not be empty");
            valid = false;
        }
        else edtCurrPassword.setError(null);

        if (newPassword.length() == 0) {
            edtNewPassword.setError("Password can not be empty");
            valid = false;
        }
        else edtNewPassword.setError(null);

        if (newPasswordConfirm.length() == 0) {
            edtNewPasswordConfirm.setError("Please confirm your password");
            valid = false;
        }
        else if (!newPassword.equals(newPasswordConfirm)) {
            edtNewPasswordConfirm.setError("Passwords don't match");
            valid = false;
        }
        else edtNewPasswordConfirm.setError(null);

        return valid;
    }

    private void changePassword() {
        if (!validate()) {
            Toast.makeText(getContext(), "Invalid fields", Toast.LENGTH_SHORT).show();
            return;
        }

        PXServer server = PXServer.getInstance(getContext());
        String currPassword = edtCurrPassword.getText().toString(),
               newPassword = edtNewPassword.getText().toString();
        server.updateAccountPassword(currPassword, newPassword, new PXCallback() {
            @Override
            public void onSuccess(String message) {
                Toast.makeText(getContext(), message, Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onFailure(String message) {
                Toast.makeText(getContext(), message, Toast.LENGTH_LONG).show();
            }
        });
    }
}
