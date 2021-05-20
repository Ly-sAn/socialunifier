import type { NextApiRequest, NextApiResponse } from "next";

export default function (req: NextApiRequest, res: NextApiResponse) {

  let nodemailer = require('nodemailer')
  const transporter = nodemailer.createTransport({
    port: 465,
    host: "smtp.gmail.com",
    auth: {
      user: 'socialunifier101@gmail.com',
      pass: 'CodingFactory2023',
    },
    secure: true,
  });

  const mailData = {
    from: 'socialunifier101@gmail.com',
    to: req.body.email,
    subject: `Newsletter de Social Unifier`,
    text: "Envoyé par l'équipe de Social Unifier ",
    html: `<h1>Merci d'avoir souscrit à la newsletter de Social Unfier</h1><p>Vous serez désormais mis au courant de nos dernières
     nouveautés, et bien plus encore ! <br><br> A bientôt sur notre plateforme, <a href='http://localhost:3000'>L'équipe de Social Unifier</a> !</p>`
  };

  console.log(req.body);

  transporter.sendMail(mailData, function (err, info) {
    if (err)
      console.log(err)
    else
      console.log(info)
  });
  res.status(200);  
}