import Swal from "sweetalert2";

const alertService = {
  success: (message) => {
    Swal.fire({
      title: "Thành công!",
      text: message,
      icon: "success",
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000, 
      timerProgressBar: true,
    });
  },

  error: (message) => {
    Swal.fire({
      title: "Lỗi!",
      text: message,
      icon: "error",
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000, 
      timerProgressBar: true,
    });
  },

  warning: (message) => {
    Swal.fire({
      title: "Cảnh báo!",
      text: message,
      icon: "warning",
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  },

  info: (message) => {
    Swal.fire({
      title: "Thông tin!",
      text: message,
      icon: "info",
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  },

  confirm: (message, confirmCallback) => {
    Swal.fire({
      title: "Bạn có chắc chắn?",
      text: message,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Có",
      cancelButtonText: "Không, hủy!",
    }).then((result) => {
      if (result.isConfirmed) {
        confirmCallback();
      }
    });
  },
};

export default alertService;
