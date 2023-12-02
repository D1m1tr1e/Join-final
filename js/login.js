"use strict";
/**
 * Initializes the login process by animating the logo and loading the login form after a delay.
 */
function initLogin() {
    setTimeout(() => {
        let logo = document.querySelector(".logoStart");
        logo.classList.remove("logoStart");
        logo.classList.add("logomotion");
    }, 1000);
    setTimeout(() => {
        loadForm();
    }, 1250);
}

/**
 * Loads the login form into the specified container and makes it visible.
 */
function loadForm() {
    renderLogin();
    let container = document.getElementById("loginRender");
    container.classList.remove("d-none");
    let signupBox = document.querySelector(".sign-up");
    signupBox.classList.remove("d-none");
    renderLogin();
}

/**
 * Renders the login form into the specified container.
 */
function renderLogin() {
    let container = document.getElementById("loginRender");
    container.innerHTML = generateLogin();
    let signupBox = document.querySelector(".sign-up");
    signupBox.classList.remove("d-none");
}

function generateLogin() {
    return /*html*/`
    <div class="loginForm">
        <div class="loginHeader">
            <h1>Log in</h1>
            <div class="h-divider"></div>
        </div>
        <form class="form" onsubmit="login(event)">
            <input type="email" placeholder="Email" required name="email">
            <input type="password" placeholder="Password" required name="password">
        
            <div class="forgotPW">
                <div class="rememberBox">
                    <input type="checkbox">
                    <span>Remember me</span>
                </div>
                <a href="#" onclick="forgotPassword()">Forgot my password</a>
            </div>
            <div class="log-btns">
                <button class="login-btn">Log in</button>
                <a href="./assets/templates/main.html" class="guest-btn" onclick="loadGuestLogin()">Guest Log in</a>
            </div>
        </form>
    </div>
`;
}

/**
 * Displays the forgot password view by hiding the signup box and updating the container with the forgot password form.
 */
function forgotPassword() {
    let container = document.getElementById("loginRender");
    let signupBox = document.querySelector(".sign-up");
    signupBox.classList.add("d-none");
    container.innerHTML = generateForgotPassword();
}

function generateForgotPassword() {
    return /*html*/ `
    <div class="loginForm">
        <img class="arrow" src="./assets/img/icons/backArrow.svg" onclick="renderLogin()">
        <div class="loginHeader">
            <h1 class="pw-hl">I forgot my password</h1>
            <div class="h-divider"></div>
        </div>
        <form class="form">
            <input type="email" placeholder="Email" required>
            <p class="forgotpwp">Don't worry! We will send you an e-mail with the instructions to reset your password</p>
            <div class="log-btns">
                <button class="login-btn">Send me the e-mail</button>
            </div>
        </form>
    </div>`;
}

/**
 * Renders the signup form into the specified container, clearing existing content and hiding the signup box.
 */
function renderSignup() {
    let container = document.getElementById("loginRender");
    container.innerHTML = "";
    container.innerHTML = generateSignup();
    let signupBox = document.querySelector(".sign-up");
    signupBox.classList.add("d-none");
}

function generateSignup() {
    return /*html*/`
    <div class="loginForm">
        <img class="arrow" src="./assets/img/icons/backArrow.svg" onclick="renderLogin()">
        <div class="loginHeader">
            <h1>Sign up</h1>
            <div class="h-divider"></div>
        </div>
        <form class="form" onsubmit="loadSignUptoRemoteStorage(event)">
            <input type="text" human placeholder="Name" required name="name">
            <input type="email" placeholder="Email" required name="email">
            <input type="password" placeholder="Password" minlength="8" required name="password">
            <div class="log-btns">
                <button class="login-btn">Sign up</button>
            </div>
        </form>
    </div>`;
}

/**
 * Loads signup data to remote storage, checks if the account with the provided email already exists,
 * and signs up the user if the email is not already registered.
 *
 * @param {Event} event - The form submission event.
 */
async function loadSignUptoRemoteStorage(event) {
    event.preventDefault();
    let form = event.target;
    let loginData = [form.name.value, form.email.value, form.password.value];
    let alreadySignedUp = await checkAccount(loginData[1]);
    console.log(alreadySignedUp);
    if (alreadySignedUp) {
        swal.fire({
            icon: "error",
            title: "You already signed up",
        });
    } else {
        await signUp(loginData);
        location.reload()
    }
}

/**
 * Checks if an account with the given email exists in remote storage.
 *
 * @param {string} email - The email to check for account existence.
 * @returns {Promise<boolean>} - A Promise that resolves to true if the account exists, false otherwise.
 */
async function checkAccount(email) {
    try {
        await getItem(email);
        return true;
    } catch (e) {
        return false;
    }
}

/**
 * Signs up the user by storing the login data in remote storage.
 *
 * @param {string[]} loginData - Array containing signup data (name, email, password).
 */
async function signUp(loginData) {
    let email = loginData[1];
    let stringifyLoginData = JSON.stringify(loginData);
    await setItem(email, stringifyLoginData);
}

/**
 * Logs in the user by checking the provided login credentials against the stored account data.
 *
 * @param {Event} event - The form submission event.
 */
async function login(event) {
    event.preventDefault();
    let form = event.target;
    let loginEmail = form.email.value;
    let loginPassword = form.password.value;
    let alreadySignedUp = await checkAccount(loginEmail);
    
    if (!alreadySignedUp) {
        doLogin();
    }

    let accountData = JSON.parse(await getItem(loginEmail));
    let accountPassword = accountData[2];
    let loginName = accountData[0];
    let IsPasswordSame = loginPassword === accountPassword;
    doLogin(alreadySignedUp, IsPasswordSame, loginName);
}

/**
 * Performs the login action based on the authentication results.
 *
 * @param {boolean} alreadySignedUp - Indicates if the user is already signed up.
 * @param {boolean} isPasswordSame - Indicates if the provided password matches the stored account password.
 * @param {string} name - The name associated with the account.
 */
function doLogin(alreadySignedUp, isPasswordSame, name) {
    if (alreadySignedUp && isPasswordSame) {
        localStorage.setItem("accountName", name)
        location.href = "./assets/templates/main.html"
    } else if (alreadySignedUp && !isPasswordSame) {
        swal.fire({
            icon: "error",
            title: "Password is wrong",
        });
    } else if (!alreadySignedUp) {
        swal.fire({
            icon: "error",
            title: "You need to sign up first",
        });
    }
}

/**
 * Retrieves the name associated with the current logged-in account from local storage.
 *
 * @returns {string|null} - The name associated with the current account, or null if not logged in.
 */
const getName = () => {
    return localStorage.getItem('accountName')
}

/**
 * Toggles the display of the profile menu on clicking the profile image.
 */
function clickProfile() {
    let logout = document.querySelector("#menu");
    if (!logout.classList.contains("logoutShow")) {
        logout.classList.add("logoutShow");
    } else {
        logout.classList.remove("logoutShow");
    }
}

/**
 * Loads the first letter of the name associated with the current account into the profile image element.
 * Adds a click event listener to the profile image for displaying the profile menu.
 */
function loadLetter() {
    let name = getName()
    let firstLetter = name.slice(0, 1);
    let profileButton = document.querySelector('.profileImage');
    profileButton.innerHTML = firstLetter.toUpperCase();
    profileButton.addEventListener("click", clickProfile)
}

/**
 * Loads the name associated with the current account into the specified HTML element.
 */
function loadName() {
    let name = getName()
    let nameElement = document.querySelector('h5')
    if (nameElement) {
        nameElement.innerHTML = name;
    }
}

/**
 * Sets the account name to "Guest" in local storage.
 */
function loadGuestLogin() {
    localStorage.setItem("accountName", "Guest");
}