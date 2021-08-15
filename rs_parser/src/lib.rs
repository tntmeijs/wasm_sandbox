use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn parse(start_balance: f64, end_balance: f64, items_purchased: u32, outstanding_debt: f64) -> u32 {
    let mut score = 1u32;

    for _i in 0..items_purchased {
        let debt_score = calculate_debt_score(start_balance, end_balance, items_purchased, outstanding_debt);
        let spending_percentage_score = calculate_spending_percentage_score(start_balance, end_balance);
        let quantity_score = calculate_quantity_score(
            debt_score.into(),
            spending_percentage_score.into(),
            items_purchased.into());
        
        score += (debt_score * spending_percentage_score) % quantity_score;
    }

    score / items_purchased
}

fn calculate_debt_score(start_balance: f64, end_balance: f64, items_purchased: u32, outstanding_debt: f64) -> u32 {
    let price_per_item = (start_balance - end_balance) / items_purchased as f64;
    let debt_per_item = price_per_item / outstanding_debt;

    if debt_per_item > 0.1 {
        return 1;
    } else if debt_per_item < 0.05 {
        return 5;
    }

    10
}

fn calculate_spending_percentage_score(start_balance: f64, end_balance: f64) -> u32 {
    let percentage = (start_balance - end_balance) / start_balance * 100.0;

    if percentage < 60.0 {
        return 1;
    } else if percentage < 70.0 {
        return 6;
    } else if percentage < 80.0 {
        return 11;
    }

    16
}

fn calculate_quantity_score(debt_score: f64, spending_percentage_score: f64, items_purchased: f64) -> u32 {
    (spending_percentage_score * items_purchased / debt_score).floor() as u32
}
