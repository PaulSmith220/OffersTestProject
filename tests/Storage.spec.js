/**
 * Created by paul on 10.05.2017.
 */
import Storage from "../app/scripts/Storage";

describe('Storage service', () => {
    let data = Storage.getData();
    let detailsData = Storage.getDetails();

    it('Storage should return parent data', () => {
        expect(data.offers).toBeDefined();
        expect(data.offers.length).toBeGreaterThan(0);
    });

    it('Storage should return children data', () => {
        expect(detailsData.length).toBeDefined();
        expect(detailsData.length).toBeGreaterThan(0);
    });

    it('Save method should return a correct promise', () => {
        data.flag = false;
        let promise = Storage.saveData(data,detailsData);
        expect(promise.then).toBeDefined();
    });
});