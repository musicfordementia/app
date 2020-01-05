import { QuestionAnswerTag } from './question-answer-tag';

export class QuestionAnswer {
    id: number;
    questionID: number;
    str: string;
    tags: QuestionAnswerTag[];

    constructor(id = 0, questionID = 0, str = '', tags = []) {
        this.id = id;
        this.questionID = questionID;
        this.str = str;
        this.tags = tags;
    }
}