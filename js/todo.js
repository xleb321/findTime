import { Translate } from './translator.js';
import { alerter } from './main.js';
import { getDataFrom } from './extend.js';
import { saveDataTo } from './main.js';
import { toDoOn } from './main.js';

export function todoIsActive() {
  return toDoOn;
}

// Настройка времени
const timeSetting = {
  start: '08:00',
  end: '20:00',
  step: '0:30',
};

const days = {
  1: 'Пн',
  2: 'Вт',
  3: 'Ср',
  4: 'Чт',
  5: 'Пт',
  6: 'Сб',
  7: 'Вс',
};

const colors = {
  work: {
    color: 'rgb(255, 233, 214)',
    dark: 'rgb(211, 165, 125)',
  },
  work_s: {
    color: 'rgb(114, 187, 194)',
    dark: 'rgb(75, 126, 128)',
  },
  personal: {
    color: 'rgb(211, 202, 219)',
    dark: 'rgb(148, 111, 148)',
  },
  free: {
    color: 'rgb(144, 238, 144)',
    dark: 'rgb(55, 173, 95)',
  },
};

let parser = new DOMParser(); // HTML-парсер

if (todoIsActive()) {
  let btnTodo = document.querySelector('#btnTodo');

  // Инициализация данных в localStorage (по умолчанию)
  if (
    sessionStorage.getItem('globalAccess') != 7 &&
    localStorage.getItem('todo') === null
  ) {
    localStorage.setItem('todo', '{"todo": {}}');
  }

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
                <option trans="text+:WeekDay;" value="">День</option>
                <option trans="text+:Mon;" value="1">Пн</option>
                <option trans="text+:Tue;" value="2">Вт</option>
                <option trans="text+:Wed;" value="3">Ср</option>
                <option trans="text+:Thu;" value="4">Чт</option>
                <option trans="text+:Fri;" value="5">Пт</option>
                <option trans="text+:Sat;" value="6">Сб</option>
                <option trans="text+:Sun;" value="7">Вс</option>
              </select>
              <select name="start" id="todoStartTime" tabindex="2" class="todo-form__select _req">
                <option trans="text+:Beginning;" value="">Начало</option>
              </select>
              <select name="end" id="todoEndTime" tabindex="3" class="todo-form__select _req">
                <option trans="text+:Fin;" value="">Конец</option>
              </select>
              <select name="todoType" id="todoType" tabindex="4" class="todo-form__select _req">
                <option trans="text+:TypeEmployment;" value="">Тип</option>
                <option trans="text+:Work_r;" value="work">Постоянно</option>
				        <option trans="text+:Work_s;" value="work_s">Разово</option>
                <option trans="text+:Personal;" value="personal">Личное</option>
                <option trans="text+:FreeDO;"  value="free">Свободно</option>
              </select>
            </div>
            <div class="todo-form__footer">
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
            </div>
          </form>
        </div>
        <div class="todo__filters todo-filters">
          <div data-day="0" trans="text+:All;" class="todo-filters__filter _active">Все</div>
          <div data-day="1" trans="text+:Mon;" class="todo-filters__filter">Пн</div>
          <div data-day="2" trans="text+:Tue;" class="todo-filters__filter">Вт</div>
          <div data-day="3" trans="text+:Wed;" class="todo-filters__filter">Ср</div>
          <div data-day="4" trans="text+:Thu;" class="todo-filters__filter">Чт</div>
          <div data-day="5" trans="text+:Fri;" class="todo-filters__filter">Пт</div>
          <div data-day="6" trans="text+:Sat;" class="todo-filters__filter">Сб</div>
          <div data-day="7" trans="text+:Sun;" class="todo-filters__filter">Вс</div>
        </div>
        <div class="todo__deals todo-deals">
          <div class="todo-deals__items" id="todoDealsBody">
            <!-- <div class="todo-deals__empty">
                <span>Список дел пуст...</span>
            </div> -->
          </div>
        </div>

        <div class="todo__btns todo-btns">
          <div class="todo-btns__left">
            <button class="todo-btns__button todo-btns__delete"
              id="todoDeleteAll"
              tabindex="9"
              title="Удалить все дела"
            >
              <i class="bi bi-eraser-fill" style="color: indianred"></i>
            </button>
            <div class="todo__checkbox">
          		<label>
            	  <input id="todoCheckbox" data-id="${userId}" type="checkbox" class="form-check-input" tabindex="8">
            	  <span trans="text+:DisplaySchedule">Показывать в расписании</span>
          		</label>
        	  </div>
          </div>
          <div class="todo-btns__right">
            <button trans="text+:Close;"
              class="todo-btns__button todo-btns__escape"
              id="todoClose"
              tabindex="10"
            >
              Закрыть
            </button>
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
        maxSymbols,
      );
    });

    // Обновление селектов (убираем лишнее время)
    selectEndTime.addEventListener('change', () => {
      let selectStartValue = selectStartTime.value;
      selectStartUpdate(timeline, selectStartTime, selectEndTime);

      Array.from(selectStartTime.children).forEach(option => {
        if (option.value == selectStartValue) {
          option.setAttribute('selected', '');
        }
      });
    });

    selectStartTime.addEventListener('change', () => {
      let selectEndValue = selectEndTime.value;
      selectEndUpdate(timeline, selectStartTime, selectEndTime);

      Array.from(selectEndTime.children).forEach(option => {
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

      if (localStorageID.length) {
        if (localStorageID.includes(checkboxID)) {
          if (!todoCheckbox.checked) {
            todoCheckbox.checked = true;
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
        if (!localStorageID.length) {
          localStorageID.push(checkboxID);
          setLocalStorageData('todoID', localStorageID);
        } else {
          alerter(
            '<span trans="text+:Danger">Внимание</span>',
            '<div trans="text+:TodoIsAlreadyDisplayed;" style="text-indent: 0;">Список дел другого(их) пользователей уже выводится в расписание</div>',
            'standart',
            'info',
            'slim',
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
        if (confirm('Вы уверены, что хотите удалить дело?')) {
          deleteTodoItem(deleteBtn.dataset.id, userId);
        }
      }

      // Удаление всех дел сразу
      if (targetElement.closest('#todoDeleteAll')) {
        if (confirm('Вы уверены, что хотите удалить все дела?')) {
          todoDeleteAll(userId);
        }
      }

      // Закрытие списка дел
      if (targetElement.closest('#todoClose')) {
        closeTodoLayers(
          btnTodo.closest('.modal-content').children[2].children[0],
        );
        isLayersCanBeDisplayed(
          btnTodo.closest('.modal-content').children[2].children[0],
          [userId],
          'any',
          loadTodoLayers,
        );

        closeTodoWindow();
      }

      // Редактирование дела
      if (
        targetElement.closest('.todo-buttons__edit') ||
        targetElement.closest('.todo-item__info')
      ) {
        let editBtn =
          targetElement.closest('.todo-buttons__edit') ??
          targetElement.closest('.todo-item__info');
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

      // Фильтр
      if (targetElement.closest('.todo-filters__filter')) {
        let currentFilter = targetElement.closest('.todo-filters__filter');
        if (!currentFilter.classList.contains('_active')) {
          // Убираем стили с бывшего "активного" фильтра
          document
            .querySelector('.todo-filters__filter._active')
            .classList.remove('_active');
          currentFilter.classList.add('_active'); // Делаем "активным" выбранный день

          loadTodo(userId, currentFilter.dataset.day);
        }
      }
    }

    async function todoAddItem(e) {
      e.preventDefault();

      let errors = formValidate(todoForm);

      if (errors === 0) {
        todoForm.classList.add('_sending');

        let todoJson = getTodoJSON();

        if (todoJson.todo) {
          // Если у id нет созданных дел - создаем пустую 'папку'
          if (!idFolderExist(todoJson, userId)) {
            todoJson.todo[userId] = [];
          }

          // Определение ID элемента
          let maximum = 0,
            todoId;
          let userTodo = todoJson.todo[userId];

          if (userTodo.length) {
            for (let i = 0; i < userTodo.length; i++) {
              const todo = userTodo[i];

              if (+todo.id > maximum) {
                maximum = +todo.id;
              }
            }

            todoId = +maximum + 1;
          } else {
            todoId = 1;
          }

          let formData = new FormData(todoForm);

          todoJson.todo[userId].push({
            id: todoId,
            day: formData.get('day'),
            startTime: formData.get('start'),
            endTime: formData.get('end'),
            description: formData.get('description'),
            type: formData.get('todoType'),
            checked: '0',
          });

          saveTodoJSON(todoJson);

          todoForm.reset();
          changeDescriptionLimit(todoDescription, 0, maxSymbols);
          generateSelectStartTime(timeline, selectStartTime);
          generateSelectEndTime(timeline, selectEndTime);
          loadTodo(userId);
          todoForm.classList.remove('_sending');
        } else {
          showAlert('error');
        }
      } else {
        showAlert('form');
      }
    }

    async function loadTodo(
      id,
      filteredDay = +document.querySelector('.todo-filters__filter._active')
        .dataset.day,
    ) {
      filteredDay = +filteredDay;

      let todoJson = getTodoJSON();

      if (todoJson.todo) {
        let userJson = todoJson.todo[id];

        // Если есть папка и дела
        if (userJson && userJson.length) {
          todoDealsBody.innerHTML = '';

          if (filteredDay) {
            userJson = userJson.filter(item => +item.day === filteredDay);
          }

          userJson.sort((a, b) => {
            return (
              a.day.localeCompare(b.day) ||
              a.startTime.localeCompare(b.startTime)
            );
          });

          if (userJson.length) {
            for (let i = 0; i < userJson.length; i++) {
              const item = userJson[i];

              todoDealsBody.innerHTML += /* html */ `
              <div class="todo-deals__item todo-item" data-id="${item.id}">
                <div class="todo-item__body" style="border-bottom: 0.18em solid ${
                  colors[item.type]['dark']
                }">
                  <div class="todo-item__checkbox ${
                    +item.checked ? '_checked' : ''
                  }" 
                    data-id="${item.id}" 
                    title="${+item.checked ? 'Выполнено' : 'Невыполнено'}"
                  >
                    <i class="bi bi-check-lg"></i>
                  </div>
                  <div class="todo-item__content">
  
                      <div class="todo-item__info todo-info" style="cursor: pointer;"
                        data-id="${item.id}"
                        data-day="${item.day}"
                        data-starttime="${item.startTime}"
                        data-endtime="${item.endTime}"
                        data-description="${item.description}"
                        data-type="${item.type}"
                      >
                        <div class="todo-info__date">
                          <span class="todo-info__item todo-info__day">${
                            days[item.day]
                          }</span>
                          <span class="todo-info__item todo-info__time">
                            ${item.startTime} - ${item.endTime}
                          </span>
                        </div>
                        <div class="todo-item__description">
                          ${item.description}
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
                        <div class="todo-buttons__btn todo-buttons__del" data-id="${
                          item.id
                        }" title="Удалить дело">
                          <i class="bi bi-trash"></i>
                        </div>
                      </div>
  
                  </div>
                </div>
              </div>
            `;
            }
          } else {
            todoDealsBody.innerHTML = /* html */ `
            <div class="todo-deals__empty">
              <span>Пусто...</span>
            </div>
          `;
          }
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

    async function checkTodoItem(checkbox, userId) {
      let todoJson = getTodoJSON();
      let todoId = checkbox.dataset.id;

      if (todoJson.todo) {
        let userTodo = todoJson.todo[userId];

        for (let i = 0; i < userTodo.length; i++) {
          const item = userTodo[i];

          if (item.id == todoId) {
            if (+item.checked) {
              item.checked = '0';
              checkbox.title = 'Невыполнено';
            } else {
              item.checked = '1';
              checkbox.title = 'Выполнено';
            }

            saveTodoJSON(todoJson);
            let data = getTodoJSON().todo[userId];
          }
        }
      } else {
        showAlert('error');
      }
    }

    async function deleteTodoItem(todoId, userId) {
      let todoJson = getTodoJSON();

      if (todoJson.todo) {
        let userTodo = todoJson.todo[userId];

        for (let i = 0; i < userTodo.length; i++) {
          const item = userTodo[i];

          if (item.id == todoId) {
            userTodo.splice(i, 1);
          }
        }

        saveTodoJSON(todoJson);
        loadTodo(userId);
      } else {
        showAlert('error');
      }
    }

    async function todoDeleteAll(userId) {
      let todoJson = getTodoJSON();

      if (todoJson.todo) {
        if (idFolderExist(todoJson, userId)) {
          delete todoJson.todo[userId];
          saveTodoJSON(todoJson);
          loadTodo(userId);
        }
      } else {
        showAlert('error');
      }
    }

    function todoEditItem(userId, data) {
      // Генерируем окно редактирования дела
      let editPopupHtml = /* html */ `
      <div class="todo__edit todo-edit">
        <div class="todo-edit__body">
          <div class="todo-edit__content">
            <div trans="text+:EditingСase;" class="todo-edit__title">Редактирование дела</div>
            <div class="todo-edit__options">
              <form action="#" class="todo-edit__form edit-form" id="todoEditForm">
                <div class="edit-form__selects">
                  <select name="editedDay" id="editedDayOfWeek" tabindex="11" class="edit-form__select _req">
                    <option trans="text+:WeekDay;" value="">День</option>
                    <option trans="text+:Mon;" value="1">Пн</option>
                    <option trans="text+:Tue;" value="2">Вт</option>
                    <option trans="text+:Wed;" value="3">Ср</option>
                    <option trans="text+:Thu;" value="4">Чт</option>
                    <option trans="text+:Fri;" value="5">Пт</option>
                    <option trans="text+:Sat;" value="6">Сб</option>
                    <option trans="text+:Sun;" value="7">Вс</option>
                  </select>
                  <select name="editedStart" id="editedStartTime" tabindex="12" class="edit-form__select _req">
                    <option trans="text+:Beginning" value="">Начало</option>
                  </select>
                  <select name="editedEnd" id="editedEndTime" tabindex="13" class="edit-form__select _req">
                    <option trans="text+:Fin;" value="">Конец</option>
                  </select>
                  <select name="editedTodoType" id="editedTodoType" tabindex="14" class="edit-form__select _req">
                    <option trans="text+:TypeEmployment" value="">Тип</option>
                    <option trans="text+:Work_r;"  value="work">Работа рег.</option>
                    <option trans="text+:Work_s;" value="work_s">Работа раз.</option>
                    <option trans="text+:Personal;" value="personal">Личное</option>
                    <option trans="text+:FreeDO;"  value="free">Свободно</option>
                  </select>
                </div>
                <div class="edit-form__textarea" data-symbols="">
                  <textarea name="editedDescription" id="editedDescription" tabindex="15" class="_req" placeholder="Описание" maxlength=""></textarea>
                </div>
                <div class="edit-form__btns edit-buttons">
                  <div class="edit-buttons__left">
                    <button class="edit-buttons__btn edit-buttons__submit" tabindex="16" type="submit">
                      <i class="bi bi-save"></i>
                      <span trans="text+:Save">Сохранить</span>
                    </button> 
                    <button class="edit-buttons__btn edit-buttons__reset" tabindex="17" type="reset">
                      <i class="bi bi-arrow-repeat"></i>
                      <span trans="text+:ThrowOff">Сбросить</span>
                    </button>
                  </div>
                  <div class="edit-buttons__right">
                    <button class="edit-buttons__btn edit-buttons__escape" tabindex="18" type="button">
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
          maxSymbols,
        );
      });

      // Обновление селектов при их измененении (убираем лишнее время)
      editedSelectEndTime.addEventListener('change', () => {
        let editedSelectStartValue = editedSelectStartTime.value;
        selectStartUpdate(timeline, editedSelectStartTime, editedSelectEndTime);

        Array.from(editedSelectStartTime.children).forEach(option => {
          if (option.value == editedSelectStartValue) {
            option.setAttribute('selected', '');
          }
        });
      });

      editedSelectStartTime.addEventListener('change', () => {
        let editedSelectEndValue = editedSelectEndTime.value;
        selectEndUpdate(timeline, editedSelectStartTime, editedSelectEndTime);

        Array.from(editedSelectEndTime.children).forEach(option => {
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
        maxSymbols,
      );

      editedDaySelect.value = +data.day;
      editedTypeSelect.value = data.type;

      editedSelectStartTime.value = data.startTime;
      editedSelectEndTime.value = data.endTime;

      selectStartUpdate(timeline, editedSelectStartTime, editedSelectEndTime);

      Array.from(editedSelectStartTime.children).forEach(option => {
        if (option.value == data.startTime) {
          option.setAttribute('selected', '');
        }
      });

      selectEndUpdate(timeline, editedSelectStartTime, editedSelectEndTime);

      Array.from(editedSelectEndTime.children).forEach(option => {
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

          let todoJson = getTodoJSON();

          if (todoJson.todo) {
            let userTodo = todoJson.todo[userId];
            let formData = new FormData(todoEditForm);

            for (let i = 0; i < userTodo.length; i++) {
              const item = userTodo[i];

              if (item.id == data.id) {
                item.day = formData.get('editedDay');
                item.startTime = formData.get('editedStart');
                item.endTime = formData.get('editedEnd');
                item.description = formData.get('editedDescription');
                item.type = formData.get('editedTodoType');
                break;
              }
            }

            saveTodoJSON(todoJson);

            todoForm.classList.remove('_sending');
            closeEditPopup();
            loadTodo(userId);
          } else {
            showAlert('error');
          }
        } else {
          showAlert('form');
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
      const textareaParent = textarea.parentNode;
      textareaParent.dataset.symbols = `${left}/${right}`;

      if (
        textarea.value.length >= maxSymbols / 2 &&
        textarea.value.length != maxSymbols
      ) {
        if (textareaParent.classList.contains('_red')) {
          textareaParent.classList.remove('_red');
        }

        if (!textareaParent.classList.contains('_yellow')) {
          textareaParent.classList.add('_yellow');
        }
      } else if (textarea.value.length == maxSymbols) {
        if (textareaParent.classList.contains('_yellow')) {
          textareaParent.classList.remove('_yellow');
        }

        if (!textareaParent.classList.contains('_red')) {
          textareaParent.classList.add('_red');
        }
      } else {
        if (textareaParent.classList.contains('_yellow')) {
          textareaParent.classList.remove('_yellow');
        }

        if (textareaParent.classList.contains('_red')) {
          textareaParent.classList.remove('_red');
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
          timeline[timeline.length - 1],
        );

        /* Работаем с минутами */
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

        if (newHour < 10) {
          newHour = `0${newHour}`;
        }

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

      return timeline;
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
      let newEndTimeline = timeline.slice(selectStartValueIndex + 1);

      generateSelectEndTime(newEndTimeline, selectEnd);
    }

    //</FUNCTIONS>==============================================================================
  });

  // Вывод наслоения дел на таблицу полного расписания
  let btnFullScreen = document.querySelector('#btnFullScreen4orange');

  btnFullScreen.addEventListener('click', () => {
    let checkedUsers = document.querySelectorAll(
      '.checkBusyBtn.bi-check-square-fill',
    );
    let localStorageID = getLocalStorageData('todoID') || [];
    let idArray = [];
    let finalArray = [];

    closeTodoLayers(
      document.querySelector('#full').querySelector('#tableScheduleBodyFull'),
    );

    if (checkedUsers.length && localStorageID.length) {
      checkedUsers.forEach(user => {
        idArray.push(user.parentElement.attributes.id.value);
      });

      finalArray = idArray.filter(element => localStorageID.includes(element));

      setTimeout(() => {
        loadTodoLayers(
          document
            .querySelector('#full')
            .querySelector('#tableScheduleBodyFull'),
          finalArray,
        ).then(() => {
          let tableFullLayers = document
            .querySelector('#full')
            .querySelectorAll('.layers');

          tableFullLayers.forEach(layer => {
            layer.style.paddingTop = `24.11px`;
          });
        });
      }, 200);
    }
  });
}

//<FUNCTIONS>==============================================================================

//<Наслоение дел>==============================================================================

export async function loadTodoLayers(table, idArray, todoTypes = 'any') {
  if (todoIsActive()) {
    let btnClose =
      table.querySelector('.btn-close') ||
      table.closest('.modal-content').querySelector('.btn-close');
    btnClose.addEventListener('click', close);

    function close() {
      closeTodoLayers(table);
      btnClose.removeEventListener('click', close);
    }

    // Обнуляем стиль кнопки "Скрыть дела"
    document
      .getElementById('onOffTask')
      .children[0].setAttribute('class', 'bi bi-eye-slash-fill');

    for (let id of idArray) {
      // Генерируем контейнер для слоев
      let layersHtml = /* html */ `
      <div class="layers">
        <div class="layers__body">
        </div>
      </div>
    `;

      layersHtml = parser
        .parseFromString(layersHtml, 'text/html')
        .querySelector('.layers');
      layersHtml.dataset.id = id;
      table.append(layersHtml);

      table.style.position = 'relative';

      let layersBody = table
        .querySelector(`.layers[data-id="${id}"]`)
        .querySelector('.layers__body');

      layersBody.style.paddingLeft = '9%';

      let todoJson = getTodoJSON();

      if (todoJson.todo) {
        let userTodo = todoJson.todo[id];

        if (userTodo) {
          // Вывод слоёв только свободного времени
          if (todoTypes === 'free') {
            userTodo = userTodo.filter(todo => todo.type === 'free');
          }

          // Высота 1й минуты (в px)
          const oneMinuteHeight =
            table.querySelector('tbody').children[0].getBoundingClientRect()
              .height / 30;

          userTodo.forEach((item, index) => {
            // Расчет высоты наслоения (в px)
            let [endTimeHour, endTimeMinutes] = splitTimeString(item.endTime);
            let [startTimeHour, startTimeMinutes] = splitTimeString(
              item.startTime,
            );
            let layerHeight =
              ((endTimeHour - startTimeHour) * 60 +
                (endTimeMinutes - startTimeMinutes)) *
                oneMinuteHeight -
              4;

            // Расчет отступа сверху (значение top, в px)
            let [firstTimeHour, firstTimeMinutes] = splitTimeString(
              timeSetting.start,
            );

            let topValue =
              ((startTimeHour - firstTimeHour) * 60 +
                (startTimeMinutes - firstTimeMinutes)) *
              oneMinuteHeight;

            // Переводим layerHeight и topValue в %
            layerHeight = (layerHeight / table.offsetHeight) * 100;
            topValue = (topValue / table.offsetHeight) * 100;

            // Множитель для отступа слева (для margin-left)
            let marginLeftValue = 12.99;

            // Расчет отступа слева (значение margin-left)
            switch (item.day) {
              case '1':
                marginLeftValue = 0;
                break;

              case '2':
                marginLeftValue *= 1;
                break;

              case '3':
                marginLeftValue *= 2;
                break;

              case '4':
                marginLeftValue *= 3;
                break;

              case '5':
                marginLeftValue *= 4;
                break;

              case '6':
                marginLeftValue *= 5;
                break;

              case '7':
                marginLeftValue *= 6;
                break;
            }

            let colorsValue = colors[item.type];

            layersBody.innerHTML += /*html*/ `
            <div class="layers__item layers-item ${
              +item.checked ? '_checked' : ''
            }" 
              style="
                z-index: ${index + 1};
                height: ${layerHeight}%;
                top: ${topValue}%;
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
          });

          tippy('[data-tippy-content]', {
            allowHTML: true,
            theme: 'light-border',
            placement: 'right',
            followCursor: 'vertical',
            maxWidth: 180,
            duration: [500, 0],
          });
        }
      } else {
        showAlert('error');
      }
    }
  }
}

export function closeTodoLayers(table) {
  if (todoIsActive()) {
    let layers = table.querySelectorAll('.layers');
    if (layers.length) {
      for (let i = 0; i < layers.length; i++) {
        layers[i].remove();
      }
    }
  }
}

export function isLayersCanBeDisplayed(
  table,
  idArray,
  todoType = 'any',
  callback,
) {
  if (todoIsActive()) {
    let localStorageID = getLocalStorageData('todoID') || [];
    let call = false;

    for (let id of idArray) {
      call = localStorageID.includes(id);
      if (!call) break;
    }

    if (call) callback(table, idArray, todoType);
  }
}

//</Наслоение дел>==============================================================================

function getTodoJSON() {
  return (
    JSON.parse(
      getDataFrom(
        sessionStorage.getItem('typeBase'),
        sessionStorage.getItem('globalLogin'),
        'todo',
      ),
    ) || {}
  );
}

function saveTodoJSON(json) {
  saveDataTo(
    sessionStorage.getItem('typeBase'),
    sessionStorage.getItem('globalLogin'),
    'todo',
    JSON.stringify(json),
  );
}

function idFolderExist(json, id) {
  return json.todo[id];
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

function getLocalStorageData(name) {
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
        'slim',
      );
      break;

    case 'form':
      alerter(
        '<span trans="text+:Danger">Внимание</span>',
        '<div trans="text+:FillRequired" style="text-indent: 0;">Заполните обязательные поля</div>',
        'standart',
        'warning',
        'slim',
      );
      break;
  }
}

if (todoIsActive()) {
  // Логика кнопки "Скрыть дела"
  let onOffTasks = document.getElementById('onOffTask');
  let layers = document.getElementsByClassName('layers');

  onOffTasks.addEventListener('click', () => {
    if (onOffTasks.children[0].classList.contains('bi-eye-slash-fill')) {
      for (let layer of layers) {
        layer.style.visibility = 'hidden';
      }
      onOffTasks.children[0].classList.remove('bi-eye-slash-fill');
      onOffTasks.children[0].classList.add('bi-eye-fill');
    } else {
      for (let layer of layers) {
        layer.style.visibility = 'visible';
      }
      onOffTasks.children[0].classList.add('bi-eye-slash-fill');
      onOffTasks.children[0].classList.remove('bi-eye-fill');
    }
  });
}

//</FUNCTIONS>==============================================================================
