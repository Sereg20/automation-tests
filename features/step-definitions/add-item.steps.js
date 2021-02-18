const { Given, When, Then, After} = require('@cucumber/cucumber');
const assert = require("assert");
require('chromedriver');
const {Builder, By, Key, until, Capabilities} = require("selenium-webdriver");

const chrome = require('selenium-webdriver/chrome');
const chromePath = require('chromedriver').path;
let service = new chrome.ServiceBuilder(chromePath).build();
chrome.setDefaultService(service);


let driver = new Builder().withCapabilities(Capabilities.chrome()).build();
driver.manage().window().maximize();

When("we request the products list", async function() {
    await driver.get('https://e83b40c1trial-dev-mydreamapp-approuter.cfapps.eu10.hana.ondemand.com/namespaceui/index.html');
});

Then ("we should receive", async function(dataTable) {
    await driver.manage().setTimeouts( {implicit: 10000} )
    await driver.wait(until.elementsLocated(By.xpath("//tbody/tr")));
    await driver.sleep(1000);

    const tasksElements = await driver.findElements(By.xpath("//tbody/tr"));
    await driver.sleep(1000);
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
    await (await driver).sleep(2000);
    const tasksElements = await driver.wait(until.elementsLocated(By.xpath("//tbody/tr")), 5000);
    for (let i=0; i < tasksElements.length; i++) {
        const itemName = await driver.findElement(By.xpath(`//tbody/child::tr[${i+1}]/td/div/descendant::span[1]`)).getText();
        assert.equal(itemName, this.query);
    }
});

When ("we go to the second view", async function() {
    const item = await driver.findElement(By.xpath("//tbody/tr[1]"));
    item.click();
});

When ("reload thr page", async function() {
    await driver.navigate().refresh();
});

Then ("we should see opened dialog", async function() {
    await driver.findElement(By.id("container-ui---taskDetails--jobDetailsFragment"));
});

// After(async function() {
//     await driver.close();
// });
