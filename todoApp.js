$(function () {
    let pendingTasks = 0;

    // Add new task button
    $('.todo-component__input-form').on('submit', function (e) {
        e.preventDefault();
        let newInput = $('.todo-component__input');
        if (newInput.val().length !== 0) {
            let newTodo = $('<label class="todo-component__todo-item todo-component__todo-item--shown">' +
                '<input type="checkbox" class="todo-component__todo-item__checkbox">' +
                '<p class="todo-component__todo-item-text"/>' +
                '<button class="todo-component__trash-btn">' +
                '<i class="fas fa-trash todo-component__trash-btn-icon"></i>' +
                '</button>' +
                '</label>');
            newTodo.find('.todo-component__todo-item-text').text(newInput.val());
            newTodo.find('.todo-component__trash-btn').on('click', removeTask);
            newTodo.find('.todo-component__todo-item__checkbox').on('click', toggleTaskStatus)
            $('.todo-component__todo-list').append(newTodo);
            newInput.val("");
            $('.todo-component__warning--shown').removeClass("todo-component__warning--shown");
            pendingTasks++;
            updateTaskStatus();
        } else {
            $('.todo-component__warning').addClass("todo-component__warning--shown");
        }
    });

    // Clear all tasks button
    $('.btn__clear-btn').on('click', function () {
        $('.todo-component__todo-list').html("");
        pendingTasks = 0;
        updateTaskStatus();
    });

    // Show all tasks button
    $('.todo-component__list-button--show-all').on('click', function () {
        $('.todo-component__todo-list')
            .children('.todo-component__todo-item--hidden')
            .removeClass('todo-component__todo-item--hidden')
            .addClass('todo-component__todo-item--shown')
    });

    // Show completed tasks button
    $('.todo-component__list-button--show-completed').on('click',function () {
        toggleList('completed')
    });

    // Show pending tasks button
    $('.todo-component__list-button--show-pending').on('click', function () {
        toggleList('pending')
    });

    // Remove task button
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