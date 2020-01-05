package com.example.pxapp.account;

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.Toast;

import com.example.pxapp.server.DefaultPXCallback;
import com.example.pxapp.server.PXAccount;
import com.example.pxapp.server.PXServer;
import com.example.pxapp.R;

import java.util.regex.Pattern;

public class FragmentSignUp extends Fragment {
    private EditText edtEmail, edtPassword, edtPasswordConfirm, edtFirstName, edtLastName,
                     edtInstitution;
    private Spinner spnType;
    private Button btnSignUp;

    public FragmentSignUp() {

    }

    public static FragmentSignUp newInstance() {
        return new FragmentSignUp();
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View rootView = inflater.inflate(R.layout.fragment_sign_up, container, false);

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
                    case R.id.edtPasswordConfirm: id = R.string.password_confirm_hint; break;
                    case R.id.edtFirstName: id = R.string.first_name_hint; break;
                    case R.id.edtLastName: id = R.string.last_name_hint; break;
                    case R.id.edtInstitution: id = R.string.institution_hint; break;
                }

                EditText edt = (EditText)view;
                edt.setHint(hasFocus ? getResources().getString(id) : "");
            }
        };
        int padding = (int)(20 * getResources().getDisplayMetrics().density + 0.5);
        edtEmail = rootView.findViewById(R.id.edtEmail);
        edtEmail.setPadding(padding, 2*padding, padding, 2*padding);
        edtEmail.addTextChangedListener(tw);
        edtEmail.setOnFocusChangeListener(listener);

        edtPassword = rootView.findViewById(R.id.edtPassword);
        edtPassword.setPadding(padding, 2*padding, padding, 2*padding);
        edtPassword.addTextChangedListener(tw);
        edtPassword.setOnFocusChangeListener(listener);

        edtPasswordConfirm = rootView.findViewById(R.id.edtPasswordConfirm);
        edtPasswordConfirm.setPadding(padding, 2*padding, padding, 2*padding);
        edtPasswordConfirm.addTextChangedListener(tw);
        edtPasswordConfirm.setOnFocusChangeListener(listener);

        spnType = rootView.findViewById(R.id.spnType);
        spnType.setPadding(padding, padding, padding, padding/2);
        ArrayAdapter<CharSequence> adapter = ArrayAdapter.createFromResource(
            getContext(),
            R.array.types_array,
            R.layout.spinner_item
        );
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spnType.setAdapter(adapter);

        edtFirstName = rootView.findViewById(R.id.edtFirstName);
        edtFirstName.setPadding(padding, padding/2, padding, 2*padding);
        edtFirstName.addTextChangedListener(tw);
        edtFirstName.setOnFocusChangeListener(listener);

        edtLastName = rootView.findViewById(R.id.edtLastName);
        edtLastName.setPadding(padding, 2*padding, padding, 2*padding);
        edtLastName.addTextChangedListener(tw);
        edtLastName.setOnFocusChangeListener(listener);

        edtInstitution = rootView.findViewById(R.id.edtInstitution);
        edtInstitution.setPadding(padding, 2*padding, padding, 2*padding);
        edtInstitution.setOnFocusChangeListener(listener);

        btnSignUp = rootView.findViewById(R.id.btnSignUp);
        btnSignUp.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                signUp();
            }
        });

        return rootView;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    private void signUp() {
        if (!validate()) {
            Toast.makeText(getContext(), "Invalid fields", Toast.LENGTH_SHORT).show();
            return;
        }

        PXServer server = PXServer.getInstance(getContext());
        PXAccount account = new PXAccount(
            edtEmail.getText().toString(),
            edtPassword.getText().toString(),
            PXAccount.Type.values()[spnType.getSelectedItemPosition()],
            edtInstitution.getText().toString(),
            edtFirstName.getText().toString(),
            edtLastName.getText().toString()
        );
        server.signUp(account, new DefaultPXCallback(getContext()));
    }

    private boolean validateEmail() {
        Pattern emailRegex = Pattern.compile("^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,6}$",
                Pattern.CASE_INSENSITIVE);
        return emailRegex.matcher(edtEmail.getText().toString()).find();
    }

    private boolean validate() {
        boolean valid = true;
        String password = edtPassword.getText().toString(),
               passwordConfirm = edtPasswordConfirm.getText().toString();

        if (edtEmail.getText().length() == 0) {
            edtEmail.setError("Email can not be empty");
            valid = false;
        }
        else if(!validateEmail()) {
            edtEmail.setError("Invalid email");
            valid = false;
        }
        else edtEmail.setError(null);

        if (password.length() == 0) {
            edtPassword.setError("Password can not be empty");
            valid = false;
        }
        else edtPassword.setError(null);

        if (passwordConfirm.length() == 0) {
            edtPasswordConfirm.setError("Please confirm your password");
            valid = false;
        }
        else if (!password.equals(passwordConfirm)) {
            edtPasswordConfirm.setError("Passwords don't match");
            valid = false;
        }
        else edtPasswordConfirm.setError(null);

        if (edtFirstName.getText().toString().length() == 0) {
            edtFirstName.setError("First name can not be empty");
            valid = false;
        }
        else edtFirstName.setError(null);

        if (edtLastName.getText().toString().length() == 0) {
            edtLastName.setError("Last name can not be empty");
            valid = false;
        }
        else edtLastName.setError(null);

        return valid;
    }
}
