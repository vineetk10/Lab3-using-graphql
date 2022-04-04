import React, { useEffect, useState } from 'react';
import FavoriteItemCard from './FavoriteItemCard';
import "../../css/Cards.css";
const Cards =({favorites})=>{
    return(
                <div className="row" id="cards">
                    {/* {favorites.map((favorite,index)=>{
                        return(
                            <div key={index} className="col-4 mb-4">
                                <FavoriteItemCard favorite={favorite}/>
                             </div>   
                        )
                    })} */}
                </div>
           
    )
}

export default Cards