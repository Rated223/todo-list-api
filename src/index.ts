import app from './app';

const port: number = +(process.env.PORT || 3005);

app.listen(port, () => {
	console.log(`Server running in port ${port}.`);
});
