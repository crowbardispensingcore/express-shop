const usernameInput = document.querySelector("#identifier");
const passwordInput = document.querySelector("#password");
const loginButton = document.querySelector('#login-button');
const errorMessage = document.querySelector("#error-message");

loginButton.addEventListener('click', async (event) => {
    event.preventDefault();
    errorMessage.innerHTML = '';

    const identifier = usernameInput.value;
    const password = passwordInput.value;

    const baseUrl = `${location.protocol}//${location.host}`;
    const response = await fetch(`${baseUrl}/user/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ identifier, password }),
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