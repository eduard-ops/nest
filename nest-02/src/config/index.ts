export default () => ({
	port: process.env.PORT,
	accessSecretKey: process.env.ACCESS_SECRET_KEY,
	refreshSecretKey: process.env.REFRESH_SECRET_KEY
})
