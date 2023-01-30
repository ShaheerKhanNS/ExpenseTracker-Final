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
      localStorage.setItem("token", respone.data.token);
      window.location.replace("http://127.0.0.1:8080/html/expensePage.html");
    } else {
      alert("Please Provide your registered email and password");
    }
  } catch (err) {
    document.body.innerHTML += `<div class="error" >${err.message}</div>`;
  }
});
