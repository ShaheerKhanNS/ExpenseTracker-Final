const btnSignup = document.querySelector(".btn-signup");
const clearField = () => {
  document.getElementById("name").value =
    document.getElementById("email").value =
    document.getElementById("password").value =
      "";
};

btnSignup.addEventListener("click", async () => {
  try {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (name && email && password) {
      await axios({
        method: "POST",
        url: "http://localhost:3000/api/v1/users",
        data: {
          name,
          email,
          password,
        },
      });
      clearField();
      window.location.replace("http://127.0.0.1:8080/html/login.html");
    }
  } catch (err) {
    document.body.innerHTML += `<div class="error">${err.message}</div>`;
  }
});
