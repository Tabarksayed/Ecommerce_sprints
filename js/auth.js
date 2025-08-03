function toggleForm(type) {
  document.getElementById("login-box").classList.toggle("hidden", type === "signup");
  document.getElementById("signup-box").classList.toggle("hidden", type === "login");
}

function signup() {
  const username = document.getElementById("signupUsername").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;
  const confirm = document.getElementById("signupConfirm").value;
  const isAdmin = document.getElementById("isAdmin").checked;

  if (!username || !email || !password || !confirm) {
    Swal.fire("Error", "Please fill in all fields.", "warning");
    return;
  }

  const invalidChars = /[^a-zA-Z0-9_]/;
  if (invalidChars.test(username)) {
    Swal.fire("Error", "Username must not contain special characters like @ or #.", "error");
    return;
    
  }

  if (password.length < 8) {
    Swal.fire("Weak Password", "Password must be at least 8 characters long.", "warning");
    return;
  }

  if (password !== confirm) {
    Swal.fire("Error", "Password and confirmation do not match.", "error");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users") || "[]");
  if (users.find(u => u.email === email)) {
    Swal.fire("User Exists", "This email is already registered.", "error");
    return;
  }

  users.push({ username, email, password, isAdmin });
  localStorage.setItem("users", JSON.stringify(users));

  Swal.fire("Success!", "Account created successfully! You can now log in.", "success");
  toggleForm("login");
}

function login() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;
  const users = JSON.parse(localStorage.getItem("users") || "[]");

  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    Swal.fire("Error", "Incorrect login credentials.", "error");
    return;
  }

  localStorage.setItem("currentUser", JSON.stringify(user));

  const welcomeMsg = user.isAdmin
    ? `Welcome ${user.username} (Admin)`
    : `Welcome ${user.username}`;

  Swal.fire("Login Successful", welcomeMsg, "success").then(() => {
    if (user.isAdmin) {
      window.location.href = "./admin.html"; 
    } else {
     window.location.href = "./products.html";

    }
  });
}


function logout() {
  localStorage.removeItem("currentUser");
  Swal.fire("Logged Out", "You have been logged out.", "info");
}

document.addEventListener("DOMContentLoaded", () => {
  const usernameInput = document.getElementById("signupUsername");
  const passwordInput = document.getElementById("signupPassword");

  const usernameHelper = document.getElementById("usernameHelper");
  const passwordHelper = document.getElementById("passwordHelper");

  usernameInput.addEventListener("input", () => {
    const value = usernameInput.value.trim();
    const invalidChars = /[^a-zA-Z0-9_]/;
    if (value === "" || invalidChars.test(value)) {
      usernameHelper.style.display = "block";
    } else {
      usernameHelper.style.display = "none";
    }
  });

  passwordInput.addEventListener("input", () => {
    const value = passwordInput.value;
    if (value.length < 8) {
      passwordHelper.style.display = "block";
    } else {
      passwordHelper.style.display = "none";
    }
  });
});
