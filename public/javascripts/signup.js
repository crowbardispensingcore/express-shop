const usernameInput = document.querySelector("#username");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const signupButton = document.querySelector('#signup-button');
const errorMessage = document.querySelector("#error-message");

signupButton.addEventListener('click', async (event) => {
    event.preventDefault();
    errorMessage.innerHTML = '';

    const username = usernameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;

    const baseUrl = `${location.protocol}//${location.host}`;
    const response = await fetch(`${baseUrl}/user/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
    });

    if (response.ok) {
        const data = await response.json();
        console.log(data);
        const redirectUrl = baseUrl + data.redirectPath;
        location.assign(redirectUrl);
    }
    else {
        const data = await response.json();
        const message = data.message;
        errorMessage.textContent = message;
    }
});