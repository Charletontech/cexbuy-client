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

    const response = await fetch(
      "https://cexbuy-server.onrender.com/api/v1/auth/login",
      {
        method: "POST",
        body: formData,
        credentials: "include",
      }
    );

    if (response.ok) {
      const jsonResponse = await response.json();
      console.log("Success:", jsonResponse);

      // Show the SweetAlert toast for successful login
      toastMixin.fire({
        title: "Signed in successfully",
      });

      // Redirect to another page after successful login
      if (jsonResponse.data == "Admin login successful!") {
        window.location.href = "https://cexbuy.online/pages/admin.html";
      } else {
        window.location.href =
          "https://cexbuy.online/pages/dashboard.html";
      }
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
    const response = await fetch(
      "https://cexbuy-server.onrender.com/api/v1/dashboard/me",
      {
        method: "get",
        credentials: "include",
      }
    );

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
