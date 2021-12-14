$.widget('custom.todoComponent', {
    options: {
        selectors: {
            addButton: '.btn__add-btn',
            clearButton: '.btn__clear-btn',
            input: '.todo-component__input',
            pendingText: '.todo-component__pending-text',
            todoComponent: '.todo-component',
            todoItem: '.todo-component__todo-item',
            todoItemPending: '.todo-component__todo-item--pending',
            todoList: '.todo-component__todo-list',
            validationWarning: '.todo-component__validation-warning',
        },
        classes: {
            showingAll: 'todo-component--showing-all',
            showingCompleted: 'todo-component--showing-completed',
            showingPending: 'todo-component--showing-pending',
            inputError: 'todo-component--input-error',
        },
        tasks: [],
    },
    _create: function () {
        const selectors = this.options.selectors;
        const classes = this.options.classes;

        this.element.addClass(classes.showingAll);

        this.addButton = $(selectors.addButton).button();
        this.clearButton = $(selectors.clearButton).button();

        this.listButtonRow = $('<ul/>')
            .appendTo(selectors.todoList)
            .listButtonRow({
                buttons: [
                    {icon: 'fas fa-th'},
                    {icon: 'fas fa-tasks'},
                    {icon: 'fas fa-list'},
                ],
                onButtonSelected: function (selectedButtonIdx) {
                    switch (selectedButtonIdx) {
                        case 1:
                            $(selectors.todoComponent)
                                .removeClass(classes.showingAll)
                                .addClass(classes.showingCompleted)
                                .removeClass(classes.showingPending)
                            break;
                        case 2:
                            $(selectors.todoComponent)
                                .removeClass(classes.showingAll)
                                .removeClass(classes.showingCompleted)
                                .addClass(classes.showingPending);
                            break;
                        default:
                            $(selectors.todoComponent)
                                .addClass(classes.showingAll)
                                .removeClass(classes.showingCompleted)
                                .removeClass(classes.showingPending);
                            break;
                    }
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
            let newTodo = $('<label/>');
            newTodo.todoItem({
                id: tasks.length + 1,
                value: input.val(),
            });
            tasks.push({id: tasks.length + 1, item: newTodo, pending: true, text: input.val()});
            input.val("");
            this.element.removeClass(classes.inputError);
            this.updateTaskText();
        } else {
            this.element.addClass(classes.inputError);
        }
    },

    _clearAllTasks: function () {
        $(this.options.selectors.todoItem).remove();
        this.options.tasks = [];
        this.updateTaskText();
    },

    updateTaskText: function () {
        const pendingTasksCount = $(this.options.selectors.todoItemPending).length
        const taskText = pendingTasksCount === 1 ? 'task' : 'tasks';
        $(this.options.selectors.pendingText).text(`You have ${pendingTasksCount} pending ${taskText}`);
    },

    removeTask: function (taskId) {
        const tasks = this.options.tasks;
        let task = tasks.find(task => task.id === taskId);
        tasks.splice(tasks.indexOf(task), 1);
        this.updateTaskText();
    },
});

$.widget('custom.listButtonRow', {
    options: {
        buttons: [],
        selectedButtonIdx: 0,
        classes: {
            listButtonRow: 'list-button-row',
            selectedButton: 'list-button-row__button--selected',
            listButtonRowButton: 'list-button-row__button',
            showAllButton: 'list-button-row__button--show-all',
            showCompletedButton: 'list-button-row__button--show-completed',
            showPendingButton: 'list-button-row__button--show-pending',
        },
        selectors: {
            todoComponent: '.todo-component',
        },
        onButtonSelected: function (index) {
        }
    },
    _create: function () {
        const component = this;
        const classes = component.options.classes;
        component.element.addClass(classes.listButtonRow);

        const buttons = component.options.buttons.map(function (buttonDef, index) {
            const listElm = $('<li/>');
            const buttonElm = $('<button/>');
            buttonElm.addClass(classes.listButtonRowButton);
            buttonElm.appendTo(listElm);

            $('<i/>')
                .addClass(buttonDef.icon)
                .appendTo(buttonElm);

            component._on(buttonElm, {
                click: function () {
                    component.select(index);
                }
            });
            return listElm;
        });
        component.element.append(buttons);

        this._elmCache = {
            buttons: buttons,
        };
        this._doSelect(component.options.selectedButtonIdx);
    },

    select: function (index) {
        if (this.options.selectedButtonIdx !== index) {
            this.option({
                selectedButtonIdx: index
            });
        }
    },
    _doSelect: function (index) {
        // Borrar selected en todos los botones y añadir al que tiene el indice
        this._elmCache.buttons.map((button, idx) => {
            if (idx===index){
                button.children().addClass(this.options.classes.selectedButton)
            }else{
                button.children().removeClass(this.options.classes.selectedButton)
            }
        })
        this.options.onButtonSelected(index);
    },
    _setOptions: function () {
        this._superApply(arguments);
        this._doSelect(arguments[0].selectedButtonIdx)
    },
});

$.widget('custom.todoItem', {
    options: {
        classes: {
            todoItem: 'todo-component__todo-item',
            todoItemCheckbox: 'todo-component__todo-item__checkbox',
            todoItemCompleted: 'todo-component__todo-item--completed',
            todoItemPending: 'todo-component__todo-item--pending',
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
            .addClass(classes.todoItemPending)

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
        this.element.remove();
        $(this.options.selectors.todoComponent).todoComponent('removeTask', this.options.id);
    },

    _toggleTask: function () {
        if (this.checkbox.is(':checked')) {
            this.element
                .addClass(this.options.classes.todoItemCompleted)
                .removeClass(this.options.classes.todoItemPending)
        } else {
            this.element
                .addClass(this.options.classes.todoItemPending)
                .removeClass(this.options.classes.todoItemCompleted)
        }
        $(this.options.selectors.todoComponent).todoComponent('updateTaskText');
    },
});

$(function () {
    $('.todo-component').todoComponent();
});
