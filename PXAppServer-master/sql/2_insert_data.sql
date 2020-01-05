INSERT INTO QuestionnaireType VALUES(1, 'Pre-questionnaire'), (2, 'Post-questionnaire');

/* Appendix 1 - Patient */
INSERT INTO Questionnaire VALUES(3, 'Vulnerability to Negative Affect in Dementia Scale (VNADS) - Patient Version', 1);
INSERT INTO Question VALUES
(29, 1, 'In the last 2 weeks I have had little interest or pleasure in doing things', 2, FALSE, NULL),
(30, 2, 'In the last 2 weeks I have felt down, depressed or hopeless', 2, FALSE, NULL),
(31, 3, 'Often throughout my life I have felt down, depressed or hopeless', 2, FALSE, NULL),
(32, 4, 'In the past 2 weeks I have felt so restless it is hard to sit still', 2, FALSE, NULL),
(33, 5, 'I have often had periods I my life where I felt so restless it was hard to sit still', 2, FALSE, NULL),
(34, 6, 'Sometimes I feel so upset that I want to hit or kick something', 2, FALSE, NULL),
(35, 7, 'Sometimes I feel so stirred up inside I want to scream', 2, FALSE, NULL),
(36, 8, 'Listening to music can sometimes bring back distressing memories', 2, FALSE, NULL),
(37, 9, 'Sometimes I get so stirred up by music that my emotions feel overwhelming', 2, FALSE, NULL);
INSERT INTO QuestionChoice VALUES
(43, 29, 'Strongly Disagree'), (44, 29, 'Disagree'), (45, 29, 'Neither Agree Nor Disagree'), (46, 29, 'Agree'), (47, 29, 'Strongly Agree'), 
(48, 30, 'Strongly Disagree'), (49, 30, 'Disagree'), (50, 30, 'Neither Agree Nor Disagree'), (51, 30, 'Agree'), (52, 30, 'Strongly Agree'), 
(53, 31, 'Strongly Disagree'), (54, 31, 'Disagree'), (55, 31, 'Neither Agree Nor Disagree'), (56, 31, 'Agree'), (57, 31, 'Strongly Agree'), 
(58, 32, 'Strongly Disagree'), (59, 32, 'Disagree'), (60, 32, 'Neither Agree Nor Disagree'), (61, 32, 'Agree'), (62, 32, 'Strongly Agree'), 
(63, 33, 'Strongly Disagree'), (64, 33, 'Disagree'), (65, 33, 'Neither Agree Nor Disagree'), (66, 33, 'Agree'), (67, 33, 'Strongly Agree'), 
(68, 34, 'Strongly Disagree'), (69, 34, 'Disagree'), (70, 34, 'Neither Agree Nor Disagree'), (71, 34, 'Agree'), (72, 34, 'Strongly Agree'), 
(73, 35, 'Strongly Disagree'), (74, 35, 'Disagree'), (75, 35, 'Neither Agree Nor Disagree'), (76, 35, 'Agree'), (77, 35, 'Strongly Agree'), 
(78, 36, 'Strongly Disagree'), (79, 36, 'Disagree'), (80, 36, 'Neither Agree Nor Disagree'), (81, 36, 'Agree'), (82, 36, 'Strongly Agree'), 
(83, 37, 'Strongly Disagree'), (84, 37, 'Disagree'), (85, 37, 'Neither Agree Nor Disagree'), (86, 37, 'Agree'), (87, 37, 'Strongly Agree');
INSERT INTO QuestionnaireQuestion VALUES
(3, 29), (3, 30), (3, 31), (3, 32), (3, 33), (3, 34), (3, 35), (3, 36), (3, 37);

/* Appendix 1 - Carer */
INSERT INTO Questionnaire VALUES(4, 'Vulnerability to Negative Affect in Dementia Scale (VNADS) - Family/Caregiver Version', 1);
INSERT INTO Question VALUES
(38, 1, 'In the last 2 weeks he/she has had little interest or pleasure in doing things', 2, FALSE, NULL),
(39, 2, 'In the last 2 weeks he/she has felt down, depressed or hopeless', 2, FALSE, NULL),
(40, 3, 'Often throughout his/her life he/she has felt down, depressed or hopeless', 2, FALSE, NULL),
(41, 4, 'In the past 2 weeks he/she has found it hard to sit still', 2, FALSE, NULL),
(42, 5, 'He/she has often had periods where he/she felt so restless it was hard to sit still', 2, FALSE, NULL),
(43, 6, 'Sometimes he/she feel so upset that he/she hits or kicks something', 2, FALSE, NULL),
(44, 7, 'Sometimes he/she feels so stirred up that he/she screams', 2, FALSE, NULL),
(45, 8, 'Sometimes listening to music can bring back distressing memories to him/her', 2, FALSE, NULL),
(46, 9, 'Sometimes he/she experiences overwhelming emotions in response to music', 2, FALSE, NULL);
INSERT INTO QuestionChoice VALUES
(88, 38, 'Strongly Disagree'), (89, 38, 'Disagree'), (90, 38, 'Neither Agree Nor Disagree'), (91, 38, 'Agree'), (92, 38, 'Strongly Agree'), 
(93, 39, 'Strongly Disagree'), (94, 39, 'Disagree'), (95, 39, 'Neither Agree Nor Disagree'), (96, 39, 'Agree'), (97, 39, 'Strongly Agree'), 
(98, 40, 'Strongly Disagree'), (99, 40, 'Disagree'), (100, 40, 'Neither Agree Nor Disagree'), (101, 40, 'Agree'), (102, 40, 'Strongly Agree'), 
(103, 41, 'Strongly Disagree'), (104, 41, 'Disagree'), (105, 41, 'Neither Agree Nor Disagree'), (106, 41, 'Agree'), (107, 41, 'Strongly Agree'), 
(108, 42, 'Strongly Disagree'), (109, 42, 'Disagree'), (110, 42, 'Neither Agree Nor Disagree'), (111, 42, 'Agree'), (112, 42, 'Strongly Agree'), 
(113, 43, 'Strongly Disagree'), (114, 43, 'Disagree'), (115, 43, 'Neither Agree Nor Disagree'), (116, 43, 'Agree'), (117, 43, 'Strongly Agree'), 
(118, 44, 'Strongly Disagree'), (119, 44, 'Disagree'), (120, 44, 'Neither Agree Nor Disagree'), (121, 44, 'Agree'), (122, 44, 'Strongly Agree'), 
(123, 45, 'Strongly Disagree'), (124, 45, 'Disagree'), (125, 45, 'Neither Agree Nor Disagree'), (126, 45, 'Agree'), (127, 45, 'Strongly Agree'), 
(128, 46, 'Strongly Disagree'), (129, 46, 'Disagree'), (130, 46, 'Neither Agree Nor Disagree'), (131, 46, 'Agree'), (132, 46, 'Strongly Agree');
INSERT INTO QuestionnaireQuestion VALUES
(4, 38), (4, 39), (4, 40), (4, 41), (4, 42), (4, 43), (4, 44), (4, 45), (4, 46);

/* Appendix 2 */
INSERT INTO Questionnaire VALUES(5, 'Challeneges to Care', 1);
INSERT INTO Question VALUES
(47, 1, 'Agitation or Anxiety', 2, FALSE, NULL),
(48, 2, 'Withdrawal or Apathy', 2, FALSE, NULL),
(49, 3, 'Reduced Verbal or Social Engagement', 2, FALSE, NULL),
(50, 4, 'Resistance to Care Situations such as Showering, Dressing or Eating', 2, FALSE, NULL),
(51, 5, 'Restlessness, Wandering or Falls', 2, FALSE, NULL),
(52, 6, 'Problems Sleeping', 2, FALSE, NULL);
INSERT INTO QuestionChoice VALUES
(133, 47, 0), (134, 47, 1), (135, 47, 2), (136, 47, 3), 
(137, 48, 0), (138, 48, 1), (139, 48, 2), (140, 48, 3), 
(141, 49, 0), (142, 49, 1), (143, 49, 2), (144, 49, 3), 
(145, 50, 0), (146, 50, 1), (147, 50, 2), (148, 50, 3), 
(149, 51, 0), (150, 51, 1), (151, 51, 2), (152, 51, 3), 
(153, 52, 0), (154, 52, 1), (155, 52, 2), (156, 52, 3);
INSERT INTO QuestionnaireQuestion VALUES
(5, 47), (5, 48), (5, 49), (5, 50), (5, 51), (5, 52);

/* Appendix 3 - Patient */
INSERT INTO Questionnaire VALUES(1, 'Determining Music Preferences - Patient Version', 1);
INSERT INTO Question VALUES
(1, 1, 'How important has music been to you in your life?', 2, FALSE, NULL),
(2, 2, 'Do/did you play a musical instrument?', 2, FALSE, NULL),
(3, 2, 'If yes, please specify (e.g. piano, guitar)', 5, FALSE, 6),
(4, 2, 'If yes, how long have you been playing this instrument?', 5, FALSE, 6),
(5, 3, 'Do/did you enjoy singing?', 2, FALSE, NULL),
(6, 3, 'If yes, please specify (e.g. around-the house, in choir etc.)', 5, FALSE, 8),
(7, 4, 'Do/did you enjoy dancing?', 2, FALSE, NULL),
(8, 4, 'If yes, please specify (e.g. attended dance lessons, socials)', 5, FALSE, 10),
(9, 5, 'The following is a list of different types of music. Please indicate your 3 most favourite '
'types with 1 being the most favourite, 2 the next and 3 the third favourite.', 3, TRUE, NULL),
(10, 6, 'Do you prefer:', 2, FALSE, NULL),
(11, 7, 'Please identify as many songs as you can think of that make you feel happy.', 6, FALSE, NULL),
(12, 8, 'Please identify any specific songs that you can think of which make you find sad or distressing to listen to.', 
6, FALSE, NULL),
(13, 9, 'Please identify specific artists or performers that you enjoy listening to the most.', 6, FALSE, NULL),
(14, 10, 'Name some albums that you have in your personal music library', 6, FALSE, NULL);
INSERT INTO QuestionChoice VALUES
(1, 1, 'Very important'), (2, 1, 'Moderately important'), (3, 1, 'Slightly important'), (4, 1, 'Not important'), 
(5, 2, 'No'), (6, 2, 'Yes'), 
(7, 5, 'No'), (8, 5, 'Yes'), 
(9, 7, 'No'), (10, 7, 'Yes'),
(11, 9, 'Country and Western'), (12, 9, 'Classical'), (13, 9, 'Spiritual/Religious'), 
(14, 9, 'Big Band/Swing'), (15, 9, 'Folk'), (16, 9, 'Blues'), (17, 9, 'Rock and Roll'), 
(18, 9, 'Easy Listening'),
(19, 10, 'Vocal'), (20, 10, 'Instrumental'), (21, 10, 'Both');
INSERT INTO QuestionnaireQuestion VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7), (1, 8), (1, 9), (1, 10), (1, 11), (1, 12), (1, 13), (1, 14);

/* Appendix 3 - Carer */
INSERT INTO Questionnaire VALUES(2, 'Determining Music Preferences - Family/Caregiver Version', 1);
INSERT INTO Question VALUES
(15, 1, 'How important has music been in his/her life?', 2, FALSE, NULL),
(16, 2, 'Does/did he/she a musical instrument?', 2, FALSE, NULL),
(17, 2, 'If yes, please specify (e.g. piano, guitar)', 5, FALSE, 27),
(18, 2, 'If yes, how long have they been playing this instrument?', 5, FALSE, 27),
(19, 3, 'Does/did he/she enjoy singing?', 2, FALSE, NULL),
(20, 3, 'If yes, please specify (e.g. around-the house, in choir etc.)', 5, FALSE, 29),
(21, 4, 'Does/did he/she you enjoy dancing?', 2, FALSE, NULL),
(22, 4, 'If yes, please specify (e.g. attended dance lessons, socials)', 5, FALSE, 31),
(23, 5, "The following is a list of different types of music. Please indicate the individual's 3 "
'most favourite types with 1 being the most favourite, 2 the next and 3 the third favourite.', 
3, TRUE, NULL),
(24, 6, 'Does the individual prefer:', 2, FALSE, NULL),
(25, 7, 'Please identify as many songs as you can think of that makes the individual feel happy, or'
' that might be connected with happy memories.', 6, FALSE, NULL),
(26, 8, 'Please identify any specific songs that you can think of which might make the individual '
'feel sad or that could be associated with distressing memories.', 6, FALSE, NULL),
(27, 9, 'Please identify specific artists or performers that the individual most enjoys listening to.', 
6, FALSE, NULL),
(28, 10, 'Name some albums that the individual has in his/her personal music library', 6, FALSE, NULL);
INSERT INTO QuestionChoice VALUES
(22, 15, 'Very important'), (23, 15, 'Moderately important'), (24, 15, 'Slightly important'), (25, 15, 'Not important'), 
(26, 16, 'No'), (27, 16, 'Yes'), 
(28, 19, 'No'), (29, 19, 'Yes'), 
(30, 21, 'No'), (31, 21, 'Yes'),
(32, 23, 'Country and Western'), (33, 23, 'Classical'), (34, 23, 'Spiritual/Religious'), 
(35, 23, 'Big Band/Swing'), (36, 23, 'Folk'), (37, 23, 'Blues'), (38, 23, 'Rock and Roll'), 
(39, 23, 'Easy Listening'),
(40, 24, 'Vocal'), (41, 24, 'Instrumental'), (42, 24, 'Both');
INSERT INTO QuestionnaireQuestion VALUES
(2, 15), (2, 16), (2, 17), (2, 18), (2, 19), (2, 20), (2, 21), (2, 22), (2, 23), (2, 24), (2, 25),
(2, 26), (2, 27), (2, 28);

/* MMSE Entry */
INSERT INTO Questionnaire VALUES(6, 'MMSE Score', 1);
INSERT INTO Question VALUES
(53, 1, 'Please enter the patients MMSE score', 5, FALSE, NULL);
INSERT INTO QuestionnaireQuestion VALUES
(6, 53);

INSERT INTO Song(id, name, artist, link, tempo, modeID, genreID, length, year, lyricID) VALUES
(1, "Mexicali Rose", "Johnny Bond", "https://youtube.com/watch?v=MCMw9gaYUz8", 110, 1, 1, 168, 1940, 1),
(2, "Wild Side of Life", "Hank Thompson", "https://youtube.com/watch?v=OPvARPfquPc", 116, 1, 1, 165, 1940, 1),
(3, "Smoke On the Water", "Red Foley", "https://youtube.com/watch?v=PLSmj9G0cE0", 111, 1, 1, 164, 1940, 1),
(4, "When My Blue Moon Turns to Gold Again", "Walker & Sullivan", "https://youtube.com/watch?v=skiYWynD2o4", 79, 1, 1, 155, 1940, 2),
(5, "Blueberry Hill", "Gene Autry", "https://youtube.com/watch?v=tdJSBtuS0oc", 106, 2, 1, 157, 1940, 2),
(6, "Bouquet of Roses", "Eddy Arnold", "https://youtube.com/watch?v=7qECR90Qpa8", 68, 1, 1, 153, 1940, 2),
(7, "The Song from Moulin Rouge", "Andy Williams", "https://youtube.com/watch?v=If_mCEoV0Cc", 95, 1, 1, 143, 1950, 2),
(8, "Tennessee Waltz", "Patti Page", "https://youtube.com/watch?v=-XCvfy6Huyc", 87, 2, 1, 185, 1950, 2),
(9, "The Rains Came", "Freddy Fender", "https://youtube.com/watch?v=WAL5ebTrUJk", 116, 1, 1, 136, 1960, 2),
(10, "Lay Lady Lay", "Bob Dylan", "https://youtube.com/watch?v=LhzEsb2tNbI", 80, 1, 1, 197, 1960, 1),
(11, "A Single Girl", "Sandy Posey", "https://youtube.com/watch?v=3KD8gptsQJA", 109, 1, 1, 144, 1960, 2),
(12, "Back in the Arms of Love", "The Spinners", "https://youtube.com/watch?v=uNOyh4yUG88", 104, 1, 1, 231, 1960, 1),
(13, "You Are My Sunshine", "Elizabeth Mitchell", "https://youtube.com/watch?v=1moWxHdTkT0", 92, 1, 1, 169, 1960, 1),
(14, "You Were Always On My Mind", "Willie Nelson", "https://youtube.com/watch?v=R7f189Z0v0Y", 72, 2, 1, 216, 1970, 2),
(15, "Country Roads", "John Denver", "https://youtube.com/watch?v=1vrEljMfXYo", 84, 1, 1, 198, 1970, 1),
(16, "Fire On the Mountain", "Marshall Tucker Band", "https://youtube.com/watch?v=0uMWbZj-gWg", 102, 1, 1, 236, 1970, 2),
(17, "If You Were the Only Girl in the World", "Dick Haymes", "https://youtube.com/watch?v=LCUyMho744g", 85, 1, 2, 173, 1940, 1),
(18, "White Christmas", "Bing Crosby", "https://youtube.com/watch?v=w9QLn7gM-hY", 104, 2, 2, 177, 1940, 1),
(19, "Danny Boy", "Various", "https://youtube.com/watch?v=cvUrB-MIxm8", 80, 2, 2, 212, 1940, 2),
(20, "When I Grow Too Old to Dream", "Foster & Allen", "https://youtube.com/watch?v=7h8fHZFlxSE", 116, 1, 2, 141, 1940, 1),
(21, "Lily Marlene", "Marlene Dietrich", NULL, 104, 1, 2, 204, 1940, 1),
(22, "In the Wee Small Hours of the Morning", "Frank Sinatra", NULL, 69, 1, 2, 179, 1940, 2),
(23, "White Cliffs of Dover", "Vera Lynn", NULL, 83, 1, 2, 183, 1940, 1),
(24, "I'll Be Seeing You", "Billie Holiday", NULL, 64, 2, 2, 211, 1940, 2),
(25, "Don't Worry ‘Bout Me", "Billie Holiday", NULL, 64, 1, 2, 191, 1940, 1),
(26, "Something Stupid", "Frank Sinatra, Nancy Sinatra", NULL, 108, 1, 2, 158, 1960, 1),
(27, "Magic Moments", "Perry Como", NULL, 108, 1, 2, 159, 1950, 1),
(28, "Just An Old Fashioned Girl", "Eartha Kitt", NULL, 120, 1, 2, 171, 1950, 1),
(29, "Let's Do It (Let's Fall In Love)", "Ella Fitzgerald", NULL, 80, 1, 2, 215, 1950, 1),
(30, "Catch a Falling Star", "Perry Como", NULL, 124, 1, 2, 150, 1950, 1),
(31, "Day-O (Banana Boat Song)", "Harry Belafonte", NULL, 120, 1, 2, 186, 1950, 1),
(32, "Rose Marie", "Slim Whitman", NULL, 136, 1, 2, 143, 1950, 1),
(33, "Perhaps, Perhaps, Perhaps", "Doris Day", NULL, 108, 1, 2, 163, 1950, 2),
(34, "You Belong to Me", "Jo Stafford", NULL, 76, 1, 2, 198, 1950, 1),
(35, "Little Things Mean A Lot", "Kitty Kallen", NULL, 84, 1, 2, 180, 1950, 1),
(36, "Volare", "Dean Martin", NULL, 124, 1, 2, 182, 1950, 1),
(37, "I'll Be Home", "The Flamingos", NULL, 84, 1, 2, 174, 1950, 1),
(38, "Que Sera Ser", "Doris Day", NULL, 60, 1, 2, 152, 1950, 1),
(39, "Unchained Melody", "Righteous Brothers", NULL, 72, 1, 2, 217, 1950, 2),
(40, "Secret Love", "Doris Day", NULL, 76, 1, 2, 217, 1950, 1),
(41, "Because You're Mine", "Mario Lanzo", NULL, 40, 1, 2, 210, 1950, 1),
(42, "Edelweiss", "Rogers & Hammerstein", NULL, 108, 1, 2, 103, 1950, 1),
(43, "Oh Donna", "Ritchie Valens", NULL, 68, 1, 2, 178, 1950, 1),
(44, "Unforgettable", "Nat King Cole", NULL, 68, 1, 2, 151, 1950, 1),
(45, "Hello Young Lovers", "Frank Sinatra", NULL, 60, 1, 2, 225, 1950, 1),
(46, "You Made Me Love You", "Dean Martin", NULL, 84, 1, 2, 201, 1950, 1),
(47, "Juliet", "The Four Pennies", NULL, 70, 1, 2, 143, 1960, 1),
(48, "Wonderful Land", "The Shadows", NULL, 136, 1, 2, 128, 1960, 2),
(49, "Little Egypt", "Elvis Presley", NULL, 124, 1, 2, 138, 1960, 1),
(50, "Moon River", "Andy Williams", NULL, 68, 2, 2, 164, 1960, 2),
(51, "Roses are Red", "Bobby Vinton", NULL, 108, 1, 2, 158, 1960, 1),
(52, "Wishin' and Hopin'", "Dusty Springfield", NULL, 108, 1, 2, 177, 1960, 1),
(53, "Stranger on the Shore", "The Ventures", NULL, 116, 1, 2, 151, 1960, 2),
(54, "Tell Laura I Love Her", "Ricky Valance", NULL, 116, 1, 2, 160, 1960, 1),
(55, "It's Only Make Believe", "Conway Twitty", NULL, 80, 1, 2, 155, 1960, 2),
(56, "Calendar Girl", "Neil Sedaka", NULL, 124, 1, 2, 162, 1960, 1),
(57, "The Pink Panther", "Henry Mancini", NULL, 128, 1, 2, 158, 1960, 2),
(58, "The Lonely Surfer", "Jack Nitzsche", NULL, 104, 1, 2, 154, 1960, 2),
(59, "These Arms of Mine", "Otis Redding", NULL, 60, 1, 2, 153, 1960, 1),
(60, "Walking the Dog", "Rufus Thomas", NULL, 116, 1, 2, 158, 1960, 1),
(61, "Hi-Heel Sneakers", "Tommy Tucker", NULL, 84, 1, 2, 243, 1960, 1),
(62, "Save the Last Dance for Me", "The Drifters", NULL, 76, 1, 2, 149, 1960, 1),
(63, "Baby Elephant Walk", "Henry Mancini", NULL, 60, 1, 2, 161, 1960, 2),
(64, "If I Were A Rich Man", "Jerry Bock", NULL, 72, 1, 2, 307, 1960, 1),
(65, "Little Wing", "Jimi Hendrix", NULL, 68, 1, 2, 146, 1960, 2),
(66, "Hey Jude", "Beatles", NULL, 72, 1, 2, 490, 1960, 1),
(67, "West Side Story Medley", "Leonard Bernstein", NULL, 88, 1, 2, 285, 1960, 1),
(68, "Daisy, Daisy (Bicycle Built for Two)", "Nat King Cole", NULL, 68, 1, 2, 105, 1960, 1),
(69, "And I Love Her", "The Beatles", NULL, 60, 1, 2, 149, 1960, 1),
(70, "True Blue", "John Williamson", NULL, 56, 1, 2, 246, 1970, 1),
(71, "I Will Always Love You", "Dolly Parton", NULL, 68, 1, 2, 199, 1970, 1),
(72, "Stand By Your Man", "Tammy Wynette", NULL, 56, 1, 2, 133, 1970, 1),
(73, "Help Me Make it Through the Night", "Kris Kristofferson", NULL, 88, 1, 2, 245, 1970, 2),
(74, "Satin Sheets", "Jeanne Pruett", NULL, 56, 1, 2, 183, 1970, 2),
(75, "You Wear It Well", "Rod Stewart", NULL, 136, 1, 2, 259, 1970, 2),
(76, "The Entertainer", "Marvin Hamlisch", NULL, 80, 1, 2, 180, 1970, 2),
(77, "Your Love Has Lifted Me Higher", "Rita Coolidge", NULL, 124, 1, 2, 266, 1970, 1),
(78, "At Seventeen", "Janis Ian", NULL, 64, 1, 2, 299, 1970, 2),
(79, "Send in the Clowns", "Barbara Streisand", NULL, 44, 1, 2, 277, 1970, 2),
(80, "Cavatina", "Stanley Myers", NULL, 60, 2, 2, 261, 1970, 2),
(81, "I Can't Tell You Why", "The Eagles", NULL, 92, 2, 2, 295, 1970, 2),
(82, "I Honestly Love You", "Olivia Newton John", NULL, 76, 1, 2, 220, 1970, 1),
(83, "Puppy Love", "Paul Anka", NULL, 72, 1, 2, 163, 1970, 1),
(84, "You're a Lady", "Peter Skellern", NULL, 92, 1, 2, 275, 1970, 1),
(85, "Tonight's the Night", "Rod Stewart", NULL, 96, 1, 2, 240, 1970, 1),
(86, "How Deep Is Your Love", "Bee Gees", NULL, 108, 2, 2, 238, 1970, 1),
(87, "Vincent", "Don Maclean", NULL, 54, 1, 2, 238, 1970, 2),
(88, "From Little Things Big Thing Grow", "Paul Kelly", NULL, 60, 1, 2, 412, 1970, 1),
(89, "The Foggy, Foggy Dew", "N/A", NULL, 80, 2, 3, 150, NULL, 2),
(90, "Waly Waly (The Water Is Wide)", "N/A", NULL, 80, 2, 3, 212, NULL, 2),
(91, "Nottamun Town", "N/A", NULL, 80, 1, 3, 220, NULL, 1),
(92, "Reyardine", "N/A", NULL, 80, 1, 3, 152, NULL, 1),
(93, "Marble Halls", "N/A", NULL, 80, 1, 3, 235, NULL, 1),
(94, "Sweet Polly Oliver", "N/A", NULL, 80, 1, 3, 139, NULL, 1),
(95, "The Minstrel Boy", "N/A", NULL, 80, 1, 3, 341, NULL, 2),
(96, "The Lincolnshire Poacher", "N/A", NULL, 80, 1, 3, 125, NULL, 1),
(97, "Tom Bowling", "N/A", NULL, 80, 1, 3, 272, NULL, 1),
(98, "Boll Weevil Holler", "Vera Holler", NULL, 76, 1, 3, 123, 1960, 1),
(99, "Bridge Over Troubled Water", "Simon & Garfunkel", NULL, 88, 1, 3, 292, 1960, 1),
(100, "We'll Sing in the Sunshine", "Gale Garnett", NULL, 107, 1, 3, 179, 1960, 1),
(101, "Proud Maisie", "Davy Graham & Shirley Collins", NULL, 68, 1, 3, 244, 1960, 1),
(102, "The Carnival is Over", "The Seekers", NULL, 76, 1, 3, 193, 1960, 2),
(103, "Dress Rehearsal Rag", "Leonard Cohen", NULL, 94, 1, 3, 366, 1960, 2),
(104, "You'll Never Walk Alone", "Gerry and the Pacemakers", NULL, 76, 1, 2, 168, 1960, 1),
(105, "All Kinds of Everything", "Dana Scallon", NULL, 100, 1, 3, 185, 1970, 1),
(106, "Honeysuckle Rose", "Fats Waller", NULL, 156, 1, 4, 158, 1940, 1),
(107, "Blues in the Night", "Ella Fitzgerald", NULL, 80, 1, 4, 431, 1940, 2),
(108, "Memories of You", "Benny Goodman", NULL, 86, 1, 4, 200, 1940, 2),
(109, "Ain't Misbehavin", "Fats Waller", NULL, 98, 1, 4, 238, 1940, 1),
(110, "Bop, Look and Listen", "George Shearing Quintet", NULL, 116, 1, 4, 177, 1950, 2),
(111, "Ev'ry Time We Say Goodbye", "Ella Fitzgerald", NULL, 80, 1, 4, 214, 1950, 1),
(112, "I Get Along Without You Very Well", "Chet Baker", NULL, 103, 1, 4, 180, 1950, 1),
(113, "Blue in Green", "Miles Davis", NULL, 76, 1, 4, 338, 1950, 2),
(114, "The Girl From Ipanema", "Carlos Jobim", NULL, 136, 1, 4, 322, 1960, 2),
(115, "Thunder Walk", "George Benson", NULL, 124, 1, 4, 282, 1960, 2),
(116, "Can't Help Lovin' Dat Man", "Ava Gardner", NULL, 80, 1, 4, 203, 1960, 1),
(117, "Try Me", "James Brown", NULL, 72, 1, 4, 153, 1960, 1),
(118, "Non, Je Ne Regrette Rien", "Edith Piaf", NULL, 92, 1, 4, 142, 1960, 1),
(119, "Is that All There Is?", "Peggy Lee", NULL, 108, 1, 4, 262, 1960, 1),
(120, "All That Jazz", "Ralph Burns", NULL, 124, 1, 4, 91, 1970, 2),
(121, "How Great Thou Art", "N/A", NULL, 80, 2, 5, 294, NULL, 1),
(122, "Come You Not From Newcastle", "N/A", NULL, 80, 1, 5, 188, NULL, 1),
(123, "Just A Closer Walk With Thee", "N/A", NULL, 80, 1, 5, 188, NULL, 1),
(124, "Swing Low, Sweet Chariot", "N/A", NULL, 80, 1, 5, 190, NULL, 1),
(125, "Deep River", "N/A", NULL, 80, 2, 5, 142, NULL, 2),
(126, "Great Is Thy Faithfulness", "N/A", NULL, 80, 2, 5, 280, NULL, 1),
(127, "A Mighty Fortress is Our God", "N/A", NULL, 80, 1, 5, 229, NULL, 1),
(128, "Onward Christian Soldiers", "N/A", NULL, 80, 1, 5, 208, NULL, 1),
(129, "All Things Bright and Beautiful", "N/A", NULL, 80, 1, 5, 161, NULL, 1),
(130, "Let All Mortal Flesh Keep Silent", "N/A", NULL, 80, 2, 5, 175, NULL, 1),
(131, "Nearer to God, To Thee", "N/A", NULL, 80, 1, 5, 206, NULL, 1),
(132, "Jerusalem", "N/A", NULL, 80, 1, 5, 301, NULL, 1),
(133, "Arioso, from Cantata BWV 156", "J. S. Bach", NULL, 80, 1, 6, 144, NULL, 2),
(134, "Adagio in G Minor", "Albinoni", NULL, 80, 1, 6, 491, NULL, 2),
(135, "Gymnopedie", "Satie", NULL, 80, 1, 6, 216, NULL, 2),
(136, "Nimrod, from Enigma Variations", "Elgar", NULL, 80, 1, 6, 234, NULL, 2),
(137, "Canon in D", "Pachelbel", NULL, 80, 1, 6, 371, NULL, 2),
(138, "Meditation from Thais", "Massenet", NULL, 80, 1, 6, 345, NULL, 2),
(139, "Mio Babbino Caro", "Puccini", NULL, 80, 1, 6, 202, NULL, 2),
(140, "On the Beautiful Blue Danube", "Strauss", NULL, 80, 1, 6, 606, NULL, 2),
(141, "Ave Verum Corpus, K618", "Mozart", NULL, 80, 1, 6, 173, NULL, 1),
(142, "Jesu, Joy of Man's Desiring", "J. S. Bach", NULL, 80, 1, 6, 234, NULL, 2),
(143, "Sheep May Safely Graze", "J. S. Bach", NULL, 80, 1, 6, 277, NULL, 2),
(144, "String Quartet in F", "Hoffstetter", NULL, 80, 1, 6, 237, NULL, 2),
(145, "Magnificat, Gloria Patri", "J. S. Bach", NULL, 80, 1, 6, 143, NULL, 1),
(146, "Nessun Dorma", "Puccini", NULL, 80, 2, 6, 180, NULL, 2),
(147, "Ave Maria", "Caccini", NULL, 80, 2, 6, 255, NULL, 1),
(148, "Clarinet Concerto", "Mozart", NULL, 80, 1, 6, 1783, NULL, 2),
(149, "Air on the G string", "J. S. Bach", NULL, 80, 1, 6, 259, NULL, 2),
(150, "Nocturne in E flat major, Opus 9, No. 2", "Chopin", NULL, 80, 1, 6, 297, NULL, 2),
(151, "Piano Concerto No. 21 , Andante", "Mozart", NULL, 80, 1, 6, 352, NULL, 2),
(152, "Cello Suite No 1, 1st movement", "J. S. Bach", NULL, 80, 1, 6, 195, NULL, 2),
(153, "Peer Gynt Suite No 1., Morning Mood", "Edvard Grieg", NULL, 80, 1, 6, 370, NULL, 2),
(154, "Dance of the Swans", "Tchiakovsky", NULL, 80, 1, 6, 195, NULL, 2),
(155, "Rhapsody on a Theme of Paganini", "Rachmaninoff", NULL, 80, 1, 6, 212, NULL, 2),
(156, "Minuet, from Quintet in E major", "Boccherini", NULL, 80, 1, 6, 238, NULL, 2),
(157, "Claire de Lune", "Debussy", NULL, 80, 2, 6, 302, NULL, 2),
(158, "Be Thou But Near", "J. S. Bach", NULL, 80, 1, 6, 156, NULL, 2),
(159, "Trumpet Concerto in D", "Telemann", NULL, 80, 1, 6, 455, NULL, 2);

INSERT INTO SongTag(songID, tagID) VALUES
(1, 3), (1, 4), 
(2, 3), (2, 4), 
(3, 3), (3, 4), 
(4, 2), (4, 4), 
(5, 3), (5, 4), 
(6, 2), (6, 4), 
(7, 3), (7, 4), 
(8, 3), (8, 4), 
(9, 3), (9, 4), 
(10, 2), (10, 3), (10, 4), 
(11, 3), (11, 4), 
(12, 3), (12, 4), 
(13, 3), (13, 4), 
(14, 2), (14, 4), 
(15, 3), (15, 4), 
(16, 3), (16, 4), 
(17, 3), (17, 4), 
(18, 3), (18, 4), 
(19, 2), (19, 3), (19, 4), 
(20, 3), (20, 4), 
(21, 3), (21, 4), 
(22, 2), (22, 4), 
(23, 3), (23, 4), 
(24, 2), (24, 4), 
(25, 2), (25, 4), 
(26, 3), (26, 4), 
(27, 3), (27, 4), 
(28, 3), (28, 4), 
(29, 2), (29, 3), (29, 4), 
(30, 3), 
(31, 3), (31, 4), 
(32, 3), 
(33, 3), (33, 4), 
(34, 2), (34, 4), 
(35, 3), (35, 4), 
(36, 3), 
(37, 3), (37, 4), 
(38, 1), (38, 2), (38, 4), 
(39, 2), (39, 4), 
(40, 2), (40, 4), 
(41, 1), (41, 2), (41, 4), 
(42, 3), (42, 4), 
(43, 2), (43, 4), 
(44, 2), (44, 4), 
(45, 1), (45, 2), (45, 4), 
(46, 3), (46, 4), 
(47, 2), (47, 4), 
(48, 3), 
(49, 3), 
(50, 2), (50, 4), 
(51, 3), (51, 4), 
(52, 3), (52, 4), 
(53, 3), (53, 4), 
(54, 3), (54, 4), 
(55, 2), (55, 3), (55, 4), 
(56, 3), 
(57, 3), 
(58, 3), (58, 4), 
(59, 1), (59, 2), (59, 4), 
(60, 3), (60, 4), 
(61, 3), (61, 4), 
(62, 2), (62, 4), 
(63, 1), (63, 2), (63, 4), 
(64, 2), (64, 4), 
(65, 2), (65, 4), 
(66, 2), (66, 4), 
(67, 3), (67, 4), 
(68, 2), (68, 4), 
(69, 1), (69, 2), (69, 4), 
(70, 1), (70, 2), (70, 4), 
(71, 2), (71, 4), 
(72, 1), (72, 2), (72, 4), 
(73, 3), (73, 4), 
(74, 1), (74, 2), (74, 4), 
(75, 3), 
(76, 2), (76, 3), (76, 4), 
(77, 3), 
(78, 2), (78, 4), 
(79, 1), (79, 2), (79, 4), 
(80, 1), (80, 2), (80, 4), 
(81, 3), (81, 4), 
(82, 2), (82, 4), 
(83, 2), (83, 4), 
(84, 3), (84, 4), 
(85, 3), (85, 4), 
(86, 3), (86, 4), 
(87, 1), (87, 2), (87, 4), 
(88, 1), (88, 2), (88, 4), 
(89, 2), (89, 3), (89, 4), 
(90, 2), (90, 3), (90, 4), 
(91, 2), (91, 3), (91, 4), 
(92, 2), (92, 3), (92, 4), 
(93, 2), (93, 3), (93, 4), 
(94, 2), (94, 3), (94, 4), 
(95, 2), (95, 3), (95, 4), 
(96, 2), (96, 3), (96, 4), 
(97, 2), (97, 3), (97, 4), 
(98, 2), (98, 4), 
(99, 3), (99, 4), 
(100, 3), (100, 4), 
(101, 2), (101, 4), 
(102, 2), (102, 4), 
(103, 3), (103, 4), 
(104, 2), (104, 4), 
(105, 3), (105, 4), 
(106, 3), 
(107, 2), (107, 3), (107, 4), 
(108, 3), (108, 4), 
(109, 3), (109, 4), 
(110, 3), (110, 4), 
(111, 2), (111, 3), (111, 4), 
(112, 3), (112, 4), 
(113, 2), (113, 4), 
(114, 3), 
(115, 3), 
(116, 2), (116, 3), (116, 4), 
(117, 2), (117, 4), 
(118, 3), (118, 4), 
(119, 3), (119, 4), 
(120, 3), 
(121, 2), (121, 3), (121, 4), 
(122, 2), (122, 3), (122, 4), 
(123, 2), (123, 3), (123, 4), 
(124, 2), (124, 3), (124, 4), 
(125, 2), (125, 3), (125, 4), 
(126, 2), (126, 3), (126, 4), 
(127, 2), (127, 3), (127, 4), 
(128, 2), (128, 3), (128, 4), 
(129, 2), (129, 3), (129, 4), 
(130, 2), (130, 3), (130, 4), 
(131, 2), (131, 3), (131, 4), 
(132, 2), (132, 3), (132, 4), 
(133, 2), (133, 3), (133, 4), 
(134, 2), (134, 3), (134, 4), 
(135, 2), (135, 3), (135, 4), 
(136, 2), (136, 3), (136, 4), 
(137, 2), (137, 3), (137, 4), 
(138, 2), (138, 3), (138, 4), 
(139, 2), (139, 3), (139, 4), 
(140, 2), (140, 3), (140, 4), 
(141, 2), (141, 3), (141, 4), 
(142, 2), (142, 3), (142, 4), 
(143, 2), (143, 3), (143, 4), 
(144, 2), (144, 3), (144, 4), 
(145, 2), (145, 3), (145, 4), 
(146, 2), (146, 3), (146, 4), 
(147, 2), (147, 3), (147, 4), 
(148, 2), (148, 3), (148, 4), 
(149, 2), (149, 3), (149, 4), 
(150, 2), (150, 3), (150, 4), 
(151, 2), (151, 3), (151, 4), 
(152, 2), (152, 3), (152, 4), 
(153, 2), (153, 3), (153, 4), 
(154, 2), (154, 3), (154, 4), 
(155, 2), (155, 3), (155, 4), 
(156, 2), (156, 3), (156, 4), 
(157, 2), (157, 3), (157, 4), 
(158, 2), (158, 3), (158, 4), 
(159, 2), (159, 3), (159, 4);

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

/* Challenges to Care */
INSERT INTO QuestionAnswer(id, questionID, str) VALUES
(1, 47, '1'), (2, 47, '2'), (3, 47, '3'),
(4, 48, '1'), (5, 48, '2'), (6, 48, '3'),
(7, 49, '1'), (8, 49, '2'), (9, 49, '3'),
(10, 50, '1'), (11, 50, '2'), (12, 50, '3'),
(13, 51, '1'), (14, 51, '2'), (15, 51, '3'),
(16, 52, '1'), (17, 52, '2'), (18, 52, '3');
INSERT INTO QuestionAnswerTag(questionAnswerID, tagID) VALUES
(1, 2), (2, 2), (3, 2),
(4, 3), (4, 4), (5, 3), (5, 4), (6, 3), (6, 4),
(7, 4), (8, 4), (9, 4),
(10, 4), (11, 4), (12, 4),
(13, 2), (14, 2), (15, 2),
(16, 1), (17, 1), (18, 1);