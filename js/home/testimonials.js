export function testimonials() {
  const testimonials = [
    {
      img: "./assets/f130000b-d954-44f0-bba3-ae763b16d3a6_removalai_preview.png",
      quote:
        "“CexBuy has transformed my finances! I earn passive income effortlessly, and their investment strategies are top-notch.”",
      author: "Stephen H.",
      location: "Manchester, UK",
    },
    {
      img: "./assets/6.png",
      quote:
        "“A fantastic service! Their team was incredibly helpful and made everything seamless. Highly recommended!”",
      author: "Lisa M.",
      location: "New York, USA",
    },
    {
      img: "./assets/1.png",
      quote:
        "“Reliable, transparent, and profitable—I’ve seen steady growth in my portfolio with CexBuy. Was skeptical at first, but i'm glad i took my chances!”",
      author: "David P.",
      location: "Sydney, Australia",
    },
  ];

  let currentIndex = 0;

  const imgElement = document.querySelector(".testimonial-left img");
  const quoteElement = document.querySelector(".testimonial-quote");
  const authorElement = document.querySelector(".testimonial-author");
  const locationElement = document.querySelector(".testimonial-location");

  const prevBtn = document.querySelector(
    ".testimonial-nav .nav-arrow:first-child"
  );
  const nextBtn = document.querySelector(
    ".testimonial-nav .nav-arrow:last-child"
  );

  function updateTestimonial(index) {
    imgElement.style.opacity = "0";
    quoteElement.style.opacity = "0";
    authorElement.style.opacity = "0";
    locationElement.style.opacity = "0";

    setTimeout(() => {
      imgElement.src = testimonials[index].img;
      quoteElement.textContent = testimonials[index].quote;
      authorElement.textContent = testimonials[index].author;
      locationElement.textContent = testimonials[index].location;

      imgElement.style.opacity = "1";
      quoteElement.style.opacity = "1";
      authorElement.style.opacity = "1";
      locationElement.style.opacity = "1";
    }, 300);
  }

  nextBtn.addEventListener("click", function () {
    currentIndex = (currentIndex + 1) % testimonials.length; // Loop forward
    updateTestimonial(currentIndex);
  });

  prevBtn.addEventListener("click", function () {
    currentIndex =
      (currentIndex - 1 + testimonials.length) % testimonials.length; // Loop backward
    updateTestimonial(currentIndex);
  });

  // Auto-change testimonials every 5 seconds
  setInterval(() => {
    currentIndex = (currentIndex + 1) % testimonials.length;
    updateTestimonial(currentIndex);
  }, 5000);
}
