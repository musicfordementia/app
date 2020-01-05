export class QuestionChoice {
    id: number;
    questionID: number;
    str: string;

    constructor(id: number = 0, questionID: number = 0, str: string = '') {
        this.id = id;
        this.questionID = questionID;
        this.str = str;
    }
}