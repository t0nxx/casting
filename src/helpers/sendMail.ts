const mailgun = require('mailgun-js');
const DOMAIN = 'castingsecret.com';
export const mg = mailgun({ apiKey: '13c992e774b054f494bbd805381e4816-f696beb4-b9c906c7', domain: DOMAIN, host: "api.eu.mailgun.net" });

export function sendResetPasswordMail(mail, resetCode, userName) {
  const data = {
    from: 'Casting info@castingsecret.com',
    to: `${mail}`,
    subject: 'Casting Reset Password Code',
    html: `
    <body>
    <table cellspacing="0" cellpadding="0" border="0"
      style="color:#333;background:#fff;padding:0;margin:0;width:100%;font:15px/1.25em &#39;Helvetica Neue&#39;,Arial,Helvetica">
      <tbody>
        <tr width="100%">
          <td valign="top" align="left"
            style="background:#eef0f1;font:15px/1.25em &#39;Helvetica Neue&#39;,Arial,Helvetica">
            <table style="border:none;padding:0 18px;margin:50px auto;width:500px">
              <tbody>
                <tr width="100%" height="60">
                  <td valign="top" align="left"
                    style="border-top-left-radius:4px;border-top-right-radius:4px;background:#3c2b3f;padding:10px 18px;text-align:center">
                    <img height="100" width="125" src="https://casting-secret-new.s3.eu-central-1.amazonaws.com/images/1582555484792%20-%20logo%2050.jpg" title="Castingsecret"
                      style="font-weight:bold;font-size:18px;color:#fff;vertical-align:top"> </td>
                </tr>
                <tr width="100%">
                  <td valign="top" align="left" style="background:#fff;padding:18px">
                    <h1 style="font-size:20px;margin:16px 0;color:#333;text-align:center"> Dear
                      ${userName} , You Reset Password Code is  </h1>
  
                    <div style="background:#f6f7f8;border-radius:3px">
                      <br>
                      <h1
                        style="font:40px/1.25em &#39;Helvetica Neue&#39;,Arial,Helvetica;text-align:center">
                        ${resetCode} 
                      </h1>
                    </div>
                    <p style="font:14px/1.25em &#39;Helvetica Neue&#39;,Arial,Helvetica;color:#333">
                      <strong>Casting Secret </strong>
                    <p>Copyright © 2020 castingsceret, All rights reserved. </p>
                    <p> 9091 Abdulmajid
                      Shubukshi · Jeddah 23434 · Saudi Arabia</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
    `
  };
  mg.messages().send(data, (error, body) => {
    console.log(body);
  });
}

export function sendMailWithCustomHtmlTemplate(mails: string[], template: string) {
  mails.forEach(email => {
    const data = {
      from: 'Casting info@castingsecret.com',
      to: `${email}`,
      subject: 'Casting Secret News Letter',
      html: template,
    };
    mg.messages().send(data, (error, body) => {
      console.log(body);
    });
  })
}

export function sendActivationMail(mail, userName, link) {
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
  mg.messages().send(data, (error, body) => {
    console.log(body);
  });
}

export function sendInviteMail(mail) {
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
  mg.messages().send(data, (error, body) => {
    console.log(body);
  });
}


export function sendInterviewDate(mail, userName, date, interviewLocation, interviewName, jobLink) {
  const data = {
    from: 'Casting mail@castingsecret.com',
    to: `${mail}`,
    subject: 'Job Interview To Casting',
    text: `Welcome ,`,
    html: `
    <body>
    <table cellspacing="0" cellpadding="0" border="0"
      style="color:#333;background:#fff;padding:0;margin:0;width:100%;font:15px/1.25em &#39;Helvetica Neue&#39;,Arial,Helvetica">
      <tbody>
        <tr width="100%">
          <td valign="top" align="left"
            style="background:#eef0f1;font:15px/1.25em &#39;Helvetica Neue&#39;,Arial,Helvetica">
            <table style="border:none;padding:0 18px;margin:50px auto;width:500px">
              <tbody>
                <tr width="100%" height="60">
                  <td valign="top" align="left"
                    style="border-top-left-radius:4px;border-top-right-radius:4px;background:#3c2b3f;padding:10px 18px;text-align:center">
                    <img height="100" width="125" src="https://casting-secret-new.s3.eu-central-1.amazonaws.com/images/1582555484792%20-%20logo%2050.jpg" title="Castingsecret"
                      style="font-weight:bold;font-size:18px;color:#fff;vertical-align:top"> </td>
                </tr>
                <tr width="100%">
                  <td valign="top" align="left" style="background:#fff;padding:18px">
                    <h1 style="font-size:20px;margin:16px 0;color:#333;text-align:center"> Dear&nbsp
                      ${userName} ,</h1>
  
                    <div style="background:#f6f7f8;border-radius:3px">
                      <br>
                      <h1
                        style="font:40px/1.25em &#39;Helvetica Neue&#39;,Arial,Helvetica;text-align:center">
                        Congratulation!
                      </h1>
                      <p
                        style="font:20px/1.25em &#39;Helvetica Neue&#39;,Arial,Helvetica;text-align:center">
                        You Accept In A Job And Have Inivitation For Interview
                        on ${date} </p>
                      <span style="color: red;margin-left: 10px;">location : </span> ${interviewLocation} <br>
                      <span style="color: red;margin-left: 10px;">Contact Number : </span> ${interviewName}
                      </p>
                      <p style="font:15px/1.25em;margin-bottom:0;text-align:center"> <a
                          href="${jobLink}"
                          style="border-radius:3px;background:#3c2b3f;color:#fff;display:block;font-weight:700;font-size:16px;line-height:1.25em;margin:24px auto 6px;padding:10px 18px;text-decoration:none;width:180px"
                          target="_blank"> Cast details </a> </p> <br><br>
                    </div>
                    <p style="font:14px/1.25em &#39;Helvetica Neue&#39;,Arial,Helvetica;color:#333">
                      <strong>Casting Secret </strong>
                    <p>Copyright © 2020 castingsceret, All rights reserved. </p>
                    <p> 9091 Abdulmajid
                      Shubukshi · Jeddah 23434 · Saudi Arabia</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
        `
  };
  mg.messages().send(data, (error, body) => {
    console.log(body);
  });
}

/**
 * @param mails 
 * @param jobTitle 
 * @param jobDescription 
 * @param jobLink 
 */
export function sendNewJobToMail(mails: string[], jobTitle, jobDescription, jobLink) {
  mails.forEach(email => {
    const data = {
      from: 'Casting mail@castingsecret.com',
      to: `${email}`,
      subject: 'New Casting Call',
      text: `Welcome ,`,
      html: `
      <body>
    <table cellspacing="0" cellpadding="0" border="0"
        style="color:#333;background:#fff;padding:0;margin:0;width:100%;font:15px/1.25em &#39;Helvetica Neue&#39;,Arial,Helvetica">
        <tbody>
            <tr width="100%">
                <td valign="top" align="left"
                    style="background:#eef0f1;font:15px/1.25em &#39;Helvetica Neue&#39;,Arial,Helvetica">
                    <table style="border:none;padding:0 18px;margin:50px auto;width:500px">
                        <tbody>
                            <tr width="100%" height="60">
                                <td valign="top" align="left"
                                    style="border-top-left-radius:4px;border-top-right-radius:4px;background:#3c2b3f;padding:10px 18px;text-align:center">
                                    <img height="100" width="125" src="https://casting-secret-new.s3.eu-central-1.amazonaws.com/images/1582555484792%20-%20logo%2050.jpg" title="Castingsecret"
                                        style="font-weight:bold;font-size:18px;color:#fff;vertical-align:top"> </td>
                            </tr>
                            <tr width="100%">
                                <td valign="top" align="left" style="background:#fff;padding:18px">

                                    <h1 style="font-size:20px;margin:16px 0;color:#333;text-align:center"> New Casting
                                        Call ! </h1>

                                    <p style="font:15px/1.25em &#39;Helvetica Neue&#39;,Arial,Helvetica;text-align:center">
                                        ${jobTitle}
                                    </p>

                                    <div style="background:#f6f7f8;border-radius:3px"> <br>

                                        <!-- jobDescription -->
                                        <p style="font:15px/1.25em &#39;Helvetica Neue&#39;,Arial,Helvetica;text-align:center">
                                        ${jobDescription}
                                        </p>

                                        <p style="font:15px/1.25em;margin-bottom:0;text-align:center">
                                            <a href="${jobLink}"
                                                style="border-radius:3px;background:#3c2b3f;color:#fff;display:block;font-weight:700;font-size:16px;line-height:1.25em;margin:24px auto 6px;padding:10px 18px;text-decoration:none;width:180px"
                                                target="_blank"> Apply Now </a> </p>

                                        <br><br>
                                    </div>

                                    <p style="font:14px/1.25em &#39;Helvetica Neue&#39;,Arial,Helvetica;color:#333">
                                        <strong>Casting Secret </strong>
                                    <p>Copyright © 2020 castingsceret, All rights reserved. </p>
                                    <p> 9091 Abdulmajid Shubukshi · Jeddah 23434 · Saudi Arabia</p>
                                </td>

                            </tr>

                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>
</body>
      `
    };
    mg.messages().send(data, (error, body) => {
      console.log(body);
    });
  })
}