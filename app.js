const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');
const { getMaxListeners } = require('process');

const app = express();

// View engiune setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('index', { layout: false });
});

app.post('/send', (req, res) => {
  const output = `
    <p>Masz nową wiadomość</p>
    <h3>Dane kontaktowe</h3>
    <ul>
      <li>Imię: ${req.body.name}</li>
      <li>Imię: ${req.body.email}</li>
      <li>Imię: ${req.body.message}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
  `;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'zaliczeniebackend@gmail.com', // generated ethereal user
      pass: 'abcd!123', // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  // send mail with defined transport object
  let mailOptions = {
    from: '"Nodemailer Contact" <zaliczeniebackend@gmail.com>', // sender address
    to: "zaliczeniebackend@gmail.com", // list of receivers
    subject: "Node contact request", // Subject line
    text: "Hello world?", // plain text body
    html: output, // html body
  };

  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      return log('Error occurs');
    }
    return log('Email sent!!!');
  });

  res.render('index', { layout: false }, { msg: "Email has been send" })

})

app.listen(3000, () => console.log('Server started...'));