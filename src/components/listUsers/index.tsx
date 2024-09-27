"use client";
import * as React from "react";
import { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import {
  Autocomplete,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
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
import { deleteUser } from "@/fetch/deleteUser";
import { StyledTextField } from "@/utils/styledTextField";

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
  const [openDelete, setOpenDelete] = useState(false);
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
    onSuccess: (response) => {
      if (response.message) {
        alert(response.message);
        refetch();
        handleClose();
      } else {
        console.log("message: " + response.message);

        alert("Erro ao excluir o usuário");
      }
    },
  });
  const { mutate } = useMutation({
    mutationKey: ["updateUser"],
    mutationFn: (id: number) => deleteUser(user?.token || "", id),
    onSuccess: (response) => {
      if (response.message) {
        alert(response.message);
        refetch();
        handleCloseDelete();
      } else {
        console.log("message: " + response.message);

        alert("Erro ao excluir o usuário");
      }
    },
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleOpenAutocomplete = (event: any, value: any) => {
    if (value) {
      setSelectedUser(value);
      setOpen(true);
    }
  };

  const handleOpen = (user: UserData) => {
    setSelectedUser(user);
    setOpen(true);
  };
  const handleOpenDelete = () => {
    setOpenDelete(true);
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
  };
  const handleCloseDelete = () => {
    setOpenDelete(false);
    setSelectedUser(null);
    setOpen(false);
  };
  useEffect(() => {
    refetch();
  }, []);
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
        {isLoading ? (
          <div className="flex  flex-col justify-center items-center min-h-96 gap-4  ">
            <CircularProgress size={70} style={{ color: "#ffff" }} />
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center min-h-96 gap-4 ">
            <Autocomplete
              disablePortal
              options={users || []}
              getOptionLabel={(option) => option.name}
              sx={{ width: "41%", marginTop: 5, marginRight: 2 }}
              onChange={handleOpenAutocomplete}
              renderInput={(params) => (
                <StyledTextField {...params} label="Lista de Filmes" />
              )}
            />
            <div className=" h-96 overflow-y-auto gap-4 w-2/4">
              {(users || []).map((parm) => (
                <div
                  key={parm.id}
                  className="flex bg-slate-400 bg-opacity-95 w-10/12 justify-center items-center py-2 rounded transition-transform duration-200 transform hover:scale-105 hover:bg-slate-500 m-auto mt-2"
                >
                  <p
                    style={{ cursor: "pointer", color: "white" }}
                    onClick={() => handleOpen(parm)}
                  >
                    {parm.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

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
                            onClick={() => handleOpenDelete()}
                            className="w-full px-4 py-1 text-white bg-red-600 rounded hover:bg-red-700  focus:outline-none focus:ring-2 focus:ring-red-500  focus:ring-offset-2 mt-3"
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
          <DialogTitle className="font-semibold">Deletar Usuário</DialogTitle>
          <DialogContent>
            <div className="p-4 gap-3 flex flex-col justify-center items-center">
              <p>Tem certeza de que deseja deletar o usuário?</p>
              <p>{selectedUser?.name}</p>
            </div>
            <div className="flex justify-center w-full">
              <button
                onClick={handleCloseDelete}
                className="w-1/4 px-4 py-2 text-white bg-slate-500 rounded hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
              >
                Não
              </button>
              <button
                type="submit"
                className="ml-4 w-1/4 px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 focus:outline-none focus:ring-2 "
                onClick={() => mutate(selectedUser?.id || 0)}
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
