const $btnLogout = document.getElementById("closeApp");
const $userName = document.getElementById("userName");
const $formTasks = document.querySelector(".nova-tarefa");
const $inputTasks = document.getElementById("novaTarefa");
const $pendingTasks = document.querySelector(".tarefas-pendentes");
const $completedTasks = document.querySelector(".tarefas-terminadas");


// O If abaixo válida se o token(JWT) obtido na hora do Registro/Login, confere com o que se encontra no "localStorage".
// Do contrário, o usuário recebe um aviso informando que o mesmo precisa estar logado, e é direcionado a tela de "login(index.html)".
if (
    localStorage.getItem("token") == null ||
    localStorage.getItem("token") == ""
) {
    alert("Você precisa estar logado para acessar essa página");
    window.location.href = "index.html";
};


// O evento abaixo serve para dar funcionalidade ao botão "Finalizar Sessão", removendo o token do usuário do localStorage,
//e o redirecionando à página de "login(index.html)".
$btnLogout.addEventListener("click", (e) => {
    localStorage.removeItem("token");
    alert("Deslogado com sucesso");

    setTimeout(() => {
        window.location.href = "index.html";
        
    }, 2000);
});


// A função abaixo efetua uma requisição do tipo GET para obter as informações do usuário logado no momento,
//pegando seu "firstName" e "lastName" cadastrados na API e apresentando-o, ao lado do botão usado para "finalizar a sessão".
function dataUser() {

    fetch("https://ctd-todo-api.herokuapp.com/v1/users/getMe", {
        method: "GET",
        headers: {
            "Accept": "*/* , application/json, text/plain",
            "Content-Type": "application/json",
            "authorization": `${localStorage.getItem("token")}`,
        }

    })
    .then((response) => response.json())
    .then(data => {
        $userName.innerHTML = `${data.firstName} ${data.lastName}`

    });
        
}

dataUser();


// O evento abaixo, executa a validação do campo "Nova Tarefa", para saber se o mesmo está dentro dos parâmetros solicitados,
//e então efetua uma requisição do tipo POST para a API, permitindo a criação de uma "Nova Tarefa"
$formTasks.addEventListener("submit", (e) => {

    if ($inputTasks.value != null && $inputTasks.value.length > 5) {

        function newTask() {
            fetch("https://ctd-todo-api.herokuapp.com/v1/tasks", {
                method: "POST",
                headers: {
                    "Accept": "*/* , application/json, text/plain",
                    "Content-Type": "application/json",
                    "authorization": `${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    description: `${$inputTasks.value}`,
                    completed: false,
                })

            }).then((response) => {
                if (!response.ok) {
                    throw Error(response);
                } else {
                    response.json().then(data => console.log(data));
                }
            });

        }

        newTask();
        e.preventDefault();

    } else {
        alert("O campo precisa ser preenchido");
        e.preventDefault();

    }

});


// A função abaixo efetua uma requisição do tipo GET para a API, com o intuito de obter todas as tarefas criadas pelo atual usuário,
//ao obter resposta positiva, a mesma efetua a "criação dos elementos" responsáveis pela visualização em página das mesmas.
function showTask() {

    fetch("https://ctd-todo-api.herokuapp.com/v1/tasks", {
        method: "GET",
        headers: {
            "Accept": "*/*, application/json, text/plain",
            "Content-Type": "application/json",
            "authorization": `${localStorage.getItem("token")}`,
        }

    })
    .then((response) => response.json())
    .then((data) => {

        // forEach responsável por varrer o Array de resposta da requisição da API, e criar os elementos,
        //de acordo com o número de tarefas existentes.
        data.forEach(item => {

            var $containerTask = document.createElement("div");

            var $taskList = document.createElement("li");
            $taskList.classList.add("tarefa");

            var $btnCompleted = document.createElement("button");
            $btnCompleted.setAttribute("type", "click");
            $btnCompleted.classList.add("not-done");
            $btnCompleted.id = item.id;

            var $containerDescription = document.createElement("div");
            $containerDescription.classList.add("descricao");

            var $dataName = document.createElement("p");
            $dataName.classList.add("nome");
            $dataName.innerHTML = item.description;

            var $dataTime = document.createElement("p");
            $dataTime.classList.add("timestamp");
            $dataTime.innerHTML = `Criada em: ${dayjs(item.createAt).format("DD/MM/YY")}`;

            var $btnUndo = document.createElement('button');
            $btnUndo.setAttribute("type", "click");
            $btnUndo.classList.add("btnUndo");
            $btnUndo.innerHTML =
                `
                    <i class="fa-solid fa-rotate-left"></i>
                `
            ;

            var $btnDelete = document.createElement('button');
            $btnDelete.setAttribute("type", "click");
            $btnDelete.classList.add("btnDelete");
            $btnDelete.innerHTML =
                `
                    <i class="fa-solid fa-trash-can"></i>
                `
            ;

            // Condição que irá dizer onde as tarefas devem ser mostradas na página, sendo "false" para as "Tarefas Pendentes",
            //e "true(else)", para as "Tarefas Terminadas".
            if (item.completed == false) {

                $pendingTasks.insertAdjacentElement("beforeend", $containerTask);

                $containerTask.appendChild($taskList);

                $taskList.insertAdjacentElement("beforeend", $btnCompleted);

                $taskList.insertAdjacentElement("beforeend", $containerDescription);

                $containerDescription.insertAdjacentElement("beforeend", $dataName);

                $containerDescription.insertAdjacentElement("beforeend", $dataTime);

            } else {

                $completedTasks.insertAdjacentElement("beforeend", $containerTask);

                $containerTask.appendChild($taskList);

                $taskList.insertAdjacentElement("beforeend", $btnCompleted);

                $taskList.insertAdjacentElement("beforeend", $containerDescription);

                $containerDescription.insertAdjacentElement("beforeend", $dataName);

                $containerDescription.insertAdjacentElement("beforeend", $btnUndo);

                $containerDescription.insertAdjacentElement("beforeend", $btnDelete);

            }

            // O evento abaixo efetua uma requisição do tipo PUT para a API quando o usuário clica no "botão roxo" localizado à esquerda das tarefas.
            // Dessa forma, ao clicar no botão, o mesmo está atualizando o "body.completed" da tarefa selecionada, para "true", ao invés de "false",
            //movendo a mesma para a área de "Tarefas Terminadas." 
            $btnCompleted.addEventListener('click', (e) => {

                function completedTask() {

                    fetch(`https://ctd-todo-api.herokuapp.com/v1/tasks/${item.id}`, {
                        method: "PUT",
                        headers: {
                            "Accept": "*/* , application/json, text/plain ",
                            "Content-Type": "application/json",
                            "authorization": `${localStorage.getItem("token")}`,
                        },
                        body: JSON.stringify({
                            description: `${item.description}`,
                            completed: true,
                        })

                    });

                }

                completedTask();

            });

            // O evento abaixo efetua uma requisição do tipo PUT para a API quando o usuário clica no "botão Undo(ícone de seta em semicírculo)" localizado a direita das "Tarefas Terminadas".
            // Dessa forma, ao clicar no botão, o mesmo está atualizando o "body.completed" da tarefa selecionada, para "false", ao invés de "true",
            //retornando a mesma para a área de "Tarefas Pendentes." 
            $btnUndo.addEventListener('click', (e) => {

                function undoTask() {

                    fetch(`https://ctd-todo-api.herokuapp.com/v1/tasks/${item.id}`, {
                        method: "PUT",
                        headers: {
                            "Accept": "*/* , application/json, text/plain ",
                            "Content-Type": "application/json",
                            "authorization": `${localStorage.getItem("token")}`,
                        },
                        body: JSON.stringify({
                            description: `${item.description}`,
                            completed: false,
                        })

                    });
                }

                undoTask();

            });

            // O evento abaixo efetua uma requisição do tipo DELETE para a API quando o usuário clica no "botão com o ícone de lixeira" localizado a direita das "Tarefas Terminadas".
            // Dessa forma, ao clicar no botão, o mesmo está dando autorização para que a API exclua/delete de forma permanente, a tarefa selecionada. 
            $btnDelete.addEventListener('click', (e) => {

                function deleteTask() {

                    fetch(`https://ctd-todo-api.herokuapp.com/v1/tasks/${item.id}`, {
                        method: "DELETE",
                        headers: {
                            "Accept": "*/* , application/json, text/plain ",
                            "Content-Type": "application/json",
                            "authorization": `${localStorage.getItem("token")}`,
                        }

                    });
                }

                deleteTask();

            });
        });
    });
};

showTask();