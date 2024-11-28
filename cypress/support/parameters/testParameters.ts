export class TestParameters {
    readonly firmLink: string;
    readonly userName: string;
    readonly password: string;
    readonly firm: string;
    readonly engagementName: string = 'Sample Engagement';
    readonly accountNumber: string = '1001';
    readonly accountName: string = 'Account 1001';
    readonly prelim: string = '99999';

    constructor() {
        this.firmLink = 'https://www.vincenttest.com/';
        this.firm = this.firmLink.substring(this.firmLink.lastIndexOf('/') + 1);
        this.userName = 'user@vincenttest.com';
        this.password = Cypress.env('test_password');
    }
}