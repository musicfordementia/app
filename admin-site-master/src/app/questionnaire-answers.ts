export class AnswerTag {
    id: number;
    answerID: number;
    tagID: number;

    constructor(id = 0, answerID = 0, tagID = 0) {
        this.id = id;
        this.answerID = answerID;
        this.tagID = tagID;
    }
}

export class Answer {
    id: number;
    str: string;
    tags: AnswerTag[];

    constructor(id = 0, str = '', tags = []) {
        this.id = id;
        this.str = str;
        this.tags = tags;
    }
}

export class QuestionAnswers {
    questionID: number;
    answers: Answer[];

    constructor(questionID = 0, answers = []) {
        this.questionID = questionID;
        this.answers = answers;
    }
}

export class QuestionnaireAnswers {
    questionnaireID: number;
    questionAnswers: QuestionAnswers[];

    constructor(questionnaireID = 0, questionAnswers = []) {
        this.questionnaireID = questionnaireID;
        this.questionAnswers = questionAnswers;
    }
}