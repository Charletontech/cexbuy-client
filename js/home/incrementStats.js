export function incrementStats() {
  console.log("first");
  const statsSection = document.querySelector(".statistics");
  const stats = document.querySelectorAll(".stat h2");
  let hasAnimated = false;

  function animateStats() {
    if (!hasAnimated && isElementInViewport(statsSection)) {
      stats.forEach((stat) => {
        const targetValue = parseInt(
          stat.textContent.replace(/[^0-9]/g, ""),
          10
        );
        const duration = 5000; // Animation duration in milliseconds
        let startValue = 0;
        let increment = targetValue / (duration / 16); // 16ms per frame

        let counter = setInterval(() => {
          startValue += increment;
          if (startValue >= targetValue) {
            startValue = targetValue;
            clearInterval(counter);
          }
          stat.textContent =
            formatNumber(Math.floor(startValue)) + getSuffix(stat.textContent);
        }, 16);
      });
      hasAnimated = true;
    }
  }

  function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  function formatNumber(num) {
    return num.toLocaleString(); // Adds commas as thousand separators
  }

  function getSuffix(text) {
    if (text.includes("M$")) return "M$";
    if (text.includes("+")) return "+";
    return "";
  }

  window.addEventListener("scroll", animateStats);
}
