import Swal from "sweetalert2";

export const confirmAlert = async (
  title = "Are you sure?",
  text = "This action cannot be undone.",
) => {
  const result = await Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, confirm",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#dc2626",
  });

  return result.isConfirmed;
};
