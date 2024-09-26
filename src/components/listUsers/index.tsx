"use client";
import * as React from "react";
import { useState } from "react";

import Box from "@mui/material/Box";
import { Dialog, DialogContent } from "@mui/material";
import { useQuery, useMutation } from "@tanstack/react-query";
import CircularProgress from "@mui/material/CircularProgress";
import { getUsers } from "@/fetch/getUser";
import { useSession } from "@/contexts/userContext";
import { updateUser } from "@/fetch/updateUser";
import { UserData } from "@/types/userData";
import { useRouter, useSearchParams } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import InputMask from "react-input-mask";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { formatDate } from "@/functions/formatDate";

// Validação com Yup
const validationSchema = Yup.object().shape({
  email: Yup.string().email("Email inválido").required("Email é obrigatório"),
  password: Yup.string().required("Senha é obrigatória"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), ""], "As senhas não correspondem")
    .required("Confirmação de senha é obrigatória"),
  name: Yup.string().required("Nome é obrigatório"),
  cpf: Yup.string().required("CPF é obrigatório"),
  birthDate: Yup.string().required("Data de nascimento é obrigatória"),
  phone: Yup.string().required("Telefone é obrigatório"),
  isAdmin: Yup.boolean(),
});

export default function ListUsers() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  if (!id) {
    router.push("/");
  }
  const { user } = useSession();
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    data: users,
    isLoading,
    refetch,
  } = useQuery<UserData[]>({
    queryKey: ["users"],
    queryFn: () => getUsers(user?.token || ""),
  });
  console.log("users", users);

  const mutation = useMutation({
    mutationKey: ["updateUser"],
    mutationFn: (values: UserData) => updateUser(values, user?.token || ""),
    onSuccess: () => {
      refetch();
      handleClose();
    },
  });

  const handleOpen = (user: UserData) => {
    setSelectedUser(user);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
  };

  if (isLoading) return <CircularProgress />;

  return (
    <div
      className="flex min-h-[94vh] items-center justify-center bg-cover bg-center "
      style={{ backgroundImage: "url('/image/background.jpg')" }}
    >
      <Box sx={{ flexGrow: 1, backgroundColor: "#00000095" }}>
        <div className="flex   justify-center items-center">
          <h1 className="text-white font-semibold text-2xl">
            Lista de Usuários
          </h1>
        </div>
        <div className="flex  flex-col justify-center items-center min-h-96 gap-4  ">
          {(users || []).map((user) => (
            <div
              key={user.id}
              className="flex bg-slate-400 bg-opacity-95 w-2/4 justify-center items-center py-2 rounded"
            >
              <p
                style={{
                  cursor: "pointer",
                  color: "white",
                }}
                onClick={() => handleOpen(user)}
              >
                {user.name}
              </p>
            </div>
          ))}
        </div>

        <Dialog open={open} onClose={handleClose}>
          <DialogContent>
            {selectedUser && (
              <div className="flex justify-center items-center">
                <div className="w-full max-w-md p-8 bg-[#00000095] bg-opacity-90 rounded shadow-lg">
                  <h1 className="text-2xl font-bold text-center text-cyan-50">
                    Editar Usuário
                  </h1>
                  <Formik
                    initialValues={{
                      email: selectedUser.email,
                      password: selectedUser.password,
                      confirmPassword: "",
                      isAdmin: selectedUser.isAdmin,
                      name: selectedUser.name,
                      cpf: selectedUser.cpf || "",
                      birthDate: formatDate(selectedUser.birthDate || ""),
                      phone: selectedUser.phone,
                    }}
                    validationSchema={validationSchema}
                    onSubmit={(values) => {
                      console.log("valor", values);

                      mutation.mutate({ id: selectedUser.id, ...values });
                    }}
                  >
                    {({ isSubmitting }) => (
                      <Form className="space-y-4">
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
                                onClick={() =>
                                  setShowConfirmPassword((prev) => !prev)
                                }
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

                          <div className="mt-6">
                            <div className="flex flex-row justify-center items-center gap-2">
                              <Field
                                id="isAdmin"
                                name="isAdmin"
                                type="checkbox"
                                className="focus:outline-none focus:ring focus:ring-indigo-200"
                              />
                              <label
                                htmlFor="isAdmin"
                                className="block text-sm font-medium text-cyan-50"
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

                        <div>
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
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </Box>
    </div>
  );
}
