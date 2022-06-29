const $formLogin = document.getElementById("formLogin");
const $formItems = document.querySelectorAll('.formItem');
const $inptEmail = document.getElementById("inputEmail");
const $inptPassword = document.getElementById("inputPassword");
const $btnLogin = document.getElementById("btnLogin");


var validityEmail = false;
var validityPassword = false;


$formLogin.addEventListener("submit", (e) => {
  e.preventDefault();

  checkEmail();
  checkPassword();
  login();
  
  function checkEmail() {

    if ($inptEmail.value === '' || $inptEmail.value == null) {
        e.preventDefault()
  
        //============= parte visual para o usuario identificar em qual campo ele errou =============
        $formItems[0].classList.add("error")
    }
  
    else if (!isEmail($inptEmail.value)) {
        e.preventDefault()
  
        //============= parte visual para o usuario identificar em qual campo ele errou =============
        $formItems[0].classList.add("error")
    }
  
    else {
      validityEmail = true;
      $formItems[0].classList.remove("error")
      $formItems[0].classList.add("success")
    }
  
    function isEmail(email) {
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
    }
  
  }
  
  function checkPassword() {

    if ($inptPassword.value === '' || $inptPassword.value == null) {
        e.preventDefault()
  
        //============= parte visual para o usuario identificar em qual campo ele errou =============
        $formItems[1].classList.add("error")
  
    }
  
    else if ($inptPassword.value.length < 8) {
        e.preventDefault()
  
        //============= parte visual para o usuario identificar em qual campo ele errou =============
        $formItems[1].classList.add("error")
    }
  
    else if ($inptPassword.value.length > 15) {
        e.preventDefault();
  
        //============= parte visual para o usuario identificar em qual campo ele errou =============
        $formItems[1].classList.add("error")
    }
  
    else if (!/[A-Z]/.test($inptPassword.value)) {
        e.preventDefault()
  
        //============= parte visual para o usuario identificar em qual campo ele errou =============
        $formItems[1].classList.add("error")
    }
  
    else if (!/[0-9]/.test($inptPassword.value)) {
        e.preventDefault()
  
        //============= parte visual para o usuario identificar em qual campo ele errou =============
        $formItems[1].classList.add("error")
    }
  
    else if (!/[^A-Za-z0-9]/.test($inptPassword.value)) {
        e.preventDefault()
  
        //============= parte visual para o usuario identificar em qual campo ele errou =============
        $formItems[1].classList.add("error")
    }
  
    else {
      validityPassword = true;
      $formItems[1].classList.remove("error")
      $formItems[1].classList.add("success")
    }
  
  }

});


function login() {

  if (validityEmail && validityPassword) {

    fetch("https://ctd-todo-api.herokuapp.com/v1/users/login", {
      method: "POST",
      headers: {
        "Accept": "*/* , application/json, text/plain",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: `${$inptEmail.value}`,
        password: `${$inptPassword.value}`,
      })

    })
    .then((res) => res.json())
    .then((data) => {

      localStorage.setItem("token", data.jwt);
      window.location.href = "tarefas.html";

    });

  }

}