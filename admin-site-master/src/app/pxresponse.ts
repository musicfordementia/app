export class PXResponse {
    success: boolean;
    message: string;

    constructor(success = false, message = '') {
        this.success = success;
        this.message = message;
    }
}