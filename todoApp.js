$(document).ready(function () {
    let todoList = [];
    let taskStatus = [];

    $('#add-button').click(function () {
        if ($('#text').val().length !== 0) {
            let newTodo = `<div class="todo-component__todo-item">
                                <input type="checkbox" id="checkbox">
                                <p class="todo-component__todo-item-text"> ` + $('#text').val() + `</p>
                                <button class="todo-component__trash-icon-container">
                                    <i class="fas fa-trash todo-component__trash-icon"></i>
                                </button>
                            </div>`;
            todoList.push(newTodo);
            taskStatus.push(false);
            $('#text').val("");
            showAll();
        } else alert("Enter some Text!");
    });

    $('#clear-button').click(function () {
        todoList = [];
        taskStatus = [];
        showAll();
    });

    $(document).on('click', '.todo-component__trash-icon-container', function () {
        let task to
        todoList.splice(todoList.indexOf($('.todo-component__trash-icon-container').parent()));
        showAll();
    });

    $(document).on('click', '#checkbox', function () {
        console.log("hola");
    });

    $('#show-all').click(function () {
        showAll();
    });

    $('#show-completed').click(function () {
        $('.todo-component__todo-list').html(taskStatus);
    });

    $('#show-pending').click(function () {
        $('.todo-component__todo-list').html(todoList);
    });

    function showAll() {
        $('.todo-component__todo-list').html("");
        renderList(todoList);
        $('.todo-component__pending-text').text(`You have ${todoList.length} pending tasks`);
    }

    function renderList(list) {
        list.forEach(task => $('.todo-component__todo-list').append(task));
    }
});



