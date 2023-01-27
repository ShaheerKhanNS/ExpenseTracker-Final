const btnLogin = document.querySelector(".btn-login");

btnLogin.addEventListener("click", async () => {
  try {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (email && password) {
      const respone = await axios({
        method: "POST",
        url: "http://localhost:3000/api/v1/users/login",
        data: {
          email,
          password,
        },
      });
      alert(respone.data.message);
      window.location.replace("http://127.0.0.1:8080/expensePage.html");
    }
  } catch (err) {
    document.body.innerHTML += `<div class="error" >${err.message}</div>`;
  }
});
