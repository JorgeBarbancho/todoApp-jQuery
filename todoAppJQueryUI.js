$.widget('custom.todoComponent', {
    options: {
        selectors: {
            addButton: '.btn__add-btn',
            clearButton: '.btn__clear-btn',
            input: '.todo-component__input',
            pendingText: '.todo-component__pending-text',
            showAllButton: '.list-button-row__button--show-all',
            showCompletedButton: '.list-button-row__button--show-completed',
            showPendingButton: '.list-button-row__button--show-pending',
            todoItem: '.todo-component__todo-item',
            todoList: '.todo-component__todo-list',
            validationWarning: '.todo-component__validation-warning',
        },
        classes: {
            listButtonRow: 'list-button-row',
            selectedButton: 'list-button-row__button--selected',
            todoItemShown: 'todo-component__todo-item--shown',
            todoItemHidden: 'todo-component__todo-item--hidden',
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
            .appendTo(selectors.todoList)
            .addClass(classes.listButtonRow)
            .listButtonRow({
                buttons: [
                    {
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
                    //console.log(selectedButtonIdx);
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
        const input = $(selectors.input);
        if (input.val().length !== 0) {
            $('<label/>').todoItem({
                id: tasks.length + 1,
                value: input.val(),
            });
            tasks.push({id: tasks.length + 1, pending: true, text: input.val()});
            input.val("");
            $(selectors.validationWarning).removeClass(classes.warningShown);
            this._updateTaskText();
            this.filterTasks(0);
        } else {
            $(selectors.validationWarning).addClass(classes.warningShown);
        }
    },

    _clearAllTasks: function () {
        $(this.options.selectors.todoList).html("");
        this.options.tasks = [];
        this._updateTaskText();
    },

    _updateTaskText: function () {
        const tasks = this.options.tasks;
        const pendingTasksCount = tasks.filter(task => task.pending === true).length
        const taskText = pendingTasksCount === 1 ? 'task' : 'tasks';
        $(this.options.selectors.pendingText).text(`You have ${pendingTasksCount} pending ${taskText}`);
    },

    removeTask: function (taskId) {
        this.options.tasks = this.options.tasks.filter(task => task.id !== taskId);
        this._updateTaskText();
    },

    toggleTask: function (taskId) {
        let task = this.options.tasks.find(task => task.id === taskId);
        task.pending = !task.pending;
        this.filterTasks(0);
        this._updateTaskText();
    },

    filterTasks: function (filterId) {
        const selectors = this.options.selectors;
        const classes = this.options.classes;
        const tasks = this.options.tasks;
        const completedTasks = tasks.filter(task => task.pending === false);
        const pendingTasks = tasks.filter(task => task.pending === true);
        const items = $(this.options.selectors.todoItem);

        switch (filterId) {
            case 1:
                completedTasks.map(task => {
                    $(items[task.id - 1])
                        .addClass(classes.todoItemShown)
                        .removeClass(classes.todoItemHidden);
                });
                pendingTasks.map(task => {
                    $(items[task.id - 1])
                        .addClass(classes.todoItemHidden)
                        .removeClass(classes.todoItemShown);
                });
                $(selectors.showAllButton).removeClass(classes.selectedButton);
                $(selectors.showCompletedButton).addClass(classes.selectedButton);
                $(selectors.showPendingButton).removeClass(classes.selectedButton);
                break;
            case 2:
                pendingTasks.map(task => {
                    $(items[task.id - 1])
                        .addClass(classes.todoItemShown)
                        .removeClass(classes.todoItemHidden);
                });
                completedTasks.map(task => {
                    $(items[task.id - 1])
                        .addClass(classes.todoItemHidden)
                        .removeClass(classes.todoItemShown);
                });
                $(selectors.showAllButton).removeClass(classes.selectedButton);
                $(selectors.showCompletedButton).removeClass(classes.selectedButton);
                $(selectors.showPendingButton).addClass(classes.selectedButton);
                break;
            default:
                tasks.map(task => {
                    $(items[task.id - 1])
                        .addClass(classes.todoItemShown)
                        .removeClass(classes.todoItemHidden);
                });
                $(selectors.showAllButton).addClass(classes.selectedButton);
                $(selectors.showCompletedButton).removeClass(classes.selectedButton);
                $(selectors.showPendingButton).removeClass(classes.selectedButton);
                break;

        }
    }
});

$.widget('custom.listButtonRow', {
    options: {
        buttons: [],
        selectedButtonIdx: 0,
        classes: {
            listButtonRow: 'list-button-row__button',
            selectedButton: 'list-button-row__button--selected',
            showAllButton: 'list-button-row__button--show-all',
            showCompletedButton: 'list-button-row__button--show-completed',
            showPendingButton: 'list-button-row__button--show-pending'
        },
        selectors: {
            todoComponent: '.todo-component',
        },
    },
    _create: function () {
        const classes = this.options.classes;
        this.showAllButton = $('<button/>')
            .appendTo(this.element)
            .addClass(classes.listButtonRow)
            .addClass(classes.showAllButton)
            .addClass(classes.selectedButton)

        this.addButtonIcon = $('<i/>')
            .appendTo(this.showAllButton)
            .addClass(this.options.buttons[0].icon)

        this.showCompletedButton = $('<button/>')
            .appendTo(this.element)
            .addClass(classes.listButtonRow)
            .addClass(classes.showCompletedButton)

        this.completedButtonIcon = $('<i/>')
            .appendTo(this.showCompletedButton)
            .addClass(this.options.buttons[1].icon)

        this.showPendingButton = $('<button/>')
            .appendTo(this.element)
            .addClass(classes.listButtonRow)
            .addClass(classes.showPendingButton)

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
        $(this.options.selectors.todoComponent).todoComponent('filterTasks', 0);
    },

    _showCompleted: function () {
        this.options.onButtonSelected(1);
        $(this.options.selectors.todoComponent).todoComponent('filterTasks', 1);
    },

    _showPending: function () {
        this.options.onButtonSelected(2);
        $(this.options.selectors.todoComponent).todoComponent('filterTasks', 2);
    },
});

$.widget('custom.todoItem', {
    options: {
        classes: {
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
        $(this.options.selectors.todoComponent).todoComponent('removeTask', this.options.id);
        this.element.remove();
    },

    _toggleTask: function () {
        $(this.options.selectors.todoComponent).todoComponent('toggleTask', this.options.id);
    },
});

$(function () {
    $('.todo-component').todoComponent();
});
