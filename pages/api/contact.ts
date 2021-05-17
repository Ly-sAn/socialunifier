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
    subject: `Message From Earth`,
    text: "Sent from: " + req.body.email,
    html: `<div>COUCOU</div><p>Sent from:
    ${req.body.email}</p>`
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