$(function () {
    let pendingTasks = 0;

    $.widget("custom.listControls", {
        _create: function () {
            this.showAllButton = $(".list-button--show-all");
            this.showCompletedButton = $(".list-button--show-completed");
            this.showPendingButton = $(".list-button--show-pending");

            this._on(this.showAllButton, {
                click: "showAll"
            });

            this._on(this.showCompletedButton, {
                click: "showCompleted"
            });

            this._on(this.showPendingButton, {
                click: "showPending"
            });
        },

        showAll: function () {
            $('.todo-component__todo-item').todo("showTask");
            this.showAllButton.addClass('list-button--selected');
            this.showCompletedButton.removeClass('list-button--selected');
            this.showPendingButton.removeClass('list-button--selected');
        },

        showCompleted: function () {
            $('.todo-component__todo-item').todo("showIfCompleted");
            this.showAllButton.removeClass('list-button--selected');
            this.showCompletedButton.addClass('list-button--selected');
            this.showPendingButton.removeClass('list-button--selected');
        },

        showPending: function () {
            $('.todo-component__todo-item').todo("showIfPending");
            this.showAllButton.removeClass('list-button--selected');
            this.showCompletedButton.removeClass('list-button--selected');
            this.showPendingButton.addClass('list-button--selected');
        },
    });

    $.widget("custom.todo", {
        options: {
            pending: true
        },
        _create: function () {
            this.element
                .appendTo(".todo-component__todo-list")
                .addClass("todo-component__todo-item todo-component__todo-item--shown")

            this.checkbox = $("<input type=\"checkbox\"/>")
                .appendTo(this.element)
                .addClass("todo-component__todo-item__checkbox")

            this.text = $("<p/>")
                .appendTo(this.element)
                .addClass("todo-component__todo-item-text")
                .text(this.options.value)

            this.changer = $("<button><i class=\"fas fa-trash todo-component__trash-btn-icon\"></i></button>")
                .appendTo(this.element)
                .addClass("todo-component__trash-btn")
                .button();

            this._on(this.changer, {
                click: "remove"
            });

            this._on(this.checkbox, {
                click: "toggleTask"
            });

            pendingTasks++;
            updateTaskText();
        },

        remove: function () {
            if (this.options.pending) {
                pendingTasks--;
                updateTaskText();
            }
            this.element.remove();
        },

        toggleTask: function () {
            this.options.pending = !this.options.pending;
            if (this.options.pending) {
                pendingTasks++;
            } else {
                pendingTasks--;
            }
            updateTaskText();
        },

        showTask: function () {
            this.element
                .removeClass('todo-component__todo-item--hidden')
                .addClass('todo-component__todo-item--shown')
        },

        hideTask: function () {
            this.element
                .removeClass('todo-component__todo-item--shown')
                .addClass('todo-component__todo-item--hidden')
        },

        showIfCompleted: function () {
            if (this.options.pending) {
                this.hideTask()
            } else {
                this.showTask();
            }
        },

        showIfPending: function () {
            if (this.options.pending) {
                this.showTask()
            } else {
                this.hideTask();
            }
        }
    });

    $(".list-button-row").listControls();

    $(".todo-component__input-form").on('submit', function (event) {
        event.preventDefault();
        let newInput = $('.todo-component__input');
        if (newInput.val().length !== 0) {
            $('<label/>').todo({value: newInput.val()});
            newInput.val("");
            $('.todo-component__validation-warning--shown').removeClass("todo-component__validation-warning--shown");
        } else {
            $('.todo-component__validation-warning').addClass("todo-component__validation-warning--shown");
        }
        $(".list-button-row").listControls("showAll");
    });

    // Clear all tasks button
    $('.btn__clear-btn').on('click', function () {
        $('.todo-component__todo-list').html("");
        pendingTasks = 0;
        updateTaskText();
    });

    // Update pending tasks text
    function updateTaskText() {
        let taskText = pendingTasks === 1 ? 'task' : 'tasks';
        $('.todo-component__pending-text').text(`You have ${pendingTasks} pending ${taskText}`);
    }
});