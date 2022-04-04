var expect    = require("chai").expect;
const ShopManager = require('../Manager/ShopManager');

describe('Shop Test', function(){

    it('check if a shop name with name vineet is available', async function(){
        var isAvailable = await ShopManager.checkAvailability({
            "query": {},
            "body": {"shopName": "vineet"}
        })

        expect(isAvailable).to.equal(false);
    })

    it('check if a shop name with name random is available', async function(){
        var isAvailable = await ShopManager.checkAvailability({
            "query": {},
            "body": {"shopName": "random"}
        })

        expect(isAvailable).to.equal(true);
    })
})