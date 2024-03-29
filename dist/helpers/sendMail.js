"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mailgun = require('mailgun-js');
const DOMAIN = 'castingsecret.com';
exports.mg = mailgun({ apiKey: '13c992e774b054f494bbd805381e4816-f696beb4-b9c906c7', domain: DOMAIN, host: "api.eu.mailgun.net" });
function sendResetPasswordMail(mail, resetCode) {
    const data = {
        from: 'Casting mail@castingsecret.com',
        to: `${mail}`,
        subject: 'Reset Password Code',
        text: ` Hi , 
        Your code is ${resetCode} .`
    };
    exports.mg.messages().send(data, (error, body) => {
        console.log(body);
    });
}
exports.sendResetPasswordMail = sendResetPasswordMail;
function sendMailWithCustomHtmlTemplate(mails, template) {
    mails.forEach(email => {
        const data = {
            from: 'Casting info@castingsecret.com',
            to: `${email}`,
            subject: 'Casting Secret News Letter',
            html: template,
        };
        exports.mg.messages().send(data, (error, body) => {
            console.log(body);
        });
    });
}
exports.sendMailWithCustomHtmlTemplate = sendMailWithCustomHtmlTemplate;
function sendActivationMail(mail, userName, link) {
    const data = {
        from: 'Casting mail@castingsecret.com',
        to: `${mail}`,
        subject: 'Activate your Casting account ',
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
                                  <br>
                                     <p>You successfully created an account. Thank you for being a member of Casting Secret friends. Start engaging , reacting and sharing your awesome production work on your wall and profile. Invite your actors, Voice Overs and Models friends to join you for easier and professional casting calls finding.</p>
                                  <br>
                                  Glad to have you and Welcome to the talents and filmmaker space.
                                  <br>
                                  Sincerely,
                                  <br>
                                  <br>
                                  Casting Secret Team .
                                  <br>
                                     <p>
                                    (${userName} )   أهلا وسهلا
لقد أنشأت حسابك بنجاح. شكرا لانضمامك إلى قائمة أصدقاء كاستنج سيكريت. ابدأ بالتفاعل ومشاركة أعمالك الانتاجية الرائعة على الحائط وعلى الملف الشخصي. ادع اصدقائك الممثلين والمعلقين الصوتيين والعارضين للانضمام لسهولة مشاركة الأعمال وإيجاد طلبات النداءات بشكل احترافي.

سعيدون بانضمامك و أهلا بك مرة أخرى في فضاء المواهب وصناع الأفلام 
تحياتنا 
فريق كاستنج سيكريت.

                                     </p>
                                  <center>
                                    <strong> Activate your Casting account Now </strong><br>
                                    <br>
                                    <div>

                                      <a href='${link}'
                                        style="background-color: #3c2b3f;border-radius:5px;color:#ffffff;display:inline-block;font-family:sans-serif;font-size:15px;font-weight:bold;line-height:45px;text-align:center;text-decoration:none;width:200px;-webkit-text-size-adjust:none;">
                                       Click to Activate </a>
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
    exports.mg.messages().send(data, (error, body) => {
        console.log(body);
    });
}
exports.sendActivationMail = sendActivationMail;
function sendWelcomeMail(mail, userName) {
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
                                  <br>
                                     <p>You successfully created an account. Thank you for being a member of Casting Secret friends. Start engaging , reacting and sharing your awesome production work on your wall and profile. Invite your actors, Voice Overs and Models friends to join you for easier and professional casting calls finding.</p>
                                  <br>
                                  Glad to have you and Welcome to the talents and filmmaker space.
                                  <br>
                                  Sincerely,
                                  <br>
                                  <br>
                                  Casting Secret Team .
                                  <br>
                                     <p>
                                    (${userName} )   أهلا وسهلا
لقد أنشأت حسابك بنجاح. شكرا لانضمامك إلى قائمة أصدقاء كاستنج سيكريت. ابدأ بالتفاعل ومشاركة أعمالك الانتاجية الرائعة على الحائط وعلى الملف الشخصي. ادع اصدقائك الممثلين والمعلقين الصوتيين والعارضين للانضمام لسهولة مشاركة الأعمال وإيجاد طلبات النداءات بشكل احترافي.

سعيدون بانضمامك و أهلا بك مرة أخرى في فضاء المواهب وصناع الأفلام 
تحياتنا 
فريق كاستنج سيكريت.

                                     </p>
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
    exports.mg.messages().send(data, (error, body) => {
        console.log(body);
    });
}
exports.sendWelcomeMail = sendWelcomeMail;
function sendInviteMail(mail) {
    const data = {
        from: 'Casting mail@castingsecret.com',
        to: `${mail}`,
        subject: 'Invite To Casting',
        text: `Hello ,`,
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
                                  Hello&nbsp,<br>
                                  <br>We Invite you to join our website casting secret.<br>
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
    exports.mg.messages().send(data, (error, body) => {
        console.log(body);
    });
}
exports.sendInviteMail = sendInviteMail;
function sendInterviewDate(mail, userName, date, interviewLocation, interviewName, jobLink) {
    const data = {
        from: 'Casting mail@castingsecret.com',
        to: `${mail}`,
        subject: 'Job Interview To Casting',
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
                                  <br>
                                     <p> Congratulation! You Accept In Job And Have Inivitation For Interview
                                     on ${date} \n
                                     location  :  ${interviewLocation} \n
                                     Contact Number  ${interviewName} </p>
                                  <br>
                                  <a href="${jobLink}"
                                  style="background-color: #3c2b3f;border-radius:5px;color:#ffffff;display:inline-block;font-family:sans-serif;font-size:15px;font-weight:bold;line-height:45px;text-align:center;text-decoration:none;width:200px;-webkit-text-size-adjust:none;">Go
                                  To Job </a>
                                  <br>
                                  Sincerely,
                                  <br>
                                  <br>
                                  Casting Secret Team .
                                  <br>
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
    exports.mg.messages().send(data, (error, body) => {
        console.log(body);
    });
}
exports.sendInterviewDate = sendInterviewDate;
//# sourceMappingURL=sendMail.js.map