function showSpinnerModal() {
  document.getElementById('spinnerModal').style.display = 'flex';
}

function hideSpinnerModal() {
  document.getElementById('spinnerModal').style.display = 'none';
}


function formatCurrency(amount, locale = 'en-US') {
  return new Intl.NumberFormat(locale, {
  }).format(amount);
}

showSpinnerModal()


//sign out function
async function signOutUser() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.log('Error signing out:', error.message);
  } else {
    console.log('User signed out successfully');
    window.location.href = "../index.html";
  }
}



async function fetchUserData() {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.error('Network Error getting session:', error.message);
  } else {


    if (data.session == null) {
      alert('we are not loged in')
    } else {
      alert('we are loged in')
    }


    showSpinnerModal();
    const user = data.session?.user;
    window.userUuid = user.id;
    if (user) {

      const { data, error } = await supabase
        .from('onlinbanking')
        .select('*')
        .eq('uuid', user.id);

      if (error) {
        alert('Error fetching user data:', error);
        hideSpinnerModal();
      } else {
        data.forEach(doc => {
          //checking if user is active 
          if (doc.activeuser == "inactive") {
            hideSpinnerModal()
            Swal.fire({
              background: '#0C290F',
              confirmButtonColor: 'green',
              customClass: {
                popup: 'swal2Style'
              },
              title: 'YOUR ACCOUNT IS CURRENTLY INACTIVE',
              text: "Please contact our customer-service for your account re-activation",
              icon: 'warning',
              showCancelButton: false,
              confirmButtonText: 'OK!'
            }).then((result) => {
              if (result.isConfirmed) {
                signOutUser();
              } else if (result.isDismissed) {
                signOutUser();
              }
            });
          } else {
            // User is active
            window.dataBase = doc;
            // document.getElementById('').innerHTML
            // slow down loading spinner because with window variable takes time to be vaild
            setTimeout(() => {
              hideSpinnerModal();
            }, 1000);

          }
        });
      }


      document.getElementById('logout').addEventListener('click', () => {
        signOutUser();
      })



    } else {
      alert('no user')
      // signOutUser();
    }
  }

} fetchUserData();


/////////////////////////
document.getElementById('openDeposit').addEventListener('click', async () => {

  Swal.fire({
    background: '#0C290F',
    showConfirmButton: false,
    width: 600,
    html: `
            <div class="popup-container">
              <h2>Bank Deposit Details</h2>
              <p>Please deposit to the account below. Tap the copy icon to copy details.</p>

              <div class="info-block">
                <div class="info-content">
                  <span class="info-label">Bank Name</span>
                  <span class="info-value" id="bankName">OnlinBankin</span>
                </div>
                <button class="copy-btn" onclick="copyText('bankName')">📋</button>
              </div>

              <div class="info-block">
                <div class="info-content">
                  <span class="info-label">Account Holder</span>
                  <span class="info-value" id="accountHolder">${dataBase.firstname} ${dataBase.middlename} ${dataBase.lastname}</span>
                </div>
                <button class="copy-btn" onclick="copyText('accountHolder')">📋</button>
              </div>

              <div class="info-block">
                <div class="info-content">
                  <span class="info-label">Account Number</span>
                  <span class="info-value" id="accountNumber">${dataBase.accountNumber}</span>
                </div>
                <button class="copy-btn" onclick="copyText('accountNumber')">📋</button>
              </div>
            </div>
          `,
    didOpen: () => {
      // Reattach copy functions inside the popup
      window.copyText = function (id) {
        const text = document.getElementById(id).textContent;
        navigator.clipboard.writeText(text).then(() => {
          Swal.fire({
            toast: true,
            icon: 'success',
            title: `Copied: ${text}`,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500
          });
        });
      };
    }
  });

});


document.getElementById('Trans2').addEventListener('click', () => {
  // Show confirmation dialog

  Swal.fire({
    title: "Transfer Type",
    background: '#0C290F',
    textColor: 'white',
    showDenyButton: true,
    denyButtonColor: 'green',
    confirmButtonColor: 'green',
    confirmButtonText: "Local Transfer",
    denyButtonText: `International Transfer`,
    customClass: {
      popup: 'swal2Style'
    },
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      window.location.href = "./local.html";
    } else if (result.isDenied) {
      window.location.href = "./international.html";
    }
  });
});

document.getElementById('Trans3').addEventListener('click', () => {
  // Show confirmation dialog

  Swal.fire({
    title: "Transfer Type",
    background: '#0C290F',
    textColor: 'white',
    showDenyButton: true,
    denyButtonColor: 'green',
    confirmButtonColor: 'green',
    confirmButtonText: "Local Transfer",
    denyButtonText: `International Transfer`,
    customClass: {
      popup: 'swal2Style'
    },
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      window.location.href = "./local.html";
    } else if (result.isDenied) {
      window.location.href = "./international.html";
    }
  });
});

document.getElementById('goLoan').addEventListener('click', () => {
  window.location.href = "loan.html";
});
document.getElementById('cards').addEventListener('click', () => {
  window.location.href = "cards.html";
});