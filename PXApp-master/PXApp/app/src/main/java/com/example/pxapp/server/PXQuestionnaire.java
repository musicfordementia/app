package com.example.pxapp.server;

import java.io.Serializable;
import java.util.ArrayList;

public class PXQuestionnaire implements Serializable {
    public int id;
    public String name;
    public String type;
    public ArrayList<PXQuestion> questions;

    public PXQuestionnaire(int id, String name, String type, ArrayList<PXQuestion> questions) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.questions = questions;
    }
}
