import transporter from "~/config/emailConfig";
import hbs from 'nodemailer-express-handlebars';

export default class Email {
    // trigger the sending of the E-mail
    async sendEmail(mailOptions) {

        // use a template file with nodemailer
        transporter.use('compile', hbs(mailOptions))

        // send mail 
        return transporter.sendMail(mailOptions).then((response) => {
            var res = {
                status: true,
                response: response
            };

            return res;

        }).catch((err) => {

            var res = {
                status: false,
                response: err
            };
            return res;
        })

    }
}

// var mailOptions = {
//     from: '"Adebola" <adebola.rb.js@gmail.com>', // sender address
//     to: 'adebola.rb.js@gmail.com', // list of receivers
//     subject: 'Welcome!',
//     template: 'email', // the name of the template file i.e email.handlebars
//     context: {
//         name: "Adebola", // replace {{name}} with Adebola
//         company: 'My Company' // replace {{company}} with My Company
//     }
//     attachments: [{ filename: "pic-1.jpeg", path: "./attachments/pic-1.jpeg" }],
//      cc: 'onedebos@gmail.com',
//      bcc: 'adebola.rb.js@gmail.com'
// };