import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { User } from './user';
import { Question } from './question';
import { Questionnaire } from './questionnaire';
import { Song } from './song';
import { QuestionnaireAnswers, AnswerTag } from './questionnaire-answers';
import { Tag } from './tag';
import { Playlist } from './playlist';
import { PXResponse } from './pxresponse';
import { QuestionAnswer } from './question-answer';
import { PlaylistRule } from './playlist-rule';
import { SongRating } from './song-rating';
import { ListeningDiary } from './listening-diary';
import { UsagePlan } from './usage-plan';

@Injectable({
    providedIn: 'root'
})
// TODO: Return an array of objects rather than an array of any for some API calls (getChoiceTypes, getSongModes, etc.).
export class ApiService {
	API_URL = '/api/admin/';

	constructor(private http: HttpClient) { }

	isSignedIn(): boolean {
		return this.getToken() != null;
	}

	getToken(): string {
		return localStorage.getItem('token');
	}

	signin(username: string, password: string): Observable<PXResponse> {
		return this.http.post(`${this.API_URL}signin`, { username: username, password: password })
						.pipe(map(res => {
							// Save the token.
							if (res['success']) {
								localStorage.setItem('token', res['token']);
							}

							return new PXResponse(res['success'], res['message']);
						}));
	}

	signout() {
		localStorage.removeItem('token');
	}

	getAllUsers(): Observable<User[]> {
		return this.http.get(`${this.API_URL}users`).pipe(
			map(res => res['users'])
		);
	}

	getUser(id: number): Observable<User> {
		return this.http.get(`${this.API_URL}users/${id}`).pipe(
			map(res => res['user'])
		);
	}

	getUserTypes(): Observable<[]> {
		return this.http.get(`${this.API_URL}users/types`).pipe(
			map(res => res['types'])
		);
	}

	addUser(user: User): Observable<PXResponse> {
		return this.http.post(`${this.API_URL}users/add`, user).pipe(
			map(this.mapPXResponse)
		);
	}

	updateUser(user: User): Observable<PXResponse> {
		return this.http.post(`${this.API_URL}users/${user.id}/update`, user).pipe(
			map(this.mapPXResponse)
		);
	}

	updatePassword(id: number, password: string): Observable<PXResponse> {
		return this.http.post(
			`${this.API_URL}users/${id}/password/update`, 
			{ password: password }
		).pipe(map(this.mapPXResponse));
	}

	getUserAnswers(userID: number): Observable<QuestionnaireAnswers[]> {
		return this.http.get(`${this.API_URL}users/${userID}/answers`).pipe(
			map(res => res['answers'])
		);
	}

	updateUserAnswerTags(userID: number, answerID: number, tags: AnswerTag[]): Observable<PXResponse> {
		return this.http.post(
			`${this.API_URL}users/${userID}/answers/${answerID}/update-tags`, 
			{ tags: tags }
		).pipe(map(this.mapPXResponse));
	}

	getAllQuestionnaires(): Observable<Questionnaire[]> {
		return this.http.get(`${this.API_URL}questionnaires`).pipe(
			map(res => res['questionnaires'])
		);
	}

	getQuestionnaireTypes(): Observable<[]> {
		return this.http.get(`${this.API_URL}questionnaires/types`).pipe(
			map(res => res['types'])
		);
	}

	getQuestionnaire(id: number): Observable<Questionnaire> {
		return this.http.get(`${this.API_URL}questionnaires/${id}`).pipe(
			map(res => res['questionnaire'])
		);
	}

	addQuestionnaire(questionnaire: Questionnaire): Observable<PXResponse> {
		return this.http.post(`${this.API_URL}questionnaires/add`, questionnaire).pipe(
			map(this.mapPXResponse)
		);
	}

	// Only name and type.
	updateQuestionnaire(q: Questionnaire): Observable<PXResponse> {
		return this.http.post(`${this.API_URL}/questionnaires/${q.id}/update`, q).pipe(
			map(this.mapPXResponse)
		);
	}

	getAllQuestions(): Observable<Question[]> {
		return this.http.get(`${this.API_URL}questions`).pipe(
			map(res => res['questions'])
		);
	}

	getQuestion(id: number): Observable<Question> {
		return this.http.get(`${this.API_URL}questions/${id}`).pipe(
			map(res => res['question'])
		);
	}

	updateQuestion(question: Question): Observable<PXResponse> {
		return this.http.post(`${this.API_URL}questions/${question.id}/update`, question).pipe(
			map(this.mapPXResponse)
		);
	}

	getChoices(questionnaireID: number): Observable<[]> {
		return this.http.get(`${this.API_URL}questionnaires/${questionnaireID}/choices`).pipe(
			map(res => res['choices'])
		);
	}

	getChoiceTypes(): Observable<[]> {
		return this.http.get(`${this.API_URL}questions/choicetypes`).pipe(
			map(res => res['choiceTypes'])
		);
	}

	getAllSongs(): Observable<Song[]> {
		return this.http.get(`${this.API_URL}songs`).pipe(
			map(res => res['songs'])
		);
	}

	getSongModes(): Observable<[]> {
		return this.http.get(`${this.API_URL}songs/modes`).pipe(
			map(res => res['modes'])
		);
	}

	getSongGenres(): Observable<[]> {
		return this.http.get(`${this.API_URL}songs/genres`).pipe(
			map(res => res['genres'])
		);
	}

	getSongLyrics(): Observable<[]> {
		return this.http.get(`${this.API_URL}songs/lyrics`).pipe(
			map(res => res['lyrics'])
		);
	}

	addSong(song: Song): Observable<PXResponse> {
		return this.http.post(`${this.API_URL}songs/add`, song).pipe(
			map(this.mapPXResponse)
		);
	}

	updateSong(song: Song): Observable<PXResponse> {
		return this.http.post(`${this.API_URL}songs/${song.id}/update`, song).pipe(
			map(this.mapPXResponse)
		);
	}

	getSong(id: number): Observable<Song> {
		return this.http.get(`${this.API_URL}songs/${id}`).pipe(
			map(res => res['song'])
		);
	}

	getAllTags(): Observable<Tag[]> {
		return this.http.get(`${this.API_URL}tags`).pipe(
			map(res => res['tags'])
		);
	}

	updateTag(tag: Tag): Observable<PXResponse> {
		return this.http.post(`${this.API_URL}tags/${tag.id}/update`, tag).pipe(
			map(this.mapPXResponse)
		);
	}

	addTag(tag: Tag): Observable<PXResponse> {
		return this.http.post(`${this.API_URL}tags/add`, tag).pipe(
			map(this.mapPXResponse)
		);
	}

	getAllPlaylists(): Observable<Playlist[]> {
		return this.http.get(`${this.API_URL}playlists`).pipe(
			map(res => res['playlists'])
		);
	}

	getPlaylist(id: number): Observable<Playlist> {
		return this.http.get(`${this.API_URL}playlists/${id}`).pipe(
			map(res => res['playlist']),
		);
	}

	getUserPlaylists(userID: number): Observable<Playlist[]> {
		return this.http.get(`${this.API_URL}users/${userID}/playlists`).pipe(
			map(res => res['playlists']),
		);
	}

	addUserPlaylist(userID: number, playlistID: number): Observable<PXResponse> {
		return this.http.post(
			`${this.API_URL}users/${userID}/playlists/add`, 
			{ playlistID: playlistID }
		).pipe(map(this.mapPXResponse));
	}

	deleteUserPlaylist(userID: number, playlistID: number): Observable<PXResponse> {
		return this.http.post(`${this.API_URL}users/${userID}/playlists/${playlistID}/delete`, null)
						.pipe(map(this.mapPXResponse));
	}

	addPlaylist(playlist: Playlist): Observable<PXResponse> {
		return this.http.post(`${this.API_URL}playlists/add`, playlist).pipe(
			map(this.mapPXResponse)
		);
	}

	updatePlaylist(playlist: Playlist): Observable<PXResponse> {
		return this.http.post(`${this.API_URL}playlists/${playlist.id}/update`, playlist).pipe(
			map(this.mapPXResponse)
		);
	}

	getAllQuestionAnswerRules(): Observable<QuestionAnswer[]> {
		return this.http.get(`${this.API_URL}rules/question-answers`).pipe(
			map(res => res['rules'])
		);
	}

	getQuestionAnswerRule(id: number): Observable<QuestionAnswer> {
		return this.http.get(`${this.API_URL}rules/question-answers/${id}`).pipe(
			map(res => res['rule'])
		);
	}

	addQuestionAnswerRule(qa: QuestionAnswer): Observable<PXResponse> {
		return this.http.post(`${this.API_URL}rules/question-answers/add`, qa).pipe(
			map(this.mapPXResponse)
		);
	}

	updateQuestionAnswerRule(qa: QuestionAnswer): Observable<PXResponse> {
		return this.http.post(`${this.API_URL}rules/question-answers/${qa.id}/update`, qa).pipe(
			map(this.mapPXResponse)
		);
	}

	runQuestionAnswerRules(userID: number, qid: number): Observable<Object> {
		return this.http.post(
			`${this.API_URL}rules/question-answers/run`, 
			{ userID: userID, questionnaireID: qid }
		);
	}

	getAllPlaylistRules(): Observable<PlaylistRule[]> {
		return this.http.get(`${this.API_URL}rules/playlists`).pipe(
			map(res => res['rules'])
		);
	}

	getPlaylistRule(id: number): Observable<PlaylistRule> {
		return this.http.get(`${this.API_URL}rules/playlists/${id}`).pipe(
			map(res => res['rule'])
		);
	}

	addPlaylistRule(rule: PlaylistRule): Observable<PXResponse> {
		return this.http.post(`${this.API_URL}rules/playlists/add`, rule).pipe(
			map(this.mapPXResponse)
		);
	}

	updatePlaylistRule(rule: PlaylistRule): Observable<PXResponse> {
		return this.http.post(`${this.API_URL}rules/playlists/${rule.id}/update`, rule).pipe(
			map(this.mapPXResponse)
		);
	}

	runPlaylistRules(userID: number): Observable<Object> {
		return this.http.post(`${this.API_URL}rules/playlists/run`, { userID: userID });
	}

	getSongRatings(userID: number): Observable<SongRating[]> {
		return this.http.get(`${this.API_URL}users/${userID}/song-ratings`).pipe(
			map(res => res['songRatings'])
		);
	}

	addSongRating(sr: SongRating): Observable<PXResponse> {
		return this.http.post(`${this.API_URL}users/${sr.userID}/song-ratings/add`, sr).pipe(
			map(this.mapPXResponse)
		);
	}

	getListeningDiary(userID: number): Observable<ListeningDiary[]> {
		return this.http.get(`${this.API_URL}users/${userID}/listening-diary`).pipe(
			map(res => res['listeningDiary'])
		);
	}

	addListeningDiary(ld: ListeningDiary): Observable<PXResponse> {
		return this.http.post(`${this.API_URL}users/${ld.userID}/listening-diary/add`, ld).pipe(
			map(this.mapPXResponse)
		);
	}

	getUsagePlan(userID: number): Observable<UsagePlan[]> {
		return this.http.get(`${this.API_URL}users/${userID}/usage-plan`).pipe(
			map(res => res['usagePlan'])
		);
	}

	addUsagePlan(up: UsagePlan): Observable<PXResponse> {
		return this.http.post(`${this.API_URL}users/${up.userID}/usage-plan/add`, up).pipe(
			map(this.mapPXResponse)
		);
	}

	parseError(e): string {
        if (!e) return 'Something went wrong';
        if (e.error && e.error.message) return e.error.message;
        if (e.message) return e.message;
        return e;
    }

	private mapPXResponse(res): PXResponse {
		return new PXResponse(res['success'], res['message']);
	}
}