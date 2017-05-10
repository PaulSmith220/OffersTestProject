/**
 * Created by paul on 10.05.2017.
 */

const initialDataSources = {
    data: require("../data/parent.json"),
    detailsData: require("../data/children.json")
};

const dataSource = {
    data: null,
    detailsData: null,
};

const saveData = (data, detailsData) => {
    return new Promise((resolve, reject) => {
        dataSource.data = data;
        dataSource.detailsData = detailsData;
        localStorage.setItem("dataSource", JSON.stringify(data));
        localStorage.setItem("detailsDataSource", JSON.stringify(detailsData));
        resolve();
    });
};

const getData = () => {
    let parents = localStorage.getItem("dataSource");
    if (parents != null) {
        dataSource.data = JSON.parse(parents);
        console.log(dataSource.data);
    } else {
        dataSource.data = initialDataSources.data;
        localStorage.setItem("dataSource", JSON.stringify(dataSource.data));
    }
    return dataSource.data;
};

const getDetails = () => {
    let children = localStorage.getItem("detailsDataSource");
    if (children != null) {
        dataSource.detailsData = JSON.parse(children);
    } else {
        dataSource.detailsData = initialDataSources.detailsData;
        localStorage.setItem("detailsDataSource", JSON.stringify(dataSource.detailsData));
    }
    return dataSource.detailsData;
};


export default Storage = {
    getData: getData,
    getDetails: getDetails,
    saveData: saveData
};