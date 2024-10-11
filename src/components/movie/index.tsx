"use client";
import { useSession } from "@/contexts/userContext";
import { newMovie } from "@/fetch/newMovie";
import { Movies } from "@/types/movies";
import { CircularProgress } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Image from "next/image";
import { useState } from "react";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Título é obrigatório"),
  releaseYear: Yup.number().required("Ano de lançamento é obrigatório"),
  overview: Yup.string().required("Sinopse é obrigatória"),
  gender: Yup.string().required("Gênero obrigatória"),
  price: Yup.number()
    .required("Preço é obrigatório")
    .min(0, "Preço não pode ser negativo"),
  poster: Yup.mixed(),
  rented: Yup.boolean(),
});

export default function NewMovie() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { user } = useSession();
  const mutation = useMutation({
    mutationKey: ["updateMovie"],
    mutationFn: (values: Movies) => newMovie(values, user?.token || ""),
    onSuccess: (response) => {
      console.log("Mutation", response);
      if (response.message) {
        alert(response.message);
      } else {
        alert("Erro ao atualizar o filme");
      }
    },
  });

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

  return (
    <div
      className="flex min-h-[96vh] items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/image/background.jpg')" }}
    >
      <div className="flex justify-center items-center w-7/12 max-sm:w-full">
        <div className="w-9/12 h-5/6 p-8 bg-[#00000095] bg-opacity-90 rounded shadow-lg">
          <h1 className="text-2xl font-bold text-center text-cyan-50">
            Novo Filme
          </h1>
          <Formik
            initialValues={{
              title: "",
              overview: "",
              price: 0,
              poster: "",
              gender: "",
              rented: false,
              userId: false,
              releaseYear: 0,
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              console.log("values", values);

              const formData = new FormData();
              formData.append("title", values.title);
              formData.append("releaseYear", values.releaseYear.toString());
              formData.append("overview", values.overview);
              formData.append("price", values.price.toString());
              formData.append("posterPath", values.poster);
              formData.append("price", values.gender.toString());
              formData.append("rented", values.rented.toString());

              mutation.mutate({
                title: values.title,
                releaseYear: values.releaseYear,
                overview: values.overview,
                price: values.price,
                posterPath: values.poster,
                rented: values.rented,
                userId: 0,
                gender: values.gender,
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
                    {imagePreview ? (
                      <Image
                        src={imagePreview}
                        alt=""
                        width={300}
                        height={300}
                        className=" cursor-pointer rounded "
                      />
                    ) : (
                      <Image
                        src={"/image/default.jpg"}
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
                    htmlFor="gender"
                    className="block text-sm font-medium text-cyan-50"
                  >
                    Gênero
                  </label>
                  <Field
                    id="gender"
                    name="gender"
                    type="text"
                    className="w-full px-3 py-1 mt-1 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
                  />
                  <ErrorMessage
                    name="gender"
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
                    {isSubmitting ? <CircularProgress size={16} /> : "Salvar"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
