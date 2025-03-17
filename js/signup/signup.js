const form = document.querySelector(".signup-form");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  try {
    var toastMixin = Swal.mixin({
      toast: true,
      icon: "success",
      title: "General Title",
      animation: false,
      position: "top",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });
    const response = await fetch(
      "https://cexbuy-server.onrender.com/api/v1/auth/register",
      {
        method: "POST",
        body: formData,
      }
    );

    if (response.ok) {
      const jsonResponse = await response.json();
      console.log("Success:", jsonResponse);
      toastMixin.fire({
        title: "Signed up in successfully! You can now login",
        timer: 7000,
      });
    } else {
      console.log("Error:", response);
      toastMixin.fire({
        icon: "error",
        title:
          "Unable to sign you up. Please try again. Ensure this email has not been used before",
      });
    }
  } catch (error) {
    console.error("Request failed", error);
  }
});
