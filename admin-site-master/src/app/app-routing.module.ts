import { Routes, RouterModule } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserAddComponent } from './user-add/user-add.component';
import { UserUpdatePasswordComponent } from './user-update-password/user-update-password.component';
import { UserQuestionnairesComponent } from './user-questionnaires/user-questionnaires.component';
import { UserAnswersComponent } from './user-answers/user-answers.component';
import { QuestionnaireListComponent } from './questionnaire-list/questionnaire-list.component';
import { QuestionnaireAddComponent } from './questionnaire-add/questionnaire-add.component';
import { QuestionnaireQuestionsComponent } from './questionnaire-questions/questionnaire-questions.component';
import { QuestionEditComponent } from './question-edit/question-edit.component';
import { SongListComponent } from './song-list/song-list.component';
import { AuthGuard } from './auth-guard';
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

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'signin', component: SignInComponent },
    { path: 'users', component: UserListComponent, canActivate: [AuthGuard] },
    { path: 'users/add', component: UserAddComponent, canActivate: [AuthGuard] },
    { path: 'users/:id/update-password', component: UserUpdatePasswordComponent, canActivate: [AuthGuard] },
    { path: 'users/:id/playlists', component: UserPlaylistsComponent, canActivate: [AuthGuard] },
    { path: 'users/:id/questionnaires', component: UserQuestionnairesComponent, canActivate: [AuthGuard] },
    { path: 'users/:id/questionnaires/:qid/answers', component: UserAnswersComponent, canActivate: [AuthGuard] },
    { path: 'users/:id/questionnaires/:qid/answers/:answerID/edit', component: UserAnswerEditComponent, canActivate: [AuthGuard] },
    { path: 'users/:id/song-ratings', component: SongRatingsComponent, canActivate: [AuthGuard] },
    { path: 'users/:id/listening-diary', component: ListeningDiaryComponent, canActivate: [AuthGuard] },
    { path: 'users/:id/usage-plan', component: UsagePlanComponent, canActivate: [AuthGuard] },
    { path: 'questionnaires', component: QuestionnaireListComponent, canActivate: [AuthGuard] },
    { path: 'questionnaires/add', component: QuestionnaireAddComponent, canActivate: [AuthGuard] },
    { path: 'questionnaires/:id/questions', component: QuestionnaireQuestionsComponent, canActivate: [AuthGuard] },
    { path: 'questionnaires/:id/questions/:qid/edit', component: QuestionEditComponent, canActivate: [AuthGuard] },
    { path: 'songs', component: SongListComponent, canActivate: [AuthGuard] },
    { path: 'songs/add', component: SongAddComponent, canActivate: [AuthGuard] },
    { path: 'songs/:id/edit', component: SongEditComponent, canActivate: [AuthGuard] },
    { path: 'playlists', component: PlaylistsComponent, canActivate: [AuthGuard] },
    { path: 'playlists/add', component: PlaylistAddComponent, canActivate: [AuthGuard] },
    { path: 'playlists/:id/edit', component: PlaylistEditComponent, canActivate: [AuthGuard] },
    { path: 'playlists/:id/songs', component: PlaylistSongsComponent, canActivate: [AuthGuard] },
    { path: 'tags', component: TagListComponent, canActivate: [AuthGuard] },
    { path: 'rules', component: RulesComponent, canActivate: [AuthGuard] },
    { path: 'rules/question-answers/add', component: QuestionAnswerAddComponent, canActivate: [AuthGuard] },
    { path: 'rules/question-answers/:id/edit', component: QuestionAnswerEditComponent, canActivate: [AuthGuard] },
    { path: 'rules/playlists/add', component: PlaylistRuleAddComponent, canActivate: [AuthGuard] },
    { path: 'rules/playlists/:id/edit', component: PlaylistRuleEditComponent, canActivate: [AuthGuard] }
];

export const AppRoutingModule = RouterModule.forRoot(routes);
