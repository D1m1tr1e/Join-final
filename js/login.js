"use strict";

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

function loadForm() {
    renderLogin();
    let container = document.getElementById("loginRender");
    container.classList.remove("d-none");
    let signupBox = document.querySelector(".sign-up");
    signupBox.classList.remove("d-none");
    renderLogin();
}

function renderLogin() {
    let container = document.getElementById("loginRender");
    container.innerHTML = generateLogin();
    let signupBox = document.querySelector(".sign-up");
    signupBox.classList.remove("d-none");
}

function generateLogin() {
    return `
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

function forgotPassword() {
    let container = document.getElementById("loginRender");
    let signupBox = document.querySelector(".sign-up");
    signupBox.classList.add("d-none");
    container.innerHTML = generateForgotPassword();
}

function generateForgotPassword() {
    return `
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

function renderSignup() {
    let container = document.getElementById("loginRender");
    container.innerHTML = "";
    container.innerHTML = generateSignup();
    let signupBox = document.querySelector(".sign-up");
    signupBox.classList.add("d-none");
}

function generateSignup() {
    return `
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

async function loadSignUptoRemoteStorage(event) {
    event.preventDefault();
    let form = event.target;
    let loginData = [form.name.value, form.email.value, form.password.value];
    let alreadySignedUp = await checkAccount(loginData[1]);
    console.log(alreadySignedUp);
    if (alreadySignedUp) {
        alert("You already signed up");
    } else {
        await signUp(loginData);
        location.reload()
    }
}

async function checkAccount(email) {
    try {
        await getItem(email);
        return true;
    } catch (e) {
        return false;
    }
}

async function signUp(loginData) {
    let email = loginData[1];
    let stringifyLoginData = JSON.stringify(loginData);
    await setItem(email, stringifyLoginData);
}

async function login(event) {
    event.preventDefault();
    let form = event.target;
    let loginEmail = form.email.value;
    let loginPassword = form.password.value;
    let alreadySignedUp = await checkAccount(loginEmail);
    let accountData = JSON.parse(await getItem(loginEmail));
    let accountPassword = accountData[2];
    let loginName = accountData[0];
    let IsPasswordSame = loginPassword === accountPassword;
    doLogin(alreadySignedUp, IsPasswordSame, loginName);
}

function doLogin(alreadySignedUp, isPasswordSame, name) {
    if (alreadySignedUp && isPasswordSame) {
        localStorage.setItem("accountName", name)
        location.href = "./assets/templates/main.html"
    } else if (alreadySignedUp && !isPasswordSame) {
        alert("Password is wrong")
    } else if (!alreadySignedUp) {
        alert("You need to sign up first");
    }
}

const getName = () => {
    return localStorage.getItem('accountName')
}

function clickProfile() {
    let logout = document.querySelector("#menu");
    if (!logout.classList.contains("logoutShow")){
        logout.classList.add("logoutShow");
    } else {
        logout.classList.remove("logoutShow");
    }
}

function loadLetter() {
    let name = getName()
    let firstLetter = name.slice(0, 1);
    let profileButton = document.querySelector('.profileImage');
    profileButton.innerHTML = firstLetter.toUpperCase();
    profileButton.addEventListener("click", clickProfile)
}

function loadName() {
    let name = getName()
    let nameElement = document.querySelector('h5')
    if (nameElement){
        nameElement.innerHTML = name;
    }
}

function loadGuestLogin() {
    localStorage.setItem("accountName", "Guest");
}