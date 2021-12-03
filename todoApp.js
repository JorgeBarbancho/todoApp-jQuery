$(document).ready(function () {
    let pendingTasks = 0;

    // Add button
    $('.btn__add-btn').click(function () {
        if ($('.todo-component__input').val().length !== 0) {
            let newTodo = $('<label class="todo-component__todo-item--shown">' +
                '<input type="checkbox" class="todo-component__todo-item__checkbox">' +
                '<p class="todo-component__todo-item-text">' + $('.todo-component__input').val() + '</p>' +
                '<button class="todo-component__trash-btn">' +
                '<i class="fas fa-trash todo-component__trash-btn-icon"></i>' +
                '</button>' +
                '</label>');
            newTodo.find('.todo-component__trash-btn').click(removeTask);
            newTodo.find('.todo-component__todo-item__checkbox').click(toggleTaskStatus)
            $('.todo-component__todo-list').append(newTodo);
            $('.todo-component__input').val("");
            $('.todo-component__warning--shown').removeClass("todo-component__warning--shown").addClass("todo-component__warning--hidden");
            pendingTasks++;
            updateTaskStatus();
        } else {
            $('.todo-component__warning--hidden').removeClass("todo-component__warning--hidden").addClass("todo-component__warning--shown");
        }
    });

    // Clear button
    $('.btn__clear-btn').click(function () {
        $('.todo-component__todo-list').html("");
        pendingTasks = 0;
        updateTaskStatus();
    });

    // Show all button
    $('.todo-component__list-button--show-all').click(function () {
        $('.todo-component__todo-list')
            .children('.todo-component__todo-item--hidden')
            .removeClass('todo-component__todo-item--hidden')
            .addClass('todo-component__todo-item--shown')
    });

    // Show completed button
    $('.todo-component__list-button--show-completed').click(function () {
        toggleList('completed')
    });

    // Show pending button
    $('.todo-component__list-button--show-pending').click(function () {
        toggleList('pending')
    });

    // Remove button
    function removeTask() {
        if (!$(this).siblings('.todo-component__todo-item__checkbox').is(':checked')) {
            pendingTasks--;
        }
        $(this).parent().remove();
        updateTaskStatus();
    }

    // Toggle completed/pending lists
    function toggleList(kindOfList) {
        $('.todo-component__todo-list').children().each(function () {
            if ($(this).children('.todo-component__todo-item__checkbox').is(':checked')) {
                if (kindOfList === 'completed') {
                    $(this).removeClass('todo-component__todo-item--hidden').addClass('todo-component__todo-item--shown');
                } else {
                    $(this).removeClass('todo-component__todo-item--shown').addClass('todo-component__todo-item--hidden');
                }
            } else {
                if (kindOfList === 'completed') {
                    $(this).removeClass('todo-component__todo-item--shown').addClass('todo-component__todo-item--hidden');
                } else {
                    $(this).removeClass('todo-component__todo-item--hidden').addClass('todo-component__todo-item--shown');
                }
            }
        });
    }

    // Checkbox behaviour
    function toggleTaskStatus() {
        if ($(this).is(':checked')) {
            pendingTasks--;
        } else {
            pendingTasks++;
        }
        updateTaskStatus();
    }

    // Update pending tasks
    function updateTaskStatus() {
        let taskText = pendingTasks === 1 ? 'task' : 'tasks';
        $('.todo-component__pending-text').text(`You have ${pendingTasks} pending ${taskText}`);
    }
});



