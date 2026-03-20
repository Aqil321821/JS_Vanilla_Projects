const form = document.getElementById('form');
const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const password2 = document.getElementById('password2');
const submitBtn = form.querySelector('button');

// ---------------- UI Helpers ----------------
function showError(input, message) {
  const formControl = input.parentElement;
  formControl.classList.remove('success');
  formControl.classList.add('error');

  const small = formControl.querySelector('small');
  small.innerText = message;
}

function showSuccess(input) {
  const formControl = input.parentElement;
  formControl.classList.remove('error');
  formControl.classList.add('success');
}

// ---------------- Validators ----------------
function validateUsername() {
  const value = username.value.trim();

  if (value === '') {
    showError(username, 'Username is required');
    return false;
  }

  if (value.length < 3) {
    showError(username, 'Username must be at least 3 characters');
    return false;
  }

  if (value.length > 15) {
    showError(username, 'Username must be less than 15 characters');
    return false;
  }

  showSuccess(username);
  return true;
}

function validateEmail() {
  const value = email.value.trim();
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (value === '') {
    showError(email, 'Email is required');
    return false;
  }

  if (!re.test(value)) {
    showError(email, 'Email is not valid');
    return false;
  }

  showSuccess(email);
  return true;
}

function validatePassword() {
  const value = password.value.trim();

  if (value === '') {
    showError(password, 'Password is required');
    return false;
  }

  if (value.length < 6) {
    showError(password, 'Password must be at least 6 characters');
    return false;
  }

  if (value.length > 25) {
    showError(password, 'Password must be less than 25 characters');
    return false;
  }

  showSuccess(password);
  return true;
}

function validatePasswordMatch() {
  const value1 = password.value.trim();
  const value2 = password2.value.trim();

  if (value2 === '') {
    showError(password2, 'Confirm password is required');
    return false;
  }

  if (value1 !== value2) {
    showError(password2, 'Passwords do not match');
    return false;
  }

  showSuccess(password2);
  return true;
}

// ---------------- Event ----------------
form.addEventListener('submit', function (e) {
  e.preventDefault();

  const isUsernameValid = validateUsername();
  const isEmailValid = validateEmail();
  const isPasswordValid = validatePassword();
  const isMatch = validatePasswordMatch();

  if (isUsernameValid && isEmailValid && isPasswordValid && isMatch) {
    alert('Form Submitted !');
    form.reset();
    const formControls = document.querySelectorAll('.form-control');
    formControls.forEach((fc) => {
      fc.classList.remove('error', 'success');
    });
  }
});
