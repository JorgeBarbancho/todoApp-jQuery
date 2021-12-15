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
        _elmCache:{
            listButtonRow: null,
            addButton: null,
            clearButton: null,
        }
    },
    _create: function () {
        const component = this;
        const element = component.element;
        const selectors = component.options.selectors;
        const classes = component.options.classes;
        const elmCache = component.options._elmCache;

        element.addClass(classes.showingAll);

        elmCache.addButton = element.find(selectors.addButton).button();
        elmCache.clearButton = element.find(selectors.clearButton).button();

        elmCache.listButtonRow = $('<ul/>')
            .appendTo(selectors.todoList)
            .listButtonRow({
                buttons: [
                    {icon: 'fas fa-th'},
                    {icon: 'fas fa-tasks'},
                    {icon: 'fas fa-list'},
                ],
                onButtonSelected: function (selectedButtonIdx) {
                    // noinspection FallThroughInSwitchStatementJS
                    switch (selectedButtonIdx) {
                        default:
                            console.warn('Selected button not found. Falling back to 0');
                        case 0:
                            element
                                .addClass(classes.showingAll)
                                .removeClass(classes.showingCompleted)
                                .removeClass(classes.showingPending);
                            break;
                        case 1:
                            element
                                .removeClass(classes.showingAll)
                                .addClass(classes.showingCompleted)
                                .removeClass(classes.showingPending)
                            break;
                        case 2:
                            element
                                .removeClass(classes.showingAll)
                                .removeClass(classes.showingCompleted)
                                .addClass(classes.showingPending);
                            break;
                    }
                }
            })

        this._on(elmCache.addButton, {
            click: "_addNewTask"
        });

        this._on(elmCache.clearButton, {
            click: "_clearAllTasks"
        });
    },

    _addNewTask: function (event) {
        event.preventDefault();
        const component = this;
        const element = component.element;
        const options = component.options;
        const selectors = options.selectors;
        const classes = options.classes;
        const input = element.find(selectors.input);
        if (input.val().length !== 0) {
            const newListElm = $('<li/>')
            const newTodoElm = $('<label/>');
            newTodoElm.todoItem({
                value: input.val(),
                onRemoveClicked: function () {
                    newTodoElm.todoItem('destroy');
                    newTodoElm.remove();
                    component._updateTaskText();
                },
                onCheckboxClicked: function () {
                    component._updateTaskText();
                }
            });
            const todoListElm = element.find(selectors.todoList);
            newTodoElm.appendTo(newListElm);
            newListElm.appendTo(todoListElm);
            input.val('');
            element.removeClass(classes.inputError);
            component._updateTaskText();
        } else {
            element.addClass(classes.inputError);
        }
    },

    _clearAllTasks: function () {
        const component = this;
        const todoItems = component.element.find(component.options.selectors.todoItem)
        todoItems.todoItem('destroy');
        todoItems.remove();
        component._updateTaskText();
    },

    _destroy: function () {
        const component = this;
        component._superApply(arguments);
        component.element.find(component.options.selectors.todoItem).todoItem('destroy');
        component.listButtonRow.listButtonRow('destroy');
    },

    _updateTaskText: function () {
        const component = this;
        const selectors = component.options.selectors;
        const pendingTasksCount = $(selectors.todoItemPending).length
        const taskText = pendingTasksCount === 1 ? 'task' : 'tasks';
        component.element.find(selectors.pendingText).text(`You have ${pendingTasksCount} pending ${taskText}`);
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
        _elmCache: {
          buttons: [],
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
                    component._select(index);
                }
            });
            return listElm;
        });
        component.element.append(buttons);

        component._elmCache = {
            buttons: buttons,
        };
        this._doSelect(component.options.selectedButtonIdx);
    },

    _select: function (index) {
        const component = this;
        if (component.options.selectedButtonIdx !== index) {
            component.option({
                selectedButtonIdx: index
            });
        }
    },

    _doSelect: function (index) {
        const component = this;
        const selectedButtonClass = this.options.classes.selectedButton;

        component._elmCache.buttons.map((button, idx) => {
            const buttonChildren = button.children();
            if (idx === index) {
                buttonChildren.addClass(selectedButtonClass);
            } else {
                buttonChildren.removeClass(selectedButtonClass);
            }
        })
        component.options.onButtonSelected(index);
    },
    _setOptions: function () {
        const component = this;
        component._superApply(arguments);
        component._doSelect(arguments[0].selectedButtonIdx)
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
        },
        _elmCache: {
          checkbox: null,
          trashBtn: null,
        },
        icons: {
            trash: 'fas fa-trash'
        },
        onRemoveClicked: function () {

        },
        onCheckboxClicked: function () {

        }
    },
    _create: function () {
        const component = this;
        const element = component.element;
        const classes = component.options.classes;
        const elmCache = component.options._elmCache;
        element
            .addClass(classes.todoItem)
            .addClass(classes.todoItemPending);

        elmCache.checkbox = $('<input type="checkbox"/>')
            .appendTo(element)
            .addClass(classes.todoItemCheckbox)

        $('<p/>')
            .addClass(classes.todoItemText)
            .text(component.options.value)
            .appendTo(component.element)

        elmCache.trashButton = $('<button/>')
            .appendTo(component.element)
            .addClass(classes.trashButton)
            .button();

        $('<i/>')
            .appendTo(elmCache.trashButton)
            .addClass(component.options.icons.trash)

        component._on(elmCache.trashButton, {
            click: '_remove'
        });

        component._on(elmCache.checkbox, {
            click: '_toggleTask'
        });
    },

    _remove: function () {
        this.options.onRemoveClicked();
    },

    _toggleTask: function () {
        const component = this;
        const classes = component.options.classes;
        if (component.options._elmCache.checkbox.is(':checked')) {
            component.element
                .addClass(classes.todoItemCompleted)
                .removeClass(classes.todoItemPending)
        } else {
            component.element
                .addClass(classes.todoItemPending)
                .removeClass(classes.todoItemCompleted)
        }
        component.options.onCheckboxClicked();
    },
});

$(function () {
    $('.todo-component').todoComponent();
});
