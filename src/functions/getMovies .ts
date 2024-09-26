import axios from "axios";

export async function getMovies(token: string) {
    try {
        const response = await axios.get("api/movies", {
            headers: {
                Authorization: `Bearer ${token}`, 
            },
        });
        return response.data; 
    } catch (error) {
        console.error('Error fetching movies:', error);
        throw new Error('Failed to fetch movies');
    }
};