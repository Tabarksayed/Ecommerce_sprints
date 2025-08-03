document.addEventListener("DOMContentLoaded", () => {
  const userList = document.getElementById("userList");
  const productList = document.getElementById("productList");
  const logoutBtn = document.getElementById("logoutBtn");

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser || !currentUser.isAdmin) {
    Swal.fire("Access Denied", "Admins only", "error").then(() => {
      window.location.href = "../auth.html";
    });
    return;
  }

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    Swal.fire("Logged out", "Goodbye admin", "info").then(() => {
      window.location.href = "../auth.html";
    });
  });

  // Load users
  const users = JSON.parse(localStorage.getItem("users")) || [];
  users.forEach((user, index) => {
    const li = document.createElement("li");
    li.textContent = `${user.username} - ${user.email} ${user.isAdmin ? "(Admin)" : ""}`;
    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.addEventListener("click", () => {
      Swal.fire({
        title: 'Are you sure?',
        text: `Delete user ${user.username}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete!',
      }).then((result) => {
        if (result.isConfirmed) {
          users.splice(index, 1);
          localStorage.setItem("users", JSON.stringify(users));
          location.reload();
        }
      });
    });
    li.appendChild(delBtn);
    userList.appendChild(li);
  });

  // Load products
  const products = JSON.parse(localStorage.getItem("products")) || [];
  products.forEach((product, index) => {
    const li = document.createElement("li");
    li.textContent = `${product.name} - ${product.price} EGP`;
    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.addEventListener("click", () => {
      Swal.fire({
        title: 'Are you sure?',
        text: `Delete product ${product.name}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete!',
      }).then((result) => {
        if (result.isConfirmed) {
          products.splice(index, 1);
          localStorage.setItem("products", JSON.stringify(products));
          location.reload();
        }
      });
    });
    li.appendChild(delBtn);
    productList.appendChild(li);
  });
});
