
const db = require('../Services/db');

exports.SaveOrder = async (req,res) => {
    let sql_string = `INSERT INTO Orders(UserId,OrderDate) VALUES('${req.body.UserId}',curdate());`
    let rowsInserted =await db.query(sql_string); //insertId

    let values = [];
    let sql_string2 = "INSERT INTO OrderDetails(OrderId,ItemId) VALUES";
    let itemString = "";
    for(let item of req.body.Items){
        // values.push({OrderId: rowsInserted.insertId, ItemId: item.ItemId});
        sql_string2+= `(${rowsInserted.insertId}, ${item.ItemId}),`
        itemString += `(${item.ItemId},)`
    }
    const editedSql_string2 = sql_string2.slice(0, -1);
    // let sql_string2 = "";
    const editedItemString = itemString.slice(0,-2);
    let rowsInserted1 =await db.query(editedSql_string2);
    await db.query(`UPDATE Items SET Quantity = Quantity-1 WHERE ItemId in ${editedItemString})`);
    return res.json({message:rowsInserted1.affectedRows+" records inserted"});
}

exports.GetAllPurchases = async(req,res)=>{
    let sql_string = `Select ItemImage, ItemName, Quantity, Price,ShopName, OrderDate
    From Orders o inner join OrderDetails od on o.OrderId = od.OrderId
    inner join Items i on i.ItemId=od.ItemId
    Inner JOIN Shop s on i.ShopId=s.ShopId
    where o.UserId=${req.body.UserId}`;
    let purchases =await db.query(sql_string);
    return res.json({purchases:purchases});
}