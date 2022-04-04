const db = require('../Services/db');

module.exports = {
    checkAvailability : async function(req){
        let users = await db.query(`SELECT * FROM Shop where ShopName="${req.body.shopName}"`);
        return users.length==0 ? true : false;
    }
}