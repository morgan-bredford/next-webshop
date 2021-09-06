import { MongoClient } from "mongodb"
import bcrypt from "bcrypt"

export default async function register(req, res) {
  console.log(req.body)
  let new_user = { ...req.body, admin: false }
  await bcrypt.hash(req.body.password, 10, function (err, hash) {
    new_user = { ...new_user, password: hash }
  })

  try {
    const client = await MongoClient.connect(process.env.DB_LOGIN)
    const db = client.db()
    const coll = db.collection("wbusers")
    await coll.insertOne(new_user)
    client.close()
    res.send(new_user)
  } catch (error) {
    //console.log(error)
    //res.status(401).json({ error: "db error" })
    res.status(401).send(error)
  }
}
