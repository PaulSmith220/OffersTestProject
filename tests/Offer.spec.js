/**
 * Created by paul on 10.05.2017.
 */
import Offer from "../app/scripts/models/Offer";
import OfferProperties from "../app/scripts/models/OfferProperties";

describe('Offer class', () => {
    let offer = new Offer({id: 1});
    offer.loadDetails = ()=>{};
    offer.remove = ()=>{};
    offer.onUpdate = ()=>{};

    it('Should be created properly', () => {
        expect(offer.properties instanceof OfferProperties).toBeTruthy();
        expect(offer.id).toBe(1);
    });

    it('Should build own node', () => {
        let template = document.createElement("div");
        template.id = "cardTemplate";
        document.body.appendChild(template);
        template.appendChild(document.createElement("div"));

        let actionPanel = document.createElement("div");
        actionPanel.innerHTML = [
            '<div id="test">{{ id }}</div><div class="mdl-card__actions"><div class="show-details"></div></div><div class="remove-button"></div>'
        ].join("");

        template.appendChild(actionPanel);

        let node = offer.getNode();
        expect(node.querySelector("#test").innerHTML).toEqual("1");
    });

});