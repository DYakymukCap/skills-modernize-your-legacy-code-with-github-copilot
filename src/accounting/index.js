const readline = require("node:readline");
const { stdin, stdout } = require("node:process");

const INITIAL_BALANCE_CENTS = 100_000;
const MAX_AMOUNT_CENTS = 99_999_999;

function parseAmount(value) {
  const match = value.trim().match(/^(\d+)(?:\.(\d{1,2}))?$/);
  if (!match) {
    return null;
  }

  const whole = Number(match[1]);
  const cents = Number((match[2] ?? "").padEnd(2, "0"));
  const amount = whole * 100 + cents;

  return Number.isSafeInteger(amount) && amount <= MAX_AMOUNT_CENTS
    ? amount
    : null;
}

function formatBalance(balanceCents) {
  return (balanceCents / 100).toFixed(2);
}

async function runAccountingApp({ input = stdin, output = stdout } = {}) {
  const terminal = readline.createInterface({ input });
  const lines = terminal[Symbol.asyncIterator]();
  let balance = INITIAL_BALANCE_CENTS;
  let continueRunning = true;

  async function ask(prompt) {
    output.write(prompt);
    const line = await lines.next();
    return line.done ? null : line.value;
  }

  try {
    while (continueRunning) {
      output.write(
        [
          "--------------------------------",
          "Account Management System",
          "1. View Balance",
          "2. Credit Account",
          "3. Debit Account",
          "4. Exit",
          "--------------------------------",
          "",
        ].join("\n"),
      );
      const choiceInput = await ask("Enter your choice (1-4): ");
      if (choiceInput === null) {
        break;
      }
      const choice = choiceInput.trim();

      switch (choice) {
        case "1":
          output.write(`Current balance: ${formatBalance(balance)}\n`);
          break;
        case "2":
        case "3": {
          const action = choice === "2" ? "credit" : "debit";
          const amountInput = await ask(`Enter ${action} amount: `);
          if (amountInput === null) {
            continueRunning = false;
            break;
          }
          const amount = parseAmount(amountInput);

          if (amount === null) {
            output.write(
              "Invalid amount. Enter a non-negative amount with up to two decimal places.\n",
            );
            break;
          }

          if (action === "credit") {
            if (balance + amount > MAX_AMOUNT_CENTS) {
              output.write("Credit would exceed the supported balance range.\n");
              break;
            }

            balance += amount;
            output.write(`Amount credited. New balance: ${formatBalance(balance)}\n`);
          } else if (balance >= amount) {
            balance -= amount;
            output.write(`Amount debited. New balance: ${formatBalance(balance)}\n`);
          } else {
            output.write("Insufficient funds for this debit.\n");
          }
          break;
        }
        case "4":
          continueRunning = false;
          break;
        default:
          output.write("Invalid choice, please select 1-4.\n");
      }
    }

    output.write("Exiting the program. Goodbye!\n");
  } finally {
    terminal.close();
  }
}

if (require.main === module) {
  runAccountingApp().catch((error) => {
    console.error("Unable to run the accounting application:", error);
    process.exitCode = 1;
  });
}

module.exports = { runAccountingApp };
