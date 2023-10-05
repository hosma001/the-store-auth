const {
  fetchProducts,
  fetchFavorites,
  fetchOrders,
  fetchLineItems,
  createLineItem,
  createFavorite,
  updateLineItem,
  deleteLineItem,
  deleteFavorite,
  updateOrder,
  authenticate,
  findUserByToken
} = require('./db');

const express = require('express');
const app = express.Router();

const isLoggedIn = async(req, res, next)=> {
  try {
    const user = await findUserByToken(req.headers.authorization);
    req.user = user;
    next();
  }
  catch(ex){
    next(ex);
  }
};

const isAdmin = (req, res, next)=> {
  if(req.user.is_admin){
    next();
  }
  else {
    const error = Error('must be admin');
    error.status = 401;
    next(error);
  }
};

app.post('/login', async(req, res, next)=> {
  try {
    const token = await authenticate(req.body);
    res.send({ token });
  }
  catch(ex){
    next(ex);
  }
});

app.get('/me', isLoggedIn, (req, res, next)=> {
  try {
    res.send(req.user);
  } 
  catch(ex){
    next(ex);
  }
});

app.get('/products', async(req, res, next)=> {
  try {
    res.send(await fetchProducts());
  }
  catch(ex){
    next(ex);
  }
});

app.put('/orders/:id', isLoggedIn, async(req, res, next)=> {
  try {
    //TODO make sure the order's user_id is req.user.id
    res.send(await updateOrder({ ...req.body, id: req.params.id}));
  }
  catch(ex){
    next(ex);
  }
});

app.get('/orders', isLoggedIn, async(req, res, next)=> {
  try {
    res.send(await fetchOrders(req.user.id));
  }
  catch(ex){
    next(ex);
  }
});

app.get('/favorites', isLoggedIn, async(req, res, next)=> {
  try {
    res.send(await fetchFavorites(req.user.id));
  }
  catch(ex){
    next(ex);
  }
});

app.post('/favorites', isLoggedIn, async(req, res, next)=> {
  try {
    res.send(await createFavorite({user_id: req.user.id, product_id: req.body.product_id}));
  }
  catch(ex){
    next(ex);
  }
});

app.delete('/favorites/:id', isLoggedIn, async(req, res, next)=> {
  try {
    await deleteFavorite({ id: req.params.id, user_id: req.user.id });
    res.sendStatus(201);
  }
  catch(ex){
    next(ex);
  }
});

app.get('/lineItems', isLoggedIn, async(req, res, next)=> {
  try {
    res.send(await fetchLineItems(req.user.id));
  }
  catch(ex){
    next(ex);
  }
});

app.post('/lineItems', isLoggedIn, async(req, res, next)=> {
  try {
    //TODO make sure the order's user_id is req.user.id 
    res.send(await createLineItem(req.body));
  }
  catch(ex){
    next(ex);
  }
});

app.put('/products/:id', isLoggedIn, isAdmin, (req, res, next)=> {
  res.send('hello world');
});

app.put('/lineItems/:id', isLoggedIn, async(req, res, next)=> {
  try {
    //TODO make sure the order's user_id is req.user.id 
    res.send(await updateLineItem({...req.body, id: req.params.id}));
  }
  catch(ex){
    next(ex);
  }
});

app.delete('/lineItems/:id', isLoggedIn, async(req, res, next)=> {
  try {
    //TODO make sure the order's user_id is req.user.id 
    await deleteLineItem({ id: req.params.id });
    res.sendStatus(204);
  }
  catch(ex){
    next(ex);
  }
});

module.exports = app;
