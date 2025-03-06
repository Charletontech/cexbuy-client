// grabbing elements
const menuCont = document.querySelector(".menuCont");
const menuBtn = document.querySelector(".menuBtn");
const closeBtn = document.querySelector(".closeBtn");

menuBtn.addEventListener("click", toggleMenu);
closeBtn.addEventListener("click", toggleMenu);

// toggle menu logic
function toggleMenu() {
  menuCont.classList.toggle("showMenu");
}

import { incrementStats } from "./incrementStats.js";
import { testimonials } from "./testimonials.js";

document.addEventListener("DOMContentLoaded", function () {
  incrementStats();
  testimonials();
});
