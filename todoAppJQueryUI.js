$.widget('custom.todoComponent', {
    options: {
        selectors: {
            button: '<button/>',
            div: '<div/>',
            h3: '<h3/>',
            label: '<label/>',
            form: '<form/>',
            formInput: '<input placeholder="Add your new todo">',
            p: '<p/>',
            btn: 'btn',
            header: 'todo-component__header',
            inputForm: 'todo-component__input-form',
            listButtonRow: 'list-button-row',
            pendingRow: 'todo-component__pending-row',
            pendingText: 'todo-component__pending-text',
            textInput: 'todo-component__input',
            todoList: 'todo-component__todo-list',
            validationWarning: 'todo-component__validation-warning',
        },
        classes: {
            todoList: '.todo-component__todo-list',
            pendingText: '.todo-component__pending-text'
        },
        pendingTasks: 0,
    },
    _create: function () {
        const selectors = this.options.selectors
        this.header = $(selectors.h3)
            .appendTo(this.element)
            .addClass(selectors.header)
            .text('Todo App')

        this.inputForm = $(selectors.form)
            .appendTo(this.element)
            .addClass(selectors.inputForm)

        this.inputText = $(selectors.formInput)
            .appendTo(this.inputForm)
            .addClass(selectors.textInput)

        this.addButton = $(selectors.button)
            .appendTo(this.inputForm)
            .addClass(selectors.btn)
            .text('+')
            .button()

        this.validationWarning = $(selectors.div)
            .appendTo(this.element)
            .addClass(selectors.validationWarning)
            .text('Enter some Text!')

        this.listButtonRow = $(selectors.div)
            .appendTo(this.element)
            .addClass(selectors.listButtonRow)
            .listButtonRow()

        this.todoList = $(selectors.div)
            .appendTo(this.element)
            .addClass(selectors.todoList)

        this.pendingRow = $(selectors.div)
            .appendTo(this.element)
            .addClass(selectors.pendingRow)

        this.pendingText = $(selectors.p)
            .appendTo(this.pendingRow)
            .addClass(selectors.pendingText)
            .text('You have 0 pending tasks')

        this.clearButton = $(selectors.button)
            .appendTo(this.pendingRow)
            .addClass(selectors.btn)
            .text('Clear all')
            .button()

        this._on(this.addButton, {
            click: "addNewTask"
        });

        this._on(this.clearButton, {
            click: "clearAllTasks"
        });
    },

    addNewTask: function (event) {
        event.preventDefault();
        let newInput = $('.todo-component__input');
        if (newInput.val().length !== 0) {
            $(this.options.selectors.label).todoItem({value: newInput.val()});
            newInput.val("");
            $('.todo-component__validation-warning--shown').removeClass("todo-component__validation-warning--shown");
            this.options.pendingTasks++;
            this.updateTaskText();
        } else {
            $('.todo-component__validation-warning').addClass("todo-component__validation-warning--shown");
        }
        //$(".list-button-row").listButtonRow("showAll");
    },

    clearAllTasks: function () {
        $(this.options.classes.todoList).html("");
        this.options.pendingTasks = 0;
        this.updateTaskText();
    },

    updateTaskText: function () {
        let taskText = this.options.pendingTasks === 1 ? 'task' : 'tasks';
        $(this.options.classes.pendingText).text(`You have ${this.options.pendingTasks} pending ${taskText}`);
    },

    addPendingTask: function () {
        this.options.pendingTasks++;
        this.updateTaskText();
    },

    removePendingTask: function () {
        this.options.pendingTasks--;
        this.updateTaskText();
    }
});

$.widget('custom.listButtonRow', {
    options: {
        buttons: [
            //    {
            //        id: 'showAll',
            //        icon: '...',
            //    }
        ],
        selectedButtonIdx: 0,
        selectors: {
            button: '<button/>',
        },
        classes: {
            listButtonRow: 'list-button-row__button',
        },
        onButtonSelected: function (selectedButtonIdx) {

        }
    },
    _create: function () {
        const selectors = this.options.selectors;
        const classes = this.options.classes;

        this.showAllButton = $(selectors.button)
            .appendTo(this.element)
            .addClass(classes.listButtonRow)

        this.showCompletedButton = $(selectors.button)
            .appendTo(this.element)
            .addClass(classes.listButtonRow)

        this.showPendingButton = $(selectors.button)
            .appendTo(this.element)
            .addClass(classes.listButtonRow)

        this._on(this.showAllButton, {
            click: 'showAll'
        });

        this._on(this.showCompletedButton, {
            click: 'showCompleted'
        });

        this._on(this.showPendingButton, {
            click: 'showPending'
        });
    },

    /*showAll: function () {
        $('.todo-component__todo-item').todo('showTask');
        this.showAllButton.addClass('list-button-row__button--selected');
        this.showCompletedButton.removeClass('list-button-row__button--selected');
        this.showPendingButton.removeClass('list-button-row__button--selected');
    },

    showCompleted: function () {
        $('.todo-component__todo-item').todo('showIfCompleted');
        this.showAllButton.removeClass('list-button-row__button--selected');
        this.showCompletedButton.addClass('list-button-row__button--selected');
        this.showPendingButton.removeClass('list-button-row__button--selected');
    },

    showPending: function () {
        $('.todo-component__todo-item').todo('showIfPending');
        this.showAllButton.removeClass('list-button-row__button--selected');
        this.showCompletedButton.removeClass('list-button-row__button--selected');
        this.showPendingButton.addClass('list-button-row__button--selected');
    },*/
});

$.widget('custom.todoItem', {
    options: {
        selectors: {
            checkbox: '<input type=\"checkbox\"/>',
            todoItem: 'todo-component__todo-item',
            todoItemCheckbox: 'todo-component__todo-item__checkbox',
            todoItemShown: 'todo-component__todo-item--shown',
            todoItemText: 'todo-component__todo-item-text',
            trashButton: 'todo-component__trash-btn',
        },
        classes: {
            todoComponent: '.todo-component',
            todoList: '.todo-component__todo-list'
        },
        pending: true
    },
    _create: function () {
        const selectors = this.options.selectors;
        this.element
            .appendTo(this.options.classes.todoList)
            .addClass(selectors.todoItem)
            .addClass(selectors.todoItemShown)

        this.checkbox = $(selectors.checkbox)
            .appendTo(this.element)
            .addClass(selectors.todoItemCheckbox)

        this.text = $("<p/>")
            .appendTo(this.element)
            .addClass(selectors.todoItemText)
            .text(this.options.value)

        this.trashButton = $("<button><i class=\"fas fa-trash todo-component__trash-btn-icon\"></i></button>")
            .appendTo(this.element)
            .addClass(selectors.trashButton)
            .button();

        this._on(this.trashButton, {
            click: 'remove'
        });

        this._on(this.checkbox, {
            click: 'toggleTask'
        });

    },

    remove: function () {
        if (this.options.pending) {
            $(this.options.classes.todoComponent).todoComponent('removePendingTask');
        }
        this.element.remove();
    },

    toggleTask: function () {
        if (this.options.pending) {
            $(this.options.classes.todoComponent).todoComponent('removePendingTask');
            this.options.pending = false;
        } else {
            $(this.options.classes.todoComponent).todoComponent('addPendingTask');
            this.options.pending = true;
        }
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
});

$(function () {
    $('.todo-component').todoComponent();
});
