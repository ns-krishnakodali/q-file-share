import { redirect } from 'next/navigation';

const Home = () => {
	const isAuthenticated = false;
	const pageToLoad = (isAuthenticated) ? "/dashboard" : "/login";

	redirect(pageToLoad);
};

export default Home;
