import { TestBase } from '../pageObjects/testBase';
import axios from "axios";
import { TestParameters } from '../parameters/testParameters';

const testBase = new TestBase();
const testParameters = new TestParameters();

export class TestActions {
    //log in to specified firm and server on testVPC, partner or production server
    loginAndAuthorize(firmLink: string, userName: string, password: string) {
        cy.visit(testParameters.firmLink); // Navigate to the login page
        // Fill in the username field
        cy.get(testBase.userLogin).type(testParameters.userName);
        // Fill in the password field
        cy.get(testBase.password).type(testParameters.password);
        // Click the login button
        cy.get(testBase.submitButton).click();
    }

    selectPlugin(pluginName: string) {
        cy.get(testBase.pluginMenu).contains(testBase.samplePlugin).click();
    }

    //click on New button
    createEngagement(engagementName: string) {
        cy.get(testBase.newButton).click();
        cy.get(testBase.engagementName).type(engagementName);
        cy.get(testBase.saveButton).click({ force: true });
    }

    selectTopMenu(menuItem: string) {
        cy.get(testBase.topMenu).contains(menuItem).click();
    }

    selectAccountLeftMenu() {
        cy.get(testBase.leftMenuAccount).click();
    }

    selectAccountDropdownMenu(menuItem: string) {
        cy.get(testBase.accountDropdownMenu).contains(menuItem).click();
    }

    clickContinueButton(menuItem) {
        cy.get(testBase.accountMessage).contains(menuItem).click();
    }

    captureEngagementId() {
        cy.get('a.cw-grid-linked-column[title="Click to view"]')
            .invoke('attr', 'href')
            .then((href) => {
                // Extract the engagementId using a regular expression
                const match = href.match(/\/e\/eng\/([^/]+)\//);
                if (match) {
                    const engagementId = match[1]; // Extract the engagementId
                    cy.log('Captured engagementId:', engagementId);
                    // Save the engagementId as an environment variable
                    Cypress.env('engagementId', engagementId);
                    // Construct the target URL
                    const targetUrl = `${testParameters.firmLink}/e/eng/${engagementId}/index.jsp#/documents`;
                    // Visit the constructed URL
                    cy.visit(targetUrl);
                    // Verify you are on the correct page
                    cy.url().should('eq', targetUrl);
                } else {
                    throw new Error('Engagement Id not found in href');
                }
            });
    }
    createAccount(accountNumber: string, accountName: string, prelim: string) {
        this.selectTopMenu(testBase.dataButton);
        this.selectAccountLeftMenu();
        cy.get(testBase.addButton).click();
        this.selectAccountDropdownMenu(testBase.addAccount);
        this.clickContinueButton(testBase.continueButton);
        cy.get(testBase.accountNumberTextbox).type(accountNumber);
        cy.get(testBase.accountName).type(accountName);
        cy.get(testBase.prelim).type(prelim);
        cy.get(testBase.accountName).click();
        cy.get(testBase.accountSaveButton).click();
    }

    async closeEngagement(engagementId: string, userName: string, password: string) {
        const url = `https://www.vincenttest.com/e/eng/${engagementId}/api/engagement/close`;

        try {
            const response = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:132.0) Gecko/20100101 Firefox/132.0',
                    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language': 'en-CA,en-US;q=0.7,en;q=0.3',
                    'Accept-Encoding': 'gzip, deflate, br, zstd',
                    Connection: 'keep-alive',
                    Cookie: `__username__=${encodeURIComponent(userName)}; __password__=${password};`
                }
            });

            console.log('Engagement closed successfully:', response.data);
        } catch (error) {
            console.error('Error closing engagement:', error);
        }
    }

    logout(){
        cy.get(testBase.profileMenu).click();
        cy.get(testBase.logout).click();
    }
}