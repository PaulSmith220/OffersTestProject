/**
 * Created by paul on 09.05.2017.
 */
import OfferProperties from "./OfferProperties";
import * as moment from "moment";
const defaultImage = require("../../images/main.png");

export default class Offer {
    constructor({id = null, properties = null, createdAt = null} = {}, dataActions = {}) {
        this.id = id;
        this.properties = new OfferProperties(properties);
        this.createdAt = createdAt;
        this._domNode = null;
        this._dialogView = null;
        this.dataActions = dataActions;
    }

    getDetails() {
        // Simulate fetching details from server
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    // Simulate details fetching
                    // normally we will get details by id, but here i'll just search in array
                    let data = this.loadDetails(this);
                    if (data && data.offer[0]) {
                        resolve(new OfferProperties(data.offer[0].properties));
                    } else {
                        resolve(null);
                    }
                } catch(e) {
                    reject(e);
                }
            }, 200);

        });
    }

    get domNode() {
        return this._domNode || this.getNode();
    }

    set domNode(node) {
        this._domNode = node;
    }

    getImageUrl() {
        return (!this.properties.productImagePointer ||
        !this.properties.productImagePointer.itemName ||
        this.properties.productImagePointer.itemName == "main.jpg") ? defaultImage : this.properties.productImagePointer.itemName
    }

    getNode() {

        let template = document.getElementById("cardTemplate").innerHTML;

        let node  = document.createElement("div");
        node.innerHTML = fillTemplate(template,
            {
                id: this.id,
                name: this.properties.name,
                date: moment.default(this.createdAt).format("D MMMM YYYY"),
                price: this.properties.originalPrice.amount || "-",
                currency: this.properties.originalPrice.currencyCode || "-",
                reducedPrice: this.properties.reducedPrice.amount || "-",
                reducedCurrency: this.properties.reducedPrice.currencyCode || "-",
                imageUrl: this.getImageUrl()
            }
        );
        node = node.childNodes[1];
        node.querySelector(".mdl-card__actions .show-details").addEventListener("click", this.showInDialog.bind(this));
        node.querySelector(".mdl-menu .show-details").addEventListener("click", this.showInDialog.bind(this));
        node.querySelector(".mdl-menu .remove").addEventListener("click", () => {
            this.remove(this);
        });
        return node;
    }

    setModalView(container) {
        let template = document.getElementById("dialogContentTemplate").innerHTML;
        this._dialogView = document.createElement("div");
        this.getDetails().then(details => {

            this._dialogView.innerHTML = fillTemplate(template, Object.assign(
                {
                    id: this.id,
                    name: "",
                    productName: "",
                    category: "",
                    productBrand: "",
                    retailerUrl: "",
                    description: ""
                },
                this.properties,
                details,
                {
                    originalPrice: details? details.originalPrice.amount: 0,
                    reducedPrice: details? details.reducedPrice.amount: 0,
                    image: this.getImageUrl()
                }
            ));
            container.innerHTML = "";
            container.appendChild(this._dialogView);
            componentHandler.upgradeDom();

            // Set change behaviour
            let inputs = document.querySelectorAll("#dialog form input, #dialog form textarea");
            let saveBtn = document.querySelector(".mdl-dialog__actions .save");
            let saveBtnClone = saveBtn.cloneNode(true);
            saveBtn.parentNode.replaceChild(saveBtnClone, saveBtn);
            saveBtnClone.addEventListener("click", this.updateData.bind(this));
            console.log("Modal:", this);
        });
    }

    showInDialog() {
        let dialog = document.querySelector('#dialog');
        dialog.querySelector(".dialog__title").innerHTML = this.properties.name;
        let dialogContent = dialog.querySelector(".dialog__content");
        dialogContent.innerHTML = "<div class='spinner'></div>";
        dialog.showModal();
        this.setModalView(dialogContent);


    }

    updateData() {
        const formData = new FormData(document.getElementById("modalForm"));
        for (let key of formData.keys()) {
            if (key === "id") {
                this.id = formData.get(key);
            } else
            if (key === "originalPrice" || key === "reducedPrice") {
                this.properties[key].amount = formData.get(key);
            } else {
                this.properties[key] = formData.get(key);
            }
        }

        this.updateDom();
        this.onUpdate(this);
    }

    updateDom() {
        let newNode = this.getNode();
        this._domNode.parentNode.replaceChild(newNode, this._domNode);
        this._domNode = newNode;
    }
}



// we dont really need a template engine for this project, so i used my own mini-version of it
const fillTemplate = (template, object) => {
    let result = template;
    for (let key in object) {
        result = result.replace(new RegExp('\{\{ ' + key + ' \}\}', 'g'), object[key]);
    }
    return result;
};