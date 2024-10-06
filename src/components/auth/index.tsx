"use client";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import "../../app/globals.css";
import { useRouter } from "next/navigation";
import { useSession } from "@/contexts/userContext";
import { useMutation } from "@tanstack/react-query";
import { auth } from "@/fetch/auth";
import { useState } from "react";
import { CircularProgress } from "@mui/material";

const LoginPage = () => {
  const [isLoding, setIsLoding] = useState(false);
  const { getUser } = useSession();
  const router = useRouter();
  
  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Email inválido").required("Campo obrigatório"),
    password: Yup.string()
      .min(4, "A senha deve ter pelo menos 4 caracteres")
      .required("Campo obrigatório"),
  });
  const { mutate } = useMutation({
    mutationKey: ["rentedMovie"],
    mutationFn: (values: { email: string; password: string }) =>
      auth(values.email, values.password),
    onSuccess: (response) => {
      console.log(response.data);
      if (response.status === 404) {
        console.log(response.data);
        alert(response.data.error);
        setIsLoding(false);
        return;
      }

      console.log("response", response.status);
      if (response.status === 200) {
        console.log(response.data);

        getUser(response.data);
        router.push("/dashboard");
        setIsLoding(false);
      }
    },
    onError: (response) => {
      if (response.message) {
        console.log(response.message);
        alert("Usuário não encontrado!!");
        setIsLoding(false);
        return;
      }
    },
  });
  const handleSubmit = async (values: { email: string; password: string }) => {
    setIsLoding(true);
    mutate(values);

    console.log(values);
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/image/background.jpg')" }} // Caminho da imagem
    >
      <div className="w-full max-w-md p-8 space-y-4 bg-white bg-opacity-90 rounded shadow-lg">
        <h1 className="text-2xl font-bold text-center">Login</h1>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <Field
                id="email"
                name="email"
                type="email"
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-sm text-red-600"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Senha
              </label>
              <Field
                id="password"
                name="password"
                type="password"
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-sm text-red-600"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoding}
                className="w-full px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                {isLoding ? (
                  <CircularProgress className="text-white" />
                ) : (
                  "Entrar"
                )}
              </button>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default LoginPage;
