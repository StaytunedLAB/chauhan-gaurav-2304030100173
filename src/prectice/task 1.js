/**
 * Safely converts any value into a valid number.
 * Returns { valid: boolean, value: number }
 */
function toNumberSafe(value) {
    const num = Number(value);
    if (typeof value === "boolean" || value === null || value === "" || Number.isNaN(num)) {
        return { valid: false, value: 0 };
    }
    return { valid: true, value: num };
}

/**
 * Processes a banking account with transactions.
 * Original input is NOT mutated.
 */
function processBankAccount(input) {
    // Deep clone to keep original input unchanged
    const data = JSON.parse(JSON.stringify(input || {}));

    const result = {
        accountNumber: data.accountNumber || null,
        accountHolder: data.accountHolder || null,
        currency: data.currency || null,
        openingBalance: 0,
        finalBalance: 0,
        appliedTransactions: [],
        rejectedTransactions: []
    };

    // 1. Validate & parse initial balance
    const initial = toNumberSafe(data.initialBalance);
    result.openingBalance = initial.valid && initial.value >= 0 ? initial.value : 0;
    let balance = result.openingBalance;

    // 2. Process transactions safely
    const transactions = Array.isArray(data.transactions) ? data.transactions : [];

    for (const rawTx of transactions) {
        // Copy individual transaction (do not mutate)
        const tx = { ...rawTx };

        // Prepare record for rejecting (but only used if invalid)
        const reject = (reason) => {
            result.rejectedTransactions.push({
                ...tx,
                reason
            });
        };

        // Validate transaction type
        const type = typeof tx.type === "string" ? tx.type.toLowerCase() : null;
        if (type !== "deposit" && type !== "withdraw") {
            reject("Invalid or missing transaction type");
            continue;
        }

        // Validate amount
        const amt = toNumberSafe(tx.amount);
        if (!amt.valid) {
            reject("Amount is not a valid number");
            continue;
        }

        if (amt.value <= 0) {
            reject("Amount must be greater than zero");
            continue;
        }

        // Apply rules
        if (type === "deposit") {
            balance += amt.value;
            result.appliedTransactions.push({
                type: "deposit",
                amount: amt.value
            });
        } else if (type === "withdraw") {
            if (amt.value > balance) {
                reject("Insufficient balance");
                continue;
            }
            balance -= amt.value;
            result.appliedTransactions.push({
                type: "withdraw",
                amount: amt.value
            });
        }
    }

    // Final balance
    result.finalBalance = balance;

    return result;
}

// ---------------------------------------------------------
// Example usage:
// ---------------------------------------------------------

const input = {
    accountNumber: "ACC123",
    accountHolder: "John Smith",
    initialBalance: "1000",
    currency: "USD",
    transactions: [
        { type: "deposit", amount: "200" },
        { type: "withdraw", amount: 50 },
        { type: "withdraw", amount: "2000" },     // rejected (insufficient funds)
        { type: "deposit", amount: "-5" },        // rejected (negative)
        { type: "withdraw", amount: "xyz" },      // rejected (invalid number)
        { type: null, amount: 100 },              // rejected (missing type)
        { amount: 30 }                            // rejected (missing type)
    ]
};

console.log(processBankAccount(input));
