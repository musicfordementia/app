export class MessageMap {
    map = [];

    push(id: number, message: string, success: boolean) {
        let elem = this.map.find(e => e.id == id);
        if (elem) {
			elem.message = message;
			elem.success = success;
		}
        else this.map.push({ id: id, message: message, success: success });
    }

	getMessage(id: number): string {
		let elem = this.map.find(e => e.id == id);
		return elem ? elem.message : null;
	}

	getSuccess(id: number): boolean {
		let elem = this.map.find(e => e.id == id);
		return elem ? elem.success : null;
	}

	clearMessage(id: number): void {
		let elem = this.map.find(e => e.id == id);
		if (elem) elem.message = '';
	}
}