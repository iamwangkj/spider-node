const { MongoClient } = require('mongodb')
const url = 'mongodb://localhost:27017/'

const getRow = async (db = '', col = '', query = {}, options = {
  // sort matched documents in descending order by rating
  // sort: { id: -1 }
}) => {
  const client = new MongoClient(url)
  try {
    await client.connect()
    const database = client.db(db)
    const collection = database.collection(col)
    const res = await collection.findOne(query, options)
    return res
  } catch (err) {
    console.dir(err)
  } finally {
    await client.close()
  }
}

const getRows = async (opt = {
  db: '',
  col: '',
  query: {},
  options: {}
}, cb) => {
  const { db, col, query, options } = opt
  const client = new MongoClient(url)
  try {
    await client.connect()
    const database = client.db(db)
    const collection = database.collection(col)
    const cursor = await collection.find(query, options)
    const docs = await cursor.toArray()
    cb(docs)
  } catch (err) {
    console.dir(err)
  } finally {
    await client.close()
  }
}

const insertOne = async (db = '', col = '', doc = {}) => {
  const client = new MongoClient(url)
  try {
    await client.connect()
    const database = client.db(db)
    const collection = database.collection(col)
    const res = await collection.insertOne(doc)
    console.log(`${res.insertedCount} documents were inserted with the _id: ${res.insertedId}`)
  } catch (err) {
    console.error(err)
  } finally {
    await client.close()
  }
}

const insertMany = async (db = '', col = '', docs = []) => {
  const client = new MongoClient(url)
  try {
    await client.connect()
    const database = client.db(db)
    const collection = database.collection(col)
    // this option prevents additional documents from being inserted if one fails
    const options = { ordered: true }
    const res = await collection.insertMany(docs, options)
    console.log(`${res.insertedCount} documents were inserted`)
  } catch (err) {
    console.error(err)
  } finally {
    await client.close()
  }
}

module.exports = {
  getRow,
  getRows,
  insertOne,
  insertMany
}
