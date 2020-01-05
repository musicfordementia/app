package com.example.pxapp.server;

import java.util.HashMap;

public class PXAccount {
    public String email, password, institution, firstName, lastName;
    public Type type;

    public PXAccount(String email, String password, Type type, String institution, String firstName,
                     String lastName) {
        this.email = email;
        this.password = password;
        this.type = type;
        this.institution = institution;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    // Should be all uppercase, but this makes it easier to work with.
    public enum Type {
        Carer(1), Patient(2);

        private static final HashMap<Integer, Type> map = new HashMap<>();
        static {
            for (Type c : values()) map.put(c.value, c);
        }

        public final int value;
        Type(int value) {
            this.value = value;
        }

        public static Type valueOf(int n) {
            return map.get(n);
        }
    }
}