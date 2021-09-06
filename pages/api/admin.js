import { MongoClient } from "mongodb"
import jwt from "jsonwebtoken"

export default async function admin(req, res) {
  const client = await MongoClient.connect(process.env.DB_LOGIN)
  const db = client.db()
  const coll = db.collection("wbproducts")
  const user = await coll.insertOne(req.body)
  client.close()
  res.send({ message: "hi" })
}
