// Simulated data (You would get this data from an API endpoint)
async function fetchUsersData() {
  return new Promise((resolve, reject) => {
    fetch("https://cexbuy-server.onrender.com/api/v1/admin/all-users", {
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

// Populate Users table
async function populateUsersTable() {
  const users = await fetchUsersData();
  const userTableBody = document.getElementById("user-table-body");
  users.forEach((user) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user.email}</td>
      <td><input type="number" value="${user.balance}" id="balance-${user.email}" /></td>
      <td>${user.wallet}</td>
      <td>${user.walletType}</td>
      <td>${user.country}</td>
      <td>${user.fullName}</td>
      <td><button class="button" onclick="updateBalance('${user.email}')">Update Balance</button></td>
    `;
    userTableBody.appendChild(row);
  });
}
populateUsersTable();

// Update balance function
function updateBalance(email) {
  const newBalance = document.getElementById(`balance-${email}`).value;
  const payload = { email, newBalance };
  // console.log("Updating balance for", email, "to", newBalance);
  // sending request to server
  fetch("https://cexbuy-server.onrender.com/api/v1/admin/edit-user-balance", {
    method: "post",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
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
      alert(data.data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// plan data - from an API endpoint
async function fetchPlansData() {
  return new Promise((resolve, reject) => {
    fetch("https://cexbuy-server.onrender.com/api/v1/admin/all-plans", {
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

// Populate Plans table
async function populatePlansTable() {
  const planTableBody = document.getElementById("plan-table-body");
  const plans = await fetchPlansData();
  plans.forEach((plan) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${plan.user}</td>
      <td>${plan.amount}</td>
      <td>${plan.plan}</td>
      <td>${plan.roi}</td>
      <td>${plan.duration}</td>
      <td>${plan.matureDate}</td>
    `;
    planTableBody.appendChild(row);
  });
}
populatePlansTable();

// withdrawal requests data
async function fetchWithdrawalRequestsData() {
  return new Promise((resolve, reject) => {
    fetch(
      "https://cexbuy-server.onrender.com/api/v1/admin/all-withdrawal-requests",
      {
        method: "get",
        credentials: "include",
      }
    )
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

// Populate Withdrawal Requests table
async function populateWithdrawalsTable() {
  const withdrawalTableBody = document.getElementById("withdrawal-table-body");
  const withdrawals = await fetchWithdrawalRequestsData();
  withdrawals.forEach((withdrawal) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${withdrawal.email}</td>
      <td>${withdrawal.amount}</td>
      <td>${withdrawal.walletAddress}</td>
      <td>${withdrawal.walletType}</td>
      <td>
        <select id="status-${
          withdrawal.email
        }" onchange="updateWithdrawalStatus('${withdrawal.id}', '${
      withdrawal.email
    }')">
          <option value="Pending" ${
            withdrawal.status === "Pending" ? "selected" : ""
          }>Pending</option>
          <option value="Approved" ${
            withdrawal.status === "Approved" ? "selected" : ""
          }>Approved</option>
          <option value="Rejected" ${
            withdrawal.status === "Rejected" ? "selected" : ""
          }>Rejected</option>
        </select>
      </td>
    `;
    withdrawalTableBody.appendChild(row);
  });
}

populateWithdrawalsTable();

// Update withdrawal status function
function updateWithdrawalStatus(id, email) {
  const newStatus = document.getElementById(`status-${email}`).value;
  // console.log(`Withdrawal status for ${email} updated to ${newStatus}`);

  // Simulate sending request to server
  fetch(
    "https://cexbuy-server.onrender.com/api/v1/admin/update-withdrawal-status",
    {
      method: "post",
      body: JSON.stringify({ id, newStatus }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    })
    .then((data) => {
      // console.log("Success:", data);
      alert(data.data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// wallet funding requests data
async function fetchFundWalletRequestsData() {
  return new Promise((resolve, reject) => {
    fetch(
      "https://cexbuy-server.onrender.com/api/v1/admin/all-fund-wallet-requests",
      {
        method: "get",
        credentials: "include",
      }
    )
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

// Populate Wallet Funding Requests table
async function populateFundRequestsTable() {
  const fundingTableBody = document.getElementById("funding-table-body");
  const walletFundingRequests = await fetchFundWalletRequestsData();
  walletFundingRequests.forEach((funding) => {
    const row = document.createElement("tr");
    let dateRequested = new Date(funding.createdAt);
    row.innerHTML = `
      <td>${funding.email}</td>
      <td>${funding.amount}</td>
      <td><a href="${
        funding.receiptUrl
      }" target="_blank" style="color: black; font-weight: bold; text-decoration: none;">View receipt<a></td>
      <td>${dateRequested.toLocaleDateString()}</td>
      <td>
        <select id="funding-status-${
          funding.email
        }" onchange="updateFundingStatus('${funding.email}', '${funding.id}')">
          <option value="Pending" ${
            funding.status === "Pending" ? "selected" : ""
          }>Pending</option>
          <option value="Approved" ${
            funding.status === "Approved" ? "selected" : ""
          }>Approved</option>
          <option value="Rejected" ${
            funding.status === "Rejected" ? "selected" : ""
          }>Rejected</option>
        </select>
      </td>
    `;
    fundingTableBody.appendChild(row);
  });
}
populateFundRequestsTable();

// Update wallet funding status function
function updateFundingStatus(email, id) {
  const newStatus = document.getElementById(`funding-status-${email}`).value;
  // console.log(`Wallet funding status for ${email} updated to ${newStatus}`);
  // Simulate sending request to server
  fetch(
    "https://cexbuy-server.onrender.com/api/v1/admin/update-fund-wallet-status",
    {
      method: "post",
      body: JSON.stringify({ id, newStatus }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    })
    .then((data) => {
      // console.log("Success:", data);
      alert(data.data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
