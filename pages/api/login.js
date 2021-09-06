import { MongoClient } from "mongodb"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export default async function login(req, res) {
  console.log(req.body)
  const client = await MongoClient.connect(process.env.DB_LOGIN)
  const db = client.db()
  const coll = db.collection("wbusers")
  const user = await coll.findOne({ email: req.body.email })
  client.close()

  if (!user) {
    res.status(403).json({ error: "Emailen är inte registrerad" })
  } else {
    const match = await bcrypt.compare(req.body.password, user.password)
    user.password = ""
    if (!match) {
      res.status(403).json({ error: "felaktigt lösenord" })
    } else if (user.admin) {
      const jwtToken = jwt.sign(
        { email: user.email, id: user._id },
        process.env.JWT_SECRET
      )
      res.send({ user, jwtToken })
    } else {
      res.send({ user })
    }
  }
}
