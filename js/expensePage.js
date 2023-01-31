const btnSubmit = document.getElementById("btn");
const btnPremium = document.getElementById("btn-premium");
const btnLeader = document.getElementById("btn-leader");
const btnClose = document.getElementById("btn-close");
const btnFake = document.getElementById("btn-leader-fake");
const btnDownload = document.getElementById("btn-download-expense");

const indianCurrency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumSignificantDigits: 3,
});

const clearField = () => {
  document.getElementById("price").value =
    document.getElementById("description").value =
    document.getElementById("category").value =
      "";
};

btnSubmit.addEventListener("click", async (e) => {
  try {
    e.preventDefault();

    const price = document.getElementById("price").value;
    const description = document.getElementById("description").value;
    const category = document.getElementById("category").value;

    const token = localStorage.getItem("token");

    if (price && description && category) {
      await axios({
        method: "POST",
        url: "http://localhost:3000/api/v1/expense/addexpense",
        headers: { Authorization: token },

        data: {
          price,
          description,
          category,
        },
      });
      clearField();
      window.location.reload();
    } else {
      alert("Please Fill all the required fields for better analysis🤗");
    }
  } catch (err) {
    alert(err.message);
  }
});

btnPremium.addEventListener("click", async (e) => {
  e.preventDefault();
  const token = localStorage.getItem("token");

  const response = await axios({
    method: "GET",
    url: "http://localhost:3000/api/v1/purchase/premiummembership",
    headers: { Authorization: token },
  });

  const options = {
    key: response.data.key_id,
    order_id: response.data.order.id,
    handler: async (response) => {
      await axios({
        method: "POST",
        url: "http://localhost:3000/api/v1/purchase/premiummembership",
        data: {
          status: true,
          order_id: options.order_id,
          payment_id: response.razorpay_payment_id,
        },
        headers: { Authorization: token },
      });
      alert("You have a premium account😎");
      window.location.reload();
    },
  };

  const rzp = new Razorpay(options);

  rzp.open();

  rzp.on("payment.failed", async (error) => {
    await axios({
      method: "POST",
      url: "http://localhost:3000/api/v1/purchase/premiummembership",
      data: {
        status: false,
        order_id: options.order_id,
        payment_id: response.razorpay_payment_id,
      },
      headers: { Authorization: token },
    });
    alert(error.error.description);
  });
});

const deleteExpense = async (e) => {
  const id = e.dataset.id;

  const response = await axios({
    method: "DELETE",
    url: `http://localhost:3000/api/v1/expense/${id}`,
  });

  if (response.data.status === "success") {
    window.location.reload();
  } else {
    alert("Some thing Terrible had happened🤯");
  }
};

const renderLeaderBoard = (slNo, name, totalExpense) => {
  const tableBody = document.getElementById("table-leaderBoard");

  const template = ` <tr>
      <td>${slNo}</td>
      <td>${name}</td>
      <td>${totalExpense}</td>
      </tr>`;

  tableBody.innerHTML += template;
};

const renderExpenses = (price, description, category, id, i) => {
  const tableBody = document.getElementById("table");

  const template = ` <tr>
      <td>${i}</td>
      <td>${price}</td>
      <td>${description}</td>
      <td>${category}</td>
      <td><button data-id=${id} class="btn btn-outline-secondary" onclick='editExpense(this)'>Edit</button>
      </td>
      <td><button data-id=${id} class="btn btn-outline-danger" onclick='deleteExpense(this)'>Delete</button>
      </td>
    </tr>`;

  tableBody.innerHTML += template;
};

const retreiveData = async () => {
  const token = localStorage.getItem("token");
  const btnPremium = document.getElementById("btn-premium");
  const premiumUser = document.getElementById("btn-premium-user");
  const btnLeader = document.getElementById("btn-leader");

  const expenses = await axios({
    method: "GET",
    url: "http://localhost:3000/api/v1/expense",
    headers: { Authorization: token },
  });

  if (expenses.data.data.premium === true) {
    btnPremium.classList.add("invisible");
  } else if (expenses.data.data.premium === false) {
    premiumUser.classList.add("invisible");
    btnLeader.classList.add("invisible");
    btnDownload.classList.add("invisible");
  }

  expenses.data.data.expenses.forEach((el, i) => {
    const id = el.id;
    const formattedPrice = indianCurrency.format(el.price);
    const category = el.category.charAt(0).toUpperCase() + el.category.slice(1);
    const description =
      el.description.charAt(0).toUpperCase() + el.description.slice(1);
    renderExpenses(formattedPrice, description, category, id, i + 1);
  });
};

const div = document.getElementById("leader-board-view");
const leaderBoardTable = document.getElementById("leader-table");

btnLeader.addEventListener("click", async (e) => {
  e.preventDefault();

  btnClose.classList.remove("invisible");

  div.classList.add("view");
  leaderBoardTable.classList.remove("invisible");

  btnLeader.classList.add("invisible");

  // Close Functionality; will be added

  const response = await axios({
    method: "GET",
    url: "http://localhost:3000/api/v1/premium/showleaderboard",
  });

  // console.log(response);

  response.data.userAggregatedExpense.forEach((data, i) => {
    const formattedPrice = indianCurrency.format(data.total_cost);
    const name = data.name;
    renderLeaderBoard(i + 1, name, formattedPrice);
  });
});

btnClose.addEventListener("click", (e) => {
  e.preventDefault();
  btnClose.classList.add("invisible");

  div.classList.remove("view");
  leaderBoardTable.classList.add("invisible");

  btnFake.classList.remove("invisible");
});

btnFake.addEventListener("click", (e) => {
  e.preventDefault();

  btnClose.classList.remove("invisible");

  div.classList.add("view");
  leaderBoardTable.classList.remove("invisible");

  btnFake.classList.add("invisible");
});

btnDownload.addEventListener("click", async (e) => {
  try {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const response = await axios({
      method: "GET",
      url: "http://localhost:3000/api/v1/users/download",
      headers: { Authorization: token },
    });
    console.log(response);
    if (response.status === 200) {
      let a = document.createElement("a");
      a.href = response.data.fileUrl;
      a.download = "myexpense.csv";
      a.click();
    }
  } catch (err) {
    document.body.innerHTML += `<div class="error">Something went wrong in downloading your expense data Please try again after sometime or you can contact us via our helpline, Have a Great day!!</div>`;
  }
});

window.addEventListener("DOMContentLoaded", retreiveData);
