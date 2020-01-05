package com.example.pxapp.server;

public enum PXRoutes {
    SIGN_IN("signin"),
    SIGN_UP("signup"),
    ACCOUNT_INFO("account/info"),
    ACCOUNT_UPDATE(ACCOUNT_INFO + "/update"),
    PASSWORD_UPDATE("account/password/update"),
    PASSWORD_RESET("account/password/reset"),
    SONGS("songs"),
    QUESTIONNAIRES("questionnaires/"),
    PLAYLISTS("playlists"),
    SONG_RATINGS("appendix/song-ratings"),
    LISTENING_DIARY("appendix/listening-diary"),
    USAGE_PLAN("appendix/usage-plan"),
    PLAYLIST_RULES_RUN("rules/playlists/run"),
    QA_RULES_RUN("rules/question-answers/run");

    private String route;

    PXRoutes(String r) { route = r; }

    @Override
    public String toString() { return route; }
}