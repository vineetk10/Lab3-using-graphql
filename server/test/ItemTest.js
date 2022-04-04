var expect    = require("chai").expect;
const ItemManager = require('../Manager/ItemManager');

describe('Item Test', function(){

    it('returns all items of a shop', async function(){
        var items = await ItemManager.getItemsOfShop({
            "query": {},
            "body": {"ShopId": 2}
        })

        expect(items.length).to.equal(4);
    })

    it('returns all items of other shops', async function(){
        var items = await ItemManager.getAllItemsOfOtherShops({
            "query": {},
            "body": {"UserId": 1}
        })

        expect(items.length).to.equal(4);
    })

    it('returns all favorite items of a user', async function(){
        var items = await ItemManager.getAllFavoriteItems({
            "query": {},
            "body": {"UserId": 2}
        })

        expect(items.length).to.equal(1);
    })
})