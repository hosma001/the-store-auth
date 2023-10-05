import React from 'react';
import { Link } from 'react-router-dom';

const Favorite = ({ product, favorite, createFavorite, removeFavorite })=> {
  return(
    <div>
      {
        favorite ? <button onClick={ ()=> { removeFavorite(favorite) } }>Remove Favorite</button> : <button onClick={ ()=> {createFavorite({ product_id: product.id })}}>Add Favorite</button>
      }
    </div>
  )  
};

const Products = ({ products, cartItems, createLineItem, updateLineItem, auth, favorites, createFavorite, removeFavorite })=> {
  return (
    <div>
      <h2>Products</h2>
      <h3>You have { favorites.length } favorites</h3>
      <ul>
        {
          products.map( product => {
            const cartItem = cartItems.find(lineItem => lineItem.product_id === product.id);
            return (
              <li key={ product.id }>
                { product.name }
                {
                  auth.id ? (
                    cartItem ? <button onClick={ ()=> updateLineItem(cartItem)}>Add Another</button>: <button onClick={ ()=> createLineItem(product)}>Add</button>
                  ): null 
                }
                {
                  auth.is_admin ? (
                    <Link to={`/products/${product.id}/edit`}>Edit</Link>
                  ): null
                }
                {
                  auth.id ? 
                  <Favorite 
                  product={ product } 
                  favorite={ favorites.find(favorite => favorite.product_id === product.id)}
                  createFavorite={ createFavorite }
                  removeFavorite={ removeFavorite }
                  />: null
                }
              </li>
            );
          })
        }
      </ul>
    </div>
  );
};

export default Products;
