let user = document.getElementById("email");
let password = document.getElementById("password");
let loginBtn = document.getElementById("login");
let registerBtn = document.getElementById("register");
let logoutBtn = document.getElementById("logout");

/**
 * Logout button, this function redirect after
 */
logoutBtn?.addEventListener("click", async () => {
  const response = await fetch("/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  try {
    window.location.href = response.url;
  } catch (error) {
    console.log(error);
  }
});
/**
 * Register button, this function get the body data
 * and send this to the API with a fetch and register
 * the user
 */
registerBtn?.addEventListener("click", async () => {
  const body = {
    username: user.value,
    password: password.value,
  };
  const response = await fetch("/register", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });

  try {
    const result = await response.json();
    if (result.status === "error") {
      throw new Error(result.error);
    }
    return alert("Usuario creado con exito");
  } catch (error) {
    console.log(error);
  }
});

/**
 * Login button, this function send the body data
 * thru the a fetch and redirect if is validate in the backend
 */
loginBtn?.addEventListener("click", async () => {
  const body = {
    username: user.value,
    password: password.value,
  };
  const response = await fetch("/login", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });

  try {
    if(response.status == 401){
      return alert('Authentication failed')
    }
    window.location.href = response.url;
  } catch (error) {
    console.log(error);
  }
});
