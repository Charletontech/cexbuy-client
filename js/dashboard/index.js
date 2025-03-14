var generalUserID;

// LOGIC TO GET ALL DASHBOARD DATA
// grabbing the input elements
const userEmail = document.querySelector(".user-email");
const balance = document.getElementById("balance");
const balance2 = document.getElementById("balance2");
const currentPlan = document.getElementById("currentPlan");
const amtInvested = document.getElementById("amtInvested");
const roi = document.getElementById("roi");
const userName = document.querySelector(".userName");

// grab investment progress elements
const dateInvested = document.getElementById("dateInvested");
const cashoutDate = document.getElementById("cashoutDate");

// fetch data once DOM is loaded
let dashboardData = await fetchDashboardData();

// set dashboard data into DOM
generalUserID = dashboardData.userData.email; //so email id can be accessible generally
userEmail.innerHTML = dashboardData.userData.email || "No email found";
balance.innerHTML = dashboardData.userData.balance || "0.00";
balance2.innerHTML = dashboardData.userData.balance || "0.00";
userName.innerHTML = dashboardData.userData.fullName || "--";
currentPlan.innerHTML =
  dashboardData.allPurchasedPlans[0]?.plan.toUpperCase() || "None";
amtInvested.innerHTML = dashboardData.allPurchasedPlans[0]?.amount || "0";
roi.innerHTML = dashboardData.allPurchasedPlans[0]?.roi || "0";

let dateInvestedObj = new Date(dashboardData.allPurchasedPlans[0]?.createdAt);
dateInvested.innerHTML = `${dateInvestedObj.getDate() || "--"}/${
  dateInvestedObj.getMonth() + 1 || "--"
}/${dateInvestedObj.getFullYear() || "--"}`;

let matureDateObj = new Date(dashboardData.allPurchasedPlans[0]?.matureDate);
cashoutDate.innerHTML = `${matureDateObj.getDate() || "--"}/${
  matureDateObj.getMonth() + 1 || "--"
}/${matureDateObj.getFullYear() || "--"}`;

function calculateElapsedPercentage(startDate, futureDate) {
  const start = new Date(startDate).getTime();
  const future = new Date(futureDate).getTime();
  const now = Date.now();

  const totalDuration = future - start;
  const elapsedTime = now - start;
  const percentageElapsed = (elapsedTime / totalDuration) * 100;
  return Math.min(Math.max(Math.round(percentageElapsed), 0), 100);
}

const elapsedPercentage = calculateElapsedPercentage(
  dateInvestedObj,
  matureDateObj
);

const progressBar = document.querySelector(".progressBar");
progressBar.innerHTML = `${elapsedPercentage || 0}%`;
progressBar.style.width = `${elapsedPercentage || 0}%`;
// populate active investments UI
const activeInvestments = document.querySelector(".activeInvestments");
if (dashboardData.allPurchasedPlans.length < 1) {
  activeInvestments.innerHTML += "You have no active investments";
} else {
  dashboardData.allPurchasedPlans.forEach((element) => {
    let date = new Date(element.createdAt);
    activeInvestments.innerHTML += `
        <div class="box">
                  <div>
                    <h3>${element.plan}</h3>
                    <p>${date.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h3>
                      <span>${element.amount} </span
                      ><small style="font-size: 12px; color: gray">USD</small>
                    </h3>
                    <p
                      style="font-weight: bold; color: var(--blue); cursor: pointer"
                      class="updateAnalyticsBtn"
                      data-plan="${element.plan}"
                    data-amount="${element.amount}"
                    data-roi="${element.roi}"
                    >
                      Show analytics
                    </p>
                  </div>
                </div>
      `;
  });
}

// declare function to fetch data
async function fetchDashboardData() {
  return new Promise((resolve, reject) => {
    fetch("http://127.0.0.1:5000/api/v1/dashboard/me", {
      method: "get",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
      })
      .then((data) => {
        // console.log("Success:", data);
        resolve(data.data);
      })
      .catch((error) => {
        reject(error);
        console.error("Error:", error);
      });
  });
}

// LOGIC TO UPDATE ANALYTICS
const updateAnalyticsBtns = document.querySelectorAll(".updateAnalyticsBtn");
updateAnalyticsBtns.forEach((updateAnalyticsBtn) => {
  updateAnalyticsBtn.addEventListener("click", updateAnalytics);
});
function updateAnalytics(e) {
  const getDataSet = e.target.dataset;
  let plan = getDataSet.plan;
  let amount = getDataSet.amount;
  let roiDataSet = getDataSet.roi;

  currentPlan.innerHTML = plan;
  amtInvested.innerHTML = amount;
  roi.innerHTML = roiDataSet;
}

//  logic to toggle menu
const menuBtn = document.querySelector(".menuBtn");
const closeBtn = document.querySelector(".closeBtn");
const sideMenu = document.querySelector(".mainFrame aside");

menuBtn.addEventListener("click", () => {
  sideMenu.classList.toggle("showMenu");
});

closeBtn.addEventListener("click", () => {
  sideMenu.classList.toggle("showMenu");
});

// Logic to toggle plan options
const optionsBtns = document.querySelectorAll(".box button");
const nextElements = [];

optionsBtns.forEach((optionsBtn) => {
  optionsBtn.addEventListener("click", (e) => {
    const nextElement = optionsBtn.nextElementSibling;
    if (nextElement) {
      nextElement.classList.toggle("showOptions");
      nextElements.push(nextElement);
      // Prevent the document click handler from removing the class immediately
      e.stopPropagation();
    }
  });
});

document.addEventListener("click", (e) => {
  let clickedInside = false;

  optionsBtns.forEach((optionsBtn) => {
    if (optionsBtn.contains(e.target)) {
      clickedInside = true;
    }
  });

  nextElements.forEach((nextElement) => {
    if (!clickedInside && !nextElement.contains(e.target)) {
      nextElement.classList.remove("showOptions");
    }
  });
});

// LOGIC TO HANDLE WITHDRAWAL
const withdrawBtns = document.querySelectorAll(".withdrawBtn");
withdrawBtns.forEach((withdrawBtn) => {
  withdrawBtn.addEventListener("click", async () => {
    const { value: formValues } = await Swal.fire({
      title: "Withdrawal form",
      html: `
    <input id="swal-input1" name="wAddress" class="swal2-input" placeholder="Wallet address" required>
    <input id="swal-input2" name="wType" class="swal2-input" placeholder="Wallet type" required>  
    <input id="swal-input3" name="amount" class="swal2-input" placeholder="Amount to withdraw" type="number" required>
  `,
      focusConfirm: false,
      confirmButtonText: "Submit",
      confirmButtonColor: "#007bff",
      preConfirm: () => {
        return [
          document.getElementById("swal-input1").value,
          document.getElementById("swal-input2").value,
          document.getElementById("swal-input3").value,
        ];
      },
    });

    if (formValues) {
      const Toast = Swal.mixin({
        toast: true,
        position: "center",
        showConfirmButton: false,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: "info",
        title: "Please wait, we are sending your withdrawal request...",
      });

      var noEmptyFields = true;

      // ensure no empty fields
      formValues.forEach((element) => {
        if (element === "") {
          noEmptyFields = false;
        }
      });

      if (!noEmptyFields) {
        Toast.fire({
          icon: "info",
          title:
            "You can not leave any field empty. Please fill out all fields",
        });
      } else {
        // send withdrawal request to server
        var requestBody = {
          formdata: formValues,
          user: generalUserID,
        };
        fetch("http://localhost:5000/api/v1/dashboard/withdrawal-request", {
          method: "POST",
          body: JSON.stringify(requestBody),
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => {
            if (!response.ok) {
              Toast.fire({
                icon: "error",
                title:
                  "An error occurred. Request failed with status " +
                  response.status,
              });
            }
            return response.json();
          })
          .then((data) => {
            if (data.success === true) {
              Toast.fire({
                icon: "success",
                title:
                  "Withdrawal request successfully sent. An admin will process your request within the next 3 working days.",
              });
            } else {
              Toast.fire({
                icon: "error",
                title:
                  "An error occurred. Request failed with reason: " +
                  data.error,
              });
            }
            console.log("Success:", data);
          })
          .catch((error) => {
            console.error("Error:", error); // Handle any errors that occur
          });
      }
    }
  });
});

// LOGIC FOR FUND WALLET MODAL
const nextButton = document.getElementById("nextButton");
const closeButton = document.getElementById("closeButton");
const fundBtns = document.querySelectorAll(".fundBtn");
let currentStep = 0;
const steps = [
  {
    title: "Step 1",
    description:
      "Make a transfer of the amount you want to deposit into any of the crypto wallets below.",
  },
  {
    title: "Step 2",
    description: "Take a screenshot of the transfer as evidence.",
  },
  {
    title: "Step 3",
    description:
      "Fill in details and upload the screenshot picture in the form that will be displayed after this prompt.",
  },
  {
    title: "Step 4",
    description:
      "Wait for admin to confirm the transaction and approve, then your balance will automatically updated.",
  },
  { title: "Step 5", description: "Your process is complete!" },
];

fundBtns.forEach((fundBtn) => {
  fundBtn.addEventListener("click", openModal);
});

nextButton.addEventListener("click", nextStep);
closeButton.addEventListener("click", closeModal);

function openModal() {
  document.getElementById("popupModal").style.display = "block";
  updateStep();
}

function closeModal() {
  document.getElementById("popupModal").style.display = "none";
  currentStep = 0; // Reset steps when closed
  showScreenshotForm();
}

function updateStep() {
  document.getElementById("stepTitle").innerText = steps[currentStep].title;
  document.getElementById("stepDescription").innerText =
    steps[currentStep].description;

  // Update breadcrumbs
  const breadcrumbContainer = document.getElementById("breadcrumb");
  breadcrumbContainer.innerHTML = "";
  steps.forEach((_, index) => {
    const stepElement = document.createElement("div");
    stepElement.classList.add("step");
    if (index === currentStep) stepElement.classList.add("active");
    stepElement.innerText = index + 1;
    breadcrumbContainer.appendChild(stepElement);
  });

  // Update buttons
  const nextButton = document.getElementById("nextButton");
  const closeButton = document.getElementById("closeButton");

  if (currentStep === steps.length - 1) {
    nextButton.classList.add("hidden");
    closeButton.classList.remove("hidden");
  } else {
    nextButton.classList.remove("hidden");
    closeButton.classList.add("hidden");
  }
}

function nextStep() {
  if (currentStep < steps.length - 1) {
    currentStep++;
    updateStep();
  }
}

// LOGIC TO DISPLAY SCREENSHOT UPLOAD FORM
function showScreenshotForm() {
  Swal.fire({
    title: "Upload a File",
    html: `
          <input type="email"  id="swal-input-text1" class="swal2-input" name="email" placeholder="Enter your user email">
          <input type="file" id="swal-input-file" class="swal2-input" placeholder="Upload screenshot">
      `,
    showCancelButton: true,
    confirmButtonText: "Upload",
    preConfirm: () => {
      const text1 = document.getElementById("swal-input-text1").value.trim();
      const fileInput = document.getElementById("swal-input-file");

      if (!text1) {
        Swal.showValidationMessage(
          "Email is required. Must be email you signed up with"
        );
        return false;
      }
      if (fileInput.files.length === 0) {
        Swal.showValidationMessage("Please select a file");
        return false;
      }

      return {
        text1,
        file1: fileInput.files[0],
      };
    },
  }).then((result) => {
    if (result.isConfirmed) {
      console.log("Text 1:", result.value.text1);
      console.log("Selected file:", result.value.file);

      const formData = new FormData();
      formData.append("email", result.value.text1);
      formData.append("file", result.value.file1);

      // Replace with your actual upload URL
      const uploadUrl = "http://127.0.0.1:5000/api/v1/dashboard/upload-receipt";

      Swal.fire({
        title: "Uploading...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      fetch(uploadUrl, {
        method: "POST",
        body: formData,
        credentials: "include",
      })
        .then((response) => response.json())
        .then((data) => {
          // Swal.fire("Success!", "Your file has been uploaded.", "success");
          if (data.success === true) {
            Swal.fire("Success!", `${data.data}`, "success");
          } else {
            Swal.fire("Oops!", `${data.error}`, "error");
          }
          console.log("Server Response:", data);
        })
        .catch((error) => {
          Swal.fire("Error!", "Something went wrong. Try again.", "error");
          console.error("Upload Error:", error);
        });
    }
  });
}

// LOGIC TO HANDLE PLAN PURCHASE
// grab all plan buttons
const purchasePlanBtns = document.querySelectorAll(".purchasePlanBtn");
const orderInfo = {};

// Define the event handler function
async function handlePurchasePlanClick(e) {
  const purchasePlanBtn = e.currentTarget;
  // first disable button and remove event listener
  e.target.innerHTML = "Loading...";
  e.target.style.opacity = "0.5";
  purchasePlanBtn.removeEventListener("click", handlePurchasePlanClick);

  orderInfo.plan = purchasePlanBtn.dataset.plan;
  orderInfo.amount = parseInt(purchasePlanBtn.dataset.amount);
  orderInfo.roi = parseInt(purchasePlanBtn.dataset.roi);
  orderInfo.user = generalUserID;

  fetch("http://127.0.0.1:5000/api/v1/dashboard/purchase-plan", {
    method: "POST",
    body: JSON.stringify(orderInfo),
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      purchasePlanBtn.addEventListener("click", handlePurchasePlanClick);

      return response.json();
    })
    .then((data) => {
      // re-enable button
      e.target.innerHTML = "Select";
      e.target.style.opacity = "1";
      purchasePlanBtn.addEventListener("click", handlePurchasePlanClick);
      console.log("Success:", data);
    })
    .catch((error) => {
      purchasePlanBtn.addEventListener("click", handlePurchasePlanClick);
      console.error("Error:", error);
    });
}

purchasePlanBtns.forEach((purchasePlanBtn) => {
  purchasePlanBtn.addEventListener("click", handlePurchasePlanClick);
});
