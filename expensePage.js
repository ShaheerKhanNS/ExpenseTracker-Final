const btnSubmit = document.getElementById("btn");

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

    if (price && description && category) {
      await axios({
        method: "POST",
        url: "http://localhost:3000/api/v1/expense/addexpense",
        data: {
          price,
          description,
          category,
        },
      });
      clearField();
    } else {
      alert("Please Fill all the required fields for better analysis🤗");
    }
  } catch (err) {
    alert(err.message);
  }
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
  const expenses = await axios({
    method: "GET",
    url: "http://localhost:3000/api/v1/expense",
  });
  let indianCurrency = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumSignificantDigits: 3,
  });
  expenses.data.data.expenses.forEach((el, i) => {
    const id = el.id;
    const formattedPrice = indianCurrency.format(el.price);
    const category = el.category.charAt(0).toUpperCase() + el.category.slice(1);
    const description =
      el.description.charAt(0).toUpperCase() + el.description.slice(1);
    renderExpenses(formattedPrice, description, category, id, i + 1);
  });
};

window.addEventListener("DOMContentLoaded", retreiveData);
