const mailgun = require('mailgun-js');
const DOMAIN = 'castingsecret.com';
const mg = mailgun({ apiKey: '13c992e774b054f494bbd805381e4816-f696beb4-b9c906c7', domain: DOMAIN, host: "api.eu.mailgun.net" });
export function sendMail(mail, resetCode) {
    const data = {
        from: 'Casting mail@castingsecret.com',
        to: `${mail}`,
        subject: 'Reset Password Code',
        text: ` Hi , 
        Your code is ${resetCode} .`
    };
    mg.messages().send(data, (error, body) => {
        console.log(body);
    });
}

export function sendWelcomeMail(mail, userName) {
    const data = {
        from: 'Casting mail@castingsecret.com',
        to: `${mail}`,
        subject: 'Welcome To Casting',
        text: `Welcome ,`,
        html: `
        <body bgcolor="#F5F8FA" style="-webkit-text-size-adjust:none;margin:0;padding:0;">
  <!-- Background -->
  <table align="center" border="0" cellpadding="0" cellspacing="0"
    style="border-collapse:collapse;background-color:#f5f8fa;text-align:center;" width="100%">
    <tbody>
      <tr>
        <td align="center" class="framepadding" style="padding-left:30px;padding-right:30px;">
          <!--FRAME-->
          <table align="center" border="0" cellpadding="0" cellspacing="0" class="frame"
            style="border-collapse:collapse;background-color:#f5f8fa;width:600px;min-width:320px;text-align:center;">
            <tbody>
              <tr>
                <td style="font-size:15px;font-family:Arial,sans-serif;line-height:18px;">
                  <!--preheader -->
                  <table align="center" border="0" cellpadding="0" cellspacing="0"
                    style="border-collapse:collapse;width:100%;text-align:center;">
                    <tbody>
                      <tr>

                      </tr>
                    </tbody>
                  </table>
                  <!--/preheader -->
                </td>
              </tr>
              <tr>
                <td>
                  <!-- header -->
                  <table align="left" border="0" cellpadding="0" cellspacing="0"
                    style="border-collapse:collapse;/* background-color:#55acee; */background-color: #3c2b3f;text-align:left;"
                    width="100%">
                    <tbody>
                      <tr>
                        <td class="preblue"
                          style="font-size:0px;line-height:0px;color: white;padding-left:30px;margin-top: 10px;padding-top: 20px;padding-bottom:8px;height: 30px;">

                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <!--/header-->
                </td>
              </tr>
              <tr>
                <td>
                  <!-- banner -->
                  <table align="center" border="0" cellpadding="0" cellspacing="0"
                    style="border-collapse:collapse;background-color:#ffffff;text-align:center;" width="100%">
                    <tbody>
                    </tbody>
                  </table>
                  <!--/banner-->
                </td>
              </tr>
              <tr>
                <td>
                  <!-- body -->
                  <table align="left" bgcolor="#FFFFFF" border="0" cellpadding="0" cellspacing="0"
                    style="border-collapse:collapse;text-align:left;" width="100%">
                    <tbody>
                      <tr>
                        <td class="bodypadding"
                          style="padding:30px;font-size:15px;font-family:Arial,sans-serif;line-height:18px;color:#66757f;">
                          <!-- columns -->
                          <table align="left" bgcolor="#FFFFFF" border="0" cellpadding="0" cellspacing="0"
                            style="border-collapse:collapse;text-align:left;" width="100%">
                            <tbody>
                              <tr>
                                <!-- left column -->
                                <td class="stack"
                                  style="font-size:15px;font-family:Arial,sans-serif;line-height:18px;color:#66757f;vertical-align:top;"
                                  valign="top">
                                  Hello&nbsp ${userName};,<br>
                                  <br>Thank you for joining our website !.<br>
                                  <br>Sincerely,




                                  <br>
                                  <br>
                                  Casting Secret Team .
                                  <br>
                                  <center>
                                    <strong>Want To Start Your Adventure ?</strong><br>
                                    <br>
                                    <div>

                                      <a href="https://castingsecret.com/"
                                        style="background-color: #3c2b3f;border-radius:5px;color:#ffffff;display:inline-block;font-family:sans-serif;font-size:15px;font-weight:bold;line-height:45px;text-align:center;text-decoration:none;width:200px;-webkit-text-size-adjust:none;">Go
                                        To Casting now!</a>
                                    </div>
                                  </center>
                                </td><!-- /left column -->
                              </tr>
                            </tbody>
                          </table><!-- /columns -->
                        </td>
                      </tr>
                    </tbody>
                  </table><!-- /body -->
                </td>
              </tr>
              <tr>
                <td>
                  <!-- footer -->
                  <!-- /footer -->
                </td>
              </tr>
              <tr>
                <td bgcolor="#F5F8FA">&nbsp;</td>
              </tr>
            </tbody>
          </table><!-- /FRAME -->
        </td>
      </tr>
    </tbody>
  </table><!-- /Background -->

</body>
        `
    };
    mg.messages().send(data, (error, body) => {
        console.log(body);
    });
}
