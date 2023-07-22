const getAddButton = document.querySelectorAll(".addButton");
const getCartValue = document.getElementById("cartCount");

getAddButton.forEach((button) => {
  button.addEventListener("click", function () {addProduct(button)});
});

const addProduct = async (button) => {
  const body = {
    product: parseInt(button.value),
    quantity: 1,
  };
  try {
    const response = await fetch("/api/carts/1/", {
      method: "PUT",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();

    if (result.status === "error") {
      throw new Error(result.error);
    } else {
        console.log(getCartValue.value)
      getCartValue.innerHTML = parseInt(getCartValue.innerHTML) + 1;
    }
  } catch (error) {
    alert(`Ocurrio un error ${error}`);
  }
};
