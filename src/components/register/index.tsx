"use client";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

interface RegisterFormValues {
  email: string;
  password: string;
  isAdmin: boolean;
  name: string;
  cpf: string;
  birthDate: string;
  phone: string;
}
const RegisterPage = () => {
  const initialValues = {
    email: "",
    password: "",
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

  const handleSubmit = (values: RegisterFormValues) => {
    // Lógica para submissão dos dados
    console.log(values);
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/images/background.jpg')" }} // Caminho da imagem de fundo
    >
      <div className="w-full max-w-md p-8 space-y-4 bg-white bg-opacity-90 rounded shadow-lg ">
        <h1 className="text-2xl font-bold text-center">Cadastro</h1>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form className="space-y-1">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Nome
              </label>
              <Field
                id="name"
                name="name"
                type="text"
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-sm text-red-600"
              />
            </div>

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
              <label
                htmlFor="cpf"
                className="block text-sm font-medium text-gray-700"
              >
                CPF
              </label>
              <Field
                id="cpf"
                name="cpf"
                type="text"
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
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
                className="block text-sm font-medium text-gray-700"
              >
                Data de Nascimento
              </label>
              <Field
                id="birthDate"
                name="birthDate"
                type="date"
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
              />
              <ErrorMessage
                name="birthDate"
                component="div"
                className="text-sm text-red-600"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Telefone
              </label>
              <Field
                id="phone"
                name="phone"
                type="text"
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
              />
              <ErrorMessage
                name="phone"
                component="div"
                className="text-sm text-red-600"
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mt-3"
              >
                Cadastrar
              </button>
            </div>
          </Form>
        </Formik>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Já tem uma conta?{" "}
            <a href="/" className="text-indigo-600 hover:text-indigo-500">
              Entre aqui
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
