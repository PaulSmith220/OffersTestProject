/**
 * Created by paul on 09.05.2017.
 */
import Offer from "./models/Offer";
import OfferProperties from "./models/OfferProperties";
import Storage from "./Storage";

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
                }, 200);


            } catch(e) {
                reject(e);
            }
        });
    }

    getDetails(offer) {
        console.info(this.detailsDataSource);
        return this.detailsDataSource.filter(item => item.id === offer.id)[0];
    }

    addItem() {
        let offer = new Offer({
            id: this.generateGUID(),
            createdAt: (new Date())
        });
        this.setOfferCallbacks(offer);
        this.offers.unshift(offer);

        this.dataSource.offers.unshift(offer);

        return offer;
    }

    removeItem(offer) {
        offer.domNode.remove();
        for (let i = 0; i < this.offers.length; i++) {
            if (this.offers[i].id === offer.id) {
                this.offers.splice(i, 1);
                break;
            }
        }

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
    }

    updateItem(offer) {
        console.info(offer);
        componentHandler.upgradeDom();

        // Update in storages
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

    setOfferCallbacks(offer) {
        offer.loadDetails = this.getDetails.bind(this);
        offer.remove = this.removeItem.bind(this);
        offer.onUpdate = this.updateItem.bind(this);
    }

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

