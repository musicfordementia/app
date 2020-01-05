export class QuestionAnswerTag {
    id: number;
    questionAnswerID: number;
    tagID: number;

    constructor(id = 0, questionAnswerID = 0, tagID = 0) {
        this.id = id;
        this.questionAnswerID = questionAnswerID;
        this.tagID = tagID;
    }
}