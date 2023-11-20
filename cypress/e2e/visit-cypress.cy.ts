describe('template spec', () => {
    it('passes', () => {
        cy.visit('https://greenframe.io');
        cy.scrollTo('bottom', { duration: 2000, ensureScrollable: false });
    });
});
