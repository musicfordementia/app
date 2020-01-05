import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

import { AppComponent } from './app.component';
import { ApiService } from './api.service';
import { UserListComponent } from './user-list/user-list.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { QuestionnaireListComponent } from './questionnaire-list/questionnaire-list.component';
import { QuestionnaireQuestionsComponent } from './questionnaire-questions/questionnaire-questions.component';
import { SongListComponent } from './song-list/song-list.component';
import { QuestionEditComponent } from './question-edit/question-edit.component';
import { QuestionnaireAddComponent } from './questionnaire-add/questionnaire-add.component';
import { UserUpdatePasswordComponent } from './user-update-password/user-update-password.component';
import { UserAddComponent } from './user-add/user-add.component';
import { UserQuestionnairesComponent } from './user-questionnaires/user-questionnaires.component';
import { UserAnswersComponent } from './user-answers/user-answers.component';
import { JWTInterceptor } from './jwt-interceptor';
import { AppRoutingModule } from './app-routing.module';
import { TokenExpiredInterceptor } from './token-expired-interceptor';
import { SongAddComponent } from './song-add/song-add.component';
import { SongEditComponent } from './song-edit/song-edit.component';
import { PlaylistsComponent } from './playlists/playlists.component';
import { PlaylistSongsComponent } from './playlist-songs/playlist-songs.component';
import { PlaylistAddComponent } from './playlist-add/playlist-add.component';
import { TagListComponent } from './tag-list/tag-list.component';
import { QuestionAnswerListComponent } from './question-answer-list/question-answer-list.component';
import { QuestionAnswerEditComponent } from './question-answer-edit/question-answer-edit.component';
import { QuestionAnswerAddComponent } from './question-answer-add/question-answer-add.component';
import { PlaylistEditComponent } from './playlist-edit/playlist-edit.component';
import { UserAnswerEditComponent } from './user-answer-edit/user-answer-edit.component';
import { PlaylistRulesComponent } from './playlist-rules/playlist-rules.component';
import { PlaylistRuleAddComponent } from './playlist-rule-add/playlist-rule-add.component';
import { UserPlaylistsComponent } from './user-playlists/user-playlists.component';
import { RulesComponent } from './rules/rules.component';
import { PlaylistRuleEditComponent } from './playlist-rule-edit/playlist-rule-edit.component';
import { SongRatingsComponent } from './song-ratings/song-ratings.component';
import { ListeningDiaryComponent } from './listening-diary/listening-diary.component';
import { UsagePlanComponent } from './usage-plan/usage-plan.component';
import { HomeComponent } from './home/home.component';

@NgModule({
	imports: [ 
		BrowserModule, 
		FormsModule,
		HttpClientModule,
		NgbModule,
		AppRoutingModule, 
		NgSelectModule
	],
	declarations: [ 
		AppComponent, UserListComponent, TopBarComponent, SignInComponent, 
		QuestionnaireListComponent, QuestionnaireQuestionsComponent, SongListComponent, 
		QuestionEditComponent, QuestionnaireAddComponent, 
		UserUpdatePasswordComponent, UserAddComponent, UserQuestionnairesComponent, 
		UserAnswersComponent, 
		SongAddComponent, SongEditComponent, 
		PlaylistsComponent, PlaylistSongsComponent, PlaylistAddComponent, PlaylistEditComponent,
		TagListComponent, 
		QuestionAnswerListComponent, QuestionAnswerEditComponent, QuestionAnswerAddComponent, 
		UserAnswerEditComponent, PlaylistRulesComponent, PlaylistRuleAddComponent, 
		UserPlaylistsComponent, RulesComponent, PlaylistRuleEditComponent, SongRatingsComponent, ListeningDiaryComponent, UsagePlanComponent, HomeComponent
	],
	bootstrap: [AppComponent],
	providers: [
		ApiService,
		{ provide: HTTP_INTERCEPTORS, useClass: JWTInterceptor, multi: true },
		{ provide: HTTP_INTERCEPTORS, useClass: TokenExpiredInterceptor, multi: true }
	]
})
export class AppModule { }
