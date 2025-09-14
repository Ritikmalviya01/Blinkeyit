const verifyEmailTeamplate = ({name, url}) => {
return `
<p> Hello ${name} </p>
<p> Thank you for registering with Blinkeyit. Please verify your email address by clicking the link below:</p>
<a href=${url} style="color:white; background :blue; marin-top : 10px"> Verify Email</a>
<p> If you did not create an account, no further action is required.</p>
<p> Best regards,</p>
<p> The Blinkeyit Team</p>
`
}

export default verifyEmailTeamplate;