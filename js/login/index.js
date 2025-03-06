const form = document.querySelector(".login-form");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  try {
    const response = await fetch("http://127.0.0.1:5000/api/v1/auth/login", {
      method: "POST",
      body: formData,
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
