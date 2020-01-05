INSERT INTO Playlist VALUES(1, 'Playlist 1', 'Tempo <= 60 BPM');
INSERT INTO PlaylistSong(playlistID, songID) 
SELECT p.id, s.id FROM Playlist p, Song s WHERE p.id = 1 AND s.tempo <= 60;
INSERT INTO PlaylistTag(playlistID, tagID) VALUES(1, 1);

INSERT INTO Playlist VALUES(2, 'Playlist 2', 'Tempo <= 80 BPM');
INSERT INTO PlaylistSong(playlistID, songID) 
SELECT p.id, s.id FROM Playlist p, Song s WHERE p.id = 2 AND s.tempo <= 80;
INSERT INTO PlaylistTag(playlistID, tagID) VALUES(2, 2);

INSERT INTO Playlist VALUES(3, 'Playlist 3', 'Tempo >= 80 BPM AND Tempo <= 120 BPM');
INSERT INTO PlaylistSong(playlistID, songID) 
SELECT p.id, s.id FROM Playlist p, Song s WHERE p.id = 3 AND s.tempo >= 80 AND s.tempo <= 120;
INSERT INTO PlaylistTag(playlistID, tagID) VALUES(3, 3), (3, 4);

INSERT INTO Playlist VALUES(4, 'Playlist 4', 'Tempo <= 120 BPM');
INSERT INTO PlaylistSong(playlistID, songID) 
SELECT p.id, s.id FROM Playlist p, Song s WHERE p.id = 4 AND s.tempo <= 120;
INSERT INTO PlaylistTag(playlistID, tagID) VALUES(4, 4);

INSERT INTO Playlist VALUES(5, 'Playlist 1 - High Risk', 'Tempo <= 60 BPM AND mode = major');
INSERT INTO PlaylistSong(playlistID, songID) 
SELECT p.id, s.id FROM Playlist p, Song s WHERE p.id = 5 AND s.tempo <= 60 AND s.modeID = 1;
INSERT INTO PlaylistTag(playlistID, tagID) VALUES(5, 1), (5, 5);

INSERT INTO Playlist VALUES(6, 'Playlist 2 - High Risk', 'Tempo <= 80 BPM AND mode = major');
INSERT INTO PlaylistSong(playlistID, songID) 
SELECT p.id, s.id FROM Playlist p, Song s WHERE p.id = 6 AND s.tempo <= 80 AND s.modeID = 1;
INSERT INTO PlaylistTag(playlistID, tagID) VALUES(6, 2), (6, 5);

INSERT INTO Playlist VALUES(7, 'Playlist 3 - High Risk', 'Tempo >= 80 BPM AND Tempo <= 120 BPM AND mode = major');
INSERT INTO PlaylistSong(playlistID, songID) 
SELECT p.id, s.id FROM Playlist p, Song s WHERE p.id = 7 AND s.tempo >= 80 AND s.tempo <= 120 AND s.modeID = 1;
INSERT INTO PlaylistTag(playlistID, tagID) VALUES(7, 3), (7, 4), (7, 5);

INSERT INTO Playlist VALUES(8, 'Playlist 4 - High Risk', 'Tempo <= 120 BPM AND mode = major');
INSERT INTO PlaylistSong(playlistID, songID) 
SELECT p.id, s.id FROM Playlist p, Song s WHERE p.id = 8 AND s.tempo <= 120 AND s.modeID = 1;
INSERT INTO PlaylistTag(playlistID, tagID) VALUES(8, 4), (8, 5);