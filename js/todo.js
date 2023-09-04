import {
  Translate
} from './translator.js';
import {
  notifyer
} from './main.js';
import {
  alerter
} from './main.js';
import {
  confirmer
} from './main.js';
import {
  fCompressCodeTime
} from './main.js';
import {
  fDeCompressCodeTime
} from './main.js';
import {
  getTimeCode
} from './main.js';

// Настройка времени
const timeSetting = {
  start: '8:00',
  end: '20:00',
  step: '0:30',
};

// HTML-парсер
let parser = new DOMParser();

let btnTodo = document.querySelector('#btnTodo');

// Список дел
btnTodo.addEventListener('click', () => {
  let userId = btnTodo.dataset.id;
  if (!userId) userId = '00000000000';

  // Генерация времени
  let timeline = createTimeline(timeSetting);

  // Генерируем окно списка дел
  let modalContent = btnTodo.closest('.modal-content');
  let btnClose = modalContent.querySelector('.btn-close');
  let todoHtml = /* html */ `
    <div class="todo">
        <div class="todo__body">
            <div trans="text+:toDoList;" class="todo__title">Список дел</div>
            <div class="todo__options">
                <form action="#" class="todo__form todo-form" id="todoForm">
                    <div class="todo-form__selects">
                        <select name="day" id="todoDayOfWeek" tabindex="1" class="todo-form__select _req">
                            <option trans="text+:WeekDay;" value="">День недели</option>
                            <option trans="text+:MonFull;" value="Понедельник">Понедельник</option>
                            <option trans="text+:TueFull;" value="Вторник">Вторник</option>
                            <option trans="text+:WedFull;" value="Среда">Среда</option>
                            <option trans="text+:ThuFull;" value="Четверг">Четверг</option>
                            <option trans="text+:FriFull;" value="Пятница">Пятница</option>
                            <option trans="text+:SatFull;" value="Суббота">Суббота</option>
                            <option trans="text+:SunFull;" value="Воскресенье">Воскресенье</option>
                        </select>
                        <select name="start" id="todoStartTime" tabindex="2" class="todo-form__select _req">
                            <option trans="text+:Beginning;" value="">Начало</option>
                        </select>
                        <select name="end" id="todoEndTime" tabindex="3" class="todo-form__select _req">
                            <option trans="text+:Fin;" value="">Конец</option>
                        </select>
                        <select name="todoType" id="todoType" tabindex="4" class="todo-form__select _req">
                            <option trans="text+:TypeEmployment;" value="">Тип занятости</option>
                            <option trans="text+:Work;" value="work">Работа</option>
                            <option trans="text+:Personal;" value="personal">Личное</option>
                            <option trans="text+:Rest;" value="rest">Отдых</option>
                        </select>
                    </div>
                    <div class="todo-form__textarea" data-symbols="">
                        <textarea trans="placeholder:Description" name="description" id="todoDescription" tabindex="5" class="todo-form__description _req" placeholder="Описание" maxlength="100"></textarea>
                    </div>
                    <div class="todo-form__btns">
                        <button class="todo-form__button todo-form__submit" tabindex="6" type="submit">
                            <i class="bi bi-plus"></i>
                            <span trans="text+:plusButtonBusyText">Добавить</span>
                        </button>
                        <button class="todo-form__button todo-form__reset" tabindex="7" type="reset">
                            <i class="bi bi-arrow-repeat"></i>
                            <span trans="text+:ThrowOff">Сбросить</span>
                        </button>
                    </div>
                </form>
            </div>
            <div class="todo__deals todo-deals">
                <div class="todo-deals__items" id="todoDealsBody">
                    <!-- <div class="todo-deals__empty">
                        <span>Список дел пуст...</span>
                    </div> -->
                </div>
            </div>
            <div class="todo__checkbox">
                <label>
                    <input id="todoCheckbox" data-id="${userId}" type="checkbox" class="form-check-input" tabindex="8">
                    <span trans="text+:DisplaySchedule">Выводить список дел в расписание</span>
                </label>
            </div>
            <div class="todo__btns todo-btns">
                <div class="todo-btns__left">
                    <button class="todo-btns__button todo-btns__delete" id="todoDeleteAll" tabindex="9" title="Удалить все дела">
                        <i class="bi bi-eraser-fill" style="color: indianred"></i>
                    </button>
                </div>
                <div class="todo-btns__right">
                    <button trans="text+:Close;" class="todo-btns__button todo-btns__escape" id="todoClose" tabindex="10">Закрыть</button>
                </div>
            </div>
        </div>
    </div>
  `;
  todoHtml = parser
    .parseFromString(todoHtml, 'text/html')
    .querySelector('.todo');

  modalContent.style.position = 'relative';
  btnClose.style.position = 'relative';
  btnClose.style.zIndex = 1000;
  modalContent.append(todoHtml);

  // Закрытие списка дел на крестик
  btnClose.addEventListener('click', closeTodoWindow);

  // Переменные списка дел
  let selectStartTime = document.querySelector('#todoStartTime'),
    selectEndTime = document.querySelector('#todoEndTime'),
    todo = document.querySelector('.todo'),
    todoForm = document.querySelector('#todoForm'),
    todoDealsBody = document.querySelector('#todoDealsBody'),
    todoCheckbox = document.querySelector('#todoCheckbox');

  // Генерируем дела
  loadTodo(userId);

  // Генерация селектов
  generateSelectStartTime(timeline, selectStartTime);
  generateSelectEndTime(timeline, selectEndTime);

  // Контроль кол-ва символов в <textarea>
  let todoDescription = document.querySelector('#todoDescription');
  let maxSymbols = todoDescription.attributes.maxlength.value;

  changeDescriptionLimit(todoDescription, 0, maxSymbols);

  todoDescription.addEventListener('input', () => {
    changeDescriptionLimit(
      todoDescription,
      todoDescription.value.length,
      maxSymbols
    );
  });

  // Обновление селектов (убираем лишнее время)
  selectEndTime.addEventListener('change', () => {
    let selectStartValue = selectStartTime.value;
    selectStartUpdate(timeline, selectStartTime, selectEndTime);

    Array.from(selectStartTime.children).forEach((option) => {
      if (option.value == selectStartValue) {
        option.setAttribute('selected', '');
      }
    });
  });

  selectStartTime.addEventListener('change', () => {
    let selectEndValue = selectEndTime.value;
    selectEndUpdate(timeline, selectStartTime, selectEndTime);

    Array.from(selectEndTime.children).forEach((option) => {
      if (option.value == selectEndValue) {
        option.setAttribute('selected', '');
      }
    });
  });

  // Отправка формы при клике на кнопку 'Добавить'
  todoForm.addEventListener('submit', todoAddItem);

  // Изменение статуса checkbox "Выводить список дел в расписание"
  todoCheckbox.addEventListener('change', changeTodoCheckbox);
  renderTodoCheckbox();

  // Делегирование
  todo.addEventListener('click', todoActions);

  Translate();

  //<FUNCTIONS>==============================================================================

  // Checkbox "Выводить список дел в расписание"
  function renderTodoCheckbox() {
    let checkboxID = todoCheckbox.dataset.id;
    let localStorageID = getLocalStorageData('todoID') || [];

    if (localStorageID.length !== 0) {
      if (localStorageID.includes(checkboxID)) {
        if (!todoCheckbox.attributes.checked) {
          todoCheckbox.setAttribute('checked', '');
        }
      }
      // else {
      //     // Если нужен будет множественный выбор, то закомментировать блок else
      //     if (!todoCheckbox.attributes.disabled) {
      //         todoCheckbox.setAttribute('disabled', '');
      //     }
      // }
    }
  }

  function changeTodoCheckbox() {
    let checkboxID = todoCheckbox.dataset.id;
    let localStorageID = getLocalStorageData('todoID') || [];

    if (todoCheckbox.checked) {
      if (localStorageID.length === 0) {
        localStorageID.push(checkboxID);
        setLocalStorageData('todoID', localStorageID);
      } else {
        alerter(
          '<span trans="text+:Danger">Внимание</span>',
          '<div trans="text+:TodoIsAlreadyDisplayed;" style="text-indent: 0;">Список дел другого(их) пользователей уже выводится в расписание</div>',
          'standart',
          'info',
          'slim'
        );

        if (!localStorageID.includes(checkboxID)) {
          localStorageID.push(checkboxID);
          setLocalStorageData('todoID', localStorageID);
        }
      }
    } else {
      localStorageID.splice(localStorageID.indexOf(checkboxID), 1);
      setLocalStorageData('todoID', localStorageID);
    }
  }

  function todoActions(e) {
    let targetElement = e.target;

    // Кнопка 'Сбросить'
    if (targetElement.closest('.todo-form__reset')) {
      todoForm.reset();

      let formReq = todoForm.querySelectorAll('._req');

      for (let i = 0; i < formReq.length; i++) {
        const input = formReq[i];
        formRemoveError(input);
      }

      changeDescriptionLimit(todoDescription, 0, maxSymbols);
      generateSelectStartTime(timeline, selectStartTime);
      generateSelectEndTime(timeline, selectEndTime);
    }

    // Checkbox
    if (targetElement.closest('.todo-item__checkbox')) {
      let checkboxBtn = targetElement.closest('.todo-item__checkbox');
      checkboxBtn.classList.toggle('_checked');
      checkTodoItem(checkboxBtn, userId);
    }

    // Удаление дела
    if (targetElement.closest('.todo-buttons__del')) {
      let deleteBtn = targetElement.closest('.todo-buttons__del');
      deleteTodoItem(deleteBtn.dataset.id, userId);
    }

    // Удаление всех дел сразу
    if (targetElement.closest('#todoDeleteAll')) {
      todoDeleteAll(userId);
    }

    // Закрытие списка дел
    if (targetElement.closest('#todoClose')) {
      closeTodoLayers(
        btnTodo.closest('.modal-content').children[2].children[0]
      );
      loadTodoLayers(
        btnTodo.closest('.modal-content').children[2].children[0],
        userId
      );

      closeTodoWindow();
    }

    // Редактирование дела
    if (targetElement.closest('.todo-buttons__edit')) {
      let editBtn = targetElement.closest('.todo-buttons__edit');
      let editItemData = {
        id: editBtn.dataset.id,
        day: editBtn.dataset.day,
        startTime: editBtn.dataset.starttime,
        endTime: editBtn.dataset.endtime,
        description: editBtn.dataset.description,
        type: editBtn.dataset.type,
      };
      todoEditItem(userId, editItemData);
    }
  }

  async function todoAddItem(e) {
    e.preventDefault();

    let errors = formValidate(todoForm);

    if (errors === 0) {
      todoForm.classList.add('_sending');

      // Если у id нет созданных дел - создаем пустую 'папку'
      if (!(await idFolderExist(userId))) {
        let idFormData = new FormData();
        idFormData.append('type', 'newIdFolder');
        idFormData.append('userId', userId);

        await fetch('php/todo.php', {
          method: 'POST',
          body: idFormData,
        });
      }

      // Определение ID элемента
      let responseGetID = await fetch('api/todo.json', {
          method: 'POST',
        }),
        maximum = 0,
        todoId;

      if (responseGetID.ok) {
        let todoJson = await responseGetID.json(),
          userTodo = todoJson.todo[userId];

        if (userTodo.length == 0) {
          todoId = 1;
        } else {
          for (let i = 0; i < userTodo.length; i++) {
            const todo = userTodo[i];

            if (todo.id > maximum) {
              maximum = todo.id;
            }
          }

          todoId = +maximum + 1;
        }
      }

      let formData = new FormData(todoForm);
      formData.append('type', 'newTodo');
      formData.append('userId', userId);
      formData.append('todoId', todoId);

      let response = await fetch('php/todo.php', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        todoForm.reset();
        changeDescriptionLimit(todoDescription, 0, maxSymbols);
        generateSelectStartTime(timeline, selectStartTime);
        generateSelectEndTime(timeline, selectEndTime);
        loadTodo(userId);
        todoForm.classList.remove('_sending');
      } else {
        showAlert('error');
        todoForm.classList.remove('_sending');
      }
    } else {
      showAlert('form');
    }
  }

  async function loadTodo(id) {
    let response = await fetch('api/todo.json', {
      method: 'POST',
    });

    if (response.ok) {
      let todoJson = await response.json();

      if ((await idFolderExist(id)) && todoJson.todo[id].length !== 0) {
        let userJson = todoJson.todo[id];

        todoDealsBody.innerHTML = '';

        for (let i = 0; i < userJson.length; i++) {
          const item = userJson[i];

          todoDealsBody.innerHTML += /* html */ `
            <div class="todo-deals__item todo-item" data-id="${item.id}">
                <div class="todo-item__body">
                    <div class="todo-item__checkbox ${+item.checked ? '_checked' : ''}" data-id="${item.id}" title="${+item.checked ? 'Выполнено' : 'Невыполнено'}">
                        <i class="bi bi-check-lg"></i>
                    </div>
                    <div class="todo-item__content">
                        <div class="todo-item__header">

                            <div class="todo-item__info todo-info">
                                <div class="todo-info__item todo-info__day">${item.day}</div>
                                <div class="todo-info__item todo-info__time">
                                    ${item.startTime} - ${item.endTime}
                                </div>
                            </div>
                            <div class="todo-item__buttons todo-buttons">
                                <div class="todo-buttons__btn todo-buttons__edit" title="Редактировать дело" 
                                    data-id="${item.id}"
                                    data-day="${item.day}"
                                    data-starttime="${item.startTime}"
                                    data-endtime="${item.endTime}"
                                    data-description="${item.description}"
                                    data-type="${item.type}"
                                >
                                    <i class="bi bi-pencil-square"></i>
                                </div>
                                <div class="todo-buttons__btn todo-buttons__del" data-id="${item.id}" title="Удалить дело">
                                    <i class="bi bi-trash"></i>
                                </div>
                            </div>

                        </div>
                        <div class="todo-item__footer">
                            <div class="todo-item__description">
                                ${item.description}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          `;
        }
      } else if ((await idFolderExist(id)) && todoJson.todo[id].length === 0) {
        todoDealsBody.innerHTML = /* html */ `
          <div class="todo-deals__empty">
            <span>Список дел пуст...</span>
          </div>
        `;
      } else {
        todoDealsBody.innerHTML = /* html */ `
          <div class="todo-deals__empty">
            <span>Список дел пуст...</span>
          </div>
        `;
      }
    } else {
      showAlert('error');
    }
  }

  async function checkTodoItem(checkbox, id) {
    let response = await fetch('api/todo.json', {
        method: 'POST',
      }),
      todoId = checkbox.dataset.id;

    if (response.ok) {
      let todoJson = await response.json(),
        userTodo = todoJson.todo[id];

      for (let i = 0; i < userTodo.length; i++) {
        const item = userTodo[i];

        if (item.id == todoId) {
          let formData = new FormData();
          formData.append('type', 'checkTodo');
          formData.append('userId', id);
          formData.append('todoId', todoId);

          if (+item.checked) {
            formData.append('checked', 0);
            checkbox.title = 'Невыполнено';
          } else {
            formData.append('checked', 1);
            checkbox.title = 'Выполнено';
          }

          await fetch('php/todo.php', {
            method: 'POST',
            body: formData,
          });
        }
      }
    } else {
      showAlert('error');
    }
  }

  async function deleteTodoItem(todoId, id) {
    let formData = new FormData();
    formData.append('type', 'deleteTodo');
    formData.append('userId', id);
    formData.append('todoId', todoId);

    let response = await fetch('php/todo.php', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      loadTodo(id);
    } else {
      showAlert('error');
    }
  }

  async function todoDeleteAll(id) {
    if (await idFolderExist(id)) {
      let formData = new FormData();
      formData.append('type', 'deleteAll');
      formData.append('userId', id);

      let response = await fetch('php/todo.php', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        loadTodo(id);
      } else {
        showAlert('error');
      }
    }
  }

  function todoEditItem(id, data) {
    // Генерируем окно редактирования дела
    let editPopupHtml = /* html */ `
      <div class="todo__edit todo-edit">
          <div class="todo-edit__body">
              <div class="todo-edit__content">
                  <div trans="text+:EditingСase;" class="todo-edit__title">Редактирование дела</div>
                  <div class="todo-edit__options">
                      <form action="#" class="todo-edit__form edit-form" id="todoEditForm">
                          <div class="edit-form__selects">
                              <select name="editedDay" id="editedDayOfWeek" tabindex="1" class="edit-form__select _req">
                                  <option trans="text+:WeekDay;" value="">День недели</option>
                                  <option trans="text+:MonFull;" value="Понедельник">Понедельник</option>
                                  <option trans="text+:TueFull" value="Вторник">Вторник</option>
                                  <option trans="text+:WedFull" value="Среда">Среда</option>
                                  <option trans="text+:ThuFull" value="Четверг">Четверг</option>
                                  <option trans="text+:FriFull" value="Пятница">Пятница</option>
                                  <option trans="text+:SatFull" value="Суббота">Суббота</option>
                                  <option trans="text+:SunFull" value="Воскресенье">Воскресенье</option>
                              </select>
                              <select name="editedStart" id="editedStartTime" tabindex="2" class="edit-form__select _req">
                                  <option trans="text+:Beginning" value="">Начало</option>
                              </select>
                              <select name="editedEnd" id="editedEndTime" tabindex="3" class="edit-form__select _req">
                                  <option trans="text+:Fin;" value="">Конец</option>
                              </select>
                              <select name="editedTodoType" id="editedTodoType" tabindex="4" class="edit-form__select _req">
                                  <option trans="text+:TypeEmployment" value="">Тип занятости</option>
                                  <option trans="text+:Work" value="work">Работа</option>
                                  <option trans="text+:Personal" value="personal">Личное</option>
                                  <option trans="text+:Rest" value="rest">Отдых</option>
                              </select>
                          </div>
                          <div class="edit-form__textarea" data-symbols="">
                              <textarea name="editedDescription" id="editedDescription" tabindex="4" class="_req" placeholder="Описание" maxlength=""></textarea>
                          </div>
                          <div class="edit-form__btns edit-buttons">
                              <div class="edit-buttons__left">
                                  <button class="edit-buttons__btn edit-buttons__submit" tabindex="5" type="submit">
                                      <i class="bi bi-save"></i>
                                      <span trans="text+:Save">Сохранить</span>
                                  </button>
                                  <button class="edit-buttons__btn edit-buttons__reset" tabindex="6" type="reset">
                                      <i class="bi bi-arrow-repeat"></i>
                                      <span trans="text+:ThrowOff">Сбросить</span>
                                  </button>
                              </div>
                              <div class="edit-buttons__right">
                                  <button class="edit-buttons__btn edit-buttons__escape" tabindex="7" type="button">
                                      <span trans="text+:Close">Закрыть</span>
                                  </button>
                              </div>
                          </div>
                      </form>
                  </div>
              </div>
          </div>
      </div>
    `;

    editPopupHtml = parser
      .parseFromString(editPopupHtml, 'text/html')
      .querySelector('.todo__edit');
    modalContent.append(editPopupHtml);

    // Переменные редактирования дела
    let todoEdit = modalContent.querySelector('.todo__edit'),
      editedDaySelect = todoEdit.querySelector('#editedDayOfWeek'),
      editedTypeSelect = todoEdit.querySelector('#editedTodoType'),
      editedSelectStartTime = todoEdit.querySelector('#editedStartTime'),
      editedSelectEndTime = todoEdit.querySelector('#editedEndTime'),
      todoEditForm = todoEdit.querySelector('#todoEditForm');

    // Генерация селектов
    generateSelectStartTime(timeline, editedSelectStartTime);
    generateSelectEndTime(timeline, editedSelectEndTime);

    // Контроль кол-ва символов в <textarea>
    let editedDescription = todoEdit.querySelector('#editedDescription');
    editedDescription.attributes.maxlength.value = maxSymbols;

    changeDescriptionLimit(editedDescription, 0, maxSymbols);

    editedDescription.addEventListener('input', () => {
      changeDescriptionLimit(
        editedDescription,
        editedDescription.value.length,
        maxSymbols
      );
    });

    // Обновление селектов при их измененении (убираем лишнее время)
    editedSelectEndTime.addEventListener('change', () => {
      let editedSelectStartValue = editedSelectStartTime.value;
      selectStartUpdate(timeline, editedSelectStartTime, editedSelectEndTime);

      Array.from(editedSelectStartTime.children).forEach((option) => {
        if (option.value == editedSelectStartValue) {
          option.setAttribute('selected', '');
        }
      });
    });

    editedSelectStartTime.addEventListener('change', () => {
      let editedSelectEndValue = editedSelectEndTime.value;
      selectEndUpdate(timeline, editedSelectStartTime, editedSelectEndTime);

      Array.from(editedSelectEndTime.children).forEach((option) => {
        if (option.value == editedSelectEndValue) {
          option.setAttribute('selected', '');
        }
      });
    });

    // Отправка формы при клике на кнопку 'Сохранить'
    todoEditForm.addEventListener('submit', saveEditChanges);

    // Делегирование
    todoEdit.addEventListener('click', todoEditActions);

    // Меняем значения <textarea> и селектов
    editedDescription.value = data.description;
    changeDescriptionLimit(
      editedDescription,
      editedDescription.value.length,
      maxSymbols
    );

    editedDaySelect.value = data.day;
    editedTypeSelect.value = data.type;

    editedSelectStartTime.value = data.startTime;
    editedSelectEndTime.value = data.endTime;

    selectStartUpdate(timeline, editedSelectStartTime, editedSelectEndTime);

    Array.from(editedSelectStartTime.children).forEach((option) => {
      if (option.value == data.startTime) {
        option.setAttribute('selected', '');
      }
    });

    selectEndUpdate(timeline, editedSelectStartTime, editedSelectEndTime);

    Array.from(editedSelectEndTime.children).forEach((option) => {
      if (option.value == data.endTime) {
        option.setAttribute('selected', '');
      }
    });
    
    Translate();

    // Анимация открытия окна редактирования дела
    setTimeout(() => {
      todo.querySelector('.todo__body').style.pointerEvents = 'none';

      if (!todoEdit.classList.contains('_open')) {
        todoEdit.classList.add('_open');
      }
    }, 1);

    function todoEditActions(e) {
      let targetElement = e.target;

      // Кнопка 'Сбросить'
      if (targetElement.closest('.edit-buttons__reset')) {
        todoEditForm.reset();

        let formReq = todoEditForm.querySelectorAll('._req');

        for (let i = 0; i < formReq.length; i++) {
          const input = formReq[i];
          formRemoveError(input);
        }

        changeDescriptionLimit(editedDescription, 0, maxSymbols);
        generateSelectStartTime(timeline, editedSelectStartTime);
        generateSelectEndTime(timeline, editedSelectEndTime);
      }

      // Кнопка 'Закрыть'
      if (targetElement.closest('.edit-buttons__escape')) {
        closeEditPopup();
      }
    }

    async function saveEditChanges(e) {
      e.preventDefault();

      let errors = formValidate(todoEditForm);

      if (errors === 0) {
        todoEditForm.classList.add('_sending');

        let formData = new FormData(todoEditForm);
        formData.append('type', 'editTodo');
        formData.append('userId', id);
        formData.append('todoId', data.id);

        let response = await fetch('php/todo.php', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          todoForm.classList.remove('_sending');
          closeEditPopup();
          loadTodo(userId);
        } else {
          showAlert('error');
          todoForm.classList.remove('_sending');
        }
      } else {
        showAlert('form')
      }
    }

    function closeEditPopup() {
      // Анимация закрытия окна редактирования дела
      if (todoEdit.classList.contains('_open')) {
        todoEdit.classList.remove('_open');
      }

      setTimeout(() => {
        editPopupHtml.remove();
        todo.querySelector('.todo__body').style.pointerEvents = 'auto';
      }, 301);
    }
  }

  function closeTodoWindow() {
    modalContent.style.position = 'static';
    btnClose.style.position = 'static';
    btnClose.style.zIndex = 0;
    modalContent.querySelector('.todo').remove();
    btnClose.removeEventListener('click', closeTodoWindow);
  }

  function changeDescriptionLimit(textarea, left, right) {
    textarea.parentNode.dataset.symbols = `${left}/${right}`;

    if (
      textarea.value.length >= maxSymbols / 2 &&
      textarea.value.length != maxSymbols
    ) {
      if (textarea.parentNode.classList.contains('_red')) {
        textarea.parentNode.classList.remove('_red');
      }

      if (!textarea.parentNode.classList.contains('_yellow')) {
        textarea.parentNode.classList.add('_yellow');
      }
    } else if (textarea.value.length == maxSymbols) {
      if (textarea.parentNode.classList.contains('_yellow')) {
        textarea.parentNode.classList.remove('_yellow');
      }

      if (!textarea.parentNode.classList.contains('_red')) {
        textarea.parentNode.classList.add('_red');
      }
    } else if (
      textarea.value.length == 0 ||
      textarea.value.length <= maxSymbols
    ) {
      if (textarea.parentNode.classList.contains('_yellow')) {
        textarea.parentNode.classList.remove('_yellow');
      }

      if (textarea.parentNode.classList.contains('_red')) {
        textarea.parentNode.classList.remove('_red');
      }
    }
  }

  function createTimeline(settings) {
    let timeline = [];
    timeline.push(settings.start); // Добавляем начальное значение timeSetting.start
    let [stepHours, stepMinutes] = splitTimeString(settings.step); // Распаковываем шаг

    while (isTimeSmaller(timeline[timeline.length - 1], settings.end)) {
      let newMinutes = 0,
        newHour = 0;
      let [startHour, startMinutes] = splitTimeString(
        timeline[timeline.length - 1]
      );

      /* Работает с минутами */
      let minutesSummary = startMinutes + stepMinutes;

      if (minutesSummary > 60) {
        let diff = minutesSummary - 60;

        if (diff < 10) {
          newMinutes = `0${diff}`;
        } else {
          newMinutes = `${diff}`;
        }

        newHour++;
      } else if (minutesSummary == 60) {
        newMinutes = '00';
        newHour++;
      } else {
        if (minutesSummary < 10) {
          newMinutes = `0${minutesSummary}`;
        } else {
          newMinutes = `${minutesSummary}`;
        }
      }

      /* Работаем с часами */
      let hoursSummary = startHour + stepHours;
      newHour += hoursSummary;

      let newTimeString = `${newHour}:${newMinutes}`;

      if (
        !isTimeSmaller(newTimeString, settings.end) &&
        newTimeString !== settings.end
      ) {
        break;
      } else {
        timeline.push(newTimeString);
      }
    }

    function isTimeSmaller(string1, string2) {
      let [startHour, startMinutes] = splitTimeString(string1);
      let [endHour, endMinutes] = splitTimeString(string2);

      if (startHour < endHour) {
        return true;
      } else if (startMinutes < endMinutes && startHour == endHour) {
        return true;
      } else {
        return false;
      }
    }

    return timeline;
  }

  function generateSelectStartTime(timeline, select) {
    /* Генерация selectStartTime */
    select.innerHTML = /* html */ `
            <option trans="text+:Beginning" value=''>Начало</option>
        `;

    for (let i = 0; i < timeline.length; i++) {
      const elem = timeline[i];
      select.innerHTML += /* html */ `
                <option value='${elem}'>${elem}</option>
            `;
    }
  }

  function generateSelectEndTime(timeline, select) {
    /* Генерация selectEndTime */
    select.innerHTML = /* html */ `
            <option trans="text+:Fin;" value=''>Конец</option>
        `;

    for (let i = 0; i < timeline.length; i++) {
      const elem = timeline[i];
      select.innerHTML += /* html */ `
                <option value='${elem}'>${elem}</option>
            `;
    }
  }

  function selectStartUpdate(timeline, selectStart, selectEnd) {
    let selectEndValueIndex = timeline.indexOf(selectEnd.value);
    let newStartTimeline = timeline.slice(0, selectEndValueIndex);

    generateSelectStartTime(newStartTimeline, selectStart);
  }

  function selectEndUpdate(timeline, selectStart, selectEnd) {
    let selectStartValueIndex = timeline.indexOf(selectStart.value);
    let newEndTimeline = timeline.slice(
      selectStartValueIndex + 1,
      timeline.length
    );

    generateSelectEndTime(newEndTimeline, selectEnd);
  }

  //</FUNCTIONS>==============================================================================
});

// Вывод наслоения дел на таблицу полного расписания
let btnFullScreen = document.querySelector('#btnFullScreen4orange');

btnFullScreen.addEventListener('click', () => {
  let checkedUsers = document.querySelectorAll('.checkBusyBtn.bi-check-square-fill');
  let localStorageID = getLocalStorageData('todoID') || [];
  let idArray = [];
  let finalArray = [];

  closeTodoLayers(
    document.querySelector('#full').querySelector('#tableScheduleBodyFull')
  );

  if (checkedUsers.length && localStorageID.length) {
    checkedUsers.forEach((user) => {
      idArray.push(user.parentElement.attributes.id.value);
    });

    finalArray = idArray.filter((element) => localStorageID.includes(element));

    setTimeout(() => {
      closeTodoLayers(
        document.querySelector('#full').querySelector('#tableScheduleBodyFull')
      );

      finalArray.forEach((id) => {
        loadTodoLayers(
          document.querySelector('#full').querySelector('#tableScheduleBodyFull'),
          id
        );
      });

      let tableFullLayers = document.querySelector('#full').querySelectorAll('.layers');

      tableFullLayers.forEach((layer) => {
        layer.style.paddingTop = `24.11px`;
      });
    }, 150);
  }
});

//<FUNCTIONS>==============================================================================

//<Наслоение дел>==============================================================================

export async function loadTodoLayers(table, id) {
  const colors = {
    rest: {
      color: 'rgb(243, 255, 255)',
      dark: 'rgb(135, 174, 174)',
    },
    personal: {
      color: 'rgb(252, 240, 252)',
      dark: 'rgb(171, 142, 171)',
    },
    work: {
      color: 'rgb(255, 233, 214)',
      dark: 'rgb(211, 165, 125)',
    },
    // LemonChiffon: {
    //     color: 'rgb(255, 251, 216)',
    //     dark: 'rgb(204, 170, 71)'
    // },
  };

  // Генерируем контейнер для слоев
  let layersHtml = /* html */ `
    <div class="layers">
      <div class="layers__body">

      </div>
    </div>
  `;

  layersHtml = parser.parseFromString(layersHtml, 'text/html').querySelector('.layers');
  layersHtml.dataset.id = id;
  table.append(layersHtml);

  table.style.position = 'relative';

  let layersBody = table.querySelector(`.layers[data-id="${id}"]`).querySelector('.layers__body');

  // Расчет padding-left у layers__body
  if (window.innerWidth <= 573) {
    layersBody.style.paddingLeft = table.querySelector('tr').children[0].getBoundingClientRect().width + 'px';
  } else {
    layersBody.style.paddingLeft = "9%";
  }
  
  // Динамический padding-left у layers__body
  window.addEventListener('resize', function () {
    if (window.innerWidth <= 573) {
      layersBody.style.paddingLeft = table.querySelector('tr').children[0].getBoundingClientRect().width + 'px';
    } else {
      layersBody.style.paddingLeft = "9%";
    }
  });

  if (await idFolderExist(id)) {
    let response = await fetch('api/todo.json', {
      method: 'POST',
    });

    if (response.ok) {
      let todoJson = await response.json(),
        userTodo = todoJson.todo[id];

      // Высота 1й минуты (в px)
      const oneMinuteHeight = table.querySelector('tbody').children[0].getBoundingClientRect().height / 30;

      for (let i = 0; i < userTodo.length; i++) {
        const item = userTodo[i];

        // Расчет высоты наслоения
        let [endTimeHour, endTimeMinutes] = splitTimeString(item.endTime);
        let [startTimeHour, startTimeMinutes] = splitTimeString(item.startTime);
        let layerHeight = ((endTimeHour - startTimeHour) * 60 + (endTimeMinutes - startTimeMinutes)) * oneMinuteHeight;

        // Расчет отступа сверху (значение top)
        let [firstTimeHour, firstTimeMinutes] = splitTimeString(
          timeSetting.start
        );

        let topValue = ((startTimeHour - firstTimeHour) * 60 + (startTimeMinutes - firstTimeMinutes)) * oneMinuteHeight;
        
        // Расчет множителя для отступа слева (для margin-left)
        let marginLeftValue = 12.99;

        // Расчет отступа слева (значение margin-left)
        switch (item.day) {
          case 'Понедельник':
            marginLeftValue = 0;
            break;
        
          case 'Вторник':
            marginLeftValue *= 1;
            break;
        
          case 'Среда':
            marginLeftValue *= 2;
            break;
        
          case 'Четверг':
            marginLeftValue *= 3;
            break;
        
          case 'Пятница':
            marginLeftValue *= 4;
            break;
        
          case 'Суббота':
            marginLeftValue *= 5;
            break;
        
          case 'Воскресенье':
            marginLeftValue *= 6;
            break;
        }

        let colorsValue = colors[item.type];

        layersBody.innerHTML += /*html*/`
          <div class="layers__item layers-item ${+item.checked ? '_checked' : ''}" 
            style="
              z-index: ${i + 1};
              height: ${layerHeight - 4}px;
              top: ${topValue}px;
              margin-left: ${marginLeftValue}%;
            "
            data-tippy-content="
              <span>${item.startTime} - ${item.endTime}</span>
              <br>
              <span style='word-break: break-all;'>${item.description}</span>
            "
          >
            <div class="layers-item__body"
              style="
                background-color: ${colorsValue.color} !important; 
                box-shadow: 0 4px 0 ${colorsValue.dark} !important;
                border: 1.5px solid ${colorsValue.dark} !important; 
                border-bottom: none !important;
              "
            >
              <div class="layers-item__time">
                <i class="bi bi-clock"></i>
                <span>${item.startTime}</span>
              </div>
              <div class="layers-item__description">${item.description}</div>
            </div>
          </div>
        `;

      }
      
      tippy("[data-tippy-content]", {
        allowHTML: true,
        theme: 'light-border',
        placement: 'right',
        followCursor: 'vertical',
        maxWidth: 180,
        duration: [500, 0],
      });
      
    } else {
      showAlert('error');
    }
  }
}

export function closeTodoLayers(table) {
  let layers = table.querySelectorAll('.layers');
  if (layers.length != 0) {
    for (let i = 0; i < layers.length; i++) {
      layers[i].remove();
    }
  }
}

//</Наслоение дел>==============================================================================

async function idFolderExist(id) {
  let response = await fetch('api/todo.json', {
    method: 'POST',
  });

  if (response.ok) {
    let answer = await response.json();

    if (answer.todo[id]) {
      return true;
    } else {
      return false;
    }
  }
}

function formValidate(form) {
  let error = 0;
  let formReq = form.querySelectorAll('._req');

  for (let i = 0; i < formReq.length; i++) {
    const input = formReq[i];
    formRemoveError(input);

    if (input.value === '') {
      formAddError(input);
      error++;
    }
  }

  return error;
}

function formAddError(input) {
  if (!input.classList.contains('_error')) {
    input.classList.add('_error');
  }
}

function formRemoveError(input) {
  if (input.classList.contains('_error')) {
    input.classList.remove('_error');
  }
}

function splitTimeString(string) {
  let splited = string.split(':'),
    hours = +splited[0],
    minutes = +splited[1];

  return [hours, minutes];
}

function setLocalStorageData(name, data) {
  localStorage.setItem(name, JSON.stringify(data));
}

export function getLocalStorageData(name) {
  return JSON.parse(localStorage.getItem(name));
}

function showAlert(type) {
  switch (type) {
    case 'error':
      alerter(
        '<span trans="text+:AlertErrorHeader;">Ошибка</span>',
        '<div trans="text+:ErrorGo;" style="text-indent: 0;">Что-то пошло не так. Повторите вашу попытку позже</div>',
        'standart',
        'danger',
        'slim'
      );
      break;
      
    case 'form':
      alerter(
        '<span trans="text+:Danger">Внимание</span>',
        '<div trans="text+:FillRequired" style="text-indent: 0;">Заполните обязательные поля</div>',
        'standart',
        'warning',
        'slim'
      );
      break;
  }
}

//</FUNCTIONS>==============================================================================