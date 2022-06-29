'use strict';
const { Client } = require('pg');

const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;
const dbOptions = {
    host: PG_HOST,
    port: PG_PORT,
    database: PG_DATABASE,
    user: PG_USERNAME,
    password: PG_PASSWORD,
    ssl: {
        rejectUnauthorized: false
    },
    connectionTimeoutMillis: 5000
};

module.exports.getProducts = async (event) => {
  const client = new Client(dbOptions);
  await client.connect();

  try {

    const response = await client.query(`select * from product_list 
              inner join stock_list on product_list.id = stock_list.product_id`);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(response.rows)
    };

  } catch (error) {

    console.error('Error during database request executing: ', error);
    
  } finally {

    client.end();

  }
};

module.exports.getProductById = async (event) => {
  const passedId = event.pathParameters['id'];
  const client = new Client(dbOptions);
  await client.connect();

  try {

    const response = await client.query(`select * from product_list 
        inner join stock_list on product_list.id = stock_list.product_id
        where product_list.id = '` + passedId + "'");

      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify(response.rows)
      };

  } catch (error) {

    console.error('Error during database request executing: ', error);
    
  } finally {

    client.end();

  }
};

module.exports.createNewProduct = async (event) => {
  const newProduct = JSON.parse(event.body);
  const client = new Client(dbOptions);
  await client.connect();
  
  try {
    
    const newId = await client.query(`insert into product_list (title, description, price, image) values
        ('` + newProduct.title + "', '" + newProduct.description + "', " + newProduct.price + ", '" + newProduct.image + "') OUTPUT inserted.id)");
    
    const result2 = await client.query(`insert into stock_list (product_id, count) values 
        ('` + newId + "', " + newProduct.count + ")");

    const createdProduct = await this.getProductById({pathParameters: {id: newId}});

    console.log(newId);
    console.log(result2);
    console.log(result2);

      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify(createdProduct)
      };

  } catch (error) {

    console.error('Error during database request executing: ', error);
    
  } finally {

    client.end();

  }
}
