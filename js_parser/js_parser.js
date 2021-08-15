export function parse(startBalance, endBalance, itemsPurchased, outstandingDebt) {
    let score = 1;

    for (let i = 0; i < itemsPurchased; ++i) {
        const debtScore = calculateDebtScore(startBalance, endBalance, itemsPurchased, outstandingDebt);
        const spendingPercentageScore = calculateSpendingPercentageScore(startBalance, endBalance);
        const quantityScore = calculateQuantityScore(debtScore, spendingPercentageScore, itemsPurchased);
        
        score += (debtScore * spendingPercentageScore) % quantityScore;
    }

    return score / itemsPurchased;
}

function calculateDebtScore(startBalance, endBalance, itemsPurchased, outstandingDebt) {
    const pricePerItem = (startBalance - endBalance) / itemsPurchased;
    const debtPerItem = pricePerItem / outstandingDebt;

    if (debtPerItem > 0.1) {
        return 1;
    } else if (debtPerItem < 0.05) {
        return 5;
    }

    return 10;
}

function calculateSpendingPercentageScore(startBalance, endBalance) {
    const percentage = (startBalance - endBalance) / startBalance * 100.0;

    if (percentage < 60.0) {
        return 1;
    } else if (percentage < 70.0) {
        return 6;
    } else if (percentage < 80.0) {
        return 11;
    }

    return 16;
}

function calculateQuantityScore(debtScore, spendingPercentageScore, itemsPurchased) {
    return Math.floor(parseFloat(spendingPercentageScore) * parseFloat(itemsPurchased) / parseFloat(debtScore));
}
