//capturando os elementos do HTML
const $formSignUp = document.getElementById('formSignUp');
const $formItem = document.querySelectorAll('.formItem');
const $inputName = document.getElementById('nome');
const $inputLastName = document.getElementById('sobrenome');
const $inputEmail = document.getElementById('email');
const $inputPassword = document.getElementById('senha');
const $inputConfirmPassword = document.getElementById('confirmSenha');


//variaveis para validação geral
var validName = false;
var validLastName = false;
var validEmail = false;
var validSenha = false;


//============ evento para validação
$formSignUp.addEventListener('submit', (e) => {
    e.preventDefault();

    //=========funções para validação
    checkName();
    checkLastName();
    checkEmail();
    checkSenha();
    signUp();

    function checkName() {

        if ($inputName.value === '' || $inputName.value == null) {
            e.preventDefault()
            validName = false;

            //============= parte visual para o usuario identificar em qual campo ele errou =============
            $formItem[0].classList.add("error")
        }

        else {
            validName = true;
            $formItem[0].classList.remove("error")
            $formItem[0].classList.add("success")
        }

    }

    function checkLastName() {

        if ($inputLastName.value === '' || $inputLastName.value == null) {
            e.preventDefault()
            validLastName = false;

            //============= parte visual para o usuario identificar em qual campo ele errou =============
            $formItem[1].classList.add("error")
        }

        else {
            validLastName = true;
            $formItem[1].classList.remove("error")
            $formItem[1].classList.add("success")
        }

    }

    function checkEmail() {

        if ($inputEmail.value === '' || $inputEmail.value == null) {
            e.preventDefault()

            //============= parte visual para o usuario identificar em qual campo ele errou =============
            $formItem[2].classList.add("error")
        }

        else if (!isEmail($inputEmail.value)) {
            e.preventDefault()

            //============= parte visual para o usuario identificar em qual campo ele errou =============
            $formItem[2].classList.add("error")
        }

        else {
            validEmail = true;
            $formItem[2].classList.remove("error")
            $formItem[2].classList.add("success")
        }

        function isEmail(email) {
            return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
        }

    }

    function checkSenha() {

        if ($inputPassword.value === '' || $inputPassword.value == null) {
            e.preventDefault()

            //============= parte visual para o usuario identificar em qual campo ele errou =============
            $formItem[3].classList.add("error")

        }

        else if ($inputPassword.value.length < 8) {
            e.preventDefault()

            //============= parte visual para o usuario identificar em qual campo ele errou =============
            $formItem[3].classList.add("error")
        }

        else if ($inputPassword.value.length > 15) {
            e.preventDefault();

            //============= parte visual para o usuario identificar em qual campo ele errou =============
            $formItem[3].classList.add("error")
        }

        else if (!/[A-Z]/.test($inputPassword.value)) {
            e.preventDefault()

            //============= parte visual para o usuario identificar em qual campo ele errou =============
            $formItem[3].classList.add("error")
        }

        else if (!/[0-9]/.test($inputPassword.value)) {
            e.preventDefault()

            //============= parte visual para o usuario identificar em qual campo ele errou =============
            $formItem[3].classList.add("error")
        }

        else if (!/[^A-Za-z0-9]/.test($inputPassword.value)) {
            e.preventDefault()

            //============= parte visual para o usuario identificar em qual campo ele errou =============
            $formItem[3].classList.add("error")
        }

        else {
            $formItem[3].classList.remove("error")
            $formItem[3].classList.add("success")
        }

        if ($inputPassword.value != $inputConfirmPassword.value || $inputConfirmPassword.value === '' || $inputConfirmPassword.value == null) {
            e.preventDefault();

            //============= parte visual para o usuario identificar em qual campo ele errou =============
            $formItem[3].classList.add("error")
            $formItem[4].classList.add("error")
        }

        else {
            validSenha = true;
            $formItem[3].classList.remove("error")
            $formItem[4].classList.remove("error")
            $formItem[4].classList.add("success")
            $formItem[3].classList.add("success")
        }

    }

});


function signUp() {

    if (validName && validLastName && validEmail && validSenha) {

        fetch('https://ctd-todo-api.herokuapp.com/v1/users', {
            method: 'POST',
            headers: {
                'Accept': '*/*, text/plain, application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': '*'
            },
            body: JSON.stringify({
                "firstName": `${$inputName.value}`,
                "lastName": `${$inputLastName.value}`,
                "email": `${$inputEmail.value}`,
                "password": `${$inputPassword.value}`
            })

        })
        .then((response) => response.json())
        .then((data) => {

            localStorage.setItem('token', data.jwt);

            setTimeout(() => {
                window.location.href = 'tarefas.html';

            }, 2000);
            
        });

    }

}