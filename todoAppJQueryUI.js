$.widget('custom.todoComponent', {
    options: {
        selectors: {
            addButton: '.btn__add-btn',
            clearButton: '.btn__clear-btn',
            input: '.todo-component__input',
            pendingText: '.todo-component__pending-text',
            todoList: '.todo-component__todo-list',
            validationWarning: '.todo-component__validation-warning',
        },
        classes: {
            listButtonRow: 'list-button-row',
            warningShown: 'todo-component__validation-warning--shown',
        },
        tasks: [],
    },
    _create: function () {
        const selectors = this.options.selectors;
        const classes = this.options.classes;

        this.addButton = $(selectors.addButton).button();
        this.clearButton = $(selectors.clearButton).button();

        this.listButtonRow = $('<div/>')
            .appendTo(this.element)
            .addClass(classes.listButtonRow)
            .listButtonRow({
                buttons: [
                    {
                        id: 'showAll',
                        icon: 'fas fa-th',
                    },
                    {
                        icon: 'fas fa-tasks',
                    },
                    {
                        icon: 'fas fa-list',
                    },
                ],
                onButtonSelected: function (selectedButtonIdx) {
                    console.log(selectedButtonIdx);
                }
            })

        this._on(this.addButton, {
            click: "_addNewTask"
        });

        this._on(this.clearButton, {
            click: "_clearAllTasks"
        });
    },

    _addNewTask: function (event) {
        event.preventDefault();
        const selectors = this.options.selectors;
        const classes = this.options.classes;
        const tasks = this.options.tasks;
        const newInput = $(selectors.input);
        if (newInput.val().length !== 0) {
            $('<label/>').todoItem({value: newInput.val()});
            tasks.push({id: tasks.length + 1, pending: true, text: newInput.val()});
            newInput.val("");
            $(selectors.validationWarning).removeClass(classes.warningShown);
            this._updateTaskText();
        } else {
            $(selectors.validationWarning).addClass(classes.warningShown);
        }
        $(this.listButtonRow).listButtonRow("showAll");
    },

    _clearAllTasks: function () {
        console.log("hola")
        $(this.options.selectors.todoList).html("");
        this.options.tasks = [];
        this._updateTaskText();
    },

    _updateTaskText: function () {
        const tasks = this.options.tasks;
        const taskText = tasks.length === 1 ? 'task' : 'tasks';
        $(this.options.selectors.pendingText).text(`You have ${tasks.length} pending ${taskText}`);
    },
});

$.widget('custom.listButtonRow', {
    options: {
        buttons: [],
        selectedButtonIdx: 0,
        classes: {
            listButtonRow: 'list-button-row__button',
            selectedButton: 'list-button-row__button--selected',
        },
    },
    _create: function () {
        const classes = this.options.classes;
        this.showAllButton = $('<button/>')
            .appendTo(this.element)
            .addClass(classes.listButtonRow)

        this.addButtonIcon = $('<i/>')
            .appendTo(this.showAllButton)
            .addClass(this.options.buttons[0].icon)

        this.showCompletedButton = $('<button/>')
            .appendTo(this.element)
            .addClass(classes.listButtonRow)

        this.completedButtonIcon = $('<i/>')
            .appendTo(this.showCompletedButton)
            .addClass(this.options.buttons[1].icon)

        this.showPendingButton = $('<button/>')
            .appendTo(this.element)
            .addClass(classes.listButtonRow)

        this.pendingButtonIcon = $('<i/>')
            .appendTo(this.showPendingButton)
            .addClass(this.options.buttons[2].icon)

        this._on(this.showAllButton, {
            click: "_showAll"
        });

        this._on(this.showCompletedButton, {
            click: "_showCompleted"
        });

        this._on(this.showPendingButton, {
            click: "_showPending"
        });
    },

    _showAll: function () {
        this.options.onButtonSelected(0);
        this.showAllButton.addClass(this.options.classes.selectedButton);
        this.showCompletedButton.removeClass(this.options.classes.selectedButton);
        this.showPendingButton.removeClass(this.options.classes.selectedButton);
    },

    _showCompleted: function () {
        this.options.onButtonSelected(1);
        this.showAllButton.removeClass(this.options.classes.selectedButton);
        this.showCompletedButton.addClass(this.options.classes.selectedButton);
        this.showPendingButton.removeClass(this.options.classes.selectedButton);
    },

    _showPending: function () {
        this.options.onButtonSelected(2);
        this.showAllButton.removeClass(this.options.classes.selectedButton);
        this.showCompletedButton.removeClass(this.options.classes.selectedButton);
        this.showPendingButton.addClass(this.options.classes.selectedButton);
    },
});

$.widget('custom.todoItem', {
    options: {
        classes: {
            taskHidden: 'todo-component__todo-item--hidden',
            taskShown: 'todo-component__todo-item--shown',
            todoItem: 'todo-component__todo-item',
            todoItemCheckbox: 'todo-component__todo-item__checkbox',
            todoItemShown: 'todo-component__todo-item--shown',
            todoItemText: 'todo-component__todo-item-text',
            trashButton: 'todo-component__trash-btn',
        },
        selectors: {
            todoComponent: '.todo-component',
            todoList: '.todo-component__todo-list'
        },
        icons: {
            trash: 'fas fa-trash'
        },
        pending: true
    },
    _create: function () {
        const classes = this.options.classes;
        this.element
            .appendTo(this.options.selectors.todoList)
            .addClass(classes.todoItem)
            .addClass(classes.todoItemShown)

        this.checkbox = $('<input type="checkbox"/>')
            .appendTo(this.element)
            .addClass(classes.todoItemCheckbox)

        this.text = $('<p/>')
            .appendTo(this.element)
            .addClass(classes.todoItemText)
            .text(this.options.value)

        this.trashButton = $('<button/>')
            .appendTo(this.element)
            .addClass(classes.trashButton)
            .button();

        this.trashButtonIcon = $('<i/>')
            .appendTo(this.trashButton)
            .addClass(this.options.icons.trash)

        this._on(this.trashButton, {
            click: '_remove'
        });

        this._on(this.checkbox, {
            click: '_toggleTask'
        });

    },

    _remove: function () {
        if (this.options.pending) {
            $(this.options.selectors.todoComponent).todoComponent('removePendingTask');
        }
        this.element.remove();
    },

    _toggleTask: function () {
        if (this.options.pending) {
            $(this.options.selectors.todoComponent).todoComponent('removePendingTask');
            this.options.pending = false;
        } else {
            $(this.options.selectors.todoComponent).todoComponent('addPendingTask');
            this.options.pending = true;
        }
    },

    showTask: function () {
        this.element
            .removeClass(this.options.classes.taskHidden)
            .addClass(this.options.classes.taskShown)
    },

    hideTask: function () {
        this.element
            .removeClass(this.options.classes.taskShown)
            .addClass(this.options.classes.taskHidden)
    },

    isPending: function () {
        return this.options.pending
    }
});

$(function () {
    $('.todo-component').todoComponent();
});
