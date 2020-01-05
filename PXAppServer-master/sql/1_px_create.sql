CREATE DATABASE IF NOT EXISTS PXApp;
USE PXApp;

CREATE TABLE IF NOT EXISTS UserType (
    id int PRIMARY KEY,
    type VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS `User` (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    typeID INT NOT NULL,
    institution VARCHAR(100),
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,

    FOREIGN KEY(typeID) REFERENCES UserType(id)
);

CREATE TABLE IF NOT EXISTS AdminUser (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS QuestionnaireType (
    id INT PRIMARY KEY,
    name TEXT NOT NULL
);

/* TODO: Add what user types can see this questionnaire */
CREATE TABLE IF NOT EXISTS Questionnaire (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name TEXT NOT NULL,
    typeID INT NOT NULL,
    FOREIGN KEY(typeID) REFERENCES QuestionnaireType(id)
);

CREATE TABLE IF NOT EXISTS ChoiceType (
    id INT PRIMARY KEY,
    type VARCHAR(100) NOT NULL
);

/* Based on SurveyJS */
CREATE TABLE IF NOT EXISTS Question (
    id INT PRIMARY KEY AUTO_INCREMENT,
    pageNo INT NOT NULL,
    str TEXT NOT NULL,
    typeID INT NOT NULL,
    hasOther BOOLEAN NOT NULL,
    /* 
     * Choice ID that should be selected for this question to be visible. Only used if there is more 
     * than 1 question on this page.
     */
    visibleIfChoiceID INT,
    FOREIGN KEY(typeID) REFERENCES ChoiceType(id)
);

CREATE TABLE IF NOT EXISTS QuestionChoice (
    id INT PRIMARY KEY AUTO_INCREMENT,
    questionID INT,
    str VARCHAR(100),
    FOREIGN KEY(questionID) REFERENCES Question(id)
);

CREATE TABLE IF NOT EXISTS QuestionnaireQuestion (
    questionnaireID INT,
    questionID INT,
    PRIMARY KEY(questionnaireID, questionID),
    FOREIGN KEY(questionnaireID) REFERENCES Questionnaire(id),
    FOREIGN KEY(questionID) REFERENCES Question(id)
);

CREATE TABLE IF NOT EXISTS Answer (
    id INT PRIMARY KEY AUTO_INCREMENT,
    questionnaireID INT NOT NULL,
    questionID INT NOT NULL,
    userID INT NOT NULL,
    str TEXT NOT NULL,
    FOREIGN KEY(questionnaireID) REFERENCES Questionnaire(id),
    FOREIGN KEY(questionID) REFERENCES Question(id),
    FOREIGN KEY(userID) REFERENCES `User`(id)
);

CREATE TABLE IF NOT EXISTS TemporaryPassword (
    userID INT PRIMARY KEY,
    tempPassword VARCHAR(255) NOT NULL,
    expires DATETIME NOT NULL,
    FOREIGN KEY(userID) REFERENCES `User`(id)
);

CREATE TABLE IF NOT EXISTS Song (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    artist VARCHAR(100),
    link VARCHAR(100),
    tempo INT,
    modeID INT,      
    genreID INT,
    length INT,             /* in seconds */
    year INT,
    lyricID INT
);

CREATE TABLE IF NOT EXISTS SongMode (
    id INT PRIMARY KEY,
    mode VARCHAR(100) NOT NULL  /* major, minor */
);

CREATE TABLE IF NOT EXISTS SongGenre (
    id INT PRIMARY KEY,
    genre VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS SongLyric (
    id INT PRIMARY KEY,
    lyric VARCHAR(100)  /* positive, negative, none */
);

CREATE TABLE IF NOT EXISTS SongMapping (
    mappingID INT PRIMARY KEY AUTO_INCREMENT,
	userID INT,
    BPMFilter INT,
	GenreFilter VARCHAR(100),
	VocalInstrumentType VARCHAR(100),
	FOREIGN KEY(userID) REFERENCES `User`(id)
);

CREATE TABLE IF NOT EXISTS Tag (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS SongTag (
    id INT PRIMARY KEY AUTO_INCREMENT,
    songID INT,
    tagID INT,
    FOREIGN KEY(songID) REFERENCES Song(id),
    FOREIGN KEY(tagID) REFERENCES Tag(id)
);

CREATE TABLE IF NOT EXISTS AnswerTag (
    id INT PRIMARY KEY AUTO_INCREMENT,
    answerID INT,
    tagID INT,
    FOREIGN KEY(answerID) REFERENCES Answer(id),
    FOREIGN KEY(tagID) REFERENCES Tag(id)
);

CREATE TABLE IF NOT EXISTS Playlist (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name TEXT NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS PlaylistTag (
    id INT PRIMARY KEY AUTO_INCREMENT,
    playlistID INT,
    tagID INT,
    FOREIGN KEY(playlistID) REFERENCES Playlist(id),
    FOREIGN KEY(tagID) REFERENCES Tag(id)
);

CREATE TABLE IF NOT EXISTS PlaylistSong (
    id INT PRIMARY KEY AUTO_INCREMENT,
    playlistID INT,
    songID INT,
    FOREIGN KEY(playlistID) REFERENCES Playlist(id),
    FOREIGN KEY(songID) REFERENCES Song(id)
);

CREATE TABLE IF NOT EXISTS UserPlaylist (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userID INT,
    playlistID INT,
    FOREIGN KEY(userID) REFERENCES User(id),
    FOREIGN KEY(playlistID) REFERENCES Playlist(id)
);

/*
 * If the user's answer to questionID equals to str, then assign the tags to their answer.
 * The tags will be processed through rules, which will assign playlists to the user.
 */
CREATE TABLE IF NOT EXISTS QuestionAnswer (
    id INT PRIMARY KEY AUTO_INCREMENT,
    questionID INT,
    str TEXT NOT NULL,
    FOREIGN KEY(questionID) REFERENCES Question(id)
);

CREATE TABLE IF NOT EXISTS QuestionAnswerTag (
    id INT PRIMARY KEY AUTO_INCREMENT,
    questionAnswerID INT,
    tagID INT,
    FOREIGN KEY(questionAnswerID) REFERENCES QuestionAnswer(id),
    FOREIGN KEY(tagID) REFERENCES Tag(id)
);

/* If the number of tags in the user's answers is ==/>/< count */
CREATE TABLE IF NOT EXISTS Rule (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tagID INT,
    op CHAR(2) NOT NULL,    /* ==, >, < */
    count INT NOT NULL,
    FOREIGN KEY(tagID) REFERENCES Tag(id)
);
/* 
 * then find the playlists that have these tags.
 * These tags can be a subset of the playlist tags.
 * e.g. Playlist 1 tags: Tempo<=60
 *      Playlist 2 tags: Tempo<=60, Mode=major
 *      Rule tags      : Tempo<=60
 * The rule will match playlist 1 and 2.
 */
CREATE TABLE IF NOT EXISTS RuleTag (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ruleID INT,
    tagID INT,
    FOREIGN KEY(ruleID) REFERENCES Rule(id),
    FOREIGN KEY(tagID) REFERENCES Tag(id)
);

/* Appendix 5 - Template for Rating Strength of Response to Music */
CREATE TABLE IF NOT EXISTS SongRating (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userID INT NOT NULL,
    `date` DATE NOT NULL,
    songID INT NOT NULL,
    rating INT NOT NULL,
    FOREIGN KEY(userID) REFERENCES User(id),
    FOREIGN KEY(songID) REFERENCES Song(id)
);

/* Appendix 6 - Listening Diary */
CREATE TABLE IF NOT EXISTS ListeningDiary (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userID INT NOT NULL,
    `dateTime` DATETIME NOT NULL,
    mood TEXT NOT NULL,
    situation TEXT NOT NULL,
    reaction TEXT NOT NULL,
    comments TEXT NOT NULL,
    FOREIGN KEY(userID) REFERENCES User(id)
);

CREATE TABLE IF NOT EXISTS DiarySong (
    diaryID INT,
    songID INT,
    PRIMARY KEY(diaryID, songID),
    FOREIGN KEY(diaryID) REFERENCES ListeningDiary(id),
    FOREIGN KEY(songID) REFERENCES Song(id)
);

/* Appendix 6 - Music Usage Plan */
CREATE TABLE IF NOT EXISTS UsagePlan (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userID INT NOT NULL,
    playlistID INT NOT NULL,
    timeOfDay TEXT NOT NULL,
    symptoms TEXT NOT NULL,
    howOften TEXT NOT NULL,
    howLong TEXT NOT NULL,
    FOREIGN KEY(userID) REFERENCES User(id),
    FOREIGN KEY(playlistID) REFERENCES Playlist(id)
);

INSERT INTO UserType VALUES(1, 'Carer'), (2, 'Patient');

INSERT INTO User(email, password, typeID, institution, firstName, lastName) 
/* password: test */
VALUES('test@email.com', '$2b$10$CjdkmA6oGtnANZISiXsM6.f3JZWr1a6ZcH7M5adP.gG3sRxiWDOxG', 1, NULL,
       'test', 'user');

INSERT INTO AdminUser(username, password) VALUES
/* password: admin */
('admin', '$2b$10$DmAbEKeERaQOHDC55IbQzevy3ucVO4EsjgeX0mdK8YyErAD2unw5m');

INSERT INTO ChoiceType VALUES
(1, 'Checkbox'), (2, 'RadioGroup'), (3, 'Ranking'), (4, 'Rating'), (5, 'Text'), (6, 'TextList');

INSERT INTO SongMode VALUES(1, 'Major'), (2, 'Minor');
INSERT INTO SongGenre VALUES
(1, 'Country') , (2, 'Popular/Easy Listening/RNB/Soundtrack'), (3, 'Folk Music'), 
(4, 'Jazz & Swing'), (5, 'Hymns & Religion'), (6, 'Classical');
INSERT INTO SongLyric VALUES(1, 'Positive'), (2, 'Negative'), (3, 'None');

INSERT INTO Tag VALUES
(1, 'Tempo<=60'), (2, 'Tempo<=80'), (3, 'Tempo>=80'), (4, 'Tempo<=120'), (5, 'Mode=Major');
