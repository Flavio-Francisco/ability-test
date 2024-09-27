"use client";
import * as React from "react";
import { useEffect, useState } from "react";
import Image from "next/image";
import Box from "@mui/material/Box";
import {
  Autocomplete,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useQuery, useMutation } from "@tanstack/react-query";
import CircularProgress from "@mui/material/CircularProgress";
import { getMovies } from "@/fetch/getMovies";
import { useSession } from "@/contexts/userContext";
import { updateMovie } from "@/fetch/updateMovie";
import { deleteMovie } from "@/fetch/deleteMovie";
import { Movies } from "@/types/movies";
import { useRouter, useSearchParams } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { StyledTextField } from "@/utils/styledTextField";

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Título é obrigatório"),
  releaseYear: Yup.number().required("Ano de lançamento é obrigatório"),
  overview: Yup.string().required("Sinopse é obrigatória"),
  price: Yup.number()
    .required("Preço é obrigatório")
    .min(0, "Preço não pode ser negativo"),
  poster: Yup.mixed(),
  rented: Yup.boolean(),
});

export default function ListMovies() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  if (!id) {
    router.push("/");
  }

  const { user } = useSession();
  const [selectedMovie, setSelectedMovie] = useState<Movies | null>(null);
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    data: movies,
    isLoading,
    refetch,
  } = useQuery<Movies[]>({
    queryKey: ["movies"],
    queryFn: () => getMovies(user?.token || ""),
  });

  const mutation = useMutation({
    mutationKey: ["updateMovie"],
    mutationFn: (values: Movies) => updateMovie(values, user?.token || ""),
    onSuccess: (response) => {
      console.log("Mutation", response);
      if (response.message) {
        alert(response.message);
        refetch();
        handleClose();
      } else {
        alert("Erro ao atualizar o filme");
      }
    },
  });

  const deleteMutation = useMutation({
    mutationKey: ["deleteMovie"],
    mutationFn: (id: number) => deleteMovie(user?.token || "", id),
    onSuccess: (response) => {
      if (response.message) {
        alert(response.message);
        refetch();
        handleCloseDelete();
        handleClose();
      } else {
        alert("Erro ao excluir o filme");
      }
    },
  });

  const handleOpen = (movie: Movies) => {
    setSelectedMovie(movie);
    setOpen(true);
    setImagePreview(movie.posterPath);
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleOpenAutocomplete = (event: any, value: any) => {
    if (value) {
      // Verifica se um filme foi selecionado
      setSelectedMovie(value);
      setOpen(true);
      setImagePreview(value.posterPath); // Presumindo que você já tenha esse estado configurado
    }
  };
  const handleOpenDelete = () => {
    setOpenDelete(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedMovie(null);
    setImagePreview(null);
  };

  const handleCloseDelete = () => {
    setOpen(false);
    setOpenDelete(false);
    setSelectedMovie(null);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.currentTarget.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    refetch();
  }, []);

  return (
    <div
      className="flex min-h-[90vh] items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/image/background.jpg')" }}
    >
      <Box sx={{ flexGrow: 1, backgroundColor: "#00000095" }}>
        <div className="flex justify-center items-center">
          <h1 className="text-white font-semibold text-2xl">Lista de Filmes</h1>
        </div>
        {isLoading ? (
          <div className="flex flex-col justify-center items-center min-h-7 gap-4">
            <CircularProgress size={70} style={{ color: "#ffff" }} />
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center min-h-96 gap-4 ">
            <Autocomplete
              disablePortal
              options={movies || []}
              getOptionLabel={(option) => option.title}
              sx={{ width: "41%", marginTop: 5, marginRight: 2 }}
              onChange={handleOpenAutocomplete}
              renderInput={(params) => (
                <StyledTextField {...params} label="Lista de Filmes" />
              )}
            />
            <div className=" h-96 overflow-y-auto gap-4 w-2/4">
              {(movies || []).map((movie) => (
                <div
                  key={movie.id}
                  className="flex bg-slate-400 bg-opacity-95 w-10/12 justify-center items-center py-2 rounded transition-transform duration-200 transform hover:scale-105 hover:bg-slate-500 m-auto mt-2"
                >
                  <p
                    style={{ cursor: "pointer", color: "white" }}
                    onClick={() => handleOpen(movie)}
                  >
                    {movie.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <Dialog
          open={open}
          onClose={handleClose}
          maxWidth="md"
          fullWidth={true}
          className="bg-transparent"
        >
          <DialogContent className="w-full bg-[#00000095]">
            {selectedMovie && (
              <div className="flex justify-center items-center w-full">
                <div className="w-9/12 h-5/6 p-8 bg-[#00000095] bg-opacity-90 rounded shadow-lg">
                  <h1 className="text-2xl font-bold text-center text-cyan-50">
                    Editar Filme
                  </h1>
                  <Formik
                    initialValues={{
                      id: selectedMovie.id,
                      title: selectedMovie.title,
                      releaseYear: selectedMovie.releaseYear,
                      overview: selectedMovie.overview,
                      price: selectedMovie.price,
                      poster: selectedMovie.posterPath,
                      rented: selectedMovie.rented,
                      userId: selectedMovie.userId,
                    }}
                    validationSchema={validationSchema}
                    onSubmit={(values) => {
                      console.log("values", values);

                      const formData = new FormData();
                      formData.append("title", values.title);
                      formData.append(
                        "releaseYear",
                        values.releaseYear.toString()
                      );
                      formData.append("overview", values.overview);
                      formData.append("price", values.price.toString());

                      // Se 'poster' estiver definido, use-o, caso contrário, use o existente
                      if (values.poster) {
                        formData.append("posterPath", values.poster);
                      } else {
                        formData.append(
                          "posterPath",
                          selectedMovie?.posterPath
                        ); // usar o existente
                      }

                      formData.append("rented", values.rented.toString());

                      mutation.mutate({
                        id: values.id,
                        title: values.title,
                        releaseYear: values.releaseYear,
                        overview: values.overview,
                        price: values.price,
                        posterPath: values.poster,
                        rented: values.rented,
                        userId: values.userId,
                      });
                    }}
                  >
                    {({ isSubmitting, setFieldValue }) => (
                      <Form className="space-y-4">
                        <div className="flex justify-center ">
                          <div>
                            <label className="block text-sm font-medium text-cyan-50 mt-2">
                              Poster Atual
                            </label>
                            {imagePreview && (
                              <Image
                                src={imagePreview}
                                alt=""
                                width={300}
                                height={300}
                                className=" cursor-pointer rounded "
                              />
                            )}
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor="title"
                            className="block text-sm font-medium text-cyan-50"
                          >
                            Título
                          </label>
                          <Field
                            id="title"
                            name="title"
                            type="text"
                            className="w-full px-3 py-1 mt-1 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
                          />
                          <ErrorMessage
                            name="title"
                            component="div"
                            className="text-sm text-red-600"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="releaseYear"
                            className="block text-sm font-medium text-cyan-50"
                          >
                            Ano de Lançamento
                          </label>
                          <Field
                            id="releaseYear"
                            name="releaseYear"
                            type="number"
                            className="w-full px-3 py-1 mt-1 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
                          />
                          <ErrorMessage
                            name="releaseYear"
                            component="div"
                            className="text-sm text-red-600"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="overview"
                            className="block text-sm font-medium text-cyan-50"
                          >
                            Sinopse
                          </label>
                          <Field
                            as="textarea"
                            rows={4}
                            id="overview"
                            name="overview"
                            className="w-full px-3 py-1 mt-1 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
                          />
                          <ErrorMessage
                            name="overview"
                            component="div"
                            className="text-sm text-red-600"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="price"
                            className="block text-sm font-medium text-cyan-50"
                          >
                            Preço
                          </label>
                          <Field
                            id="price"
                            name="price"
                            type="number"
                            className="w-full px-3 py-1 mt-1 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
                          />
                          <ErrorMessage
                            name="price"
                            component="div"
                            className="text-sm text-red-600"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="poster"
                            className="block text-sm font-medium text-cyan-50"
                          >
                            Selecionar Novo Poster
                          </label>
                          <input
                            id="poster"
                            name="poster"
                            type="file"
                            accept="image/*"
                            onChange={(event) => {
                              const files = event.currentTarget.files;
                              if (files && files.length > 0) {
                                handleImageChange(event);
                                setFieldValue("poster", files[0]);
                              }
                            }}
                            className="w-full px-3 py-1 mt-1 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
                          />
                          <ErrorMessage
                            name="poster"
                            component="div"
                            className="text-sm text-red-600"
                          />
                        </div>

                        <div className="flex flex-row gap-4 max-sm:flex-col">
                          <button
                            type="submit"
                            className="w-full px-4 py-1 text-white bg-indigo-600 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mt-3"
                          >
                            {isSubmitting ? (
                              <CircularProgress size={16} />
                            ) : (
                              "Salvar"
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={handleOpenDelete}
                            className="w-full px-4 py-1 text-white bg-red-600 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 mt-3"
                          >
                            {isSubmitting ? (
                              <CircularProgress size={16} />
                            ) : (
                              "Deletar"
                            )}
                          </button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={openDelete} onClose={handleCloseDelete}>
          <DialogTitle className="font-semibold">Deletar Filme</DialogTitle>
          <DialogContent>
            <div className="p-4 gap-3 flex flex-col justify-center items-center">
              <p>Tem certeza de que deseja deletar o filme?</p>
              <p>{selectedMovie?.title}</p>
            </div>
            <div className="flex justify-center w-full">
              <button
                onClick={handleCloseDelete}
                className="w-1/4 px-4 py-2 text-white bg-slate-500 rounded hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
              >
                Não
              </button>
              <button
                type="button"
                className="ml-4 w-1/4 px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 focus:outline-none focus:ring-2"
                onClick={() => deleteMutation.mutate(selectedMovie?.id || 0)}
              >
                Sim
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </Box>
    </div>
  );
}
