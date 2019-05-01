//Created this file to make the recycling rate data easier to use and also filter out the years we don't want

var obj = {
  
};

const communityDistricts = require('./RecyclingRatesUNFORMATED.json');

communityDistricts.forEach(element => {

    let fiscalyear = element["FiscalYear"];
    if(parseInt(fiscalyear) < 2013 || parseInt(fiscalyear)  === 2019 ){ //Not including years before 2013 and also 2019 which doesn't have all the months
        return;
    }
    let fiscalMonthNumber = element["FiscalMonthNumber"];
    let districtName = element["District"]; 

    if(!obj.hasOwnProperty(fiscalyear)){
        obj[fiscalyear] = {};
        
    }
   
    if(!obj[fiscalyear].hasOwnProperty(fiscalMonthNumber)){
        obj[fiscalyear][fiscalMonthNumber] = {};
        
    }
    delete element["FiscalYear"];
    delete element["FiscalMonthNumber"];
    delete element["District"];
    obj[fiscalyear][fiscalMonthNumber][districtName] = element;

    
});


var json = JSON.stringify(obj);

var fs = require('fs');
fs.writeFile('RecyclingRates.json', json, 'utf8', function(){});