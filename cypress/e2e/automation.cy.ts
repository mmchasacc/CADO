

describe('automation', () => {
  it('is going to register user and add a task and logout', () => {
    cy.viewport(1280, 720)
    cy.visit('http://localhost:5173/')

    const randomNumbers = Date.now();
    const userEmail = `batman_${randomNumbers}@live.se`;
    const userPassword = "apassword010101!";

    cy.get("#registerBtn").click()

    cy.get('input[placeholder="Enter Email"]').click().type(userEmail)
    
    cy.get('input[placeholder="Enter Password"]').click().type(userPassword)

    cy.get("#registerButton").click()

    cy.get("#addTaskBtn").click()


    cy.get('input[placeholder="Title"]').click().type("Bake Bread").next().click().type("Bake bread with garlic sauce and excessive amounts of butter and oil").next()

    cy.get("#selectCategory").select("Work")

    cy.get('input[placeholder="Create category (optional)"]').click().type("Bread").next().click()

    cy.get("#selectCategory").select("Personal").select("Work").select("School").select("Bread")

    cy.get("#createTask").click()

    cy.get("#logoutBtn").should("exist").click()


    cy.get('input[placeholder="Enter Email"]').click().type("kalle@outlook.com")

    cy.get('input[placeholder="Enter Password"]').click().type("JabJab111")

    cy.get("#loginBtn").click()

    cy.get("#addTaskBtn").click()


    cy.get('input[placeholder="Title"]').click().type("Fix car").next().click().type("Change tires to car").next()

    cy.get("#selectCategory").select("Work")

    cy.get('input[placeholder="Create category (optional)"]').click().type("Car").next().click()

    cy.get("#selectCategory").select("Personal").select("Work").select("School").select("Car")

    cy.get("#createTask").click()

    cy.get("#logoutBtn").should("exist").click()

    cy.get('input[placeholder="Enter Email"]').click().type("kalle@outlook.com")

    cy.get('input[placeholder="Enter Password"]').click().type("JabJab111")

    cy.get("#loginBtn").click()



    

  })
})