import bcrypt from 'bcrypt'
import { NextApiResponse } from 'next'
import database from "../../lib/database"
import withSession from '../../lib/session';
import { ApiResult } from '../../types';

export default withSession(async (req, res: NextApiResponse<ApiResult>) => {
  
  try {
    const { email, password } = await req.body;

    const hash = await bcrypt.hash(password, 3)
    await database.register({ email, pwdHash: hash })

    req.session.set("user", {email})

    await req.session.save()
  
    res.json({ success: true })
  } catch (err) {
    console.error(err);
    res.json({ success: false})
  }
})
