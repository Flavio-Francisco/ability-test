import {
   
    styled,
    TextField,
  } from "@mui/material";




export const StyledTextField = styled(TextField)(() => ({
    "& label": {
      color: "white", // Altera a cor do label para branco
    },
    "& .MuiInputBase-root": {
      color: "white", // Altera a cor do texto dentro do campo para branco
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "white", // Altera a cor da borda do campo
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "white", // Altera a cor da borda ao passar o mouse
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "white", // Altera a cor da borda quando o campo está focado
    },
    "&.Mui-focused label": {
      color: "white", // Mantém o label branco quando focado
    },
    "&.mui-focused": {
      borderColor: "white",
    },
  }));