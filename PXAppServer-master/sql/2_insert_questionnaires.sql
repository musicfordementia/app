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