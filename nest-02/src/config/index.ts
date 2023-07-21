export default () => ({
	port: process.env.PORT,
	accessSecret: process.env.ACCESS_SECRET_KEY,
	accessExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
})
