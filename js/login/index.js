const form = document.querySelector(".login-form");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  try {
    // SweetAlert mixin
    var toastMixin = Swal.mixin({
      toast: true,
      icon: "success",
      title: "General Title",
      animation: false,
      position: "top",
      showConfirmButton: false,
      timer: 7000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });

    const response = await fetch("http://127.0.0.1:5000/api/v1/auth/login", {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    if (response.ok) {
      const jsonResponse = await response.json();
      console.log("Success:", jsonResponse);

      // Show the SweetAlert toast for successful login
      toastMixin.fire({
        title: "Signed in successfully",
      });

      // Redirect to another page after successful login
      window.location.href = "http://127.0.0.1:5501/pages/dashboard.html";
    } else {
      console.log("Error:", response);

      toastMixin.fire({
        icon: "error",
        title: "Login failed",
      });
    }
  } catch (error) {
    console.error("Request failed", error);
  }
});

var fp = document.querySelector(".fp").addEventListener("click", async () => {
  try {
    const response = await fetch("http://127.0.0.1:5000/api/v1/dashboard/me", {
      method: "get",
      credentials: "include",
    });

    if (response.ok) {
      const jsonResponse = await response.json();
      console.log("Success:", jsonResponse);
    } else {
      console.log("Error:", response);
    }
  } catch (error) {
    console.error("Request failed", error);
  }
});
