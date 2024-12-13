const mongoose = require('mongoose');

const laptopSchema = new mongoose.Schema({
    user: {
        ref
    },
    macAddress: String,
    comments: String,
    domain: String,
    wlanMacAddress: String,
    ethMacAddress: String,
    internalTag: String,
    brand: String,
    model: String,
    serialNo: String,
    storageType: String,
    storageCapacity: String,
    processor: String,
    ram: String,
    os: String,
    osProductKey: String,
    softwares: [String],
    powerAdapter: String,
    externalScreen: String,
    keyboard: String,
    mouse: String,
    carryBag: String,
    warrantyDate: Date,
    issueDate: Date,
    returnDate: Date,
    lastDateOfWarranty: Date,
});

const Laptop = mongoose.model('Laptop', laptopSchema);

// Repeat similarly for desktops, accessories, phonesAndTabs, etc.
