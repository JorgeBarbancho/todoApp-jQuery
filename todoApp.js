$(document).ready(function () {
    let pendingTasks = 0;

    // Add button
    $('#add-button').click(function () {
        if ($('.todo-component__input').val().length !== 0) {
            let currentList = $('.todo-component__todo-list').html();
            let newTodo = `<div class="todo-component__todo-item">
                                <input type="checkbox" id="checkbox">
                                <p class="todo-component__todo-item-text"> ` + $('.todo-component__input').val() + `</p>
                                <button class="todo-component__trash-btn">
                                    <i class="fas fa-trash todo-component__trash-btn-icon"></i>
                                </button>
                            </div>`;
            $('.todo-component__input').val("");
            $('.todo-component__todo-list').html(currentList + newTodo);
            $('.todo-component__warning').hide();
            pendingTasks++;
            updateTaskStatus();
        } else {
            $('.todo-component__warning').show();
        };
    });

    // Clear button
    $('#clear-button').click(function () {
        console.log("test");
        $('.todo-component__todo-list').html("");
        pendingTasks = 0;
        updateTaskStatus();
    });

    // Remove button
    $(document).on('click', '.todo-component__trash-icon-container', function () {
        let taskToDelete = $(this).parent();
        taskToDelete.remove();
        pendingTasks--;
        updateTaskStatus('remove')
    });

    // Show all button
    $('#show-all').click(function () {
        $('.todo-component__todo-list').children().show();
    });

    // Show completed button
    $('#show-completed').click(function () {
        $('.todo-component__todo-list').children().each(function () {
            if ($(this).children('#checkbox').is(':checked')) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });

    // Show pending button
    $('#show-pending').click(function () {
        $('.todo-component__todo-list').children().each(function () {
            if ($(this).children('#checkbox').is(':checked')) {
                $(this).hide();
            } else {
                $(this).show();
            }
        });
    });

    // Checkbox
    $(document).on('click', '#checkbox', function () {
        if ($(this).is(':checked')) {
            pendingTasks--;
        } else {
            pendingTasks++;
        }
        updateTaskStatus();
    });

    // Update pending tasks
    function updateTaskStatus() {
        let taskText = 'tasks';
        taskText = pendingTasks === 1 ? 'task' : 'tasks';
        $('.todo-component__pending-text').text(`You have ${pendingTasks} pending ${taskText}`);
    }
});



