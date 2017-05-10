/**
 * Created by paul on 09.05.2017.
 */
import Offer from "./models/Offer";
import OfferProperties from "./models/OfferProperties";
import Storage from "./Storage";

/*
 * Manages data, creates\removes\updates offers, simulates fetch-requests
 */
export default class DataService {
    constructor() {
        this.contentType = null;
        this.createdAt = null,
            this.id = null;
        this.properties = null;
        this.offers = this.offers || [];
        this.dataSource = Storage.getData();
        this.detailsDataSource = Storage.getDetails();

        window.ds = this;
    }

    /*
     * "Loads" data from storage.
     */
    loadList() {
        // Simulate fetching data from server
        return new Promise((resolve, reject) => {
            try {
                let data = this.dataSource;
                this.id = data.id;
                this.offers = [];
                for (let offer of data.offers || []) {
                    let off = new Offer(offer);
                    this.setOfferCallbacks(off);
                    this.offers.push(off);
                }

                setTimeout(()=>{
                    resolve(this.offers);
                }, 1000);


            } catch(e) {
                reject(e);
            }
        });
    }

    /*
     * Simulates GET-request to get child details by id
     * @param offer {Offer} - offer, to which we retreiving details
     */
    getDetails(offer) {
        return this.detailsDataSource.filter(item => item.id === offer.id)[0];
    }

    /*
     * Adds new blank offer to list
     */
    addItem() {
        let offer = new Offer({
            // In a real app, it could be a POST-request for object-create here, that will return new id
            id: this.generateGUID(),
            createdAt: (new Date())
        });
        this.setOfferCallbacks(offer);
        this.offers.unshift(offer);

        this.dataSource.offers.unshift(offer);

        return offer;
    }

    /*
     * Removes offer from the list, also simulates removing from the Database
     * @param offer {Offer} - Offer we need to remove
     */
    removeItem(offer) {
        offer.domNode.remove();
        for (let i = 0; i < this.offers.length; i++) {
            if (this.offers[i].id === offer.id) {
                this.offers.splice(i, 1);
                break;
            }
        }

        // It's just a mock instead of a real DELETE-request
        for (let i = 0; i < this.dataSource.offers.length; i++) {
            if (this.dataSource.offers[i].id === offer.id) {
                this.dataSource.offers.splice(i, 1);
                break;
            }
        }

        for (let i = 0; i < this.detailsDataSource.length; i++) {
            if (this.detailsDataSource[i].id === offer.id) {
                this.detailsDataSource.splice(i, 1);
                break;
            }
        }

        Storage.saveData(this.dataSource, this.detailsDataSource);
    }

    /*
     * Updates offer info after user's editing
     * @param offer {Offer} - Updated offer
     */
    updateItem(offer) {
        // Update in storages
        // It's just a mock instead of a real PUT-request
        let dataSourceItem = this.dataSource.offers.filter(item => item.id === offer.id)[0];
        if (dataSourceItem) {
            let index = this.dataSource.offers.indexOf(dataSourceItem);
            this.dataSource.offers[index] = {
                ...dataSourceItem,
                ...offer
            }
        }
        let detailsDataSourceItem = this.detailsDataSource.filter(item => item.id === offer.id)[0];
        if (detailsDataSourceItem) {
            let index = this.detailsDataSource.indexOf(detailsDataSourceItem);
            this.detailsDataSource[index].offer = [
                Object.assign({},
                    detailsDataSourceItem.offer[0],
                    offer
                )
            ];
        } else {
            // We should add details to our "Database" for the new items
            this.detailsDataSource.unshift({
                id: offer.id,
                createdAt: offer.createdAt,
                contentType: null,
                offer: [offer]
            });
        }

        Storage.saveData(this.dataSource, this.detailsDataSource);

        if (this.onUpdate) {
            this.onUpdate();
        }
    }

    /*
     * Set instance-methods for offers, same as <div onClick={this.onClick}> in React
     * @param offer {Offer} - offer we need to set methods to
     */
    setOfferCallbacks(offer) {
        offer.loadDetails = this.getDetails.bind(this);
        offer.remove = this.removeItem.bind(this);
        offer.onUpdate = this.updateItem.bind(this);
    }

    /*
     * Generates GUID for new offers
     */
    generateGUID() {
        let s4 = () => {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        };
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

}

