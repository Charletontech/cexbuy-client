const form = document.querySelector(".fp-form");
const passwordInput = document.getElementById("password");
const rPasswordInput = document.getElementById("rPassword");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log(passwordInput.value);
  if (passwordInput.value !== rPasswordInput.value) {
    alert("Passwords don't match");
    return;
  } else {
    let body = {};
    const formData = new FormData(form);

    // eliminate rPassword from request body
    formData.entries().forEach((each) => {
      if (each[0] === "email" || each[0] === "password") {
        body[`${each[0]}`] = each[1];
      }
    });
    console.log(body);
    fetch("http://127.0.0.1:5000/api/v1/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
});
