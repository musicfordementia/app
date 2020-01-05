package com.example.pxapp.server;

import java.io.Serializable;

public class PXAnswer implements Serializable {
    public int questionnaireID, questionID, userID;
    public String str;

    // questionnaireID and userID are ignored when answering a questionnaire.
    public PXAnswer(int questionID, String str) {
        this.questionID = questionID;
        this.str = str;
    }

    public PXAnswer(int questionnaireID, int questionID, int userID, String str) {
        this.questionnaireID = questionnaireID;
        this.questionID = questionID;
        this.userID = userID;
        this.str = str;
    }
}
