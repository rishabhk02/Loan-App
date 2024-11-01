import Swal from "sweetalert2";

export const showErrorMessage = (message) => {
  Swal.fire({
    icon: "error",
    title: "Error",
    text: message,
    confirmButtonText: "Ok",
    iconColor: "red",
    confirmButtonColor: "red",
  });
};

export const showSuccessMessage = (message) => {
  Swal.fire({
    icon: "success",
    title: "Success",
    text: message,
    confirmButtonText: "Ok",
    iconColor: "green",
    confirmButtonColor: "green",
  });
};

export const formateDate = (date) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(date).toLocaleDateString("en-US", options);
};