import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "m.raed.khatib@gmail.com",
    pass: "lxdjhgiobwycxuau",
  },
});

export const envoyerCourriel = (userName, req, res, next) => {
  let mailOptions = {
    from: "m.raed.khatib@gmail.com",
    to: req.body.email,
    subject: "Bienvenu chez CarFinder",
    html: `
    <div style="text-align: left;">
      <a href="http://localhost:3000" target="_blank">
        <img src="https://i.imgur.com/ybve9hi.png" alt="Logo" style="width: 100px;">
      </a>
      <h1 style="font-size: 2em; color: #333;">Bienvenu chez CarFinder</h1>
      <p>Cher(e) ${userName},</p>
      <p>Merci de vous être inscrit(e) sur notre plateforme. Nous espérons que vous apprécierez l'utiliser.</p>
      <p>Si vous n'êtes pas à l'origine de cette inscription, nous vous recommandons de sécuriser votre adresse courriel en changeant votre mot de passe. Ne partagez jamais vos informations personnelles avec des tiers et assurez-vous de nous contacter si vous rencontrez des problèmes ou si vous avez des préoccupations.</p>
      <p>Bienvenue à bord et profitez de votre expérience sur notre plateforme!</p>
      <p>Cordialement,</p>
      <p>L'équipe de carFinder</p>
    </div>
  `,
  };
  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      console.log("Erreur Occure", err);
    } else {
      console.log("Email sent successfully");
    }
    next();
  });
};
