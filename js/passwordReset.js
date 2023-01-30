const btnReset = document.querySelector(".btn");

btnReset.addEventListener("click", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;

  try {
    const response = await axios({
      method: "POST",
      url: `http://localhost:3000/api/v1/password/forgotpassword`,

      data: {
        email,
      },
    });
    alert(response.data.message);
    document.getElementById("email").value = "";
  } catch (err) {
    document.body.innerHTML += `<div class='error'>${err.message}</div>`;
  }
});
