package com.example.pxapp.account;

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.widget.SwipeRefreshLayout;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.Toast;

import com.example.pxapp.server.PXAccount;
import com.example.pxapp.server.PXCallback;
import com.example.pxapp.server.PXObjectCallback;
import com.example.pxapp.server.PXServer;
import com.example.pxapp.R;

public class FragmentProfile extends Fragment {
    private Spinner spnType;
    private EditText edtFirstName, edtLastName, edtInstitution;
    private Button btnUpdate;
    private PXServer server;

    public FragmentProfile() {
        server = PXServer.getInstance(getContext());
    }

    public static FragmentProfile newInstance() {
        return new FragmentProfile();
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View rootView = inflater.inflate(R.layout.fragment_profile, container, false);

        final SwipeRefreshLayout pullToRefresh = rootView.findViewById(R.id.pullToRefresh);
        pullToRefresh.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
            @Override
            public void onRefresh() {
                refreshAccountInfo();
                pullToRefresh.setRefreshing(false);
            }
        });

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
                    case R.id.edtFirstName: id = R.string.first_name_hint; break;
                    case R.id.edtLastName: id = R.string.last_name_hint; break;
                    case R.id.edtInstitution: id = R.string.institution_hint; break;
                }

                EditText edt = (EditText)view;
                edt.setHint(hasFocus ? getResources().getString(id) : "");
            }
        };
        int padding = (int)(20 * getResources().getDisplayMetrics().density + 0.5);
        spnType = rootView.findViewById(R.id.spnType);
        spnType.setPadding(padding, padding, padding, padding);
        ArrayAdapter<CharSequence> adapter = ArrayAdapter.createFromResource(
            getContext(),
            R.array.types_array,
            R.layout.spinner_item
        );
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spnType.setAdapter(adapter);

        edtFirstName = rootView.findViewById(R.id.edtFirstName);
        edtFirstName.setPadding(padding, 2*padding, padding, 2*padding);
        edtFirstName.addTextChangedListener(tw);
        edtFirstName.setOnFocusChangeListener(listener);

        edtLastName = rootView.findViewById(R.id.edtLastName);
        edtLastName.setPadding(padding, 2*padding, padding, 2*padding);
        edtLastName.addTextChangedListener(tw);
        edtLastName.setOnFocusChangeListener(listener);

        edtInstitution = rootView.findViewById(R.id.edtInstitution);
        edtInstitution.setPadding(padding, 2*padding, padding, 2*padding);
        edtInstitution.addTextChangedListener(tw);
        edtInstitution.setOnFocusChangeListener(listener);

        refreshAccountInfo();

        btnUpdate = rootView.findViewById(R.id.btnUpdate);
        btnUpdate.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                updateAccountInfo();
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

    private void updateAccountInfo() {
        if (!validate()) {
            Toast.makeText(getContext(), "Invalid fields", Toast.LENGTH_SHORT).show();
            return;
        }

        server.updateAccountInfo(
            PXAccount.Type.values()[spnType.getSelectedItemPosition()],
            edtFirstName.getText().toString(),
            edtLastName.getText().toString(),
            edtInstitution.getText().toString(),
            new PXCallback() {
                @Override
                public void onSuccess(String message) {
                    Toast.makeText(getContext(), message, Toast.LENGTH_SHORT).show();
                }

                @Override
                public void onFailure(String message) {
                    Toast.makeText(getContext(), message, Toast.LENGTH_LONG).show();
                    refreshAccountInfo();
                }
            }
        );
    }

    private void refreshAccountInfo() {
        server.getAccountInfo(new PXObjectCallback<PXAccount>() {
            @Override
            public void onSuccess(String message, PXAccount account) {
                spnType.setSelection(account.type.ordinal());
                edtFirstName.setText(account.firstName);
                edtLastName.setText(account.lastName);
                String institution = account.institution;
                if (institution.equals("null")) institution = "";
                edtInstitution.setText(institution);
            }

            @Override
            public void onFailure(String message) {
                Toast.makeText(getContext(), message, Toast.LENGTH_LONG).show();
            }
        });
    }

    private boolean validate() {
        boolean valid = true;

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
