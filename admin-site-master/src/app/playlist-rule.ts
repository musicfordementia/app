export class PlaylistRuleTag {
    id: number;
    ruleID: number;
    tagID: number;

    constructor(id = 0, ruleID = 0, tagID = 0) {
        this.id = id;
        this.ruleID = ruleID;
        this.tagID = tagID;
    }
}

export class PlaylistRule {
    id: number;
    tagID: number;
    op: string;
    count: number;
    tags: PlaylistRuleTag[];

    constructor(id = 0, tagID = 0, op = '', count = 0, tags = []) {
        this.id = id;
        this.tagID = tagID;
        this.op = op;
        this.count = count;
        this.tags = tags;
    }
}