// ===== MOBILE MENU BUTTON =====
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

// ===== CLOSE MOBILE MENU AFTER CLICKING A LINK =====
document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
  });
});

// ===== AUTOMATIC FOOTER YEAR =====
document.getElementById("year").textContent = new Date().getFullYear();
