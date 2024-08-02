let dashboardUrl; // Variable to store the dashboard URL

Cypress.Commands.add('loginAndCaptureDashboardUrl', () => {
    cy.viewport(1280, 720);
    cy.visit('https://sneaky.meetsoci.com/admin/login');
    cy.get('#password_login > :nth-child(2) > .input_email').type('ayadav@meetsoci.com');
    cy.get('.input_password').type('Ajay*141#');
    cy.get('#password_login > .gray_button').click();
    cy.wait(5000);
    cy.get('#select2-chosen-4').type('Ajay Yadav Demo Account');
    cy.get('.name').contains('Ajay Yadav Demo Account').click();
    cy.wait(4000);
    cy.url().then((url) => {
        dashboardUrl = url; // Store the captured URL
        cy.log('Captured Dashboard URL: ' + url); // Log the URL for reference
    });
});

describe('Location', () => {

    before(() => {
        cy.intercept({ resourceType: /xhr|fetch/ }, { log: false })
        cy.session('loginSession', () => {
            cy.loginAndCaptureDashboardUrl();
        });
    });

    beforeEach(() => {
        cy.viewport(1280, 720);
        cy.intercept({ resourceType: /xhr|fetch/ }, { log: false })
        
        cy.session('loginSession', () => {
            cy.loginAndCaptureDashboardUrl();
        });
    });

    it('Verify if user can create a new Location', () => {
        if (dashboardUrl) {
            cy.visit(dashboardUrl);
            cy.get('[data-href="locations"] > .subsection-label').click()
        cy.get('.btn_add_project').click()
        cy.wait(5000);
        cy.get('.location_name > .FormFieldView > .field_container > .input_container > .SingleLineInputView > input').type('Test Location')
        cy.get('.primary_button').click()
        //cy.get('.table-header > :nth-child(4)').dblclick()
        cy.get(':nth-child(4) > .net_container.facebook > .text').click()
        cy.get('.btn_authorize').click()
        cy.get('.heading_1').should('contain','Link Test Location with Facebook')
        cy.get('.bbm-modal__icon_close').click()
        cy.wait(5000);
        cy.get('.net_container.twitter > .text').should('contain','Link 𝕏 Account')
        cy.get('.net_container.linkedin > .text').should('contain','Link LinkedIn Account')
        cy.get('.net_container.instagram > .text').should('contain','Link Instagram Account')
        cy.get('.manage_networks_buttons > .gray_button').click()
        cy.log('user is able create a new Location')
        } else {
            cy.log('Dashboard URL not captured');
        }

        
        
    });

    it('Verify if user can Select the made location', () => {
        if (dashboardUrl) {
            cy.visit(dashboardUrl);
            // Add your test steps here
        } else {
            cy.log('Dashboard URL not captured');
        }
        cy.get('[data-href="locations"] > .subsection-label').should('contain','Locations').click()
        cy.get('.project_search').type('Test location')
        if(cy.get('.match_data').contains('Matches name: Test Location')){
            cy.get('.match_data').contains('Matches name: Test Location').click()
        }else{
            cy.log('Location not found')
        }
        cy.log('user is able to Select the made location')
    });

    it('Verify if user can Edit the location', () => {
        if (dashboardUrl) {
            cy.visit(dashboardUrl);
            // Add your test steps here
        } else {
            cy.log('Dashboard URL not captured')
        }
        cy.get('[data-href="locations"] > .subsection-label').should('contain','Locations').click()
        cy.get('.project_search').type('Test location')
        if(cy.get('.match_data').contains('Matches name: Test Location')){
            cy.get('.match_data').contains('Matches name: Test Location').click()
        }else{
            cy.log('Location not found')
        }
        cy.get('.project_details_button').click()
        cy.wait(5000)
        cy.get('.location_name > .FormFieldView > .field_container > .input_container > .SingleLineInputView > input').clear() .type('Test Location Edited')
        cy.get('.btn_save').click()
        cy.get('[data-cy="toast_message"]').should('contain','Settings updated successfully.')
    });

    it('Verify if user can Delete the Location', () => {
        if (dashboardUrl) {
            cy.visit(dashboardUrl);
            // Add your test steps here
        } else {
            cy.log('Dashboard URL not captured');
        }
        cy.get('[data-href="locations"] > .subsection-label').should('contain','Locations').click()
        cy.get('.project_search').type('Test Location Edited')
        if(cy.get('.match_data').contains('Matches name: Test Location Edited')){
            cy.get('.match_data').contains('Matches name: Test Location Edited').click()
        }else{
            cy.log('Location not found')
        }
        cy.get('.warning_button').click()
        cy.get('.pretty_confirm').contains('Are you sure you wish to delete Test Location Edited?')
        cy.get('.primary_button').click()
    });

});
