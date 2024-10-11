"use client";

import { useState } from "react";
import { useSession } from "@/contexts/userContext";
import { Formik, Field, Form, ErrorMessage } from "formik";
import InputMask from "react-input-mask";
import * as Yup from "yup";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "@/fetch/registerUser";
import { CircularProgress } from "@mui/material";

interface RegisterFormValues {
  email: string;
  password: string;
  confirmPassword: string;
  isAdmin: boolean;
  name: string;
  cpf: string;
  birthDate: string;
  phone: string;
}

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { user } = useSession();

  const initialValues: RegisterFormValues = {
    email: "",
    password: "",
    confirmPassword: "",
    isAdmin: false,
    name: "",
    cpf: "",
    birthDate: "",
    phone: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Email inválido").required("Campo obrigatório"),
    password: Yup.string()
      .min(6, "A senha deve ter pelo menos 6 caracteres")
      .required("Campo obrigatório"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "As senhas não são iguais")
      .required("Campo obrigatório"),
    isAdmin: Yup.boolean().required("Campo obrigatório"),
    name: Yup.string().required("Campo obrigatório"),
    cpf: Yup.string()
      .matches(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/, "CPF inválido")
      .required("Campo obrigatório"),
    birthDate: Yup.date().required("Campo obrigatório"),
    phone: Yup.string()
      .matches(/^\(\d{2}\) \d{5}\-\d{4}$/, "Telefone inválido")
      .required("Campo obrigatório"),
  });

  const { mutate } = useMutation({
    mutationKey: ["registerUser"],
    mutationFn: async (values: RegisterFormValues) =>
      registerUser(values, user?.token || ""),
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = (values: RegisterFormValues, { resetForm }: any) => {
    setSubmitting(true);
    mutate(values, {
      onSuccess: (response) => {
        if (response) {
          alert(response.message);
          resetForm();
        } else {
          alert("Erro ao salvar usuário");
        }
        setSubmitting(false);
      },
      onError: () => {
        alert("Ocorreu um erro ao salvar o usuário.");
        setSubmitting(false);
      },
    });
  };

  return (
    <div
      className="flex min-h-[94vh] items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/image/background.jpg')" }} // Caminho da imagem de fundo
    >
      <div className="flex justify-center items-center">
        <div className="w-full max-w-md p-8  bg-[#00000095] bg-opacity-90 rounded shadow-lg h-2/6 mt-8">
          <h1 className="text-2xl font-bold text-center text-cyan-50">
            Cadastro
          </h1>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <Form className="space-y-4">
              {/* Nome */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-cyan-50"
                >
                  Nome
                </label>
                <Field
                  id="name"
                  name="name"
                  type="text"
                  className="w-full px-3 py-1 mt-1 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-sm text-red-600"
                />
              </div>
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-cyan-50"
                >
                  Email
                </label>
                <Field
                  id="email"
                  name="email"
                  type="email"
                  className="w-full px-3 py-1 mt-1 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-sm text-red-600"
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Senha */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-cyan-50"
                  >
                    Senha
                  </label>
                  <div className="relative">
                    <Field
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      className="w-full px-3 py-1 mt-1 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
                    />
                    <div
                      className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? (
                        <VisibilityOffOutlinedIcon />
                      ) : (
                        <VisibilityOutlinedIcon />
                      )}
                    </div>
                  </div>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-sm text-red-600"
                  />
                </div>
                {/* Confirmar Senha */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-cyan-50"
                  >
                    Confirmar Senha
                  </label>
                  <div className="relative">
                    <Field
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      className="w-full px-3 py-1 mt-1 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
                    />
                    <div
                      className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                    >
                      {showConfirmPassword ? (
                        <VisibilityOffOutlinedIcon />
                      ) : (
                        <VisibilityOutlinedIcon />
                      )}
                    </div>
                  </div>
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="text-sm text-red-600"
                  />
                </div>
              </div>
              {/* CPF e Data de Nascimento (Duas colunas, que viram uma em telas menores) */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="cpf"
                    className="block text-sm font-medium text-cyan-50"
                  >
                    CPF
                  </label>
                  <Field
                    id="cpf"
                    name="cpf"
                    type="text"
                    className="w-full px-3 py-1 mt-1 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
                  />
                  <ErrorMessage
                    name="cpf"
                    component="div"
                    className="text-sm text-red-600"
                  />
                </div>
                <div>
                  <label
                    htmlFor="birthDate"
                    className="block text-sm font-medium text-cyan-50"
                  >
                    Data de Nascimento
                  </label>
                  <Field
                    id="birthDate"
                    name="birthDate"
                    type="date"
                    className="w-full px-3 py-1 mt-1 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
                  />
                  <ErrorMessage
                    name="birthDate"
                    component="div"
                    className="text-sm text-red-600"
                  />
                </div>
              </div>

              {/* Telefone e IsAdmin (Duas colunas, que viram uma em telas menores) */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-cyan-50"
                  >
                    Telefone
                  </label>
                  <Field name="phone">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {({ field }: any) => (
                      <InputMask
                        {...field}
                        mask="(99) 99999-9999"
                        className="w-full px-3 py-1 mt-1 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="text-sm text-red-600"
                  />
                </div>
                <div className="mt-6   ">
                  <div className="flex flex-row justify-center items-center gap-2 ">
                    <Field
                      id="isAdmin"
                      name="isAdmin"
                      type="checkbox"
                      className=" focus:outline-none focus:ring focus:ring-indigo-200 "
                    />
                    <label
                      htmlFor="isAdmin"
                      className="block text-sm font-medium text-cyan-50 "
                    >
                      Administrador
                    </label>
                  </div>

                  <ErrorMessage
                    name="isAdmin"
                    component="div"
                    className="text-sm text-red-600"
                  />
                </div>
              </div>

              {/* Botão de cadastro */}
              <div>
                <button
                  type="submit"
                  className="w-full px-4 py-1 text-white bg-indigo-600 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mt-3"
                >
                  {submitting ? <CircularProgress size={16} /> : "Cadastrar"}
                </button>
              </div>
            </Form>
          </Formik>
        </div>
      </div>
    </div>
  );
}




