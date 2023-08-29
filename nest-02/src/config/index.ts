export default () => ({
	port: process.env.PORT,
	accessSecretKey: process.env.ACCESS_SECRET_KEY,
	accessTokenExpires: process.env.ACCESS_TOKEN_EXPIRES,
	refreshSecretKey: process.env.REFRESH_SECRET_KEY,
    refreshTokenExpires: process.env.REFRESH_TOKEN_EXPIRES,
	hostMail: process.env.MAIL_HOST,
	mailUser: process.env.MAIL_USER,
	mailPass: process.env.MAIL_PASSWORD,
	mailFrom: process.env.MAIL_FROM
})
