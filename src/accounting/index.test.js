const assert = require("node:assert/strict");
const { Readable, Writable } = require("node:stream");
const test = require("node:test");
const { runAccountingApp } = require("./index");

async function runAppWithInput(lines) {
  let outputText = "";
  const input = Readable.from(lines.map((line) => `${line}\n`));
  const output = new Writable({
    write(chunk, encoding, callback) {
      outputText += chunk.toString();
      callback();
    },
  });

  await runAccountingApp({ input, output });
  return outputText;
}

test("shows the initial balance", async () => {
  const output = await runAppWithInput(["1", "4"]);

  assert.match(output, /Current balance: 1000\.00/);
});

test("credits the account and displays the updated balance", async () => {
  const output = await runAppWithInput(["2", "125.50", "1", "4"]);

  assert.match(output, /Amount credited\. New balance: 1125\.50/);
  assert.match(output, /Current balance: 1125\.50/);
});

test("debits an amount below the balance", async () => {
  const output = await runAppWithInput(["3", "250.00", "1", "4"]);

  assert.match(output, /Amount debited\. New balance: 750\.00/);
  assert.match(output, /Current balance: 750\.00/);
});

test("allows a debit equal to the full balance", async () => {
  const output = await runAppWithInput(["3", "1000.00", "1", "4"]);

  assert.match(output, /Amount debited\. New balance: 0\.00/);
  assert.match(output, /Current balance: 0\.00/);
});

test("rejects a debit greater than the balance without changing it", async () => {
  const output = await runAppWithInput(["3", "1000.01", "1", "4"]);

  assert.match(output, /Insufficient funds for this debit\./);
  assert.match(output, /Current balance: 1000\.00/);
});

test("preserves cent-level precision", async () => {
  const output = await runAppWithInput(["2", "0.01", "1", "4"]);

  assert.match(output, /Current balance: 1000\.01/);
});

test("rejects malformed or negative amounts without changing the balance", async () => {
  const output = await runAppWithInput(["2", "-25.00", "1", "4"]);

  assert.match(output, /Invalid amount\./);
  assert.match(output, /Current balance: 1000\.00/);
});

test("prevents a credit from exceeding the supported balance range", async () => {
  const output = await runAppWithInput(["2", "999000.00", "1", "4"]);

  assert.match(output, /Credit would exceed the supported balance range\./);
  assert.match(output, /Current balance: 1000\.00/);
});

test("reports invalid menu choices and continues", async () => {
  const output = await runAppWithInput(["5", "1", "4"]);

  assert.match(output, /Invalid choice, please select 1-4\./);
  assert.match(output, /Current balance: 1000\.00/);
});

test("exits with a goodbye message", async () => {
  const output = await runAppWithInput(["4"]);

  assert.match(output, /Exiting the program\. Goodbye!/);
});

test("resets the balance when a new application run starts", async () => {
  const firstRun = await runAppWithInput(["2", "25.00", "4"]);
  const secondRun = await runAppWithInput(["1", "4"]);

  assert.match(firstRun, /Amount credited\. New balance: 1025\.00/);
  assert.match(secondRun, /Current balance: 1000\.00/);
});
