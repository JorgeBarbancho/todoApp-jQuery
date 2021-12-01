$(document).ready(function () {
    let todoList = []

    $('.todo-component__add-button').click(function () {
        if ($('#text').val().length !== 0) {
            let newTodo = `<div class=todo-component__todo-item>
                        <input type="checkbox">
						<p class=todo-component__todo-item-text> ` + $('#text').val() + `</p>
						<div class="todo-component__trash-icon-container">
							<i class="fas fa-trash todo-component__trash-icon"></i>
						</div>
					</div>`;
            todoList.push(newTodo);
            $('.todo-component__todo-list').html(todoList);
            $('.todo-component__pending-text').text(`You have ${todoList.length} pending tasks`);
            $('#text').val("");
        } else alert("Enter some Text!");
    });

    $('.todo-component__clear-button').click(function () {
        todoList = [];
        $('.todo-component__todo-list').html(todoList);
        $('.todo-component__pending-text').text(`You have ${todoList.length} pending tasks`);
    });
});



