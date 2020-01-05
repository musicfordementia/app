package com.example.pxapp.server;

import java.util.ArrayList;
import java.util.HashMap;

public class PXQuestion {
    public int id;
    public int pageNo;
    public String str;
    public ChoiceType type;
    public boolean hasOther;
    public int visibleIfChoiceID;
    public ArrayList<Choice> choices;

    public PXQuestion(int id, int pageNo, String str, ChoiceType type, boolean hasOther,
                      int visibleIfChoiceID, ArrayList<Choice> choices) {
        this.id = id;
        this.pageNo = pageNo;
        this.str = str;
        this.type = type;
        this.hasOther = hasOther;
        this.visibleIfChoiceID = visibleIfChoiceID;
        this.choices = choices;
    }

    public static class Choice {
        public int id;
        public String str;

        public Choice(int id, String str) {
            this.id = id;
            this.str = str;
        }
    }

    public enum ChoiceType {
        Checkbox(1), RadioGroup(2), Ranking(3), Rating(4), Text(5), TextList(6);

        private static final HashMap<Integer, ChoiceType> map = new HashMap<>();
        static {
            for (ChoiceType c : values()) map.put(c.value, c);
        }

        public final int value;
        ChoiceType(int value) {
            this.value = value;
        }

        public static ChoiceType valueOf(int n) {
            return map.get(n);
        }
    }
}
