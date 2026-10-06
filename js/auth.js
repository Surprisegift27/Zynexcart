/* =========================================================
   ZYNEXCART AUTHENTICATION
   Mobile → OTP → Name
========================================================= */

(function () {
  "use strict";


  /* =======================================================
     ELEMENTS
  ======================================================== */

  const mobileStep = document.getElementById("mobileStep");
  const otpStep = document.getElementById("otpStep");
  const nameStep = document.getElementById("nameStep");
  const authSuccess = document.getElementById("authSuccess");

  const mobileLoginForm =
    document.getElementById("mobileLoginForm");

  const otpForm =
    document.getElementById("otpForm");

  const nameForm =
    document.getElementById("nameForm");

  const mobileNumberInput =
    document.getElementById("mobileNumber");

  const customerNameInput =
    document.getElementById("customerName");

  const otpInputs =
    Array.from(document.querySelectorAll(".otp-input"));

  const otpMobileNumber =
    document.getElementById("otpMobileNumber");

  const mobileError =
    document.getElementById("mobileError");

  const otpError =
    document.getElementById("otpError");

  const nameError =
    document.getElementById("nameError");

  const continueMobileBtn =
    document.getElementById("continueMobileBtn");

  const verifyOtpBtn =
    document.getElementById("verifyOtpBtn");

  const continueNameBtn =
    document.getElementById("continueNameBtn");

  const resendOtpBtn =
    document.getElementById("resendOtpBtn");

  const otpTimer =
    document.getElementById("otpTimer");

  const changeMobileBtn =
    document.getElementById("changeMobileBtn");

  const changeMobileLink =
    document.getElementById("changeMobileLink");

  const mobileAuthBack =
    document.getElementById("mobileAuthBack");


  /* =======================================================
     STATE
  ======================================================== */

  let currentMobile = "";
  let otpTimerInterval = null;
  let resendAvailable = false;

  /*
    Demo OTP.

    IMPORTANT:
    This is only a temporary front-end OTP flow.

    For real customer authentication, this value must be
    replaced by Supabase/Twilio OTP verification.
  */

  const DEMO_OTP = "123456";


  /* =======================================================
     STORAGE KEYS
  ======================================================== */

  const STORAGE_KEYS = {
    mobile: "zynexcart_auth_mobile",
    name: "zynexcart_customer_name",
    loggedIn: "zynexcart_logged_in"
  };


  /* =======================================================
     BASIC HELPERS
  ======================================================== */

  function showStep(step) {

    const steps = [
      mobileStep,
      otpStep,
      nameStep
    ];

    steps.forEach(function (item) {

      if (!item) return;

      item.hidden = true;
      item.classList.remove("active");

    });

    if (!step) return;

    step.hidden = false;

    requestAnimationFrame(function () {
      step.classList.add("active");
    });

  }


  function clearErrors() {

    if (mobileError) {
      mobileError.textContent = "";
    }

    if (otpError) {
      otpError.textContent = "";
    }

    if (nameError) {
      nameError.textContent = "";
    }

  }


  function setLoading(button, loading) {

    if (!button) return;

    button.disabled = loading;

    if (loading) {
      button.classList.add("loading");
    } else {
      button.classList.remove("loading");
    }

  }


  function normalizeMobile(value) {

    return String(value || "")
      .replace(/\D/g, "")
      .slice(0, 10);

  }


  function isValidMobile(value) {

    return /^[6-9]\d{9}$/.test(value);

  }


  function formatMobile(value) {

    const number = normalizeMobile(value);

    if (number.length !== 10) {
      return "+91 XXXXX XXXXX";
    }

    return (
      "+91 " +
      number.slice(0, 5) +
      " " +
      number.slice(5)
    );

  }


  /* =======================================================
     MOBILE INPUT
  ======================================================== */

  if (mobileNumberInput) {

    mobileNumberInput.addEventListener(
      "input",
      function () {

        const cleaned =
          normalizeMobile(
            mobileNumberInput.value
          );

        mobileNumberInput.value = cleaned;

        if (mobileError) {
          mobileError.textContent = "";
        }

      }
    );

  }


  /* =======================================================
     SEND OTP
  ======================================================== */

  if (mobileLoginForm) {

    mobileLoginForm.addEventListener(
      "submit",
      function (event) {

        event.preventDefault();

        clearErrors();

        const mobile =
          normalizeMobile(
            mobileNumberInput.value
          );

        mobileNumberInput.value = mobile;


        /* Validation */

        if (!mobile) {

          mobileError.textContent =
            "Please enter your mobile number.";

          mobileNumberInput.focus();

          return;
        }


        if (!isValidMobile(mobile)) {

          mobileError.textContent =
            "Please enter a valid 10-digit mobile number.";

          mobileNumberInput.focus();

          return;
        }


        currentMobile = mobile;

        setLoading(
          continueMobileBtn,
          true
        );


        /*
          Temporary OTP simulation.

          In production this section will call the
          real Supabase/Twilio OTP service.
        */

        setTimeout(function () {

          setLoading(
            continueMobileBtn,
            false
          );

          if (otpMobileNumber) {

            otpMobileNumber.textContent =
              formatMobile(currentMobile);

          }

          clearOtpInputs();

          showStep(otpStep);

          startOtpTimer();

          if (otpInputs[0]) {
            setTimeout(function () {
              otpInputs[0].focus();
            }, 150);
          }

        }, 650);

      }
    );

  }


  /* =======================================================
     OTP INPUT SYSTEM
  ======================================================== */

  otpInputs.forEach(function (input, index) {


    input.addEventListener(
      "input",
      function () {

        const value =
          input.value.replace(/\D/g, "");

        input.value =
          value.slice(0, 1);

        if (input.value) {

          input.classList.add("filled");

          if (index < otpInputs.length - 1) {

            otpInputs[index + 1].focus();

          }

        } else {

          input.classList.remove("filled");

        }

        if (otpError) {
          otpError.textContent = "";
        }

      }
    );


    input.addEventListener(
      "keydown",
      function (event) {

        if (
          event.key === "Backspace" &&
          !input.value &&
          index > 0
        ) {

          otpInputs[index - 1].focus();

          otpInputs[index - 1].value = "";

          otpInputs[index - 1]
            .classList.remove("filled");

        }


        if (
          event.key === "ArrowLeft" &&
          index > 0
        ) {

          otpInputs[index - 1].focus();

        }


        if (
          event.key === "ArrowRight" &&
          index < otpInputs.length - 1
        ) {

          otpInputs[index + 1].focus();

        }

      }
    );


    input.addEventListener(
      "paste",
      function (event) {

        event.preventDefault();

        const pasted =
          (
            event.clipboardData ||
            window.clipboardData
          )
            .getData("text")
            .replace(/\D/g, "")
            .slice(0, 6);

        if (!pasted) return;

        pasted
          .split("")
          .forEach(function (digit, i) {

            if (!otpInputs[i]) return;

            otpInputs[i].value = digit;

            otpInputs[i]
              .classList.add("filled");

          });

        const lastIndex =
          Math.min(
            pasted.length,
            otpInputs.length
          ) - 1;

        if (lastIndex >= 0) {
          otpInputs[lastIndex].focus();
        }

      }
    );

  });


  /* =======================================================
     GET OTP
  ======================================================== */

  function getOtp() {

    return otpInputs
      .map(function (input) {
        return input.value;
      })
      .join("");

  }


  /* =======================================================
     CLEAR OTP
  ======================================================== */

  function clearOtpInputs() {

    otpInputs.forEach(function (input) {

      input.value = "";

      input.classList.remove(
        "filled"
      );

    });

  }


  /* =======================================================
     VERIFY OTP
  ======================================================== */

  if (otpForm) {

    otpForm.addEventListener(
      "submit",
      function (event) {

        event.preventDefault();

        clearErrors();

        const otp = getOtp();


        if (otp.length !== 6) {

          otpError.textContent =
            "Please enter the 6-digit OTP.";

          const firstEmpty =
            otpInputs.find(function (input) {
              return !input.value;
            });

          if (firstEmpty) {
            firstEmpty.focus();
          }

          return;
        }


        setLoading(
          verifyOtpBtn,
          true
        );


        /*
          Temporary OTP verification.

          Demo OTP:
          123456
        */

        setTimeout(function () {

          setLoading(
            verifyOtpBtn,
            false
          );


          if (otp !== DEMO_OTP) {

            otpError.textContent =
              "Invalid OTP. Please try again.";

            clearOtpInputs();

            if (otpInputs[0]) {
              otpInputs[0].focus();
            }

            return;
          }


          /*
            Save mobile temporarily.
          */

          try {

            localStorage.setItem(
              STORAGE_KEYS.mobile,
              currentMobile
            );

          } catch (error) {
            console.warn(
              "Unable to save mobile locally.",
              error
            );
          }


          /*
            Check whether customer name already exists.
          */

          let existingName = "";

          try {

            existingName =
              localStorage.getItem(
                STORAGE_KEYS.name
              ) || "";

          } catch (error) {
            existingName = "";
          }


          if (existingName) {

            completeLogin(
              existingName
            );

          } else {

            showStep(nameStep);

            setTimeout(function () {

              if (customerNameInput) {
                customerNameInput.focus();
              }

            }, 150);

          }

        }, 650);

      }
    );

  }


  /* =======================================================
     RESEND OTP
  ======================================================== */

  if (resendOtpBtn) {

    resendOtpBtn.addEventListener(
      "click",
      function () {

        if (!resendAvailable) {
          return;
        }

        clearOtpInputs();

        if (otpError) {
          otpError.textContent = "";
        }

        startOtpTimer();

        /*
          Temporary resend simulation.
          Real SMS resend will be connected here.
        */

        if (otpInputs[0]) {
          otpInputs[0].focus();
        }

      }
    );

  }


  /* =======================================================
     OTP TIMER
  ======================================================== */

  function startOtpTimer() {

    if (!resendOtpBtn || !otpTimer) {
      return;
    }

    if (otpTimerInterval) {
      clearInterval(otpTimerInterval);
    }

    let seconds = 30;

    resendAvailable = false;

    resendOtpBtn.disabled = true;

    otpTimer.textContent =
      "(" + seconds + "s)";


    otpTimerInterval =
      setInterval(function () {

        seconds--;

        if (seconds <= 0) {

          clearInterval(
            otpTimerInterval
          );

          otpTimerInterval = null;

          resendAvailable = true;

          resendOtpBtn.disabled = false;

          otpTimer.textContent = "";

          return;

        }

        otpTimer.textContent =
          "(" + seconds + "s)";

      }, 1000);

  }


  /* =======================================================
     CHANGE MOBILE NUMBER
  ======================================================== */

  function changeMobileNumber() {

    clearErrors();

    clearOtpInputs();

    currentMobile = "";

    if (otpTimerInterval) {

      clearInterval(
        otpTimerInterval
      );

      otpTimerInterval = null;

    }

    showStep(mobileStep);

    if (mobileNumberInput) {

      setTimeout(function () {
        mobileNumberInput.focus();
      }, 150);

    }

  }


  if (changeMobileBtn) {

    changeMobileBtn.addEventListener(
      "click",
      changeMobileNumber
    );

  }


  if (changeMobileLink) {

    changeMobileLink.addEventListener(
      "click",
      changeMobileNumber
    );

  }


  /* =======================================================
     NAME
  ======================================================== */

  if (nameForm) {

    nameForm.addEventListener(
      "submit",
      function (event) {

        event.preventDefault();

        clearErrors();

        const name =
          String(
            customerNameInput.value || ""
          )
            .trim()
            .replace(/\s+/g, " ");


        if (!name) {

          nameError.textContent =
            "Please enter your name.";

          customerNameInput.focus();

          return;
        }


        if (name.length < 2) {

          nameError.textContent =
            "Please enter a valid name.";

          customerNameInput.focus();

          return;
        }


        if (name.length > 60) {

          nameError.textContent =
            "Name is too long.";

          customerNameInput.focus();

          return;
        }


        setLoading(
          continueNameBtn,
          true
        );


        setTimeout(function () {

          try {

            localStorage.setItem(
              STORAGE_KEYS.name,
              name
            );

          } catch (error) {

            console.warn(
              "Unable to save customer name.",
              error
            );

          }


          setLoading(
            continueNameBtn,
            false
          );


          completeLogin(name);

        }, 500);

      }
    );

  }


  /* =======================================================
     COMPLETE LOGIN
  ======================================================== */

  function completeLogin(name) {

    try {

      localStorage.setItem(
        STORAGE_KEYS.loggedIn,
        "true"
      );

      if (currentMobile) {

        localStorage.setItem(
          STORAGE_KEYS.mobile,
          currentMobile
        );

      }

      if (name) {

        localStorage.setItem(
          STORAGE_KEYS.name,
          name
        );

      }

    } catch (error) {

      console.warn(
        "Unable to save login state.",
        error
      );

    }


    /*
      Show success briefly.
    */

    mobileStep.hidden = true;
    otpStep.hidden = true;
    nameStep.hidden = true;

    if (authSuccess) {

      authSuccess.hidden = false;

    }


    /*
      Redirect to home after successful login.
    */

    setTimeout(function () {

      window.location.href =
        "index.html";

    }, 900);

  }


  /* =======================================================
     TERMS / PRIVACY
  ======================================================== */

  const termsLink =
    document.getElementById("termsLink");

  const privacyLink =
    document.getElementById("privacyLink");


  if (termsLink) {

    termsLink.addEventListener(
      "click",
      function (event) {

        event.preventDefault();

        alert(
          "ZynexCart Terms of Service will be available here."
        );

      }
    );

  }


  if (privacyLink) {

    privacyLink.addEventListener(
      "click",
      function (event) {

        event.preventDefault();

        alert(
          "ZynexCart Privacy Policy will be available here."
        );

      }
    );

  }


  /* =======================================================
     MOBILE BACK BUTTON
  ======================================================== */

  if (mobileAuthBack) {

    mobileAuthBack.addEventListener(
      "click",
      function () {

        window.location.href =
          "index.html";

      }
    );

  }


  /* =======================================================
     INITIAL STATE
  ======================================================== */

  showStep(mobileStep);

  if (mobileNumberInput) {

    mobileNumberInput.focus();

  }


  /* =======================================================
     PUBLIC AUTH API
  ======================================================== */

  window.ZynexCartAuth = {

    getCurrentMobile: function () {
      return currentMobile;
    },

    isLoggedIn: function () {

      try {

        return (
          localStorage.getItem(
            STORAGE_KEYS.loggedIn
          ) === "true"
        );

      } catch (error) {

        return false;

      }

    },

    getCustomerName: function () {

      try {

        return (
          localStorage.getItem(
            STORAGE_KEYS.name
          ) || ""
        );

      } catch (error) {

        return "";

      }

    },

    logout: function () {

      try {

        localStorage.removeItem(
          STORAGE_KEYS.loggedIn
        );

        localStorage.removeItem(
          STORAGE_KEYS.mobile
        );

        localStorage.removeItem(
          STORAGE_KEYS.name
        );

      } catch (error) {

        console.warn(
          "Unable to clear login state.",
          error
        );

      }

    }

  };

})();
