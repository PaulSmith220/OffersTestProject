/**
 * Created by paul on 10.05.2017.
 */
import DataService from "../app/scripts/DataService";

describe('DataService', () => {
    const dataService = new DataService();

    it('Should be filled with data after creation', ()=> {
        expect(dataService.dataSource.offers).toBeDefined();
        expect(dataService.dataSource.offers.length).toBeGreaterThan(0);
    });

    it('Should be filled with details-data after creation', ()=> {
        expect(dataService.detailsDataSource).toBeDefined();
        expect(dataService.detailsDataSource.length).toBeGreaterThan(0);
    });

    it('Should return Offer details by id', () => {
        expect(dataService.getDetails(dataService.dataSource.offers[0])).toBeDefined();
    });

    it('Should add new Offers', () => {
        let length = dataService.offers.length;
        dataService.addItem();
        expect(dataService.offers.length).toBeGreaterThan(length);
    });

    it('Should generate GUID', ()=> {
        let guid = dataService.generateGUID();
        expect(/^[a-z0-9]{8}(-[a-z0-9]{4}){3}-[a-z0-9]{12}$/.test(guid)).toBeTruthy();
    });

});