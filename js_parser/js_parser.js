export function parse(dataset) {
    const FIRST_NAME_FIELD = 0;
    const LAST_NAME_FIELD = 1;
    const START_BALANCE_FIELD = 2;
    const END_BALANCE_FIELD = 3;
    const ITEMS_PURCHASED_FIELD = 4;

    let lowestPricePerItemAccountName = "INVALID";
    let lowestPricePerItemPrice = null;

    dataset.forEach((row, index) => {
        const AVERAGE_PRICE_PER_ITEM = (row[START_BALANCE_FIELD] - row[END_BALANCE_FIELD]) / row[ITEMS_PURCHASED_FIELD];

        if (lowestPricePerItemPrice == null || lowestPricePerItemPrice > AVERAGE_PRICE_PER_ITEM) {
            lowestPricePerItemAccountName = `${row[FIRST_NAME_FIELD]} ${row[LAST_NAME_FIELD]}`;;
            lowestPricePerItemPrice = AVERAGE_PRICE_PER_ITEM;
        }
    });

    return {
        name: lowestPricePerItemAccountName,
        averagePrice: lowestPricePerItemPrice
    };
}
