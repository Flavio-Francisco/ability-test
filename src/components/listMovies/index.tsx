"use client";
import { useSession } from "@/contexts/userContext";
import { Movies } from "@/types/movies";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { useQuery } from "@tanstack/react-query";
import { getMovies } from "@/functions/getMovies ";

export default function ListMovies() {
  const { user } = useSession();
  const route = useRouter();
  const [movies, setMovies] = useState<Movies[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movies | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["Movies"],
    queryFn: () => getMovies(user?.token || ""),
  });

  
  console.log("Movies", data);
  useEffect(() => {
    setMovies(data);
  }, [data]);

  const openModal = (movie: Movies) => {
    setSelectedMovie(movie);
  };

  const closeModal = () => {
    setSelectedMovie(null);
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const checkUser = () => {
    if (!user?.token) {
      route.push("/");
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      checkUser();
    }, 3000);

    return () => clearTimeout(timer);
  }, [user, route, checkUser]);
  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="m-auto flex flex-col justify-center items-center">
          <div className="m-auto">
            <CircularProgress />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {(movies || []).map((movie) => (
          <div
            key={movie.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden relative group"
          >
            <Image
              src={movie.posterPath}
              alt={movie.title}
              width={200}
              height={300}
              className="w-full h-auto cursor-pointer"
            />
            <div
              className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              onClick={() => openModal(movie)}
            >
              <p className="text-white text-center p-2 h-10/12">
                {movie.overview}
              </p>
            </div>
            <div className="p-4">
              <h2 className="text-xl font-bold">{movie.title}</h2>
              <h2 className="text-xl font-bold">{String(movie.releaseYear)}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedMovie && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full relative">
            <h2 className="text-xl font-bold mb-4">{selectedMovie.title}</h2>
            <p className="mb-4">{selectedMovie.overview}</p>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => alert(`Alugando ${selectedMovie.title}`)}
            >
              Alugar Filme
            </button>
            <button
              className="absolute top-2 right-2 text-gray-500"
              onClick={closeModal}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
