/**
 * Created by paul on 09.05.2017.
 */
export default class OfferProperties {
    constructor(props) {
        Object.assign(
            this,
            {
                name: "Unnamed",
                originalPrice: {
                    amount: null,
                    currencyCode: "USD"
                },
                reducedPrice: {
                    amount: null,
                    currencyCode: "USD"
                },
                productImagePointer: {
                    itemName: "main.jpg"
                }
            },
            props);
    }
}