const btnSubmit = document.querySelector(".btn");

btnSubmit.addEventListener("click", async (e) => {
  try {
    e.preventDefault();
    const password = document.getElementById("password").value;

    if (password) {
      const response = await axios({
        method: "POST",
        url: "http://localhost:3000/api/v1/password/updatePassword/",
        data: {
          password,
        },
      });

      alert(response.data.message);
      window.location.replace("http://127.0.0.1:8080/html/login.html");
    }
  } catch (err) {
    console.log(err.message);
  }
});
