import { MongoClient } from "mongodb"

export default async function users(req, res) {
  const update = await JSON.parse(req.body)
  console.log(update)
  try {
    const client = await MongoClient.connect(process.env.DB_LOGIN)
    const db = client.db()
    const coll = db.collection("wbusers")
    const updated_doc = await coll.findOneAndUpdate(
      { email: update.email },
      { $set: { ...update } },
      {
        returnOriginal: false,
      }
    )
    client.close()
    const { email, firstname, lastname } = updated_doc.value
    const returnUser = { email, firstname, lastname }
    res.status(200).send(returnUser)
  } catch (error) {
    //console.log(error)
    //res.status(401).json({ error: "db error" })
    res.status(401).send(error)
  }
}
