const { Given, When, Then, AfterAll} = require('@cucumber/cucumber');
const assert = require("assert");
require('chromedriver');
const {Builder, By, Key, until, Capabilities} = require("selenium-webdriver");

const chrome = require('selenium-webdriver/chrome');
const chromePath = require('chromedriver').path;
let service = new chrome.ServiceBuilder(chromePath).build();
chrome.setDefaultService(service);

var {setDefaultTimeout} = require('@cucumber/cucumber');
setDefaultTimeout(60 * 1000);


let driver = new Builder().withCapabilities(Capabilities.chrome()).build();
driver.manage().window().maximize();

When("we request the products list", async function() {
    await driver.get('https://e83b40c1trial-dev-mydreamapp-approuter.cfapps.eu10.hana.ondemand.com/namespaceui/index.html');
});

Then ("we should receive", async function(dataTable) {
    await driver.wait(until.elementsLocated(By.xpath("//tbody/tr")));
    await driver.sleep(2000);

    const tasksElements = await driver.findElements(By.xpath("//tbody/tr"));
    await driver.sleep(2000);
    const expectations = dataTable.hashes();
    for (let i = 0; i < expectations.length; i++) {
        const taskName = await tasksElements[i].findElement(By.xpath('descendant::span[1]')).getText();
        const description = await tasksElements[i].findElement(By.xpath("td[3]/span")).getText();

        assert.equal(taskName, expectations[i].name);
        assert.equal(description, expectations[i].description);
    }
});

Given ("first view", async function() {
    await driver.findElement(By.xpath("//span[text()='Task planning']"));
});

When ("we click on the first item", async function() {
    this.taskNameText = await driver.findElement(By.xpath("//tbody/tr[1]/td/div/descendant::span[1]")).getText();
    await driver.findElement(By.xpath("//tbody/tr[1]")).click();
});

Then ("we rout to details page with specific info", async function() {
    await driver.sleep(2000);
    const taskName = await driver.wait(until.elementLocated(By.xpath("//*[@id='__section0-title']"))).getText();
    assert.equal(taskName, this.taskNameText);
    await driver.navigate().back();
});

When ("we click on the second item with activated header checkbox", async function() {
    const checkbox = await driver.wait(until.elementLocated(By.id("container-ui---tasksList--checkbox")));
    const item = await driver.findElement(By.xpath("//tbody/tr[4]"));
    checkbox.click();
    item.click();
});

Then ("we rout to details page with opened dialog form with id {string}", async function(id) {
    await driver.sleep(2000);
    const idFromDialog = await driver.wait(until.elementLocated(By.id("__text54"))).getText();
    const closeBtn = await driver.findElement(By.id("container-ui---taskDetails--closeDialogBtn"));
    assert.equal(id, idFromDialog);
    closeBtn.click();
    await driver.navigate().back();
});

Given ("search field", async function() {
    await driver.wait(until.elementLocated(By.id("container-ui---tasksList--smartFilterBar-filterItemControlA_-Name-inner")));
});

When ("we enter {string} in the input field", async function(query) {
    this.query = query;
    const inputField = await driver.wait(until.elementLocated(By.id("container-ui---tasksList--smartFilterBar-filterItemControlA_-Name-inner")));
    await inputField.sendKeys("Fix the monitor", Key.ENTER);
});

Then ("we see items matching the request", async function() {
    await driver.sleep(2000);
    const tasksElements = await driver.wait(until.elementsLocated(By.xpath("//tbody/tr")));
    for (let i=0; i < tasksElements.length; i++) {
        const itemName = await driver.findElement(By.xpath(`//tbody/child::tr[${i+1}]/td/div/descendant::span[1]`)).getText();
        assert.equal(itemName, this.query);
    }
});

When ("we go to the second view", async function() {
    const item = await driver.findElement(By.xpath("//tbody/tr[1]"));
    item.click();
});

When ("reload the page", async function() {
    await driver.navigate().refresh();
});

Then ("we should see opened dialog", async function() {
    await driver.wait(until.elementLocated(By.id("container-ui---taskDetails--jobDetailsFragment")));
});

When("dialog with some data", async function() {
    await driver.findElement(By.id("container-ui---taskDetails--jobDetailsFragment"));
});

Then ("data from dialog is equal to data from section", async function() {
    await driver.sleep(2000);
    const labelFromDialogContainers = await driver.findElements(By.xpath("//div[@class='sapUiRespGridBreak sapUiRespGridSpanXL12 sapUiRespGridSpanL12 sapUiRespGridSpanM12 sapUiRespGridSpanS6 sapUiFormElementLbl']/descendant::bdi"));
    const section = await driver.findElement(By.id("container-ui---taskDetails--simpleFormJobDetails"));
    const valuesFromDialog = [];
    const valuesFromSection = [];

    for (let elem of labelFromDialogContainers) {
        let text = await elem.getText();  

        const valueFromDialog = await elem.findElement(By.xpath("ancestor::div[1]/following-sibling::div[1]/span")).getText();
        await valuesFromDialog.push(valueFromDialog);

        const labelFromSection = await section.findElement(By.xpath(`descendant::*[contains(text(), '${text}')]`));
        if (text === "ID") {
            var valueFromSection = await labelFromSection.findElement(By.xpath("ancestor::div[1]/following-sibling::div[1]//descendant::span/span")).getText();
        } else {
            var valueFromSection = await labelFromSection.findElement(By.xpath("ancestor::div[1]/following-sibling::div[1]/span")).getText();
        }
        
        await valuesFromSection.push(valueFromSection);
    };
    for (let i = 0; i < valuesFromDialog.length; i++) {
        assert.equal(valuesFromDialog[i], valuesFromSection[i]);
    }
});

AfterAll(async function() {
    await driver.close();
});
