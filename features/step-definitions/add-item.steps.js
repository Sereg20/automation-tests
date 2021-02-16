const { Given, When, Then, After} = require('cucumber');
const assert = require("assert");
require('chromedriver');
const {Builder, By, Key, until, Capabilities} = require("selenium-webdriver");

const chrome = require('selenium-webdriver/chrome');
var chromePath = require('chromedriver').path;
let service = new chrome.ServiceBuilder(chromePath).build();
chrome.setDefaultService(service);

let driver = new Builder().withCapabilities(Capabilities.chrome()).build();


When("we request the products list", async function() {
    await driver.get('https://e83b40c1trial-dev-mydreamapp-approuter.cfapps.eu10.hana.ondemand.com/namespaceui/index.html');
});

Then ("we should receive", async function(dataTable) {
    var tasksElements = await driver.wait(until.elementsLocated(By.xpath("//tbody/tr")));
    await driver.sleep(2000);
    var expectations = dataTable.hashes();
    for (let i = 0; i < expectations.length; i++) {
        const taskName = await driver.findElement(By.xpath(`//tbody/child::tr[${i+1}]/td/div/descendant::span[1]`)).getText();
        assert.equal(taskName, expectations[i].name);

        const description = await driver.findElement(By.xpath(`//tbody/child::tr[${i+1}]/td[3]/span`)).getText();
        assert.equal(description, expectations[i].description);
    }
})

When ("we click on the first item", async function() {
    this.taskNameText = await driver.findElement(By.xpath("//tbody/tr[1]/td/div/descendant::span[1]")).getText();
    await driver.findElement(By.xpath("//tbody/tr[1]")).click();
});

Then ("we rout to details page with specific info", async function() {
    await driver.sleep(2000);
    var taskName = await driver.wait(until.elementLocated(By.xpath("//*[@id='__section0-title']"))).getText();
    assert.equal(taskName, this.taskNameText);
});

// After(async function() {
//     driver.close();
// });
