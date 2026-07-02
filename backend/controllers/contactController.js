const sendEmail = require("../utils/sendEmail");

const contact = async (req, res) => {

  try {

    const {
      name,
      email,
      subject,
      message,
    } = req.body;

    if (
      !name ||
      !email ||
      !subject ||
      !message
    ) {

      return res.status(400).json({
        message: "All fields are required",
      });

    }

    await sendEmail(

      process.env.EMAIL_USER,

      `Contact Form: ${subject}`,

`New Contact Message

Name: ${name}

Email: ${email}

Subject: ${subject}

Message:

${message}`

    );

    res.status(200).json({

      message: "Message sent successfully",

    });

  } catch (error) {

    res.status(500).json({

      message: error.message,

    });

  }

};

module.exports = {
  contact,
};