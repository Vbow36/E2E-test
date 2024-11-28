/* eslint-disable cypress/no-unnecessary-waiting */
import 'cypress-iframe';
import { TestBase } from '../support/pageObjects/testBase';
import { TestParameters } from '../support/parameters/testParameters';
import { TestActions } from '../support/actions/testActions';

const testParameters = new TestParameters();
const testBase = new TestBase();
const testActions = new TestActions();
const firmLink = testParameters.firmLink;
const userName = testParameters.userName;
const password = testParameters.password;

describe('Vincent E2E Test', () => {
    before(() => {
        // Clear the engagementId before all tests
        Cypress.env('engagementId', null);
    });

    it('login to the website and select the plugin', () => {
        // Log in to Website
        testActions.loginAndAuthorize(firmLink, userName, password);
    });

    it('select the sample plugin', () => {
        // select a plugin
        testActions.selectPlugin(testBase.samplePlugin);
    });

    it('Create a new engagement file', () => {
        // Since Cypress does not new tab, so use Stub window.open and stop the new tab from opening
        cy.window().then((win) => {
            cy.stub(win, 'open').as('windowOpen');
        });
        testActions.createEngagement(testParameters.engagementName);
    });

    it('Captures engagementId and visits Engagement URL', function () {
        // Capture the engagementId from the href attribute
        testActions.captureEngagementId();
    });

    it('Add a new account in the engagement file', () => {
        // create a new account in the US Review engagement
        testActions.createAccount(
            testParameters.accountNumber,
            testParameters.accountName,
            testParameters.prelim
        );
    });

    it('Close the engagement file and Push the data to Cloud', () => {
        //make an API call to close the engagement and push the data to S3
        const engagementId = Cypress.env('engagementId');
        if (engagementId) {
            testActions.closeEngagement(engagementId, testParameters.userName, testParameters.password);
        } else {
            throw new Error('Engagement Id not found');
        }
    });

    it('Logout from the website', () => {
        // Logout from the website
        testActions.logout();
    });
});