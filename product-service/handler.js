const products = require('./products');
'use strict';

module.exports.getProducts = async (event) => {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(products)
  };
};

module.exports.getProductById = async (event) => {
  const { id } = event.pathParameters;
  const product = products.find(product => product.id === id);
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(product)
  };
};
