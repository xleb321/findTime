import { Translate } from './translator.js';
import { alertEmptyStart, export2net, fullBreif } from './extend.js';
import {
  loadTodoLayers,
  closeTodoLayers,
  isLayersCanBeDisplayed,
  todoIsActive,
} from './todo.js';

const body = document.querySelector('body');
const nbts = document.querySelector('.nbts');
const nbtc = document.querySelector('.nbtc');
const nbtct = document.querySelector('.nbtct');
const nbtcl = document.querySelector('.nbtcl');
const creatingButton = document.getElementById('create');
const showingCodeButton = document.getElementById('showingCodeButton');

// const userSelect = document.getElementById("userSelector");
const selectCourse = document.getElementById('courseSelector');
const selectLevel = document.getElementById('levelSelector');
const fullName = document.getElementById('YourName');
const nobodyIsSelected = document.getElementById('nobody');
const nocourseIsSelected = document.getElementById('nocourse');
const nolevelIsSelected = document.getElementById('nolevel');
// const autoLoadElement = document.getElementById("autoLoad");
const studentTableDiv = document.getElementById('nav-profile');
const businessTableDiv = document.getElementById('nav-contact');
const timeSelector = document.getElementById('timeSelect');
const timeSelectorSpan = document.getElementById('timeSelectSpan');
const selectCourseSpan = document.getElementById('courseSelectorSpan');
const selectLevelSpan = document.getElementById('levelSelectorSpan');
const strCourseLevel = document.getElementById('strCourseLevel');

// const gradeTextArea = document.getElementById("gradeTextArea");
// const courseTextArea = document.getElementById("courseTextArea");
const gradeSubmittingButton = document.getElementById('gradeNameSubmit');
const courseSubmittingButton = document.getElementById('courseNameSubmit');
const scheduleLoadingCheckBox = document.getElementById('scheduleLoaded');

const param1name = document.getElementById('Param1Name');
const param2name = document.getElementById('Param2Name');

const scheduleAutoSavingCheckBox = document.getElementById('scheduleAutoSaved');
const importInput = document.getElementById('importInput');
const importButton = document.getElementById('importButton');
let loading = JSON.parse(localStorage.getItem('schedule-loading')) || false;
let autoSaving =
  JSON.parse(localStorage.getItem('schedule-auto-saving')) || false;
let dayWeek = document.getElementsByClassName('allday');
let allColor = 'transparent';
let currentCourse;
let currentLevel;
let users = [];
let sortedUsers = [];
let sortedFilteredUsers = [];
let currUser;
let currentUsers = [];
let business = [];
let sortedBusiness = [];
let currBusiness;
// let scheduleIsLoaded = false;
let usersToDisplay = [];
let businessToDisplay = [];
let allMatches = [];
let courses = [];
let grades = [];
let toDoMy = [];
let filteredCourses = [];
let filteredGrades = [];
let filteredUsers = [];
let gradeText;
let courseText;
const colorStudent = [
  'PaleGreen',
  'MediumAquamarine',
  'DarkSeaGreen',
  'LightCyan',
  'PaleTurquoise',
  'Beige',
  'PowderBlue',
  'LightBlue',
  'LightSkyBlue',
  'Thistle',
  'LightYellow',
  'PapayaWhip',
  'PeachPuff',
  'MistyRose',
  'Wheat',
  'Lavender',
  'LightPink',
  'LemonChiffon',
]; // Oleg
let cndCoincid = 0; // Oleg
let numberStudent = 0; // Oleg
export const toDoOn = true; // Oleg
export const showCanceledTodos = false; // Oleg

function getRandomColor(min, max) {
  min = Math.ceil(0);
  max = Math.floor(colorStudent.length);
  return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
}

function allDaySelect(thisy) {
  let curDayWeek = thisy.getAttribute('lock');
  if (thisy.checked) allColor = 'seagreen';
  else allColor = 'transparent';
  let allDay = document
    .querySelector('.modal-content')
    .getElementsByClassName(curDayWeek); //колонка
  for (let i = 0; i < allDay.length; i++) {
    allDay[i].style.background = allColor;
  }
  document.getElementById('importInput').value = fCompressCodeTime(
    getTimeCode(),
  );
}

function checkDec() {
  let binDay = [];
  let decDay = [];

  for (let i = 0; i < 7; i++) {
    let curObjDay = '.day' + String(i);
    let curDay = document
      .querySelector('.modal-content')
      .querySelectorAll(curObjDay);
    binDay[i] = '1';
    decDay[i] = 0;
    curDay.forEach(dv => {
      if (dv.style.background !== 'transparent') binDay[i] += '1';
      else binDay[i] += '0';
    });
    decDay[i] = Number.parseInt(binDay[i], 2);
  }

  return {
    decDay,
    binDay,
  };
}

function toBinArray(currentUser) {
  let decArray = currentUser.days;
  let binArray = [];

  decArray.forEach(item => binArray.push(item.toString(2)));

  return binArray;
}

function clearEverything() {
  const url = new URL(window.location.href);
  let strUrl = String(url.searchParams);

  if (strUrl.length > 20) {
    return true;
  }

  fullName.value = '';

  cndCoincid = 0; // Oleg
  numberStudent = 0; // Oleg
  try {
    for (let i = 0; i < 7; i++) {
      let curObjDay = '.day' + String(i);
      let cur = document.querySelectorAll('.tableSchedule');
      cur.forEach(kkk => {
        let curDay = kkk.querySelectorAll(curObjDay);

        curDay.forEach(item => {
          item.style.background = 'transparent';

          if (item.children.length > 0) {
            while (item.firstChild) {
              item.removeChild(item.firstChild);
            }
          }

          let classes = [];
          item.classList.forEach(item => classes.push(item));
          classes.slice(1).forEach(cell => item.classList.remove(cell));

          item.replaceWith(item.cloneNode(true));
        });
      });
    }
  } catch (e) {
    console.log(e.message);
  }

  for (let i = 0; i < 7; i++) {
    let curObjDay = '.day' + String(i);
    let curDay = document
      .querySelector('.modal-content')
      .querySelectorAll(curObjDay);

    curDay.forEach(item => (item.style.background = 'transparent'));
  }

  if (strUrl.indexOf('invite=') == -1) {
    importInput.value = '';
    document.getElementById('loginSendTimeCode').value = '';
  }

  nobodyIsSelected.selected = true;
  nocourseIsSelected.selected = true;
  nolevelIsSelected.selected = true;

  usersToDisplay = [];
  businessToDisplay = [];
  allMatches = [];
  checkOut();
}

function setItems(currentUser, user = true) {
  if (currentUser && user) {
    fullName.value = currentUser.name;

    if (numberStudent > 18) numberStudent = -1; // Oleg
    numberStudent++; // Oleg
    let curColorStudent = colorStudent[numberStudent]; // Oleg

    let binArray = toBinArray(currentUser);

    for (let i = 0; i < 7; i++) {
      let curObjDay = '.day' + String(i);
      let cur = document.querySelectorAll('.tableSchedule');
      cur.forEach(kkk => {
        let curDay = kkk.querySelectorAll(curObjDay);

        for (let j = 0; j < curDay.length; j++) {
          if (binArray[i][j + 1] === '1') {
            curDay[j].classList.add(currentUser.name.replace(/ /g, '%'));

            if (!curDay[j].getAttribute('ids')) {
              curDay[j].setAttribute('ids', currentUser.id);
            } else {
              let temp = Array(curDay[j].getAttribute('ids'));
              temp.push(currentUser.id);
              curDay[j].setAttribute('ids', temp);
            }

            curDay[j].setAttribute('maximum', 0);
            if (curDay[j].style.background === 'transparent') {
              curDay[j].style.background = curColorStudent; // Oleg
            } else if (curDay[j].style.background === 'skyblue') {
              curDay[j].style.background = 'IndianRed';
            } else {
              curDay[j].style.background = 'GreenYellow';
              curDay[j].style.fontSize = '12px';
              curDay[j].style.fontWeight = '500';

              if (curDay[j].children.length === 0) {
                let matching = document.createElement('p');
                matching.innerHTML = 2;
                curDay[j].appendChild(matching);
                curDay[j].addEventListener('click', () => {
                  let temp = [];
                  let ids = curDay[j]
                    .getAttribute('ids')
                    .split(',')
                    .map(Number);
                  curDay[j].classList.forEach(item =>
                    //                                      temp.push(item.replace("%", " "))
                    temp.push(item.replace(/%/g, ' ')),
                  );

                  //alerter(
                  //"<Text trans='text+:MatchTime;'></Text>",
                  //`<div style="margin-top:10px;text-indent:0px;"><Text trans='text+:cntQuery;'>Количество людей в запросе: </Text><b>${usersToDisplay.length}</b><br><Text trans='text+:maxNOM;'>Максимум совпадений по времени: </Text><b>${findBestMatch()[0][0]} (${Math.round(findBestMatch()[0][0] * 100/usersToDisplay.length)}%)<b><div style="margin-top:5px;"><b><Text trans='text+:d1;'>Данные по выбранному времени</Text></b></div><div style="margin-top:5px;><Text trans='text+:MatchTimeText;'></Text><b style="color:#48c2a9">${temp.slice(1).join(", ")}</b></div>
                  //
                  //<div style="margin-top:5px;><Text trans='text+:d2;'></Text><b>${curDay[j].getAttribute("maximum") === "1"?'<Text trans="text+:yes;"></Text>': '<Text trans="text+:no;"></Text>'}</b>
                  //<Text trans='text+:NotMatched;'></Text><b style="color:indianred">${usersToDisplay.filter(user => !ids.includes(user.id)
                  //).map(user => user.name).join(", ")}</b></div>`
                  //                                    );
                  //

                  alerter(
                    "<Text trans='text+:MatchTime;'></Text>",
                    `<div style="margin-top:10px;text-indent:0px;">
                                            <Text trans='text+:cntQuery;'></Text><b>${
                                              usersToDisplay.length
                                            }</b><br>
                                            <Text trans='text+:maxNOM;'></Text><b>${
                                              findBestMatch()[0][0]
                                            }
(${Math.round((findBestMatch()[0][0] * 100) / usersToDisplay.length)}%)

</b><br><div style="margin-top:7px;margin-bottom:7px;"><b><Text trans='text+:d1;'>Данные по выбранному времени</Text></b></div>
                                            <Text trans='text+:MatchTimeText;'><br></Text>
                                                <b style="color:#48c2a9; margin-bottom:7px;">${temp
                                                  .slice(1)
                                                  .join(', ')}</b><br>
                                            <div style="margin-top:7px; margin-bottom:7px"><Text trans='text+:llll;'></Text><b>${
                                              curDay[j].getAttribute(
                                                'maximum',
                                              ) === '1'
                                                ? '<Text trans="text+:yes;"></Text>'
                                                : '<Text trans="text+:no;"></Text>'
                                            }</b></div>
                                            <Text trans='text+:NotMatched;'></Text><b style="color:indianred;">${usersToDisplay
                                              .filter(
                                                user => !ids.includes(user.id),
                                              )
                                              .map(user => user.name)
                                              .join(', ')}</b>
                                        </div>`,
                  );
                });
              } else {
                curDay[j].firstChild.innerHTML =
                  +curDay[j].firstChild.textContent + 1;
              }

              const curMatch = [
                +curDay[j].firstChild.textContent,
                curDay[j].parentNode.id,
                curDay[j].classList[0],
              ];

              if (allMatches.length > 0) {
                const index = allMatches.findIndex(
                  item => item[1] === curMatch[1] && item[2] === curMatch[2],
                );

                if (index === -1) {
                  allMatches.push(curMatch);
                } else {
                  allMatches[index] = curMatch;
                }
              } else {
                allMatches.push(curMatch);
              }
            }
          }
        }
      });
    }
  } else if (currentUser && !user) {
    let binArray = toBinArray(currentUser);

    for (let i = 0; i < 7; i++) {
      let curObjDay = '.day' + String(i);
      let cur = document.querySelectorAll('.tableSchedule');
      cur.forEach(kkk => {
        let curDay = kkk.querySelectorAll(curObjDay);

        for (let j = 0; j < curDay.length; j++) {
          if (binArray[i][j + 1] === '1') {
            if (curDay[j].style.background === 'transparent') {
              curDay[j].style.background = 'Skyblue';
            } else {
              curDay[j].style.background = 'Indianred';
            }
          }
        }
      });
    }
  }
}

function clearTable() {
  debugger;

  for (let i = 0; i < 7; i++) {
    let curObjDay = '.day' + String(i);
    let cur = document.querySelectorAll('.tableSchedule');
    cur.forEach(kkk => {
      let curDay = kkk.querySelectorAll(curObjDay);

      curDay.forEach(item => {
        item.style.background = 'transparent';

        while (item.firstChild) {
          item.removeChild(item.firstChild);
        }

        let classes = [];
        item.classList.forEach(item => classes.push(item));
        classes.slice(1).forEach(cell => item.classList.remove(cell));

        item.replaceWith(item.cloneNode(true));
      });
    });
  }

  const section = document.getElementById('section');
  if (
    section &&
    section.querySelector('.user-table') &&
    section.querySelector('.user-table').querySelector('tbody')
  ) {
    const tbody = section.querySelector('.user-table').querySelector('tbody');
    const userChildren = tbody.children;

    for (let i = 0; i < userChildren.length; i++) {
      if (
        userChildren[i].firstElementChild.classList.contains(
          'bi-check-square-fill',
        )
      ) {
        userChildren[i].firstElementChild.classList.remove(
          'bi-check-square-fill',
        );
        userChildren[i].firstElementChild.classList.add('bi-square');
      }
    }
  }

  if (
    businessTableDiv &&
    businessTableDiv.querySelector('section') &&
    businessTableDiv.querySelector('section').lastElementChild &&
    businessTableDiv
      .querySelector('section')
      .lastElementChild.querySelector('tbody')
  ) {
    const busyChildren = businessTableDiv
      .querySelector('section')
      .lastElementChild.querySelector('tbody').children;

    for (let i = 0; i < busyChildren.length; i++) {
      if (
        busyChildren[i].firstElementChild.classList.contains(
          'bi-check-square-fill',
        )
      ) {
        busyChildren[i].firstElementChild.classList.remove(
          'bi-check-square-fill',
        );
        busyChildren[i].firstElementChild.classList.add('bi-square');
      }
    }
  }

  if (
    document
      .getElementById('allCheckFree')
      .classList.contains('bi-check-square-fill')
  ) {
    document
      .getElementById('allCheckFree')
      .classList.remove('bi-check-square-fill');
    document.getElementById('allCheckFree').classList.add('bi-square-fill');
  }

  if (
    document
      .getElementById('allCheckBusy')
      .classList.contains('bi-check-square-fill')
  ) {
    document
      .getElementById('allCheckBusy')
      .classList.remove('bi-check-square-fill');
    document.getElementById('allCheckBusy').classList.add('bi-square-fill');
  }

  alertEmptyStart();
  displayUsersAndBusiness();
}

function changeName() {
  if (currentUsers.length > 1) {
    clearTable();

    nobodyIsSelected.selected = true;
  }
}

function clickColor() {
  if (this.style.background !== 'transparent') {
    this.style.background = 'transparent';
  } else {
    this.style.background = 'seagreen';
  }
  document.getElementById('importInput').value = fCompressCodeTime(
    getTimeCode(),
  );
}

function getCurrentCourse(event) {
  if (event.target.value !== 'Nothing') {
    currentCourse = event.target.value;
  } else {
    currentCourse = null;
  }

  if (currentUsers.length > 1) {
    currUser = null;
    currentUsers = [];
    clearTable();
  }
}

function getCurrentLevel(event) {
  if (event.target.value !== 'Nothing') {
    currentLevel = event.target.value;
  } else {
    currentLevel = null;
  }

  if (currentUsers.length > 1) {
    currUser = null;
    currentUsers = [];
    clearTable();
  }
}

function toggleCellClickAbility(ability, type) {
  for (let i = 0; i < 7; i++) {
    let curObjDay = '.day' + String(i);
    let curDay = document
      .querySelector(`.${type}-content`)
      .querySelectorAll(curObjDay);

    curDay.forEach(item => {
      if (ability) {
        item.addEventListener('click', clickColor);
      } else {
        item.removeEventListener('click', clickColor);
      }
    });
  }
}

function checkOut() {
  let dayWeek = document.getElementsByClassName('allday');
  for (let i = 0; i < dayWeek.length; i++) {
    dayWeek[i].checked = false;
  }
}

function clockFreeBusy() {
  function CalcNumTab() {
    if (
      document
        .querySelectorAll('.nav-link')[1]
        .classList.value.includes('active')
    )
      return 1;
    else if (
      document
        .querySelectorAll('.nav-link')[2]
        .classList.value.includes('active')
    )
      return 2;
    else return 0;
  }

  if (CalcNumTab() == 1) {
    if (Number(window.innerWidth) < 400) {
      document.getElementById(
        'titleModalName',
      ).innerHTML = `<i class="bi bi-clock text-success" style="margin-right: 4px;"></i> <text id="dataTitle" style="text-transform: uppercase; display: inline;"> </text>`;
      briefName.innerHTML = document
        .getElementById('YourName')
        .value.slice(0, 23)
        .replace(/_/g, ' ');
    } else {
      document.getElementById(
        'titleModalName',
      ).innerHTML = ` <i class="bi bi-clock text-success" style="margin-right: 4px;"></i> <text trans="text+:FreeTime;" id="dataTitle" style="text-transform: uppercase; display: inline;"> Свободноe время</text>`;
      briefName.innerHTML = document
        .getElementById('YourName')
        .value.replace(/_/g, ' ');
    }
  } else if (CalcNumTab() == 2) {
    if (Number(window.innerWidth) < 400) {
      document.getElementById(
        'titleModalName',
      ).innerHTML = `<i class="bi bi-clock text-orange" style="margin-right: 4px;"></i> <text id="dataTitle" style="text-transform: uppercase; display: inline;"> </text>`;
      briefName.innerHTML = document
        .getElementById('YourName')
        .value.slice(0, 23)
        .replace(/_/g, ' ');
    } else {
      document.getElementById(
        'titleModalName',
      ).innerHTML = `<i class="bi bi-clock text-orange" style="margin-right: 4px;"></i> <text trans="text+:BusyTime;" id="dataTitle" style="text-transform: uppercase; display: inline;"> Занятое время</text>`;
      briefName.innerHTML = document
        .getElementById('YourName')
        .value.replace(/_/g, ' ');
    }
  }
}

function loadStudentsTable() {
  if (document.getElementById('spiner')) {
    //        debugger
    document.getElementById('spiner').remove();
  }

  //    const users = JSON.parse(localStorage.getItem("users")) || [];
  //    const users1 = JSON.parse(getDataFrom(localStorage.getItem('typeBase'), globalLogin, 'users')) || [];

  //    debugger;
  const users =
    JSON.parse(
      getDataFrom(
        sessionStorage.getItem('typeBase'),
        sessionStorage.getItem('globalLogin'),
        'users',
      ),
    ) || [];

  //    const filteredUsers =
  //        JSON.parse(localStorage.getItem("filteredUsers")) || users;

  filteredUsers =
    JSON.parse(
      getDataFrom(
        sessionStorage.getItem('typeBase'),
        sessionStorage.getItem('globalLogin'),
        'filteredUsers',
      ),
    ) || users;
  //
  //	if (sessionStorage.getItem('filteredUsers') == '[]') {
  //		filteredUsers = JSON.parse(getDataFrom(sessionStorage.getItem('typeBase'), sessionStorage.getItem('globalLogin'), 'users'));
  //	}

  //    console.log("#######-filteredUsers-analis#################")
  //    console.log(filteredUsers, '540 - - loadStudentsTable() ');
  //	console.log(sessionStorage.getItem('typeBase'), sessionStorage.getItem('globalLogin'), '540');
  //	console.log("Session", sessionStorage.getItem('filteredUsers'))
  //	console.log("Local", localStorage.getItem('filteredUsers'))
  //	console.log("##############################################")

  let rightToolBar = document.createElement('span');

  rightToolBar.classList.add = 'reverseToolBar';

  if (!document.getElementById('plus-button')) {
    const plusButton = document.createElement('button');
    plusButton.innerHTML = '';
    plusButton.style.boxSizing = 'border-box';
    plusButton.style.borderRadius = '2px';
    plusButton.style.fontWeight = '300';
    plusButton.style.fontSize = '1em';
    plusButton.style.borderWidth = '0px';
    plusButton.style.margin = '5px 8px 0 0 ';
    plusButton.style.width = '29px';
    plusButton.style.height = '29px';
    plusButton.id = 'plus-button';
    let plusButtonIcon = document.createElement('i');
    plusButtonIcon.setAttribute('class', 'bi bi-plus');
    plusButtonIcon.style.color = 'tean';
    plusButtonIcon.style.fontSize = '25px';
    plusButton.appendChild(plusButtonIcon);

    rightToolBar.append(plusButton);
    studentTableDiv.appendChild(rightToolBar);
    plusButton.setAttribute('data-bs-toggle', 'modal');
    plusButton.setAttribute('data-bs-target', '#staticBackdrop');

    if (document.documentElement.clientWidth > 540) {
      let plusButtonText = document.createElement('span');
      plusButtonText.setAttribute('trans', 'text:plusButtonBusyText;');
      plusButton.setAttribute('trans', 'style:PlusButtonBusyStyle');
      plusButton.appendChild(plusButtonText);
    }

    // plusButton.style.width = '5em'
    // plusButton.style.padding = '3px 0.5em 3px 6px';
    // let plusButtonText = document.createElement('span');
    // plusButtonText.setAttribute('trans', 'text:PlusButton;');
    // plusButton.appendChild(plusButtonText);

    document.getElementById('plus-button').addEventListener('click', () => {
      currUser = null;
      currBusiness = null;
      debugger;
      onObjOnModal();
      document
        .getElementById('dataTitle')
        .setAttribute('trans', 'text+:AddTime;');
      document.getElementById('dataTitle').innerHTML = ' ';
      document.getElementById('YourName').value = '';
      document.getElementById('timeSelect').childNodes[1].selected = true;
      document.getElementById('timeSelect').childNodes[3].selected = false;

      document.getElementById('strCourseLevel').style.display = 'flex';

      document.getElementById('courseSelector').selectedIndex = 0;
      document.getElementById('levelSelector').selectedIndex = 0;

      document.getElementById('flexCheckDefault').checked = false;
      document.getElementById('checkShedule').style.display = 'none';

      //            document.getElementById("dataTitle").display = "none";
      changeTimeSelector();
      clearEverything();
      Translate();
    });
  }
  //	timeSelectorSpan.style.display = 'block';

  if (!document.getElementById('filter-button')) {
    const filterButton = document.createElement('button');

    filterButton.innerHTML = '';
    filterButton.style.padding = '0px 0px 0px 5px';
    filterButton.style.backgroundColor = 'cornflowerblue';
    filterButton.style.borderRadius = '2px';
    filterButton.style.color = 'white';
    filterButton.style.fontWeight = '100';
    filterButton.style.borderWidth = '0px';

    filterButton.style.height = '29px';
    filterButton.style.whiteSpace = 'nowrap';
    filterButton.style.margin = '5px 8px 0 0';
    filterButton.id = 'filter-button';

    let filterButtonIcon = document.createElement('i');
    filterButtonIcon.setAttribute('class', 'bi bi-funnel-fill');
    filterButtonIcon.style.fontSize = '1.1em';
    filterButtonIcon.style.marginRight = '5px';
    filterButton.appendChild(filterButtonIcon);

    // Стили + текст для 450 и более
    if (document.documentElement.clientWidth > 540) {
      let filterButtonText = document.createElement('span');
      filterButton.setAttribute('trans', 'style:filterButtonStyle;');
      filterButtonText.setAttribute('trans', 'text+:FilterButton;');
      filterButton.appendChild(filterButtonText);
      filterButtonText.style.fontSize = '1.1em';
    }

    // filterButton.style.padding = '0px 8px 0px 3px';

    rightToolBar.append(filterButton);
    filterButton.onclick = () => createModal();
  }

  //     <button name="PlusButton" id="create" class="help" style="color: white; background-color:deepskyblue;box-sizing: border-box; padding: 4px 3px 3px 4px; border-radius: 2px; border-width: 0px; font-size: 1.6em; font-weight: 200;"><i class="bi bi-question"></i></button

  //    if (!document.getElementById('help-button')) {
  //        let helpButton = document.createElement('button');
  //        let helpButtonIcon = document.createElement('i');
  //
  //        helpButton.setAttribute('id', 'create');
  //        helpButton.setAttribute('id', 'help-button');
  //        helpButton.setAttribute('class', 'help');
  //        helpButton.setAttribute(
  //            'style',
  //            'width:3.5em; color: black; background-color:deepskyblue;box-sizing: border-box; padding: 0px 3px 2px 4px; border-radius: 2px; border-width: 0px; font-size: 1.05em; font-weight: 100;'
  //        );
  //        helpButton.style.margin = '5px 0 0 0';
  //        helpButton.style.padding = '0 1px 0 0';
  //        helpButton.style.width = '29px';
  //        helpButton.style.height = '29px';
  //        helpButton.style.fontSize = '1em';
  //        helpButton.style.fontWeight = '100';
  //
  //        helpButtonIcon.style.fontSize = '20px';
  //        helpButtonIcon.setAttribute('class', 'bi bi-question');
  //        helpButton.appendChild(helpButtonIcon);
  //
  //        if (document.documentElement.clientWidth > 540) {
  //            let helpButtonText = document.createElement('span');
  //            helpButtonText.setAttribute('trans', 'text+:HelpButton;');
  //            helpButton.setAttribute('trans', 'style:HelpButtonStyle;');
  //            helpButton.appendChild(helpButtonText);
  //        }
  //
  //        rightToolBar.append(helpButton);
  //        helpButton.onclick = () => (window.location.href = 'guide.html');
  //    }

  //	document.getElementById("erase-button").style.display = "block"
  document.getElementById('filter-button').style.display = 'block';

  //    alert("683" + String(users.length))
  //    alert("684" + String(sessionStorage.getItem("users")))

  if (
    (users.length === 0 &&
      filteredGrades.length === 0 &&
      filteredCourses.length === 0) ||
    filteredUsers.length === 0
  ) {
    //        console.log("Привет 688");
    if (studentTableDiv.querySelector('section')) {
      studentTableDiv.removeChild(studentTableDiv.querySelector('section'));
    }

    if (document.getElementById('sorting-span')) {
      studentTableDiv.removeChild(document.getElementById('sorting-span'));
    }

    if (document.getElementById('LOMATEL')) {
      // console.log("IT's here");
      studentTableDiv.removeChild(document.getElementById('LOMATEL'));
    }

    const div = document.createElement('div');
    const h6 = document.createElement('h6');

    if (document.getElementById('EmptinessOfUsersList')) {
      document.getElementById('EmptinessOfUsersList').remove();
    }

    const text = document.createElement('Text');
    console.log('----715-----');
    console.log(
      sessionStorage.getItem('numLoad'),
      sessionStorage.getItem('globalAccess'),
    );

    //        alert("empty query!")

    if (document.getElementById('spiner')) {
      document.getElementById('spiner').remove();
    }

    if (sessionStorage.getItem('numLoad') == 2) {
      text.innerHTML = "Unfortunately,\n the list of users' free time is empty";
      text.setAttribute('trans', 'text+:EmptinessOfUsersList;');
      text.id = 'EmptinessOfUsersList';
    }

    h6.appendChild(text);
    h6.style.margin = '5px';
    h6.style.width = '100%';
    h6.style.fontSize = '0.8em';
    h6.style.textAlign = 'justify';

    rightToolBar.append(h6);
    rightToolBar.style.paddingBottom = '10px';
    //		div.appendChild(h6);

    div.id = 'LOMATEL';

    studentTableDiv.appendChild(div);
    studentTableDiv.appendChild(rightToolBar);

    Translate();

    if (sessionStorage.getItem('globalAccess') == 7) {
      //            alert(sessionStorage.getItem("users"))
      //			alert(document.querySelectorAll("#section td").length)
      //
      //            if (filteredUsers.length == 0) {
      //
      //                sessionStorage.setItem("filteredUsers", sessionStorage.getItem("users"))
      //            }

      //            console.log("----741-- после удачного первого логина. Здесь должны быть все файлы--")
      //            console.log("Тип хранения данных" + sessionStorage.getItem("typeBase") + sessionStorage.getItem("filteredUsers").length == 0)
      //
      //

      //            console.log(filteredUsers, '746 -   до загрузки');

      getDataFrom(
        sessionStorage.getItem('typeBase'),
        sessionStorage.getItem('globalLogin'),
        'filteredUsers',
      );

      //            getFilteredUser();

      //            console.log(sessionStorage.getItem("typeBase") + " " + sessionStorage.getItem("globalLogin") + " " + "users")

      //            alert(sessionStorage.getItem("users"))
      //            console.log(filteredUsers, '752 -  после загрузки filteredUsers');

      //            if (filteredUsers.length >= 0 && sessionStorage.getItem('numLoad') != 1) {
      //                sessionStorage.setItem('typeBase', 'remote');
      //                sessionStorage.setItem('numLoad', 1);
      //
      //                alerter(
      //                    "<Text name='Welcome'>Добро пожаловать</Text>",
      //                    `<Text name='disable'>
      //									Вы вошли в систему расширенных возможностей по составлению расписания и организации встреч! <ul><h6 style="margin-top:10px">Теперь вы сможете:</h6><li>Смотреть данные по времени клиентов, расписанию и списка своих дел с любого устройства</li>
      //			<li>Отправить клиенту приглашение отметить своё свободное или занятое время и затем быстро и просто ввести его данные в систему для составления расписания</li><li>Отправить клиентам своё свободное или занятое время</li><li>Предоставить доступ к расписанию нескольким сотрудникам</li><li>Управлять персональным расписанием сотрудника администратором времени (тайм-менеджером) </li></ul></Text> `,
      //                    'standart',
      //                    'success',
      //                    '<a href="https://settime.online"><button type="button" class="btn btn-sm btnUpdate m-2 " id="net2" style="font-weight: 500;color: black; font-size: 1em; background-color:#48c2a9;">Понятно!</button></a>',
      //                    true
      //                );
      //
      //                //				document.getElementById("net2").addEventListener('click', () => {
      //                //					alert("")
      //                //				})
      //            }

      filteredUsers =
        JSON.parse(
          getDataFrom(
            sessionStorage.getItem('typeBase'),
            sessionStorage.getItem('globalLogin'),
            'filteredUsers',
          ),
        ) || users;
    }
    //        console.log(filteredUsers, '791 -   до загрузки');

    return;
  }

  if (document.getElementById('LOMATEL')) {
    //        console.log("IT's here");
    studentTableDiv.removeChild(document.getElementById('LOMATEL'));
    document.getElementById('EmptinessOfUsersList').remove();
  }

  if (!document.getElementById('section')) {
    const span = document.createElement('span');
    //		span.style.backgroundColor = "red";
    const div = document.createElement('div');
    const label = document.createElement('label');
    const text = document.createElement('text');

    text.setAttribute('trans', 'text+:SortingLabel;');
    text.innerHTML = 'Sort by ';

    text.style.fontSize = '0.75em';
    text.style.fontWeight = '500';
    text.style.margin = '5px;';

    label.appendChild(text);
    label.style.padding = '0 5px 0 0';
    const select = document.createElement('select');
    const nameAscendingOption = document.createElement('option');
    const nameDescendingOption = document.createElement('option');
    const numAscendingOption = document.createElement('option');
    const numDescendingOption = document.createElement('option');
    const courseAscendingOption = document.createElement('option');
    const courseDescendingOption = document.createElement('option');
    const gradeAscendingOption = document.createElement('option');
    const gradeDescendingOption = document.createElement('option');

    select.style.fontSize = '0.75em';
    select.style.fontWeight = '500';

    nameAscendingOption.value = 'nameAscending';
    nameAscendingOption.setAttribute('trans', 'text+:NameAscending');
    nameAscendingOption.innerHTML = '&#8595; name asc';
    nameDescendingOption.value = 'nameDescending';
    nameDescendingOption.setAttribute('trans', 'text+:NameDescending');
    nameDescendingOption.innerHTML = '&#8593; name desc';
    numAscendingOption.value = 'numAscending';
    numAscendingOption.innerHTML = '&#8595; num asc';
    numAscendingOption.setAttribute('trans', 'text+:NumAscending');
    numDescendingOption.value = 'numDescending';
    numDescendingOption.innerHTML = '&#8593; num desc';
    numDescendingOption.setAttribute('trans', 'text+:NumDescending');
    courseAscendingOption.value = 'courseAscending';
    courseAscendingOption.innerHTML = '&#8595; course asc';
    courseAscendingOption.setAttribute('trans', 'text+:CourseAscending');
    courseDescendingOption.value = 'courseDescending';
    courseDescendingOption.innerHTML = '&#8593; course desc';
    courseDescendingOption.setAttribute('trans', 'text+:CourseDescending');
    gradeAscendingOption.value = 'gradeAscending';
    gradeAscendingOption.innerHTML = '&#8595; grade asc';
    gradeAscendingOption.setAttribute('trans', 'text+:GradeAscending');
    gradeDescendingOption.value = 'gradeDescending';
    gradeDescendingOption.innerHTML = '&#8593; grade desc';
    gradeDescendingOption.setAttribute('trans', 'text+:GradeDescending');

    select.appendChild(numAscendingOption);
    select.appendChild(numDescendingOption);
    select.appendChild(nameAscendingOption);
    select.appendChild(nameDescendingOption);
    select.appendChild(courseAscendingOption);
    select.appendChild(courseDescendingOption);
    select.appendChild(gradeAscendingOption);
    select.appendChild(gradeDescendingOption);

    select.id = 'userSorting';
    select.onchange = () => sortUsers();

    numAscendingOption.selected = true;

    span.id = 'sorting-span';

    div.appendChild(label);
    div.appendChild(select);
    span.appendChild(div);

    const section = document.createElement('section');
    const firstTable = document.createElement('table');
    const firstTHead = document.createElement('thead');
    const firstTr = document.createElement('tr');
    const tableFirstTd = document.createElement('td');
    const tableSecondTd = document.createElement('td');
    const tableThirdTd = document.createElement('td');
    const tableSixthTd = document.createElement('td');
    const tableSeventhTd = document.createElement('td');

    const bottomSpace = document.createElement('div');
    bottomSpace.style.height = '45px';
    bottomSpace.style.backgroundColor = 'blue';

    const classesForSection = 's3 position-relative m-0 p-0 w-100';
    const classesForTable = 'table table-bordered m-0 w-100';

    const textElement = document.createElement('Text');

    section.style.position = 'relative';
    section.classList = classesForSection;
    firstTable.classList = classesForTable;
    firstTable.style.backgroundColor = 'gray';
    firstTable.appendChild(firstTHead);
    firstTHead.appendChild(firstTr);

    const tableFirstTdIcon = document.createElement('i');
    tableFirstTdIcon.setAttribute('class', 'text-light bi bi-square-fill');
    tableFirstTdIcon.setAttribute('id', 'allCheckFree');
    tableFirstTd.appendChild(tableFirstTdIcon);
    //		tableFirstTd.textContent = "A";

    tableFirstTd.style.width = '10%';
    tableSecondTd.textContent = '№';
    tableSecondTd.style.width = '7%';
    textElement.textContent = ` Name [Course] [Grade]`;
    textElement.setAttribute('trans', 'text+:NameGradeCourse;');
    tableThirdTd.appendChild(textElement);
    tableThirdTd.style.width = '61%';

    const tableSixthTdIcon = document.createElement('i');
    tableSixthTdIcon.setAttribute('class', 'bi bi-pencil-square');
    tableSixthTd.appendChild(tableSixthTdIcon);
    //		tableSixthTd.textContent = "M";

    tableSixthTd.style.width = '10%';

    const tableSeventhTdIcon = document.createElement('i');
    tableSeventhTdIcon.setAttribute('class', 'bi bi-x-square');
    tableSeventhTd.appendChild(tableSeventhTdIcon);
    //		tableSeventhTd.textContent = "D";

    tableSeventhTd.style.width = '12%';
    firstTr.appendChild(tableFirstTd);
    firstTr.appendChild(tableSecondTd);
    firstTr.appendChild(tableThirdTd);
    firstTr.appendChild(tableSixthTd);
    firstTr.appendChild(tableSeventhTd);
    studentTableDiv.appendChild(span);
    studentTableDiv.appendChild(section);
    section.appendChild(firstTable);

    section.id = 'section';
    section.appendChild(bottomSpace);

    Translate();
  }

  try {
    const section = document.getElementById('section');
    if (
      section &&
      section.children &&
      section.children.length &&
      section.children.length === 2
    ) {
      section.removeChild(section.lastChild);
    }

    const table = document.createElement('table');
    const tbody = document.createElement('tbody');

    section.appendChild(table);
    table.appendChild(tbody);
    for (let i = 0; i < sortedFilteredUsers.length; i++) {
      const tr = document.createElement('tr');
      const tableFirstTd = document.createElement('td');
      let item = sortedUsers.find(c => c.id === sortedFilteredUsers[i].id);

      // console.log(sortedUsers);
      // console.log(sortedFilteredUsers);
      // console.log(item);

      tr.id = `${item.id}`;

      const tableFirstTdIcon = document.createElement('i');
      tableFirstTd.append(tableFirstTdIcon);
      tableFirstTd.classList = 'bi bi-square text-primary hovered checkFreeBtn';

      tableFirstTd.addEventListener('click', () => {
        tableFirstTd.classList.toggle('bi-square');
        tableFirstTd.classList.toggle('bi-check-square-fill');
      });
      tableFirstTd.id = `${item.id}_1`;

      tableFirstTd.removeEventListener('click', displayUsersAndBusiness);
      tableFirstTd.addEventListener('click', displayUsersAndBusiness);

      const tableSecondTd = document.createElement('td');

      const tableThirdTd = document.createElement('td');
      tableThirdTd.style.textAlign = 'left';
      tableThirdTd.classList = 'hovered';

      tableThirdTd.addEventListener('click', () => {
        console.log('free 1017!+');

        onObjOnModal();

        //                debugger;
        document.getElementById('courseSelector').style.display =
          'inline-block';
        document.getElementById('levelSelector').style.display = 'inline-block';
        document.getElementById('strCourseLevel').style.display = 'flex';
        document.getElementsByName('Level1')[0].style.display = 'block';
        document.getElementsByName('Level2')[0].style.display = 'block';
        document.getElementById('timeSelect').style.display = 'none';
        document.getElementById('timeSelectSpan').style.display = 'none';
        document.getElementById('checkShedule').style.display = 'inline';
        document.getElementById('btnTodo').style.display = 'none';
        if (toDoOn) {
          document.getElementById('onOffTask').style.display = 'block';
        }

        document.getElementById('flexCheckDefault').style.display =
          'inline-block';

        document.getElementById('delColorTime').style.display = 'block';
        document.getElementById('clipboardLinkBusy').style.display = 'none';
        document.getElementById('btnFullScreenBusy').style.display = 'block';
        document.getElementById('sendCode2').style.display = 'none';
        document.getElementById('saveDataUser').style.display = 'block';

        document.getElementById('courseSelector').style.display =
          'inline-block';
        document.getElementById('levelSelector').style.display = 'inline-block';

        document.getElementById('loginSendTimeCode2').value =
          sessionStorage.getItem('globalLogin');

        let btnFullScreenBusy = document.getElementById('btnFullScreenBusy');

        btnFullScreenBusy.setAttribute('data-target', 'full');
        btnFullScreenBusy.innerHTML = `<i class="bi bi-arrows-expand font-weight-bold mx-0" style="margin-top: 0.65em"></i>`;

        clockFreeBusy();
        //				//	Определяем номер текущей вкладки
        //				function CalcNumTab() {
        //					if (document.querySelectorAll(".nav-link")[1].classList.value.includes('active'))
        //						return 1
        //					else if (document.querySelectorAll(".nav-link")[2].classList.value.includes('active'))
        //						return 2
        //					else
        //						return 0
        //				}
        //
        //				if (CalcNumTab() == 1) {
        //					if (Number(window.innerWidth) < 400) {
        //						document.getElementById("titleModalName").innerHTML = `<i class="bi bi-clock text-success" style="margin-right: 4px;"></i> <text id="dataTitle" style="text-transform: uppercase; display: inline;"> </text>`;
        //						briefName.innerHTML = document.getElementById("YourName").value.slice(0, 23).replace(/_/g, ' ');
        //					} else {
        //						document.getElementById("titleModalName").innerHTML = ` <i class="bi bi-clock text-success" style="margin-right: 4px;"></i> <text trans="text+:FreeTime;" id="dataTitle" style="text-transform: uppercase; display: inline;"> Свободноe время</text>`;
        //						briefName.innerHTML = document.getElementById("YourName").value.replace(/_/g, ' ');
        //					}
        //				} else if (CalcNumTab() == 2) {
        //					if (Number(window.innerWidth) < 400) {
        //						document.getElementById("titleModalName").innerHTML = `<i class="bi bi-clock text-orange" style="margin-right: 4px;"></i> <text id="dataTitle" style="text-transform: uppercase; display: inline;"> </text>`;
        //						briefName.innerHTML = document.getElementById("YourName").value.slice(0, 23).replace(/_/g, ' ');
        //					} else {
        //						document.getElementById("titleModalName").innerHTML = `<i class="bi bi-clock text-orange" style="margin-right: 4px;"></i> <text trans="text+:BusyTime;" id="dataTitle" style="text-transform: uppercase; display: inline;"> Занятое время</text>`;
        //						briefName.innerHTML = document.getElementById("YourName").value.replace(/_/g, ' ')
        //					}
        //				}

        document
          .getElementById('dataTitle')
          .setAttribute('trans', 'text+:BusyTime11111111;');

        let flags = document.querySelectorAll('.allday');
        for (let i = 0; i < flags.length; i++) {
          flags[i].style.display = 'inline-block';
        }

        let tds = document.querySelectorAll('#tableUser td');
        for (let i = 0; i < tds.length; i++) {
          tds[i].style.padding = '0px 2px';
          tds[i].disabled = true;
        }

        showUpdatingModal('freeTime');
        document.getElementById('briefName').innerHTML = '';
        displayOneUserModal(item);
        //                console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@2")
        //                console.log(item)
        //                console.log(item['id'])
        sessionStorage.setItem('idCurUser', item['id']);
        document.getElementById('importInput').value = fCompressCodeTime(
          getTimeCode(),
        );

        document.getElementById('flexCheckDefault').checked = item['setShed'];

        //<Наслоение дел - Только свободные>=================================================

        if (todoIsActive()) {
          setTimeout(() => {
            closeTodoLayers(document.querySelector('#tableUser'));
            isLayersCanBeDisplayed(
              document.querySelector('#tableUser'),
              [item.id],
              ['free'],
            );
          }, 200);
        }

        //</Наслоение дел - Только свободные>=========================================================
      });

      const tableSixthTd = document.createElement('td');

      const tableSixthTdIcon = document.createElement('i');

      tableSixthTd.append(tableSixthTdIcon);
      tableSixthTd.classList = 'bi bi-calendar3 hovered';

      tableSixthTd.addEventListener('click', () => {
        //                debugger;
        //                clearModalTable() //06.12.2023
        showUpdatingModal('freeTime');
        displayOneUserModal(item);
        document.getElementById('importInput').value = fCompressCodeTime(
          getTimeCode(),
        );
        document.getElementById('flexCheckDefault').checked = item['setShed'];

        //<Наслоение дел - Только свободные>=================================================

        if (todoIsActive()) {
          setTimeout(() => {
            closeTodoLayers(document.querySelector('#tableUser'));
            isLayersCanBeDisplayed(
              document.querySelector('#tableUser'),
              [item.id],
              ['free'],
            );
          }, 200);
        }

        //</Наслоение дел - Только свободные>=========================================================
      });

      const tableSeventhTd = document.createElement('td');
      const tableSeventhTdIcon = document.createElement('i');
      tableSeventhTd.append(tableSeventhTdIcon);
      tableSeventhTd.classList = 'bi bi-trash text-danger hovered';

      tableSeventhTd.addEventListener('click', () => {
        if (
          window.confirm('Are you sure that you are going to delete this user?')
        ) {
          deleteUser(item);
          Translate();
        }
      });

      const classes =
        'user-table table table-bordered table text-dark table-striped';

      table.classList = classes;

      tableFirstTd.textContent = ``;
      tableFirstTd.style.width = '10%';
      tableSecondTd.textContent = `${
        users.findIndex(user => user.id === item.id) + 1
      }`;
      tableSecondTd.style.width = '7%';
      //		tableThirdTd.textContent = ` ${item.name} [${item.currentLevel}] [${item.currentCourse.slice(0, 7)}]`;

      if (Number(window.innerWidth) < 400) {
        tableThirdTd.innerHTML = ` ${
          item.name
        } [<span style="color:RoyalBlue; font-weight:400;">${item.currentCourse.slice(
          0,
          8,
        )}</span>] [<span style="color:#48c2a9; font-weight:500;">${
          item.currentLevel
        }</span>]`;
      } else {
        tableThirdTd.innerHTML = ` ${item.name} [<span style="color:RoyalBlue; font-weight:400;">${item.currentCourse}</span>] [<span style="color:#48c2a9; font-weight:500;">${item.currentLevel}</span>]`;
      }

      tableThirdTd.style.width = '61%';
      tableThirdTd.style.paddingLeft = '5px';
      tableSixthTd.textContent = ``;
      tableSixthTd.style.width = '10%';
      tableSeventhTd.textContent = ``;
      tableSeventhTd.style.width = '12%';
      tr.appendChild(tableFirstTd);
      tr.appendChild(tableSecondTd);
      tr.appendChild(tableThirdTd);
      tr.appendChild(tableSixthTd);
      tr.appendChild(tableSeventhTd);
      tbody.appendChild(tr);

      if (i == sortedFilteredUsers.length - 1) {
        const trB = document.createElement('tr');
        trB.style.paddingLeft = '25px';

        const tableNullTd = document.createElement('td');
        tableNullTd.textContent = ``;
        tableNullTd.style.width = '10%';
        trB.appendChild(tableNullTd);

        const tableFirstTdB = document.createElement('td');
        tableFirstTdB.setAttribute('colspan', '4');
        tableFirstTdB.style.textAlign = 'left';
        tableFirstTdB.style.fontWeight = '500';
        tableFirstTdB.style.backgroundColor = 'white';
        tableFirstTdB.innerHTML = `<span trans="text+:total;"> Итого: </span><span>${String(
          sortedFilteredUsers.length,
        )} </span><span trans="text+:person">человек(а)</span>`;
        trB.appendChild(tableFirstTdB);
        tbody.appendChild(trB);

        if (sortedFilteredUsers.length > 11) {
          const trB2 = document.createElement('tr');
          const tableFirstTdB2 = document.createElement('td');
          tableFirstTdB2.setAttribute('colspan', '5');
          tableFirstTdB2.style.textAlign = 'left';
          tableFirstTdB2.style.backgroundColor = 'white';
          tableFirstTdB2.textContent = ' ';

          trB2.appendChild(tableFirstTdB2);
          tbody.appendChild(trB2);
        }
        Translate();
      }
    }
  } catch (e) {
    console.log(e);
  }

  gradeText = document.getElementById('gradeTextArea');
  courseText = document.getElementById('courseTextArea');
}

function sortUsers() {
  const select = document.getElementById('userSorting');
  let sorting;
  sortedFilteredUsers = [];
  if (select) {
    for (let i = 0; i < select.children.length; i++) {
      if (select.children[i].selected) {
        sorting = select.children[i].value;
      }
    }

    let names = [];
    let courses = [];
    let grades = [];

    users.forEach(
      item =>
        names.push([item.name, item.id]) &&
        courses.push([item.currentCourse, item.id]) &&
        grades.push([item.currentLevel, item.id]),
    );

    let sortedNames = [...names].sort();
    let sortedCourses = [...courses].sort();
    let sortedGrades = [...grades].sort();

    let temp = [];

    switch (sorting) {
      case 'numAscending':
        sortedUsers = [...users];
        break;
      case 'numDescending':
        sortedUsers = [...users].reverse();
        break;
      case 'nameAscending':
        for (let i = 0; i < sortedNames.length; i++) {
          let user = [...users].find(
            item =>
              item.name === sortedNames[i][0] && item.id === sortedNames[i][1],
          );
          temp.push(user);
        }
        sortedUsers = temp;
        temp = [];
        break;
      case 'nameDescending':
        // console.log(sortedNames);
        for (let i = sortedNames.length - 1; i >= 0; i--) {
          let user = [...users].find(
            item =>
              item.name === sortedNames[i][0] && item.id === sortedNames[i][1],
          );
          // console.log(user);
          temp.push(user);
        }
        sortedUsers = temp;
        temp = [];
        break;
      case 'courseAscending':
        for (let i = 0; i < sortedNames.length; i++) {
          let user = [...users].find(
            item =>
              item.currentCourse === sortedCourses[i][0] &&
              item.id === sortedCourses[i][1],
          );
          // console.log(user);
          temp.push(user);
        }
        // console.log(temp);
        sortedUsers = temp;
        temp = [];
        break;
      case 'courseDescending':
        for (let i = sortedNames.length - 1; i >= 0; i--) {
          let user = [...users].find(
            item =>
              item.currentCourse === sortedCourses[i][0] &&
              item.id === sortedCourses[i][1],
          );
          temp.push(user);
        }
        sortedUsers = temp;
        temp = [];
        break;
      case 'gradeAscending':
        for (let i = 0; i < sortedNames.length; i++) {
          let user = [...users].find(
            item =>
              item.currentLevel === sortedGrades[i][0] &&
              item.id === sortedGrades[i][1],
          );
          temp.push(user);
        }
        sortedUsers = temp;
        temp = [];
        break;
      case 'gradeDescending':
        for (let i = sortedNames.length - 1; i >= 0; i--) {
          let user = [...users].find(
            item =>
              item.currentLevel === sortedGrades[i][0] &&
              item.id === sortedGrades[i][1],
          );
          temp.push(user);
        }
        sortedUsers = temp;
        temp = [];
        break;
      default:
        sortedUsers = [...users];
        break;
    }
  }

  sortedUsers.forEach(item => {
    let kkk = filteredUsers.findIndex(user => user.id === item.id);
    if (kkk !== -1) {
      sortedFilteredUsers.push(filteredUsers[kkk]);
    }
  });

  //    alert("1261 sortUsers")
  //    console.log("1261 sortUsers")
  loadStudentsTable();
  clearTable();
}

function loadBusinessTable() {
  //    const business = JSON.parse(localStorage.getItem("business")) || [];
  const business =
    JSON.parse(
      getDataFrom(
        sessionStorage.getItem('typeBase'),
        sessionStorage.getItem('globalLogin'),
        'business',
      ),
    ) || [];

  if (business.length === 0) {
    if (businessTableDiv.querySelector('section')) {
      businessTableDiv.removeChild(businessTableDiv.lastChild);
    }

    if (businessTableDiv.querySelector('span')) {
      businessTableDiv.removeChild(businessTableDiv.lastChild);
    }

    const div = document.createElement('div');
    div.style.display = 'flex';

    let spanLeft = document.createElement('span');
    spanLeft.style.width = '100%';

    let spanRight = document.createElement('span');
    spanRight.style.width = '15%';

    const h6 = document.createElement('h6');
    const text = document.createElement('Text');

    //        alert(sessionStorage.getItem("numLoad"), sessionStorage.getItem("typeBase"), sessionStorage.getItem("globalAccess"))

    console.log('---- 1333 -----');
    console.log(sessionStorage.getItem('numLoad'));
    if (
      sessionStorage.getItem('numLoad') == 2 &&
      sessionStorage.getItem('globalAccess') == 7
    ) {
      text.innerHTML = `<div class = "text-center text-primary"><div class = "spinner-border" style="font-size:0.7em;" role = "status"><span class= "visually-hidden"></span></div></div>`;
      text.setAttribute('trans', 'text+:EmptinessOfBusinessList');
    } else {
      text.innerHTML =
        'Unfortunately\n, the list of busy time is empty.\n Add busy time.';
      text.setAttribute('trans', 'text+:EmptinessOfBusinessList');
    }

    //        alert("no busytime1")

    h6.appendChild(text);
    h6.style.margin = '5px';
    h6.style.width = '80%';
    h6.style.fontSize = '0.8em';
    h6.style.textAlign = 'justify';

    spanLeft.appendChild(h6);
    spanRight.style.textAlign = 'right';

    let rightToolBarBusy = document.createElement('span');
    //		rightToolBarBusy.classList.add = "reverseToolBar";

    if (!document.getElementById('plus-button-busy')) {
      const plusButtonBusy = document.createElement('button');
      plusButtonBusy.setAttribute('name', 'PlusButtonBusy');
      plusButtonBusy.innerHTML = '';
      plusButtonBusy.style.boxSizing = 'border-box';
      plusButtonBusy.style.margin = '5px 3px';
      plusButtonBusy.style.borderRadius = '2px';
      plusButtonBusy.style.fontWeight = '300';
      plusButtonBusy.style.borderWidth = '0px';
      plusButtonBusy.style.height = '29px';
      plusButtonBusy.style.backgroundColor = '#48c2a9';
      plusButtonBusy.id = 'plus-button-busy';
      let plusButtonIconBusy = document.createElement('i');
      plusButtonIconBusy.setAttribute('class', 'bi bi-plus');
      plusButtonIconBusy.style.color = 'black';
      plusButtonIconBusy.style.fontSize = '25px';
      plusButtonIconBusy.style.fontWeight = 'bold';
      plusButtonIconBusy.style.width = '2em';
      plusButtonBusy.appendChild(plusButtonIconBusy);
      plusButtonBusy.setAttribute('data-bs-toggle', 'modal');
      plusButtonBusy.setAttribute('data-bs-target', '#staticBackdrop');
      rightToolBarBusy.appendChild(plusButtonBusy);

      if (document.documentElement.clientWidth > 450) {
        plusButtonBusy.style.margin = '5px 40px';
      }

      plusButtonBusy.addEventListener('click', () => {
        //				alert("pressBusy")

        document.getElementById('courseSelector').selectedIndex = 0;
        document.getElementById('levelSelector').selectedIndex = 0;

        //				timeSelectorSpan.style.display = 'block';
        //				alert("plus1479")
        //				document.getElementById('strCourseLevel').display = 'none';
        //                document.getElementById("dataTitle").display = "none";;

        document
          .getElementById('dataTitle')
          .setAttribute('trans', 'text+:AddTime;');
        document.getElementById('dataTitle').innerHTML = '';

        document.getElementById('flexCheckDefault').checked = false;
        document.getElementById('checkShedule').style.display = 'none';
      });
    }
    changeTimeSelector();
    Translate();

    //        if (!document.getElementById('help-button-busy')) {
    //            let helpButtonBusy = document.createElement('button');
    //            let helpButtonIcon = document.createElement('i');
    //            //               alert("help1busy")
    //            helpButtonBusy.setAttribute('trans', 'text+:PlusButton;');
    //            //            helpButtonBusy.setAttribute("id", "create");
    //            helpButtonBusy.setAttribute('id', 'help-button-busy');
    //            helpButtonBusy.setAttribute('class', 'help');
    //            helpButtonBusy.setAttribute(
    //                'style',
    //                'color: black; background-color:deepskyblue;box-sizing: border-box; padding: 0px 3px 2px 4px; border-radius: 2px; border-width: 0px; font-size: 1.05em; font-weight: 100;'
    //            );
    //            helpButtonIcon.style.fontSize = '20px';
    //            helpButtonIcon.setAttribute('class', 'bi bi-question');
    //
    //            helpButtonBusy.appendChild(helpButtonIcon);
    //            rightToolBarBusy.append(helpButtonBusy);
    //
    //            helpButtonBusy.onclick = () => (window.location.href = 'guide.html');
    //        }

    spanRight.appendChild(rightToolBarBusy);
    div.appendChild(spanLeft);
    div.appendChild(spanRight);
    businessTableDiv.appendChild(div);

    if (businessTableDiv.querySelector('#spanTop')) {
      businessTableDiv.querySelector('#spanTop').remove();
    }

    return;
  }

  if (businessTableDiv.querySelector('div')) {
    businessTableDiv.removeChild(businessTableDiv.lastChild);
  }

  if (businessTableDiv.children.length === 0) {
    let spanTop = document.createElement('span');
    spanTop.style.display = 'flex';
    spanTop.style.height = '38px';
    spanTop.id = 'spanTop';

    let spanLeft = document.createElement('span');
    spanLeft.style.width = '80%';

    let spanRight = document.createElement('span');
    spanRight.style.width = '20%';

    const span = document.createElement('span');

    const label = document.createElement('label');
    const text = document.createElement('Text');
    text.innerHTML = 'Sort by ';

    text.style.fontSize = '0.75em';
    text.style.fontWeight = '500';

    text.setAttribute('trans', 'text+:SortingLabel;');
    label.appendChild(text);
    label.style.padding = '2px 5px';
    const select = document.createElement('select');
    const nameAscendingOption = document.createElement('option');
    const nameDescendingOption = document.createElement('option');
    const numAscendingOption = document.createElement('option');
    const numDescendingOption = document.createElement('option');

    select.style.fontSize = '0.75em';
    select.style.fontWeight = '500';

    nameAscendingOption.value = 'nameAscending';
    nameAscendingOption.innerHTML = '&#8595; description asc';
    nameAscendingOption.setAttribute('trans', 'text+:DescAscending;');
    nameDescendingOption.value = 'nameDescending';
    nameDescendingOption.innerHTML = '&#8593; description desc';
    nameDescendingOption.setAttribute('trans', 'text+:DescDescending;');
    numAscendingOption.value = 'numAscending';
    numAscendingOption.innerHTML = '&#8595; num asc';
    numAscendingOption.setAttribute('trans', 'text+:NumAscending;');
    numDescendingOption.value = 'numDescending';
    numDescendingOption.innerHTML = '&#8593; num desc';
    numDescendingOption.setAttribute('trans', 'text+:NumDescending;');

    select.appendChild(numAscendingOption);
    select.appendChild(numDescendingOption);
    select.appendChild(nameAscendingOption);
    select.appendChild(nameDescendingOption);

    select.id = 'businessSorting';
    select.onchange = () => sortBusiness();

    numAscendingOption.selected = true;

    span.appendChild(label);
    span.appendChild(select);

    spanLeft.appendChild(span);
    spanLeft.style.paddingTop = '4px';

    spanLeft.appendChild(label);
    spanLeft.appendChild(select);

    let rightToolBarBusy = document.createElement('span');

    if (!document.getElementById('plus-button-Busy1')) {
      const plusButtonBusy = document.createElement('button');
      plusButtonBusy.setAttribute('name', 'PlusButtonBusy');
      plusButtonBusy.innerHTML = '';
      plusButtonBusy.style.boxSizing = 'border-box';
      plusButtonBusy.style.borderRadius = '2px';
      plusButtonBusy.style.fontWeight = '300';
      plusButtonBusy.style.borderWidth = '0px';
      plusButtonBusy.style.width = '29px';
      plusButtonBusy.style.height = '29px';
      plusButtonBusy.style.backgroundColor = '#48c2a9';
      plusButtonBusy.style.margin = '5px 2.5px 0 0';
      plusButtonBusy.id = 'plus-button-Busy1';
      let plusButtonIconBusy = document.createElement('i');
      plusButtonIconBusy.setAttribute('class', 'bi bi-plus');
      plusButtonIconBusy.style.color = 'black';
      plusButtonIconBusy.style.fontSize = '25px';
      plusButtonIconBusy.style.fontWeight = 'bold';

      plusButtonBusy.appendChild(plusButtonIconBusy);
      plusButtonBusy.setAttribute('data-bs-toggle', 'modal');
      plusButtonBusy.setAttribute('data-bs-target', '#staticBackdrop');

      if (document.documentElement.clientWidth > 450) {
        let plusButtonBusyText = document.createElement('span');
        plusButtonBusyText.setAttribute('trans', 'text:plusButtonBusyText;');
        plusButtonBusy.setAttribute('trans', 'style:PlusButtonBusyStyle;');
        plusButtonBusy.appendChild(plusButtonBusyText);
      }

      rightToolBarBusy.appendChild(plusButtonBusy);

      plusButtonBusy.addEventListener('click', () => {
        onObjOnModal();
        document
          .getElementById('dataTitle')
          .setAttribute('trans', 'text+:AddTime;');
        document.getElementById('dataTitle').innerHTML = ' ';
        document.getElementById('YourName').value = '';
        document.getElementById('briefName').innerHTML = '';
        document.getElementById('timeSelect').childNodes[1].selected = false;
        document.getElementById('timeSelect').childNodes[3].selected = true;
        //				document.getElementById("dataTitle").value="busy";

        document.getElementById('courseSelector').selectedIndex = 0;
        document.getElementById('levelSelector').selectedIndex = 0;
        document.getElementById('strCourseLevel').style.display = 'none';

        document.getElementById('flexCheckDefault').checked = false;
        document.getElementById('checkShedule').style.display = 'none';

        Translate();
      });
    }
    Translate();

    //        if (!document.getElementById('help-button-busy2')) {
    //            let helpButtonBusy = document.createElement('button');
    //            let helpButtonIcon = document.createElement('i');
    //            helpButtonBusy.style.borderColor = 'white';
    //            //            helpButtonBusy.setAttribute("id", "create");
    //            helpButtonBusy.setAttribute('id', 'help-button-busy2');
    //            helpButtonBusy.setAttribute('class', 'help');
    //            helpButtonBusy.setAttribute(
    //                'style',
    //                ' color: black; background-color:deepskyblue; box-sizing: border-box; padding: 0px 3px 2px 4px; border-radius: 2px; border-width: 0px; font-size: 1em; font-weight: 100;'
    //            );
    //            //            alert(helpButtonBusy.innerHTML)
    //
    //            helpButtonIcon.setAttribute('class', 'bi bi-question');
    //            helpButtonBusy.appendChild(helpButtonIcon);
    //
    //            if (document.documentElement.clientWidth > 450) {
    //                helpButtonBusy.setAttribute('trans', 'style:HelpButtonStyle;');
    //                let helpButtonText = document.createElement('span');
    //                helpButtonText.setAttribute('trans', 'text:HelpButton; ');
    //                helpButtonBusy.appendChild(helpButtonText);
    //            }
    //
    //            rightToolBarBusy.append(helpButtonBusy);
    //
    //            helpButtonBusy.onclick = () => (window.location.href = 'guide.html');
    //        }

    spanRight.appendChild(rightToolBarBusy);

    spanTop.appendChild(spanLeft);
    spanTop.appendChild(spanRight);
    //		spanLeft.style.backgroundColor = "red"
    //		spanRight.style.backgroundColor = "blue"
    spanRight.style.textAlign = 'right';

    businessTableDiv.appendChild(spanTop);

    //		Таблица
    const section = document.createElement('section');
    const firstTable = document.createElement('table');
    const firstTHead = document.createElement('thead');
    const firstTr = document.createElement('tr');
    const tableFirstTd = document.createElement('td');
    const tableSecondTd = document.createElement('td');
    const tableThirdTd = document.createElement('td');
    const tableSixthTd = document.createElement('td');
    const tableSeventhTd = document.createElement('td');

    const textElement = document.createElement('Text');

    const classesForSection = 's3 position-relative m-0 p-0 w-100';
    const classesForTable = 'table table-bordered m-0 w-100';
    section.classList = classesForSection;
    firstTable.classList = classesForTable;
    firstTable.style.backgroundColor = 'gray';
    firstTable.appendChild(firstTHead);
    firstTHead.appendChild(firstTr);

    const tableFirstTdIcon = document.createElement('i');
    tableFirstTdIcon.setAttribute('class', 'text-light bi bi-square-fill');
    tableFirstTdIcon.setAttribute('id', 'allCheckBusy');
    tableFirstTd.appendChild(tableFirstTdIcon);

    //		tableFirstTd.textContent = "A";

    tableFirstTd.style.width = '10%';
    tableSecondTd.textContent = '№';
    tableSecondTd.style.width = '7%';
    textElement.textContent = 'Description';
    textElement.setAttribute('trans', 'text+:Description;');
    tableThirdTd.appendChild(textElement);
    tableThirdTd.style.width = '61%';

    const tableSixthTdIcon = document.createElement('i');
    tableSixthTdIcon.setAttribute('class', 'bi bi-pencil-square');
    tableSixthTd.appendChild(tableSixthTdIcon);
    //		tableSixthTd.textContent = "M";

    tableSixthTd.style.width = '10%';

    const tableSeventhTdIcon = document.createElement('i');
    tableSeventhTdIcon.setAttribute('class', 'bi bi-x-square');
    tableSeventhTd.appendChild(tableSeventhTdIcon);
    //		tableSeventhTd.textContent = "D";

    tableSeventhTd.style.width = '12%';
    firstTr.appendChild(tableFirstTd);
    firstTr.appendChild(tableSecondTd);
    firstTr.appendChild(tableThirdTd);
    firstTr.appendChild(tableSixthTd);
    firstTr.appendChild(tableSeventhTd);
    businessTableDiv.appendChild(span);
    businessTableDiv.appendChild(section);
    section.appendChild(firstTable);
    section.id = 'section1';
  }

  const section = document.getElementById('section1');

  if (section.children.length === 2) {
    section.removeChild(section.lastChild);
  }

  const table = document.createElement('table');
  const tbody = document.createElement('tbody');

  section.appendChild(table);
  table.appendChild(tbody);

  for (let i = 0; i < sortedBusiness.length; i++) {
    const tr = document.createElement('tr');
    const tableFirstTd = document.createElement('td');

    tr.id = `${sortedBusiness[i].id}`;

    const tableFirstTdIcon = document.createElement('i');
    tableFirstTd.append(tableFirstTdIcon);
    tableFirstTd.classList = 'bi bi-square text-primary hovered checkBusyBtn';
    tableFirstTd.addEventListener('click', () => {
      tableFirstTd.classList.toggle('bi-square');
      tableFirstTd.classList.toggle('bi-check-square-fill');
    });
    tableFirstTd.id = `${sortedBusiness[i].id}_1`;

    // if (loading && i === 0) {
    // 	tableFirstTd.classList.remove("bi-arrow-left-square");
    // 	tableFirstTd.classList.add("bi-arrow-left-square-fill");
    // }

    tableFirstTd.removeEventListener('click', displayUsersAndBusiness);
    tableFirstTd.addEventListener('click', displayUsersAndBusiness);

    const tableSecondTd = document.createElement('td');

    const tableThirdTd = document.createElement('td');
    tableThirdTd.style.textAlign = 'left';

    tableThirdTd.classList = 'hovered';

    tableThirdTd.addEventListener('click', () => {
      //busy

      onObjOnModal();

      document.getElementById('levelSelector').style.display = 'none';
      document.getElementsByName('Level1')[0].style.display = 'none';
      document.getElementsByName('Level2')[0].style.display = 'none';
      document.getElementById('timeSelect').style.display = 'none';

      if (toDoOn) {
        document.getElementById('onOffTask').style.display = 'block';
        document.getElementById('btnTodo').style.display = 'block';
      }

      document.getElementById('delColorTime').style.display = 'block';
      document.getElementById('clipboardLinkBusy').style.display = 'block';
      document.getElementById('btnFullScreenBusy').style.display = 'block';
      document.getElementById('sendCode2').style.display = 'none';
      document.getElementById('saveDataUser').style.display = 'block';

      //	Определяем номер текущей вкладки

      clockFreeBusy();

      //			alert(document.getElementById("loginSendTimeCode").value)
      //			document.getElementById("YourName").value = url.searchParams.get("nameUser");
      //			document.getElementById("loginSendTimeCode").value = url.searchParams.get("viewtime");
      //			document.getElementById("importInput").value = url.searchParams.get("sendTimeCode");
      //			document.getElementById("timeSelect").name = url.searchParams.get("typeTime");
      //			document.getElementById("timeSelect").value = url.searchParams.get("typeTime");

      let flags = document.querySelectorAll('.allday');
      for (let i = 0; i < flags.length; i++) {
        flags[i].style.display = 'inline-block';
      }

      let tds = document.querySelectorAll('#tableUser td');
      for (let i = 0; i < tds.length; i++) {
        tds[i].style.padding = '0px 2px';
        tds[i].disabled = true;
      }

      showUpdatingModal('busyTime');
      document.getElementById('briefName').innerHTML = '';
      displayOneBusyModal(sortedBusiness[i]);
      //			alert(sortedBusiness[i]);
      //            console.log("###########################################")
      //            console.log(sortedBusiness[i]['id'])
      sessionStorage.setItem('idCurUser', sortedBusiness[i]['id']);
      document.getElementById('importInput').value = fCompressCodeTime(
        getTimeCode(),
      );

      //<Наслоение дел - Все дела>=================================================

      if (todoIsActive()) {
        setTimeout(() => {
          closeTodoLayers(document.querySelector('#tableUser'));
          isLayersCanBeDisplayed(document.querySelector('#tableUser'), [
            document.querySelector('#btnTodo').dataset.id,
          ]);
        }, 200);
      }

      //</Наслоение дел - Все дела>=========================================================
    });

    const tableSixthTd = document.createElement('td');

    const tableSixthTdIcon = document.createElement('i');

    tableSixthTd.append(tableSixthTdIcon);
    tableSixthTd.classList = 'bi bi-calendar3 hovered';

    tableSixthTd.addEventListener('click', () => {
      showUpdatingModal('busyTime');
      displayOneBusyModal(sortedBusiness[i]);
      document.getElementById('importInput').value = fCompressCodeTime(
        getTimeCode(),
      );

      //<Наслоение дел - Все дела>=================================================

      if (todoIsActive()) {
        setTimeout(() => {
          closeTodoLayers(document.querySelector('#tableUser'));
          isLayersCanBeDisplayed(document.querySelector('#tableUser'), [
            document.querySelector('#btnTodo').dataset.id,
          ]);
        }, 200);
      }

      //</Наслоение дел - Все дела>=========================================================
    });

    const tableSeventhTd = document.createElement('td');
    const tableSeventhTdIcon = document.createElement('i');
    tableSeventhTd.append(tableSeventhTdIcon);
    tableSeventhTd.classList = 'bi bi-trash text-danger hovered';

    tableSeventhTd.addEventListener('click', () => {
      //			alert(confirm("<Text name='Warning'>Предупреждение!</Text>","<Text name='AreSure'>Tы уверен?</Text>"));

      if (
        //				confirm("<Text name='Warning'>Предупреждение!</Text>","<Text name='AreSure'>Tы уверен?</Text>")
        confirm('Вы уверены, что хотите удалить эту запись?')
      ) {
        deleteBusy(sortedBusiness[i]);
        Translate();
      }
    });

    const classes =
      'user-table table table-bordered table text-dark table-striped';

    table.classList = classes;

    tableFirstTd.textContent = ``;
    tableFirstTd.style.width = '10%';
    tableSecondTd.textContent = `${
      business.findIndex(busy => busy.id === sortedBusiness[i].id) + 1
    }`;
    tableSecondTd.style.width = '7%';
    tableThirdTd.textContent = `${sortedBusiness[i].description}`;
    tableThirdTd.style.width = '61%';
    tableThirdTd.style.paddingLeft = '5px';
    tableSixthTd.textContent = ``;
    tableSixthTd.style.width = '10%';
    tableSeventhTd.textContent = ``;
    tableSeventhTd.style.width = '12%';
    tr.appendChild(tableFirstTd);
    tr.appendChild(tableSecondTd);
    tr.appendChild(tableThirdTd);
    tr.appendChild(tableSixthTd);
    tr.appendChild(tableSeventhTd);
    tbody.appendChild(tr);

    //				if (i == sortedBusiness.length - 1) {
    //					const trB = document.createElement('tr');
    //					trB.style.paddingLeft = '25px';
    //
    //					const tableNullTd = document.createElement('td');
    //					tableNullTd.textContent = ``;
    //					tableNullTd.style.width = '10%';
    //					trB.appendChild(tableNullTd);
    //
    //					const tableFirstTdB = document.createElement('td');
    //					tableFirstTdB.setAttribute('colspan', '4');
    //					tableFirstTdB.style.textAlign = 'left';
    //					tableFirstTdB.style.fontWeight = '500';
    //					tableFirstTdB.style.backgroundColor = 'white';
    ////					tableFirstTdB.innerHTML = `<span trans="text+:total;"> Итого: </span><span>${String(//					sortedBusiness.length
    ////						)} </span><span trans="text+:record">запись(и)</span>`;
    //					trB.appendChild(tableFirstTdB);
    //					tbody.appendChild(trB);
    //
    //					if (sortedBusiness.length > 11) {
    //						const trB2 = document.createElement('tr');
    //						const tableFirstTdB2 = document.createElement('td');
    //						tableFirstTdB2.setAttribute('colspan', '5');
    //						tableFirstTdB2.style.textAlign = 'left';
    //						tableFirstTdB2.style.backgroundColor = 'white';
    //						tableFirstTdB2.textContent = ' ';
    //
    //						trB2.appendChild(tableFirstTdB2);
    //						tbody.appendChild(trB2);
    //					}
    //					Translate();
    //						}
  }

  //обавляем пустую строку к списку, чтобы видно было нижнюю строку из-за фиксированного футера
  //    let dop = document.createElement('p')
  //    dop.innerHTML = " "
  //    dop.style.height = "16px";
  //    section.append(dop);
}

function sortBusiness() {
  const select = document.getElementById('businessSorting');
  if (select) {
    let sorting;
    for (let i = 0; i < select.children.length; i++) {
      if (select.children[i].selected) {
        sorting = select.children[i].value;
      }
    }

    let descs = [];

    business.forEach(item => descs.push([item.description, item.id]));

    let sortedDescs = [...descs].sort();

    let temp = [];

    switch (sorting) {
      case 'numAscending':
        sortedBusiness = [...business];
        break;
      case 'numDescending':
        sortedBusiness = [...business].reverse();
        break;
      case 'nameAscending':
        // sortedBusiness = [...business].sort();
        for (let i = 0; i < sortedDescs.length; i++) {
          let busy = [...business].find(
            item =>
              item.description === sortedDescs[i][0] &&
              item.id === sortedDescs[i][1],
          );
          temp.push(busy);
        }
        sortedBusiness = temp;
        temp = [];
        break;
      case 'nameDescending':
        for (let i = sortedDescs.length - 1; i >= 0; i--) {
          let busy = [...business].find(
            item =>
              item.description === sortedDescs[i][0] &&
              item.id === sortedDescs[i][1],
          );
          temp.push(busy);
        }
        sortedBusiness = temp;
        temp = [];
        break;
      default:
        sortedBusiness = [...business];
        break;
    }
    loadBusinessTable();
    clearTable();
  }
}

function displayUsersAndBusiness() {
  clearEverything();
  const section = document.getElementById('section');

  if (
    section &&
    section.querySelector('.user-table') &&
    section.querySelector('.user-table').querySelector('tbody')
  ) {
    const tbody = section.querySelector('.user-table').querySelector('tbody');
    const userChildren = tbody.children;

    for (let i = 0; i < userChildren.length; i++) {
      let id = parseInt(userChildren[i].id);
      if (
        userChildren[i].firstElementChild.classList.contains(
          'bi-check-square-fill',
        )
      ) {
        if (!usersToDisplay.find(user => user.id === id)) {
          usersToDisplay.push(users.find(item => item.id === id));
        }
      } else {
        usersToDisplay =
          usersToDisplay.length > 0
            ? usersToDisplay.filter(user => user.id !== id)
            : [];
      }
    }

    for (let i = 0; i < usersToDisplay.length; i++) {
      setItems(usersToDisplay[i]);
    }

    const bestMatches = findBestMatch();
    // console.log(bestMatches);
    bestMatches.forEach(item => {
      //            console.log(item);
      const el = document.getElementById(item[1]).querySelector(`.${item[2]}`);
      if (el.innerHTML.length == 0) {
        el.style.background = colorStudent[getRandomColor];
      } else {
        el.style.background = 'DarkOrange';
      }
      el.style.boxSizing = 'border-box';
      el.style.fontSize = '13px';
      el.style.fontWeight = '800';
      el.style.paddingBottom = '0';
      el.setAttribute('maximum', 1);
    });
  }

  if (
    businessTableDiv &&
    businessTableDiv.querySelector('section') &&
    businessTableDiv.querySelector('section').lastElementChild &&
    businessTableDiv
      .querySelector('section')
      .lastElementChild.querySelector('tbody')
  ) {
    const busyChildren = businessTableDiv
      .querySelector('section')
      .lastElementChild.querySelector('tbody').children;

    for (let i = 0; i < busyChildren.length; i++) {
      let index =
        parseInt(
          busyChildren[i].firstElementChild.nextElementSibling.textContent,
        ) - 1;
      if (
        busyChildren[i].firstElementChild.classList.contains(
          'bi-check-square-fill',
        )
      ) {
        if (!businessToDisplay.find(busy => busy.id === business[index].id)) {
          businessToDisplay.push(business[index]);
        }
      } else {
        businessToDisplay =
          businessToDisplay.length > 0
            ? businessToDisplay.filter(busy => busy.id !== business[index].id)
            : [];
      }
    }

    for (let i = 0; i < businessToDisplay.length; i++) {
      setItems(businessToDisplay[i], false);
    }
  }
}

function displayOneUserModal(currentUser) {
  clearEverything();

  let binArray = toBinArray(currentUser);
  if (numberStudent > 18) numberStudent = -1; // Oleg
  numberStudent++; // Oleg
  let curColorStudent = colorStudent[numberStudent]; // Oleg

  for (let i = 0; i < 7; i++) {
    let curObjDay = '.day' + String(i);
    let curDay = document
      .querySelector('.modal-content')
      .querySelectorAll(curObjDay);

    for (let j = 0; j < curDay.length; j++) {
      if (binArray[i][j + 1] === '1') {
        curDay[j].style.background = curColorStudent;
      }
    }
  }

  fullName.value = currentUser.name;
  //    debugger;
  for (let i = 0; i < selectLevel.children.length; i++) {
    if (selectLevel.children[i].value === currentUser.currentLevel) {
      selectLevel.children[i].selected = true;
      currentLevel = currentUser.currentLevel;
    }
  }

  for (let i = 0; i < selectCourse.children.length; i++) {
    if (selectCourse.children[i].value === currentUser.currentCourse) {
      selectCourse.children[i].selected = true;
      currentCourse = currentUser.currentCourse;
    }
  }

  currUser = currentUser;
}

function tempUserUpdate(user) {
  // console.log(user);
  const index = users.findIndex(what => what.id === user.id);
  // console.log(index);
  users[index] = user;
  // console.log(users);

  saveDataTo(
    sessionStorage.getItem('typeBase'),
    sessionStorage.getItem('globalLogin'),
    'users',
    JSON.stringify(users),
  );
  //	localStorage.setItem("users", JSON.stringify(users));

  // console.log(users);
  filterUsers();
  $('#staticBackdrop').modal('hide');
  Translate();
}

function saveUser() {
  if (sessionStorage.getItem('globalLogin') == 'demodemo') {
    alerter(
      "<Text trans='text+:Warning;' name='disable'>Предупреждение</Text>",
      `<Text trans="text+:userDemo;" name='disable'>
						Демонстрационный доступ с пользователем <b>demodemo</b> не позволяет изменять имена и другие настройки и служит только для демострации сервиса составления расписания. Зарегистрируйтесь и получите доступ к всем сервисам системы сотавления расписани и работы со временем!</Text>`,
      'standart',
      'warning',
      'standart',
    );
  }

  const { decDay } = checkDec();

  let setShed = document.getElementById('flexCheckDefault').checked;

  if (currentCourse && currentLevel && fullName.value !== '') {
    debugger;
    // console.log(currentCourse, currentLevel, fullName.value);

    if (currUser) {
      const index = users.findIndex(user => user.id === currUser.id);
      let updatedUser = {
        ...currUser,
        name: fullName.value,
        currentCourse,
        currentLevel,
        days: decDay,
        setShed,
      };

      users[index] = updatedUser;
    } else {
      const tempUser = users.find(
        user =>
          user.name === fullName.value &&
          user.currentCourse === currentCourse &&
          user.currentLevel === currentLevel,
      );
      if (tempUser) {
        tempUser.days = decDay;
        sessionStorage.setItem('tempUser', JSON.stringify(tempUser));
        alerter(
          "<Text trans='text+:Warning;' name='disable'>Предуfние</Text>",
          `<Text trans="text+:userWith;" name='disable'>
						Пользователь с таким же именем, курсом и уровнем уже существует. Либо измените данные, либо обновите уже существующего пользователя.</Text>`,
          'standart',
          'warning',
          '<button type="button" class="btn btn-sm btnUpdate m-2 " style="font-weight: 500;color: black; font-size: 1em; background-color:#48c2a9;">Обновить</button>',
        );
        return;
      }

      let user = {
        id: new Date().getTime(),
        name: fullName.value,
        currentCourse,
        currentLevel,
        days: decDay,
        setShed,
      };

      users.push(user);
    }

    if (users.length === 1) {
      sortedUsers = [...users];
      sortedFilteredUsers = [...sortedUsers];
    }

    importInput.value = '';

    saveDataTo(
      sessionStorage.getItem('typeBase'),
      sessionStorage.getItem('globalLogin'),
      'users',
      JSON.stringify(users),
    );
    //		localStorage.setItem("users", JSON.stringify(users));

    filterUsers();
    $('#staticBackdrop').modal('hide');
    Translate();
  } else {
    alerter(
      '<Text trans="text+:AlertErrorHeader;">Ошибка</Text>',
      '<Text trans="text+:AlertErrorBody1;">Информация введена не полностью. Введите курс, уровень и имя</Text>',
      'standart',
      'danger',
      'standart',
    );
  }
}

function deleteUser(userToDelete) {
  users = users.filter(user => user.id !== userToDelete.id);
  filterUsers();
  saveDataTo(
    sessionStorage.getItem('typeBase'),
    sessionStorage.getItem('globalLogin'),
    'users',
    JSON.stringify(users),
  );
  //	localStorage.setItem("users", JSON.stringify(users));

  clearShowingButtons();
  // loadStudentsTable();
}

function clearModalTable() {
  for (let i = 0; i < 7; i++) {
    let curObjDay = '.day' + String(i);
    let curDay = document
      .querySelector('.modal-content')
      .querySelectorAll(curObjDay);

    curDay.forEach(item => (item.style.background = 'transparent'));
  }
}

function clearShowingButtons() {
  clearEverything();
  const section = document.getElementById('section');

  if (
    section &&
    section.querySelector('.user-table') &&
    section.querySelector('.user-table').querySelector('tbody')
  ) {
    const tbody = section.querySelector('.user-table').querySelector('tbody');
    const userChildren = tbody.children;

    for (let i = 0; i < userChildren.length; i++) {
      if (
        userChildren[i].firstElementChild.classList.contains(
          'bi-check-square-fill',
        )
      ) {
        userChildren[i].firstElementChild.classList.remove(
          'bi-check-square-fill',
        );
        userChildren[i].firstElementChild.classList.add('bi-square');
      }
    }
  }

  if (
    businessTableDiv &&
    businessTableDiv.querySelector('section') &&
    businessTableDiv.querySelector('section').lastElementChild &&
    businessTableDiv
      .querySelector('section')
      .lastElementChild.querySelector('tbody')
  ) {
    const busyChildren = businessTableDiv
      .querySelector('section')
      .lastElementChild.querySelector('tbody').children;

    for (let i = 0; i < busyChildren.length; i++) {
      if (
        busyChildren[i].firstElementChild.classList.contains(
          'bi-check-square-fill',
        )
      ) {
        busyChildren[i].firstElementChild.classList.remove(
          'bi-check-square-fill',
        );
        busyChildren[i].firstElementChild.classList.add('bi-square');
      }
    }
  }
}

function saveBusySchedule() {
  if (sessionStorage.getItem('globalLogin') == 'demodemo') {
    alerter(
      "<Text trans='text+:Warning;' name='disable'>Предупреждение</Text>",
      `<Text trans="text+:userDemo;" name='disable'>
						Демонстрационный доступ с пользователем <b>demodemo</b> не позволяет изменять имена и другие настройки и служит только для демострации сервиса составления расписания. Зарегистрируйтесь и получите доступ к всем сервисам системы сотавления расписани и работы со временем!</Text>`,
      'standart',
      'warning',
      'standart',
    );
  }

  const { decDay } = checkDec();

  if (fullName.value !== '') {
    if (currBusiness) {
      const index = business.findIndex(busy => busy.id === currBusiness.id);

      let updatedBusy = {
        ...currBusiness,
        description: fullName.value,
        days: decDay,
      };

      business[index] = updatedBusy;
    } else {
      let busy = {
        id: new Date().getTime(),
        description: fullName.value,
        days: decDay,
      };

      business.push(busy);
    }

    if (business.length === 1) {
      sortedBusiness = [...business];
    } else {
      sortBusiness();
    }

    importInput.value = '';

    saveDataTo(
      sessionStorage.getItem('typeBase'),
      sessionStorage.getItem('globalLogin'),
      'business',
      JSON.stringify(business),
    );
    //		localStorage.setItem("business", JSON.stringify(business));
    loadBusinessTable();
    $('#staticBackdrop').modal('hide');
  } else {
    alerter(
      '<Text trans="text+:AlertErrorHeader;">Ошибка</Text>',
      '<Text trans="text+:AlertErrorBody2;">Информация введена не полностью. Введите имя</Text>',
      'standart',
      'danger',
      'standart',
    );
  }
}

function displayOneBusyModal(currentBusiness) {
  clearEverything();

  let binArray = toBinArray(currentBusiness);

  for (let i = 0; i < 7; i++) {
    let curObjDay = '.day' + String(i);
    let curDay = document
      .querySelector('.modal-content')
      .querySelectorAll(curObjDay);

    for (let j = 0; j < curDay.length; j++) {
      if (binArray[i][j + 1] === '1') {
        curDay[j].style.background = 'RoyalBlue';
      }
    }
  }

  fullName.value = currentBusiness.description;
  document
    .getElementById('btnTodo')
    .setAttribute('data-id', currentBusiness.id);

  currBusiness = currentBusiness;
}

function deleteBusy(busyToDelete) {
  business = business.filter(busy => busy.id !== busyToDelete.id);
  sortBusiness();
  saveDataTo(
    sessionStorage.getItem('typeBase'),
    sessionStorage.getItem('globalLogin'),
    'business',
    JSON.stringify(business),
  );
  //	localStorage.setItem("business", JSON.stringify(business));
  clearShowingButtons();
  loadBusinessTable();
}

function changeTimeSelector() {
  let time;
  for (let i = 0; i < timeSelector.children.length; i++) {
    if (timeSelector.children[i].selected) {
      time = timeSelector.children[i].value;
    }
  }

  if (time === 'freeTime') {
    fullName.setAttribute('trans', 'text+:name;');
    selectCourseSpan.style.display = 'inline-block';
    selectLevelSpan.style.display = 'inline-block';
    strCourseLevel.style.display = 'flex';
    //		document.getElementById("selectCourseName").style.display = "inline-block"
    //        document.getElementById("Level1").style.display = "inline-block";
    //        document.getElementById("Level2").style.display = "inline-block";
    document.getElementById('levelSelector').style.display = 'inline-block';
    document.getElementById('courseSelector').style.display = 'inline-block';
    document.getElementById('btnTodo').style.display = 'none';
    nbts.removeEventListener('click', saveBusySchedule);
    nbts.addEventListener('click', saveUser);

    courseSelectorSpan;
  } else {
    if (toDoOn) {
      document.getElementById('btnTodo').style.display = 'inline-block';
    }

    fullName.setAttribute('trans', 'text+:desc;');
    //        document.getElementsByName("Level1").style.display = "none";
    //        document.getElementsByName("Level2").style.display = "none";
    selectCourseSpan.style.display = 'none';
    selectLevelSpan.style.display = 'none';
    strCourseLevel.style.display = 'none';
    //        document.getElementById("Level1").style.display = "none";
    //        document.getElementById("Level2").style.display = "none";
    document.getElementById('levelSelector').style.display = 'none';
    document.getElementById('courseSelector').style.display = 'none';
    nbts.removeEventListener('click', saveUser);
    nbts.addEventListener('click', saveBusySchedule);
  }
  Translate();
}

function showUpdatingModal(type) {
  document.getElementById('importInput').value = '';
  //	document.getElementById("loginSendTimeCode").value = "";

  if (type === 'freeTime') {
    document.getElementById('btnTodo').style.display = 'none';
    document.getElementById('dataTitle').display = 'block';
    document
      .getElementById('dataTitle')
      .setAttribute('trans', 'text+:FreeTime;');
    //        document.getElementById("dataTitle").innerHTML = "СВОБОДНОЕ ВРЕМЯ";
    fullName.setAttribute('trans', 'text+:name;');
    // fullName.placeholder = "Name";
    selectCourseSpan.style.display = 'inline-block';
    selectLevelSpan.style.display = 'inline-block';
    strCourseLevel.style.display = 'flex';

    //        document.getElementById("Level1").style.display = "inline-block";
    //        document.getElementById("Level2").style.display = "inline-block";
    document.getElementById('levelSelector').style.display = 'inline-block';
    document.getElementById('courseSelector').style.display = 'inline-block';
    document.getElementById('strCourseLevel').style.display = 'flex';

    nbts.removeEventListener('click', saveBusySchedule);
    nbts.addEventListener('click', saveUser);
  } else {
    if (toDoOn) {
      document.getElementById('btnTodo').style.display = 'inline-block';
    }
    fullName.setAttribute('trans', 'text+:desc;');
    document.getElementById('dataTitle').display = 'block';
    document
      .getElementById('dataTitle')
      .setAttribute('trans', 'text+:BusyTime;');
    //        document.getElementById("dataTitle").innerHTML = "ЗАНЯТОЕ ВРЕМЯ";
    // fullName.placeholder = "Description";
    selectCourseSpan.style.display = 'none';
    selectLevelSpan.style.display = 'none';
    strCourseLevel.style.display = 'none';

    //        document.getElementById("Level1").style.display = "none";
    //        document.getElementById("Level2").style.display = "none";
    document.getElementById('levelSelector').style.display = 'none';
    document.getElementById('courseSelector').style.display = 'none';

    nbts.removeEventListener('click', saveUser);
    nbts.addEventListener('click', saveBusySchedule);
  }
  Translate();

  timeSelectorSpan.style.display = 'none';
  for (let i = 0; i < timeSelector.children.length; i++) {
    if (type === timeSelector.children[i].value) {
      timeSelector.children[i].selected = true;
    }
  }

  //	document.getElementById('importInput').value = fCompressCodeTime(getTimeCode())
  //    console.log(document.getElementById('importInput').value)
  //    console.log(fCompressCodeTime(getTimeCode()))
  //    console.log(getTimeCode())

  $('#staticBackdrop').modal('show');
}

function findBestMatch() {
  let array = [...allMatches].sort((a, b) => b[0] - a[0]);
  let result = [];

  for (let i = 0; i < array.length; i++) {
    // if (array[i - 1] && array[i - 1][0] && array[i][0] === array[i - 1][0]) {
    result.push(array[i]);
    // }
    if (i === array.length - 1 || array[i][0] > array[i + 1][0]) break;
  }

  if (result.length > 0) {
    sessionStorage.setItem('BestMatch', result[0][0]);
  } else {
    sessionStorage.setItem('BestMatch', 0);
  }

  return result;
}

document
  .getElementById('btnFullScreen4orange')
  .addEventListener('click', () => {
    let tdFull = document.querySelectorAll('.fullTable td');
    let bestMatch = sessionStorage.getItem('BestMatch');
    for (let i = 0; i < tdFull.length; i++) {
      if (tdFull[i].childNodes[0]) {
        if (tdFull[i].childNodes[0].innerHTML == bestMatch) {
          tdFull[i].style.backgroundColor = 'DarkOrange';

          tdFull[i].setAttribute('maximum', 1);
        }
      }
    }
  });

function creatingOptions(array, type) {
  createParamOption();

  //    debugger;

  //    for (let i = 0; i < array.length; i++) {
  //
  //        let option = document.createElement('option');
  //        //        console.log(option)
  //        option.value = array[i].toString();
  //        option.innerHTML = array[i].toString();
  //
  //        if (type === 'course') {
  //            selectCourse.appendChild(option);
  //        } else if (type === 'grade') {
  //            //            console.log(option)
  //            selectLevel.appendChild(option);
  //        }
  //    }
}

function splittingCourses() {
  const text = courseText.value;

  // if ()
  //    let courses = JSON.parse(localStorage.getItem("courses")) || [];

  let courses =
    JSON.parse(
      getDataFrom(
        sessionStorage.getItem('typeBase'),
        sessionStorage.getItem('globalLogin'),
        'courses',
      ),
    ) || [];

  // else
  // 	let course = удаленно

  //    let filteredCourses =
  //        JSON.parse(localStorage.getItem("filteredCourses")) || courses;

  let filteredCourses =
    JSON.parse(
      getDataFrom(
        sessionStorage.getItem('typeBase'),
        sessionStorage.getItem('globalLogin'),
        'filteredCourses',
      ),
    ) || courses;

  let options = text.split(',');
  options = [...new Set(options.map(item => item.trim()))];

  creatingOptions(options, 'course');

  if (options[options.length - 1] == '') {
    options.pop();
  }

  saveDataTo(
    sessionStorage.getItem('typeBase'),
    sessionStorage.getItem('globalLogin'),
    'courses',
    JSON.stringify(options),
  );
  //	localStorage.setItem("courses", JSON.stringify([...courses, ...options]));

  saveDataTo(
    sessionStorage.getItem('typeBase'),
    sessionStorage.getItem('globalLogin'),
    'filteredCourses',
    JSON.stringify([...filteredCourses, ...options]),
  );
  //	localStorage.setItem(
  //		"filteredCourses",
  //		JSON.stringify([...filteredCourses, ...options])
  //	);

  courseText.value = '';
  // console.log(options.at(-1));
}

export function splittingGrades() {
  const text = gradeText.value;
  //    let grades = JSON.parse(localStorage.getItem("grades")) || [];

  let grades =
    JSON.parse(
      getDataFrom(
        sessionStorage.getItem('typeBase'),
        sessionStorage.getItem('globalLogin'),
        'grades',
      ),
    ) || [];

  //    let filteredGrades =
  //        JSON.parse(localStorage.getItem("filteredGrades")) || grades;
  //

  //    let filteredGrades =
  //        JSON.parse(
  //            getDataFrom(
  //                sessionStorage.getItem('typeBase'),
  //                sessionStorage.getItem('globalLogin'),
  //                'filteredGrades'
  //            )
  //        ) || grades;

  let options = text.split(',');
  options = [...new Set(options.map(item => item.trim()))];

  //    console.log(options)
  //    console.log([...options])

  //    creatingOptions(options, 'grade');
  //    console.log("2644")
  //    console.log("в поле ввода")
  //    console.log(options)
  //    console.log("из хранилища")
  //    console.log([...grades, ...options])

  if (options[options.length - 1] == '') {
    options.pop();
  }

  saveDataTo(
    sessionStorage.getItem('typeBase'),
    sessionStorage.getItem('globalLogin'),
    'grades',
    JSON.stringify(options),
  );
  //	localStorage.setItem("grades", JSON.stringify([...grades, ...options]));

  //    saveDataTo(
  //        sessionStorage.getItem('typeBase'),
  //        sessionStorage.getItem('globalLogin'),
  //        'filteredGrades',
  //        JSON.stringify([...filteredGrades, ...options])
  //    );
  //	localStorage.setItem(
  //		"filteredGrades",
  //		JSON.stringify([...filteredGrades, ...options])
  //	);

  gradeText.value = '';
  // console.log(options.at(-1));

  //    повторное получение данных после обновления 02.01.2024

  grades =
    JSON.parse(
      getDataFrom(
        sessionStorage.getItem('typeBase'),
        sessionStorage.getItem('globalLogin'),
        'grades',
      ),
    ) || [];
}

function decodeTheTimeCode(value) {
  let result = [];
  try {
    result = Array.from(value)
      .reduce(
        (acc, char) => acc.concat((char.charCodeAt() - 952).toString(2)),
        [],
      )
      .map(bin => '0'.repeat(8 - bin.length) + bin);
  } catch (e) {
    result = [];
    alerter(
      '<Text trans="text+:AlertErrorHeader;">Ошибка</Text>',
      '<Text trans="text+:AlertErrorBody3;">Неверный формат</Text>',
      'standart',
      'danger',
      'standart',
    );
  }
  return result;
}

export function fCompressCodeTime(codeTime) {
  let compressCodeTime = '';
  let abc28 = '0123456789ABCDEFGHIJKLMNOPQRS';
  let curSimbol = codeTime[0];
  let cntSimbol = 1;
  for (let i = 1; i < abc28.length + 1; i++) {
    if (curSimbol == codeTime[i]) cntSimbol++;
    else if (cntSimbol >= abc28.length - 1) {
      compressCodeTime = abc28[cntSimbol] + curSimbol;
      break;
    } else {
      if (cntSimbol > 1) {
        compressCodeTime += abc28[cntSimbol] + curSimbol;
      } else {
        compressCodeTime += curSimbol;
      }
      curSimbol = codeTime[i];
      cntSimbol = 1;
    }
  }
  return compressCodeTime;
}

export function fDeCompressCodeTime(compressCodeTime) {
  let codeTime = '';
  let abc28 = '0123456789ABCDEFGHIJKLMNOPQRS';
  if (compressCodeTime.length != abc28.length) {
    for (let i = 0; i < compressCodeTime.length; i++) {
      let curSimbol = compressCodeTime[i];
      let cntSimbol = +abc28.indexOf(curSimbol);
      if (cntSimbol >= 0) {
        codeTime += compressCodeTime[i + 1].repeat(cntSimbol);
        i++;
      } else {
        codeTime += compressCodeTime[i];
      }
    }
  } else {
    codeTime = compressCodeTime;
  }
  return codeTime;
}

function importTime() {
  if (document.getElementById('importInput').value == '') {
    alerter(
      '<Text trans="text:AlertErrorHeader;">Ошибка</Text>',
      '<Text trans="text+:sendCodeError3;">Не введен код времени. Импорт невозможен! Вставьте код в поле!</Text>',
      'standart',
      'danger',
      'standart',
    );
  } else {
    clearModalTable();
    let code = fDeCompressCodeTime(importInput.value).trim();
    //	alert(fDeCompressCodeTime(importInput.value))
    //	let code = importInput.value;

    let binCode = decodeTheTimeCode(code);
    let res = [];
    let str = '';
    binCode.forEach((item, index) => {
      if (index % 4 === 0) str += '1';
      if ((index + 1) % 4 === 0) {
        str += item[0];
        res.push(str);
        str = '';
      } else {
        str += item;
      }
    });
    //        importInput.value = "";

    for (let i = 0; i < 7; i++) {
      let curObjDay = '.day' + String(i);
      let curDay = document
        .querySelector('.modal-content')
        .querySelectorAll(curObjDay);

      for (let j = 0; j < curDay.length; j++) {
        if (res.length === 7) {
          if (res[i][j + 1] === '1') {
            curDay[j].style.background = 'seagreen';
          }
        } else {
          curDay[j].style.background = 'transparent';
        }
      }
    }
  }
}

export function filterUsers() {
  //    console.log("---2748---")
  //    console.log(filteredUsers)
  filteredUsers = [];
  users.forEach(item => {
    if (
      (filteredCourses.includes(item.currentCourse) ||
        item.currentCourse === 'Any') &&
      (filteredGrades.includes(item.currentLevel) ||
        item.currentLevel === 'Any')
    ) {
      if (
        localStorage.getItem('checkbox1') == 'true' &&
        localStorage.getItem('checkbox2') == 'true'
      ) {
        filteredUsers.push(item);
      } else if (
        localStorage.getItem('checkbox1') == 'true' &&
        localStorage.getItem('checkbox2') == 'false'
      ) {
        if (item.setShed == false || item.setShed == undefined) {
          filteredUsers.push(item);
        }
      } else if (
        localStorage.getItem('checkbox1') == 'false' &&
        localStorage.getItem('checkbox2') == 'true'
      ) {
        if (item.setShed == true) {
          filteredUsers.push(item);
        }
      } else if (
        localStorage.getItem('checkbox1') == 'false' &&
        localStorage.getItem('checkbox2') == 'false'
      ) {
        alerter(
          '<Text trans="text+:AlertErrorHeader;">Ошибка</Text>',
          '<Text trans="text+:AlertErrorBody133;">Выберите как минимум один вариантов показа (с расписанием или без)</Text>',
          'standart',
          'danger',
          'standart',
        );
      }
      //-----------------
      //			filteredUsers.push(item);
      //			!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    }
  });
  //    alert(filteredUsers, '2761')
  //    console.log(filteredUsers, '2762')
  saveDataTo(
    sessionStorage.getItem('typeBase'),
    sessionStorage.getItem('globalLogin'),
    'filteredUsers',
    JSON.stringify(filteredUsers),
  );

  //    console.log("#######-filteredUsers-analis#################")
  //    console.log(filteredUsers, '2728 -  - filterUsers() ');
  //	console.log(sessionStorage.getItem('typeBase'), sessionStorage.getItem('globalLogin'), '2728');
  //	console.log("Session", sessionStorage.getItem('filteredUsers'))
  //	console.log("Local", localStorage.getItem('filteredUsers'))
  //	console.log("##############################################")

  //	localStorage.setItem("filteredUsers", JSON.stringify(filteredUsers));

  sortUsers();
}

function createModal() {
  if (!body.contains(document.querySelector('.filter-modal'))) {
    const div = document.createElement('div');

    div.classList.add('filter-modal', 'blocked');
    // div.classList.add("blocked");
    div.setAttribute('name', 'close-modal');
    body.appendChild(div);

    //		div.addEventListener("click", e => {
    //			// console.log(e.target);
    //			if (
    //				e.target &&
    //				e.target.attributes &&
    //				e.target.attributes.name &&
    //				e.target.attributes.name.nodeValue === "close-modal"
    //			) {
    //				div.classList.remove("blocked");
    //				div.classList.add("closed");
    //			}
    //		});

    const modalBody = document.createElement('div');
    modalBody.style.backgroundColor = 'Gainsboro';
    //		modalBody.style.height = "60%";

    if (window.innerWidth < 400) modalBody.style.width = '320px';
    else if (window.innerWidth < 600) modalBody.style.width = '420px';
    else modalBody.style.width = '600px';

    modalBody.style.overflowY = 'auto';
    const title = document.createElement('div');
    const titleText = document.createElement('Text');
    title.className = 'filter-modal-title';
    titleText.innerHTML = 'Фильтры';
    titleText.setAttribute('trans', 'text+:FilterTitle;');
    title.appendChild(titleText);
    modalBody.className = 'filter-modal-body';
    modalBody.appendChild(title);

    const filtersDiv = document.createElement('div');

    const coursesDiv = document.createElement('div');
    const gradesDiv = document.createElement('div');
    const flagShedDiv = document.createElement('div');

    const coursesDivTitle = document.createElement('Text');
    const gradesDivTitle = document.createElement('Text');
    const flagShedDivTitle = document.createElement('Text');

    coursesDivTitle.innerHTML = localStorage.getItem('param1Name') + '<br>';
    coursesDivTitle.id = 'courses-div-title';
    gradesDivTitle.innerHTML = localStorage.getItem('param2Name') + '<br>';
    gradesDivTitle.id = 'grades-div-title';
    flagShedDivTitle.innerHTML = 'Признак расписания' + '<br>';
    flagShedDivTitle.id = 'flag-div-title';

    //		coursesDivTitle.setAttribute('trans', 'text+:CoursesDivTitle;');
    //		gradesDivTitle.setAttribute('trans', 'text+:GradesDivTitle;');
    flagShedDivTitle.setAttribute('trans', 'text+:flagShedDivTitle;');

    coursesDiv.appendChild(coursesDivTitle);
    gradesDiv.appendChild(gradesDivTitle);
    flagShedDiv.appendChild(flagShedDivTitle);

    filtersDiv.className = 'filter-modal-div';

    if (window.innerWidth < 400) {
      filtersDiv.style.height = '350px';
      filtersDiv.style.paddingTop = '150px';
    } else {
      filtersDiv.style.height = '422px';
      filtersDiv.style.paddingTop = '30px';
    }

    filtersDiv.style.overflowY = 'auto';

    coursesDiv.className = 'filter-modal-courses-div';
    gradesDiv.className = 'filter-modal-grades-div';
    //		flagShedDiv.className = 'filter-modal-flagShed-div';
    filtersDiv.appendChild(coursesDiv);
    filtersDiv.appendChild(gradesDiv);
    filtersDiv.appendChild(flagShedDiv);

    //Место для флага расписания

    const checkbox1span = document.createElement('span');
    const checkbox1 = document.createElement('input');
    checkbox1.type = 'checkbox';
    checkbox1.name = '';
    checkbox1.value = 'flafOff';
    checkbox1.id = 'checkbox1';
    const label1 = document.createElement('label');
    label1.style.paddingLeft = '5px';
    label1.style.cursor = 'pointer';
    label1.htmlFor = 'flafOff';
    label1.appendChild(document.createTextNode('Расписания нет'));

    checkbox1span.style.width = '48%';
    checkbox1span.style.textAlign = 'left';
    checkbox1span.style.backgroundColor = 'white';
    checkbox1span.style.display = 'inline-block';
    checkbox1span.style.margin = '2px';
    checkbox1span.style.padding = '5px 10px';
    checkbox1span.style.fontSize = '10px';
    checkbox1.style.fontWeight = '500';
    checkbox1.style.cursor = 'pointer';

    if (!localStorage.getItem('checkbox1')) {
      checkbox1.checked = true;
      localStorage.getItem('checkbox1', true);
    } else {
      if (localStorage.getItem('checkbox1') == 'false') {
        checkbox1.checked = false;
      } else if (localStorage.getItem('checkbox1') == 'true') {
        checkbox1.checked = true;
      } else {
        checkbox1.checked = true;
      }
    }

    checkbox1.addEventListener('click', () => {
      localStorage.setItem('checkbox1', checkbox1.checked);
    });

    checkbox1span.appendChild(checkbox1);
    checkbox1span.appendChild(label1);
    flagShedDiv.appendChild(checkbox1span);

    const checkbox2span = document.createElement('span');
    const checkbox2 = document.createElement('input');
    checkbox2.type = 'checkbox';
    checkbox2.name = '';
    checkbox2.value = 'flafOn';
    checkbox2.id = 'checkbox2';

    const label2 = document.createElement('label');
    label2.style.paddingLeft = '5px';
    label2.style.cursor = 'pointer';
    label2.htmlFor = 'flafOn';
    label2.appendChild(document.createTextNode('Расписание есть'));

    checkbox2span.style.width = '48%';
    checkbox2span.style.textAlign = 'left';
    checkbox2span.style.backgroundColor = 'white';
    checkbox2span.style.display = 'inline-block';
    checkbox2span.style.margin = '2px';
    checkbox2span.style.padding = '5px 10px';
    checkbox2span.style.fontSize = '10px';
    checkbox2.style.fontWeight = '500';
    checkbox2.style.cursor = 'pointer';

    if (!localStorage.getItem('checkbox2')) {
      checkbox2.checked = true;
      localStorage.getItem('checkbox2', true);
    } else {
      if (localStorage.getItem('checkbox2') == 'false') {
        checkbox2.checked = false;
      } else if (localStorage.getItem('checkbox2') == 'true') {
        checkbox2.checked = true;
      } else {
        checkbox2.checked = true;
      }
    }

    checkbox2.addEventListener('click', () => {
      localStorage.setItem('checkbox2', checkbox2.checked);
    });

    checkbox2span.appendChild(checkbox2);
    checkbox2span.appendChild(label2);
    flagShedDiv.appendChild(checkbox2span);
    flagShedDiv.classList.add('filter-modal-flagShed-div');
    flagShedDiv.style.paddingBottom = '10px';

    //---------

    let divBntApply = document.createElement('div');

    let applyFilterEsc = document.createElement('button');
    let applyFilterTextEsc = document.createTextNode(' Cancel ');
    applyFilterEsc.appendChild(applyFilterTextEsc);
    applyFilterEsc.setAttribute('trans', 'text+:Close;');
    applyFilterEsc.style.margin = '20px';
    applyFilterEsc.style.color = 'white';
    applyFilterEsc.style.borderRadius = '2px';
    applyFilterEsc.style.fontSize = '12px';
    applyFilterEsc.style.fontWeight = '500';
    applyFilterEsc.style.backgroundColor = 'gray';
    applyFilterEsc.style.padding = '4px 15px';
    applyFilterEsc.style.border = '0';

    applyFilterEsc.addEventListener('click', () => {
      document.querySelector('.filter-modal').classList.remove('blocked');
      document.querySelector('.filter-modal').classList.add('closed');
    });

    let applyFilter = document.createElement('button');
    let applyFilterText = document.createTextNode('Apply');
    applyFilter.appendChild(applyFilterText);
    applyFilter.setAttribute('trans', 'text+:Apply;');
    applyFilter.style.margin = '20px';
    applyFilter.style.color = 'white';
    applyFilter.style.borderRadius = '2px';
    applyFilter.style.fontSize = '12px';
    applyFilter.style.fontWeight = '500';
    applyFilter.style.padding = '4px 15px';
    applyFilter.style.backgroundColor = 'CornflowerBlue';
    applyFilter.style.border = '0';
    applyFilter.setAttribute('class', 'bnt btn-sm');

    applyFilter.addEventListener('click', () => {
      if (document.getElementById('dop')) {
        document.getElementById('dop').remove();
      }

      filterUsers();

      saveDataTo(
        sessionStorage.getItem('typeBase'),
        sessionStorage.getItem('globalLogin'),
        'filteredCourses',
        JSON.stringify(filteredCourses.filter(item => item !== 'All')),
      );

      //			localStorage.setItem(
      //				"filteredCourses",
      //				JSON.stringify(filteredCourses.filter(item => item !== "All"))
      //			);

      saveDataTo(
        sessionStorage.getItem('typeBase'),
        sessionStorage.getItem('globalLogin'),
        'filteredGrades',
        JSON.stringify(filteredGrades.filter(item => item !== 'All')),
      );

      //			localStorage.setItem(
      //				"filteredGrades",
      //				JSON.stringify(filteredGrades.filter(item => item !== "All"))
      //			);
      //

      document.querySelector('.filter-modal').classList.remove('blocked');
      document.querySelector('.filter-modal').classList.add('closed');
    });

    divBntApply.appendChild(applyFilterEsc);
    divBntApply.appendChild(applyFilter);
    divBntApply.style.width = '100%';
    divBntApply.style.textAlign = 'center';

    divBntApply.classList = 'filter-modal-footer';

    modalBody.appendChild(filtersDiv);
    modalBody.append(divBntApply);

    div.appendChild(modalBody);

    Translate();
  }

  document.querySelector('.filter-modal').classList.remove('closed');
  document.querySelector('.filter-modal').classList.add('blocked');
  const coursesDiv = document.querySelector('.filter-modal-courses-div');
  const gradesDiv = document.querySelector('.filter-modal-grades-div');

  if (coursesDiv.children.length !== 0) {
    while (coursesDiv.children.length > 1) {
      coursesDiv.removeChild(coursesDiv.lastElementChild);
    }
  }

  if (gradesDiv.children.length !== 0) {
    while (gradesDiv.children.length > 1) {
      gradesDiv.removeChild(gradesDiv.lastElementChild);
    }
  }
  //
  //    courses = JSON.parse(localStorage.getItem("courses")) || [];
  //    grades = JSON.parse(localStorage.getItem("grades")) || [];
  //    filteredCourses = JSON.parse(localStorage.getItem("filteredCourses")) || [];
  //    filteredGrades = JSON.parse(localStorage.getItem("filteredGrades")) || [];
  //
  courses =
    JSON.parse(
      getDataFrom(
        sessionStorage.getItem('typeBase'),
        sessionStorage.getItem('globalLogin'),
        'courses',
      ),
    ) || [];
  grades =
    JSON.parse(
      getDataFrom(
        sessionStorage.getItem('typeBase'),
        sessionStorage.getItem('globalLogin'),
        'grades',
      ),
    ) || [];
  filteredCourses =
    JSON.parse(
      getDataFrom(
        sessionStorage.getItem('typeBase'),
        sessionStorage.getItem('globalLogin'),
        'filteredCourses',
      ),
    ) || [];
  filteredGrades =
    JSON.parse(
      getDataFrom(
        sessionStorage.getItem('typeBase'),
        sessionStorage.getItem('globalLogin'),
        'filteredGrades',
      ),
    ) || [];

  let allCourses = ['All', ...courses];
  let allGrades = ['All', ...grades];

  for (let i = 0; i < allCourses.length; i++) {
    const div = document.createElement('span');
    div.classList.add('course-or-grade', 'course');
    const checkbox = document.createElement('input');
    const label = document.createElement('label');

    checkbox.type = 'checkbox';
    checkbox.className = 'PRIVET';
    checkbox.style.float = 'left';

    if (filteredCourses.includes(allCourses[i])) {
      checkbox.checked = true;
    }

    label.innerHTML = allCourses[i];
    label.style.display = 'inline';
    div.appendChild(checkbox);
    div.appendChild(label);
    div.style.backgroundColor = 'white';
    div.style.display = 'inline-block';
    div.style.margin = '2px';
    coursesDiv.appendChild(div);

    checkbox.onchange = e => {
      const item = allCourses.find(
        c => c === e.target.nextElementSibling.textContent,
      );
      const checkboxes = document.querySelectorAll('.PRIVET');
      // console.log(item);
      if (e.target.checked) {
        if (item === 'All') {
          // console.log("ПРИВЕТ");
          filteredCourses = [...allCourses];
          checkboxes.forEach(item => (item.checked = true));
        } else {
          filteredCourses.push(item);
          if (filteredCourses.length === allCourses.length - 1) {
            checkboxes[0].checked = true;
          }
        }
      } else {
        if (item === 'All') {
          filteredCourses = [];
          checkboxes.forEach(item => (item.checked = false));
        } else {
          filteredCourses = [...filteredCourses].filter(c => c !== item);
          checkboxes[0].checked = false;
        }
      }
      // filterUsers();
    };
  }

  if (filteredCourses.length === allCourses.length - 1) {
    document.querySelectorAll('.PRIVET').forEach(item => (item.checked = true));
  }

  for (let i = 0; i < allGrades.length; i++) {
    const div = document.createElement('span');
    div.classList.add('course-or-grade', 'grade');
    const checkbox = document.createElement('input');
    const label = document.createElement('label');

    checkbox.type = 'checkbox';
    checkbox.className = 'POKA';
    checkbox.style.float = 'left';

    if (filteredGrades.includes(allGrades[i])) {
      checkbox.checked = true;
    }

    label.innerHTML = allGrades[i];
    label.style.display = 'inline';
    div.appendChild(checkbox);
    div.appendChild(label);
    div.style.backgroundColor = 'white';
    div.style.display = 'inline-block';
    div.style.margin = '2px';
    gradesDiv.appendChild(div);

    checkbox.onchange = e => {
      const item = allGrades.find(
        c => c === e.target.nextElementSibling.textContent,
      );
      const checkboxes = document.querySelectorAll('.POKA');
      if (e.target.checked) {
        if (item === 'All') {
          filteredGrades = [...allGrades];
          checkboxes.forEach(item => (item.checked = true));
        } else {
          filteredGrades.push(item);
          if (filteredGrades.length === allGrades.length - 1) {
            checkboxes[0].checked = true;
          }
        }
      } else {
        if (item === 'All') {
          filteredGrades = [];
          checkboxes.forEach(item => (item.checked = false));
        } else {
          filteredGrades = [...filteredGrades].filter(c => c !== item);
          checkboxes[0].checked = false;
        }
      }

      // filterUsers();
    };
  }

  // console.log(filteredGrades, grades);

  if (filteredGrades.length === allGrades.length - 1) {
    document.querySelectorAll('.POKA').forEach(item => (item.checked = true));
  }
}

export function getTimeCode() {
  const { binDay } = checkDec();
  const days = {};
  let string = '';
  binDay.forEach((item, index) => {
    const length = 8;
    const pattern = new RegExp('.{1,' + length + '}', 'ig');

    const res = item
      .replace(item[0], '')
      .match(pattern)
      .map(_item => _item.padEnd(length, '0'))
      .map(_item => String.fromCharCode(parseInt(_item, 2) + 952));
    const parts = {};

    res.forEach((part, num) => {
      parts[num] = part;
      string += part;
    });

    days[index] = parts;
  });

  return string;
}

//select all freetime and busytime
//window.addEventListener('load', AddEventAllCheck)

function AddEventAllCheck() {
  if (document.getElementById('allCheckFree')) {
    let allCheckFree = document.getElementById('allCheckFree');

    allCheckFree.addEventListener('click', () => {
      let checkAll = false;
      if (allCheckFree.classList[2] == 'bi-check-square-fill') {
        checkAll = true;
      } else {
        checkAll = false;
      }

      allCheckFree.classList.toggle('bi-square-fill');
      allCheckFree.classList.toggle('bi-check-square-fill');

      let leftBtnFree = document.querySelectorAll('.checkFreeBtn');

      for (let i = 0; i < leftBtnFree.length; i++) {
        if (checkAll) {
          leftBtnFree[i].classList.remove('bi-square');
          leftBtnFree[i].classList.remove('bi-check-square-fill');
          leftBtnFree[i].classList.add('bi-square');
        } else {
          leftBtnFree[i].classList.remove('bi-square');
          leftBtnFree[i].classList.remove('bi-check-square-fill');
          leftBtnFree[i].classList.add('bi-check-square-fill');
        }
      }
      displayUsersAndBusiness();
    });
  }
  if (document.getElementById('allCheckBusy')) {
    let allCheckBusy = document.getElementById('allCheckBusy');

    allCheckBusy.addEventListener('click', () => {
      let checkAll = false;
      if (allCheckBusy.classList[2] == 'bi-check-square-fill') {
        checkAll = true;
      } else {
        checkAll = false;
      }

      allCheckBusy.classList.toggle('bi-square-fill');
      allCheckBusy.classList.toggle('bi-check-square-fill');

      let leftBtnBusy = document.querySelectorAll('.checkBusyBtn');
      for (let i = 0; i < leftBtnBusy.length; i++) {
        if (checkAll) {
          leftBtnBusy[i].classList.remove('bi-square');
          leftBtnBusy[i].classList.remove('bi-check-square-fill');
          leftBtnBusy[i].classList.add('bi-square');
        } else {
          leftBtnBusy[i].classList.remove('bi-square');
          leftBtnBusy[i].classList.remove('bi-check-square-fill');
          leftBtnBusy[i].classList.add('bi-check-square-fill');
        }
      }
      displayUsersAndBusiness();
    });
  }
}

//update courses list

let courseNameSubmitUpdate = document.getElementById('courseNameSubmitUpdate');
courseNameSubmitUpdate.addEventListener('click', () => {
  //	alert(document.getElementById("courseTextArea").value.length)
  if (document.getElementById('courseTextArea').value.length > 3) {
    if (confirm('Есть данные в хранилище. Обновить?')) {
      localStorage.removeItem('courses');

      splittingCourses();
      createParamOption();

      notifyer('Данные обновлены!');
    }
  } else {
    alerter(
      '<Text trans="text+:AlertAttention;">Внимание!</Text>',
      '<Text trans="text+:AlertAttention1;">Введите или загрузите из хранилища данные по курсам</Text>',
      'standart',
      'warning',
      'standart',
    );
  }
});

// WINDOWS
//Окно уведомителя
export function notifyer(
  text,
  time = 1000,
  translateCode,
  bgcolor = 'MediumSeaGreen',
  textcolor = 'white',
) {
  let divNotifyer = document.createElement('div');
  let textNotifyer = document.createTextNode(text);
  if (translateCode) {
    divNotifyer.setAttribute('trans', 'text+:' + translateCode);
  }

  divNotifyer.classList.add('mainNotifyer');
  divNotifyer.style.position = 'absolute';
  divNotifyer.style.top = '10px';
  divNotifyer.style.lineHeight = '1em';
  if (Number(window.innerWidth) < 500) {
    divNotifyer.style.width = '50%';
    divNotifyer.style.left = '26%';
  } else {
    divNotifyer.style.width = '20%';
    divNotifyer.style.left = '40%';
  }
  divNotifyer.style.padding = '5px';
  divNotifyer.style.borderRadius = '3px';
  divNotifyer.style.textAlign = 'center';
  divNotifyer.style.fontSize = '0.7em';
  divNotifyer.style.zIndex = '10000';

  divNotifyer.appendChild(textNotifyer);
  divNotifyer.style.backgroundColor = bgcolor;
  divNotifyer.style.color = textcolor;
  document.body.appendChild(divNotifyer);

  Translate();

  let timerNotifyer1 = setTimeout(() => {
    divNotifyer.classList.toggle('invsNotifyer');
    clearTimeout(timerNotifyer1);
  }, 500);

  let timerNotifyer2 = setTimeout(() => {
    divNotifyer.classList.toggle('invsNotifyer');
    clearTimeout(timerNotifyer2);
  }, 3500);
}

//Окно своего алерта
export function alerter(
  titleWin = ' title',
  bodyWin = 'body',
  footer = 'standart',
  aType = 'standart',
  aWidth = 'standart',
  hideClose = false,
) {
  let alertWin = document.querySelector('.alertWin');
  alertWin.classList.add('alertinvs');

  //    alert(footer+"-"+aType+"-"+aWidth)

  if (aWidth == 'standart') {
    if (window.innerWidth < 400) alertWin.style.width = '320px';
    else if (window.innerWidth < 600) alertWin.style.width = '400px';
    else alertWin.style.width = '450px';
  } else if (aWidth == 'slim') {
    if (window.innerWidth < 400) alertWin.style.width = '280px';
    else if (window.innerWidth < 600) alertWin.style.width = '320px';
    else alertWin.style.width = '320px';
  } else {
    if (window.innerWidth < 400) alertWin.style.width = '320px';
    else if (window.innerWidth < 600) alertWin.style.width = '400px';
    else alertWin.style.width = '450px';
  }

  let labelAlert = document.getElementById('alerterLabel');
  labelAlert.innerHTML = titleWin;

  let bodyAlert = document.getElementById('modalBodyAlert');
  bodyAlert.innerHTML = bodyWin;

  if (aType == 'standart') labelAlert.style.color = 'black';
  else if (aType == 'info') labelAlert.style.color = 'royalBlue';
  else if (aType == 'warning') labelAlert.style.color = 'darkorange';
  else if (aType == 'danger') labelAlert.style.color = 'indianred';
  else if (aType == 'success') labelAlert.style.color = '#00c097';
  else labelAlert.style.color = 'black';

  let modalFooterAlert = document.getElementById('modalFooterAlert');

  modalFooterAlert.innerHTML = '';

  //	alert(aWidth);
  if (aWidth.length > 8) {
    modalFooterAlert.innerHTML = aWidth;
  }

  if (!hideClose) {
    modalFooterAlert.innerHTML += /*html*/ `
        <div>
            <button 
                type="button" 
                trans="text+:Close;" 
                class="btn btn-secondary btn-sm btnCloseAlert m-2 "
                style="font-weight: 500;color: white; font-size: 1em; margin-left: 2em;">
                Close
            </button>
        </div>
    `;
  }
  let btnCloseAlert = document.querySelectorAll('.btnCloseAlert');
  btnCloseAlert[0].addEventListener('click', () => {
    alertWin.classList.remove('alertinvs');
  });

  //	let infoWin = document.getElementById('infoWin');
  //	let btnCloseInfo = document.querySelectorAll('.btnCloseInfo');
  //	btnCloseInfo[0].addEventListener('click', () => {
  //		console.log('до');
  //		console.log(document.getElementById('infoWin').classList)
  //		String(document.getElementById('infoWin').classList).replace('infoinvs', "")
  //		console.log('после');
  //		console.log(document.getElementById('infoWin').classList)
  //	});
  //
  //	btnCloseInfo[1].addEventListener('click', () => {
  //		//		alert("infoclose 2")
  //		infoWin.classList.remove('infoinvs');
  //	});

  if (!hideClose) {
    btnCloseAlert[1].addEventListener('click', () => {
      alertWin.classList.remove('alertinvs');
    });
  }

  if (document.querySelector('.btnUpdate')) {
    document.querySelector('.btnUpdate').addEventListener('click', () => {
      console.log('SoS');
      let tempUser = JSON.parse(sessionStorage.getItem('tempUser'));
      // console.log(tempUser);
      if (
        tempUser.name &&
        tempUser.currentCourse &&
        tempUser.currentLevel &&
        tempUser.days
      ) {
        // console.log(tempUser);
        tempUserUpdate(tempUser);
      }
      // tempUserUpdate(tempUser);
      sessionStorage.removeItem('tempUser');
      alertWin.classList.remove('alertinvs');
    });
  }

  Translate();
}

document.getElementById('F4Team').addEventListener('click', F4Team);

function F4Team() {
  let titleWin = `<Text trans="text+:TeamDev;"> Группа разработки</Text>`;
  let bodyWin = /*html*/ `
        <div class="pl-0" style="text-indent:0px;"> 
            <b>Белозеров Олег</b> - front, desing, idea
            <br> 
            <b>Бондаренко Николай</b> - JsDev (main programm)
            <br>
            <b>Сазонов Глеб</b> -  JsDev (translater)
            <br> 
            <b>Антоненко Евгений</b> - PhPDev 
            <br> 
            <b>Кузнецов Владислав</b> - JsDev, PhPDev
            <br> 
            <b>Фирсов Ярослав</b> - JsDev
        </div>
    `;

  alerter(titleWin, bodyWin);
}

document.getElementById('testConfirmer').addEventListener('click', () => {
  getFilteredUser();
  alert(sessionStorage.getItem('filteredUsers'));
  //        confirmer.bind('тело', 'заголовок')
});

export function confirmer(titleWinContent = ' title', bodyWinContent) {
  //	alert(titleWinContent+"="+bodyWinContent)

  let alertWin = document.querySelector('.alertWin');
  alertWin.classList.add('alertinvs');

  if (window.innerWidth < 400) alertWin.style.width = '320px';
  else if (window.innerWidth < 600) alertWin.style.width = '400px';
  else alertWin.style.width = '400px';

  let labelAlert = document.getElementById('alerterLabel');
  labelAlert.innerHTML = titleWinContent;
  let bodyAlert = document.getElementById('modalBodyAlert');
  bodyAlert.innerHTML = bodyWinContent;

  let modalFooterAlert = document.getElementById('modalFooterAlert');
  modalFooterAlert.innerHTML = /*html*/ `
        <button 
            type="button" 
            trans="text+:ConfirmerOk;"
            id="ConfirmerOk" 
            class="btn btn-primary btn-sm m-2 "
            style="font-weight: 500; font-size: 1em"
            >&nbsp;&nbsp;&nbsp;&nbsp;Oк&nbsp;&nbsp;&nbsp;&nbsp;
        </button>
        <button 
            type="button" 
            trans="text+:ConfirmerEsc;" 
            id="ConfirmerEsc" 
            class="btn btn-outline-secondary btn-sm  m-2 " 
            style="font-weight: 500;font-size: 1em"
            >Отмена
        </button>
    `;
  //
  //	Translate();

  let btnCloseAlert = document.querySelector('.btnCloseAlert');
  btnCloseAlert.addEventListener('click', () => {
    alertWin.classList.remove('alertinvs');
    //        alert("false")
    return false;
  });

  document.getElementById('ConfirmerOk').addEventListener('click', () => {
    alertWin.classList.remove('alertinvs');
    //        alert("true")
    return true;
  });

  document.getElementById('ConfirmerEsc').addEventListener('click', () => {
    alertWin.classList.remove('alertinvs');
    //		alert("закрываю и не удаляю")
    return false;
  });
}

//Загрузка тестовых данных для новых пользователей
if (!localStorage.getItem('users') && !localStorage.getItem('business')) {
  alerter(
    "<span trans='text+:Welcome'>Добро пожаловать!</span>",
    '<p trans="text+:scheduleA" style="text-indent:20px;text-align: justify">Вы первый раз запустили систему составления расписания и работы со временем - <b style="color:blue">ДелуВремя!</b></p> <p style="text-indent:20px;text-align: justify">Для демонстрации работы системы загружены тестовые данные по свободному и занятому времени и сделана настройка. После тестирования эти данные Вы можете удалить, настроить систему для себя и продолжить работу! </p><p style="text-indent:20px;text-align: justify;">Перед началом работы, пожалуйста, ознакомьтесь c <a href="guide.html">"Руководством пользователя"</a>',
    'standart',
    'success',
    'standart',
  );

  let users_demo =
    '[{"id": 1662373008414,"name": "Иванов Семен (Demo)",    "currentCourse": "Scratch", "currentLevel": "1","days": [33554432, 33554656, 33554432, 33554432, 33554432, 33554432, 33554432]}, {"id": 1662374017631,   "name": "Степанов Иван (Demo)","currentCourse": "Scratch","currentLevel": "1",    "days": [33554432, 33554656, 33554432, 33554432, 33554432, 33554432, 33554432]}, {"id": 1662374546140,"name": "Саблин Дмитрий (Demo)","currentCourse": "WebStart","currentLevel": "1","days": [33554432, 33554880, 33554432, 33554432, 33554432, 33554432, 33554432]}, {"id": 1662374737036,"name": "Диденко Кирилл (Demo)","currentCourse": "JavaScript Start","currentLevel": "1","days": [33554432, 33556476, 33556476, 33556476, 33556476, 33556476, 33556476]}, {    "id": 1662375208126,    "name": "Дорохов Платон (Demo)","currentCourse": "Python Start","currentLevel": "1","days": [33554432, 33554686, 33554686, 33554686, 33554686, 33554686, 33554686]}]';

  localStorage.setItem('users', users_demo);
  localStorage.setItem('filteredUsers', users_demo);
  localStorage.setItem('param1Name', 'Курс');
  localStorage.setItem('param2Name', 'Уровень');

  let business_demo =
    '[{"id":1662373691437,"description":"Класс  1(Demo)","days":[58720256,58720256,58720256,58720256,58720256,60784640,58720256]},{"id":1662373704669,"description":"Класс 2 (Demo)","days":[33554432,33554432,33554432,33554432,33554432,33554432,33554432]},{"id":1662374339780,"description":"Белозеров Олег (Demo)","days":[33685504,33556476,49815550,33556479,33677310,40910846,33554432]},{"id":1672065745981,"description":"Антоненко Евгений (Demo)","days":[67108863,67108608,67108608,67108608,67108608,67108863,58720255]}]';

  localStorage.setItem('business', business_demo);

  let courses_demo =
    '["Пробное", "Kodu", "Scratch", "CoSpaces", "MitApp Inventor", "Pencil Code", "Python Start", "Godot", "WebStart", "JavaScript Start", "JavaScripts Front", "JavaScript Game", "PHP", "C# Start", "Unity", "Java Start", "Fusion 3D", "ОГЭ", "ЕГЭ", "Project Team", "Препод."]';

  localStorage.setItem('courses', courses_demo);
  localStorage.setItem('filteredCourses', courses_demo);

  let grades_demo = '["1","2","3","4"]';

  localStorage.setItem('grades', grades_demo);
  localStorage.setItem('filteredGrades', grades_demo);
  localStorage.setItem('LanguageLocal', 'ru');
  localStorage.setItem('numTab', 1);
  localStorage.setItem('schedule-auto-saving', false);
  localStorage.setItem('typeBase', 'local');
  localStorage.setItem('isLocal', true);

  //    }
}

Translate();

function goFromURL() {
  const url = new URL(window.location.href);
  let strUrl = String(url.searchParams);

  if (strUrl.indexOf('invite=') != -1) {
    document
      .getElementById('dataTitle')
      .setAttribute('trans', 'text+:AddTime;');

    let textInviteStr =
      '<Text trans="text+:InviteText;">Вы получили приглашение от пользователя </Text><b class="text-primary"> ';
    textInviteStr += String(url.searchParams.get('invite'));

    if (!url.searchParams.get('user')) {
      textInviteStr +=
        '</b><Text trans="text+:InviteText2;">  заполнить данные по Вашему свободному или занятому времени.  Введите пожалуйста свое имя и фамилию, отметьте в таблице время и нажмите кнопку отправить! Спасибо!</Text>';
    } else {
      textInviteStr +=
        '</b><Text trans="text+:InviteText22;">  заполнить данные по Вашему свободному или занятому времени.  Отметьте в таблице своё свободное  время для занятий и нажмите кнопку ОТПРАВИТЬ! Спасибо!</Text>';
    }

    alerter(
      '<Text trans="text+:Welcome;">Добро пожаловать!</Text>',
      textInviteStr,
      'standart',
      'info',
      'standart',
    );

    //		document.getElementById("loginSendTimeCode").value = url.searchParams.get("user");
    document.getElementById('courseSelector').style.display = 'none';
    document.getElementById('levelSelector').style.display = 'none';
    document.getElementById('strCourseLevel').style.display = 'none';

    document.getElementsByName('Level1')[0].style.display = 'none';
    document.getElementsByName('Level2')[0].style.display = 'none';

    document.getElementById('btnTodo').style.display = 'none';
    document.getElementById('onOffTask').style.display = 'none';
    //		document.getElementById('sendCode2').style.display = "inline";
    document.getElementById('sendCode2').style.display = 'block';
    document.getElementById('checkShedule').style.display = 'none';

    //		document.getElementById("YourName").value = url.searchParams.get("user");
    //		document.getElementById("loginSendTimeCode").value = sessionStorage.getItem("globalLogin");

    document.getElementById('loginSendTimeCode2').value =
      url.searchParams.get('invite');
    //		debugger
    document.getElementById('importInput').value =
      url.searchParams.get('sendTimeCode');

    if (url.searchParams.get('sendTimeCode')) {
      importTime();
    }

    $('#staticBackdrop').modal('show');
    Translate();
  } else if (strUrl.indexOf('viewBusy=') != -1) {
    let textStr = '';
    var userName;
    var userListday = [];
    var userItemBusy = {};

    var params = new URLSearchParams();
    params.set('login', url.searchParams.get('viewBusy'));
    params.set('item', 'business');
    fetch('./php/lload.php', {
      method: 'POST',
      body: params,
    })
      .then(response => {
        return response.text();
      })
      .then(text => {
        sessionStorage.setItem('itemUserBusy', text);

        var userBusyTime = JSON.parse(sessionStorage.getItem('itemUserBusy'));
        //                console.log(userBusyTime);

        for (let i = 0; i < userBusyTime.length; i++) {
          if (
            String(userBusyTime[i]['id']) ==
            String(url.searchParams.get('user'))
          ) {
            userName = userBusyTime[i]['description'];
            userListday = userBusyTime[i]['days'];
            userItemBusy = userBusyTime[i];
            break;
          }
        }
        displayOneUserModal(userItemBusy);

        let textStr =
          '<Text trans="text+:InviteText1;">Вы получили информацию от аккаунта </Text><b class="text-primary"> ';
        textStr += String(url.searchParams.get('viewBusy'));
        textStr +=
          '</b><Text trans="text+:InviteText2222;"> о занятом времени пользователя </Text><strong>';

        if (url.searchParams.get('user')) {
          //			textInviteStr += String(url.searchParams.get("nameUser")).replace(/_/g, ' ')
          textStr += userName;
        }
        textStr += '</strong>.';

        alerter(
          '<Text trans="text+:Welcome22;">Информация для Вас!</Text>',
          textStr,
          'standart',
          'info',
          'standart',
        );
        //				debugger;
        document.getElementById('courseSelector').style.display = 'none';
        document.getElementById('levelSelector').style.display = 'none';
        document.getElementById('strCourseLevel').style.display = 'none';

        document.getElementsByName('Level1')[0].style.display = 'none';
        document.getElementsByName('Level2')[0].style.display = 'none';
        document.getElementById('timeSelect').style.display = 'none';

        document.getElementById('importSpan').style.display = 'none';

        document.getElementById('onOffTask').style.display = 'none';
        document.getElementById('btnTodo').style.display = 'none';
        document.getElementById('delColorTime').style.display = 'block';
        document.getElementById('clipboardLinkBusy').style.display = 'none';
        document.getElementById('btnInformer').style.display = 'block';
        document.getElementById('btnFullScreenBusy').style.display = 'block';
        document.getElementById('sendCode2').style.display = 'block';
        document.getElementById('saveDataUser').style.display = 'block';

        //				loginSendTimeCode2

        document.getElementById('YourName').value = userName;
        //				document.getElementById("loginSendTimeCode2").value = sessionStorage.getItem("globalLogin");

        //				alert(document.getElementById("loginSendTimeCode").value)

        document.getElementById('loginSendTimeCode2').value =
          url.searchParams.get('viewFree');

        document.getElementById('importInput').value =
          url.searchParams.get('sendTimeCode');
        document.getElementById('timeSelect').name =
          url.searchParams.get('typeTime');
        document.getElementById('timeSelect').value =
          url.searchParams.get('typeTime');

        document
          .getElementById('dataTitle')
          .setAttribute('trans', 'text+:BusyTime;');

        if (url.searchParams.get('sendTimeCode')) {
          importTime();
        }

        let flags = document.querySelectorAll('.allday');
        for (let i = 0; i < flags.length; i++) {
          flags[i].style.display = 'none';
        }

        let tds = document.querySelectorAll('#tableUser td');
        for (let i = 0; i < tds.length; i++) {
          if (tds[i].style.backgroundColor == 'mediumaquamarine') {
            tds[i].style.backgroundColor = 'cornflowerblue';
          }
          tds[i].style.padding = '1px 2px';
          tds[i].disabled = true;
        }

        fullBreif();

        $('#staticBackdrop').modal('show');
        Translate();
      });
  } else if (strUrl.indexOf('viewFree=') != -1) {
    let textStr = '';
    var userName;
    var userListday = [];
    var userItemFree = {};

    var params = new URLSearchParams();
    params.set('login', url.searchParams.get('viewFree'));
    params.set('item', 'users');
    fetch('./php/lload.php', {
      method: 'POST',
      body: params,
    })
      .then(response => {
        return response.text();
      })
      .then(text => {
        sessionStorage.setItem('itemUserFree', text);

        var userFreeTime = JSON.parse(sessionStorage.getItem('itemUserFree'));

        for (let i = 0; i < userFreeTime.length; i++) {
          if (
            String(userFreeTime[i]['id']) ==
            String(url.searchParams.get('user'))
          ) {
            userName = userFreeTime[i]['name'];
            userListday = userFreeTime[i]['days'];
            userItemFree = userFreeTime[i];
            break;
          }
        }
        displayOneUserModal(userItemFree);

        let textStr =
          '<Text trans="text+:InviteText244444;">Вы получили информацию от аккаунта </Text><b class="text-primary"> ';
        textStr += String(url.searchParams.get('viewFree'));
        textStr +=
          '</b><Text trans="text+:InviteText22225555;"> о свободном времени пользователя </Text><strong>';

        if (url.searchParams.get('user')) {
          textStr += userName;
        }
        textStr += '</strong>.';

        alerter(
          '<Text trans="text+:Welcome22;">Информация для Вас!</Text>',
          textStr,
          'standart',
          'info',
          'standart',
        );

        document.getElementById('courseSelector').style.display = 'none';
        document.getElementById('levelSelector').style.display = 'none';
        document.getElementById('strCourseLevel').style.display = 'none';
        document.getElementsByName('Level1')[0].style.display = 'none';
        document.getElementsByName('Level2')[0].style.display = 'none';
        document.getElementById('timeSelect').style.display = 'none';

        document.getElementById('importSpan').style.display = 'none';

        document.getElementById('onOffTask').style.display = 'none';
        document.getElementById('btnTodo').style.display = 'none';
        document.getElementById('delColorTime').style.display = 'block';
        document.getElementById('clipboardLinkBusy').style.display = 'none';
        document.getElementById('btnInformer').style.display = 'block';
        document.getElementById('btnFullScreenBusy').style.display = 'block';
        document.getElementById('sendCode2').style.display = 'block';
        document.getElementById('saveDataUser').style.display = 'block';

        document.getElementById('YourName').value = userName;

        //				document.getElementById("loginSendTimeCode").value = sessionStorage.getItem("globalLogin");

        document.getElementById('loginSendTimeCode2').value =
          url.searchParams.get('viewBusy');

        //				document.getElementById("loginSendTimeCode").value = url.searchParams.get("viewFree");
        document.getElementById('importInput').value =
          url.searchParams.get('sendTimeCode');

        document.getElementById('timeSelect').name =
          url.searchParams.get('typeTime');
        document.getElementById('timeSelect').value =
          url.searchParams.get('typeTime');
        document
          .getElementById('dataTitle')
          .setAttribute('trans', 'text+:FreeTime;');

        if (url.searchParams.get('sendTimeCode')) {
          importTime();
        }

        let flags = document.querySelectorAll('.allday');
        for (let i = 0; i < flags.length; i++) {
          flags[i].style.display = 'none';
        }

        let tds = document.querySelectorAll('#tableUser td');
        for (let i = 0; i < tds.length; i++) {
          if (tds[i].style.backgroundColor == 'mediumaquamarine') {
            //							tds[i].style.backgroundColor = "cornflowerblue"
          }
          tds[i].style.padding = '1px 2px';
          tds[i].disabled = true;
        }
        fullBreif();

        $('#staticBackdrop').modal('show');
        Translate();
      });
  } else if (url.searchParams.get('action') == 'sendCode2email') {
    document
      .getElementById('dataTitle')
      .setAttribute('trans', 'text+:AddTime;');
    document.getElementById('timeSelect').name =
      url.searchParams.get('typeTime');
    document.getElementById('timeSelect').value =
      url.searchParams.get('typeTime');

    document.getElementById('YourName').value =
      url.searchParams.get('nameUser');
    document.getElementById('loginSendTimeCode').value =
      url.searchParams.get('loginSendTimeCode');
    document.getElementById('importInput').value =
      url.searchParams.get('sendTimeCode');
    importTime();
    $('#staticBackdrop').modal('show');
  } else if (url.searchParams.get('action') == 'verify') {
    let searchParams = new URLSearchParams();
    searchParams.set('login', url.searchParams.get('loginUser'));
    searchParams.set('key', url.searchParams.get('key'));

    fetch('./php/verify.php', {
      method: 'POST',
      body: searchParams,
    })
      .then(response => {
        return response.text();
      })
      .then(text => {
        let objectPHP = JSON.parse(text);

        sessionStorage.setItem('globalLogin', objectPHP['login']);

        let msg =
          '<span style="display: block; text-align:center"><Text trans="text+:WelcomeVerify;">Пользователь</Text><b> ';
        msg += objectPHP['login'];
        msg +=
          ' </b><Text trans="text+:WelcomeVerify2;"> активирован!</Text></span>';
        msg +=
          '<p style="margin-top:5px"><Text trans="text+:WelcomeVerify3;">Войдите в систему и Вам будут доступны дополнительные функции.</Text></p>';

        alerter(
          '<Text trans="text+:Welcome;">Добро пожаловать!</Text>',
          msg,
          'standart',
          'success',
          'standart',
        );
      });
  } else {
    document.getElementById('courseSelector').style.display = 'inline-block';
    document.getElementById('levelSelector').style.display = 'inline-block';
  }
  Translate();
}

function startLoadFromRemote(globalLogin, item) {
  loadFromRemote(globalLogin, item);
  let dataFromRemote = sessionStorage.getItem(item);
  return dataFromRemote;
}

function loadFromRemote(globalLogin, item) {
  if (sessionStorage.getItem('globalAccess') != 7) {
    return false;
  }

  var params = new URLSearchParams();
  params.set('login', globalLogin);
  params.set('item', item);
  fetch('./php/lload.php', {
    method: 'POST',
    body: params,
  })
    .then(response => {
      return response.text();
    })
    .then(text => {
      sessionStorage.setItem(item, text);
    });
}

function startLoadFromLocal(item) {
  return localStorage.getItem(item);
}

function getDataFrom(typeBase, globalLogin, item) {
  let dataLoad;
  if (typeBase == 'local') {
    dataLoad = startLoadFromLocal(item);
  } else if (typeBase == 'remote') {
    dataLoad = startLoadFromRemote(globalLogin, item);
  } else {
    dataLoad = startLoadFromLocal(item);
    //                alert("error typeBase")
  }
  return dataLoad;
}

function saveData2local(globalLogin, item, dataSave) {
  localStorage.setItem(item, dataSave);
  //	alert("Сохраняю в local");
}

function saveData2remote(globalLogin, item, dataSave) {
  if (sessionStorage.getItem('globalAccess') != 7) {
    return false;
  }

  sessionStorage.setItem(item, dataSave);
  //	alert("Сохраняю в remote")
  saveData(item);

  function saveData(item) {
    let localData = sessionStorage.getItem(item);

    var params = new URLSearchParams();
    params.set('login', sessionStorage.getItem('globalLogin'));
    params.set('item', item);
    params.set('data', localData);

    fetch('./php/saveData.php', {
      method: 'POST',
      body: params,
    })
      .then(response => {
        return response.text();
      })
      .then(text => {
        console.log('Данные ' + item + ' записаны на сервер');
      });
  }
}

export function saveDataTo(typeBase, globalLogin, item, dataSave) {
  if (typeBase == 'local') {
    saveData2local(globalLogin, item, dataSave);
  } else if (typeBase == 'remote') {
    saveData2remote(globalLogin, item, dataSave);
  } else {
    saveData2local(globalLogin, item, dataSave);
  }
}

let import2 = document.getElementById('testPHP');
import2.addEventListener('click', () => {
  sessionStorage.setItem('typeBase', 'local');
  localStorage.setItem('typeBase', 'local');
  alert(
    'Глобальный логин: ' +
      sessionStorage.getItem('globalLogin') +
      ' Доступ в систему: ' +
      sessionStorage.getItem('globalAccess'),
  );

  //    alert("3907 saveDataTo")
  //    console.log("3907 saveDataTo")
  loadStudentsTable();
  loadBusinessTable();
  clearEverything();
  toggleCellClickAbility(true, 'modal');
  toggleCellClickAbility(false, 'tab');

  //
  //	if (!globalAccess) {
  //		remoteBase.disabled = true;
  //	} else {
  //		remoteBase.disabled = false;
  //	}
});

document.getElementById('param1Name').addEventListener('change', () => {
  localStorage.setItem(
    'param1Name',
    document.getElementById('param1Name').value,
  );
  document.getElementsByName('Level1')[0].innerHTML = param1Name.value + ':';
});

document.getElementById('param2Name').addEventListener('change', () => {
  localStorage.setItem(
    'param2Name',
    document.getElementById('param2Name').value,
  );
  document.getElementsByName('Level2')[0].innerHTML = param2Name.value + ':';
});

window.onload = () => {
  sessionStorage.setItem('numLoad', 1);
  start();

  //   спинер между загрузками
  //    debugger;

  if (
    localStorage.getItem('numTab') == 1 ||
    localStorage.getItem('numTab') == 2
  ) {
    const spiner = document.createElement('div');
    spiner.setAttribute(
      'style',
      'z-index: -1; display: flex; justify-content: center; position: absolute; top:35%; width:100%; margin:0 auto; height: 300px; color: blue;',
    );
    spiner.setAttribute('id', 'spiner');
    const inSpiner = document.createElement('span');
    inSpiner.innerHTML = `<div class = "spinner-border" style="font-size:0.7em; position: relative; top:25%; left:-12px;" role = "status"><span class="visually-hidden"></span></div>`;
    spiner.append(inSpiner);
    document.body.append(spiner);
  }

  sessionStorage.setItem('numLoad', 2);
  setTimeout(start, 1000);
};

export function start() {
  if (localStorage.getItem('param1Name')) {
    param1Name.value = localStorage.getItem('param1Name');
    document.getElementsByName('Level1')[0].innerHTML = param1Name.value + ':';
  } else {
    param1Name.value = '';
    document.getElementsByName('Level1')[0].innerHTML = '1:';
  }
  if (localStorage.getItem('param2Name')) {
    param2Name.value = localStorage.getItem('param2Name');
    document.getElementsByName('Level2')[0].innerHTML = param2Name.value + ':';
  } else {
    param2Name.value = '';
    document.getElementsByName('Level2')[0].innerHTML = '2:';
  }

  if (!localStorage.getItem('checkbox1')) {
    localStorage.setItem('checkbox1', true);
  }
  if (!localStorage.getItem('checkbox2')) {
    localStorage.setItem('checkbox2', true);
  }

  if (!localStorage.getItem('typeBase')) {
    localStorage.setItem('typeBase', 'local');
    sessionStorage.setItem('typeBase', 'local');
  } else {
    sessionStorage.setItem('typeBase', localStorage.getItem('typeBase'));
  }

  if (
    localStorage.getItem('typeBase') == 'remote' &&
    sessionStorage.globalAccess != 7
  ) {
    document.querySelector('.moveWin').classList.add('invs');

    document.getElementById(
      'iconDataBtn',
    ).innerHTML = `<i class="bi bi-cloud-arrow-down my-0 mt-1" style="font-size: 1.3em" title="Сетевое хранилище"></i>`;
  } else {
    document.getElementById(
      'iconDataBtn',
    ).innerHTML = `<i class="bi bi-database-down my-0 mt-1" style="font-size: 1.2em" title="Локальное хранилище"></i>`;
  }

  if (
    sessionStorage.getItem('typeBase') == 'remote' &&
    sessionStorage.globalAccess == 7
  ) {
    document.getElementById(
      'iconDataBtn',
    ).innerHTML = `<i class="bi bi-cloud-download my-0 mt-1" style="font-size: 1.15em" title="Сетевое хранилище"></i>`;
  } else {
    document.getElementById(
      'iconDataBtn',
    ).innerHTML = `<i class="bi bi-database-down my-0 mt-1" style="font-size: 1.15em" title="Локальное хранилище"></i>`;
  }

  users =
    JSON.parse(
      getDataFrom(
        sessionStorage.getItem('typeBase'),
        sessionStorage.getItem('globalLogin'),
        'users',
      ),
    ) || [];
  business =
    JSON.parse(
      getDataFrom(
        sessionStorage.getItem('typeBase'),
        sessionStorage.getItem('globalLogin'),
        'business',
      ),
    ) || [];
  courses =
    JSON.parse(
      getDataFrom(
        sessionStorage.getItem('typeBase'),
        sessionStorage.getItem('globalLogin'),
        'courses',
      ),
    ) || [];
  grades =
    JSON.parse(
      getDataFrom(
        sessionStorage.getItem('typeBase'),
        sessionStorage.getItem('globalLogin'),
        'grades',
      ),
    ) || [];
  toDoMy =
    JSON.parse(
      getDataFrom(
        sessionStorage.getItem('typeBase'),
        sessionStorage.getItem('globalLogin'),
        'todo',
      ),
    ) || [];

  //	alert(sessionStorage.getItem('typeBase'))
  //	alert(getDataFrom(sessionStorage.getItem('typeBase'), sessionStorage.getItem('globalLogin'), 'users'))
  //		alert(getDataFrom(sessionStorage.getItem('typeBase'), sessionStorage.getItem('globalLogin'), 'business'))
  //		alert(getDataFrom(sessionStorage.getItem('typeBase'), sessionStorage.getItem('globalLogin'), 'courses'))
  //		alert(getDataFrom(sessionStorage.getItem('typeBase'), sessionStorage.getItem('globalLogin'), 'grades'))
  //

  sortedBusiness = business;
  sortedUsers = users;
  //    filteredUsers = JSON.parse(localStorage.getItem("filteredUsers")) || users;

  filteredUsers =
    JSON.parse(
      getDataFrom(
        sessionStorage.getItem('typeBase'),
        sessionStorage.getItem('globalLogin'),
        'filteredUsers',
      ),
    ) || users;

  //	filteredUsers =
  //		JSON.parse(
  //			getDataFrom(
  //				sessionStorage.getItem('typeBase'),
  //				sessionStorage.getItem('globalLogin'),
  //				'filteredUsers'
  //			)
  //		) || users;

  //	if (sessionStorage.getItem('filteredUsers') == '[]') {
  //		filteredUsers = JSON.parse(getDataFrom(sessionStorage.getItem('typeBase'), sessionStorage.getItem('globalLogin'), 'users'));
  //	}
  //    getFilteredUser()
  //    console.log("#######-filteredUsers-analis#################")
  //    console.log(filteredUsers, '4057 - start()  до загрузки');
  //
  //    getDataFrom(sessionStorage.getItem("typeBase"), sessionStorage.getItem("globalLogin"), "filteredUsers")
  //
  //    alert(sessionStorage.getItem("typeBase") + " " + sessionStorage.getItem("globalLogin") + " " + "filteredUsers")
  //
  //    console.log(filteredUsers, '4062 - start() после загрузки filteredUsers');

  //	console.log(sessionStorage.getItem('typeBase'), sessionStorage.getItem('globalLogin'), '4040');
  //	console.log("Session", sessionStorage.getItem('filteredUsers'))
  //	console.log("Local", localStorage.getItem('filteredUsers'))
  //	console.log("##############################################")

  sortedFilteredUsers = filteredUsers;

  //    filteredCourses =
  //        JSON.parse(localStorage.getItem("filteredCourses")) || courses;

  filteredCourses =
    JSON.parse(
      getDataFrom(
        sessionStorage.getItem('typeBase'),
        sessionStorage.getItem('globalLogin'),
        'filteredCourses',
      ),
    ) || courses;

  //    filteredGrades = JSON.parse(localStorage.getItem("filteredGrades")) || grades;

  filteredGrades =
    JSON.parse(
      getDataFrom(
        sessionStorage.getItem('typeBase'),
        sessionStorage.getItem('globalLogin'),
        'filteredGrades',
      ),
    ) || grades;

  allMatches = [];

  //    alert("4125 start");

  if (sessionStorage.getItem('numLoad') == 2) {
    if (courses.length !== 0) {
      creatingOptions(courses, 'course');
    }

    if (grades.length !== 0) {
      creatingOptions(grades, 'grade');
    }

    goFromURL();

    console.log('4171 start -load events');
    loadStudentsTable();
    loadBusinessTable();
    clearEverything();
    toggleCellClickAbility(true, 'modal');
    toggleCellClickAbility(false, 'tab');
    nbtc.addEventListener('click', clearEverything);
    nbtct.addEventListener('click', clearTable);
    nbts.addEventListener('click', saveUser);
    nbtcl.addEventListener('click', clearTable);
    document.getElementById('btnDelFull').addEventListener('click', clearTable);
    creatingButton.addEventListener('click', () => {
      currBusiness = null;
      currUser = null;

      onObjOnModal();

      timeSelector.style.display = 'block';
      timeSelectorSpan.style.display = 'block';

      document.getElementById('courseSelector').style.display = 'inline-block';
      document.getElementById('levelSelector').style.display = 'inline-block';
      document.getElementById('levelSelector').style.marginBottom = '5px';

      document.getElementById('briefName').style.display = 'none';
      document.getElementById('checkShedule').style.display = 'none';
      document.getElementById('onOffTask').style.display = 'none';
      document.getElementById('btnTodo').style.display = 'none';
      document.getElementById('sendCode2').style.display = 'none';

      document.getElementById('timeSelect').childNodes[1].selected = true;
      document.getElementById('timeSelect').childNodes[3].selected = false;

      document
        .getElementById('dataTitle')
        .setAttribute('trans', 'text+:AddTime;');
      //        document.getElementById("dataTitle").innerHTML = " ";
      //        document.getElementById("dataTitle").display = "none";
      clearEverything();
      Translate();
      changeTimeSelector();
    });

    timeSelector.addEventListener('change', changeTimeSelector);
    gradeSubmittingButton.addEventListener('click', splittingGrades);
    courseSubmittingButton.addEventListener('click', splittingCourses);
    scheduleLoadingCheckBox.addEventListener('change', () =>
      localStorage.setItem(
        'schedule-loading',
        JSON.stringify(scheduleLoadingCheckBox.checked),
      ),
    );

    selectLevel.addEventListener('change', e => getCurrentLevel(e));
    selectCourse.addEventListener('change', e => getCurrentCourse(e));
    fullName.addEventListener('change', changeName);
    importButton.addEventListener('click', importTime);

    showingCodeButton.addEventListener('click', () => {
      document.getElementById('importInput').value = fCompressCodeTime(
        getTimeCode(),
      );
      notifyer(
        'Сформирован Ваш код времени! Можете его отправить пользователю системы',
        500,
      );
    });

    Translate();

    gradeText = document.getElementById('gradeTextArea');
    courseText = document.getElementById('courseTextArea');

    //    if (!autoSaving) {
    //        scheduleAutoSavingCheckBox.checked = false;
    //    }

    if (!loading) {
      scheduleLoadingCheckBox.checked = false;
    } else {
      tbodySchedule.innerHTML = localStorage.getItem('tableSchedule');

      //        alert(" Пытаюсь загрузить таблицу 2 ")
      tbodyScheduleFull.innerHTML = localStorage.getItem('tableSchedule');

      //        notifyer("Данные загружены из хранилища!")
    }

    for (let i = 0; i < dayWeek.length; i++) {
      dayWeek[i].addEventListener('change', () => allDaySelect(dayWeek[i]));
    }

    if (localStorage.length && localStorage.getItem('LanguageLocal')) {
      // Наличие localStorege и нашего LanguageLocal в нём
      document.getElementById('Trans').value =
        localStorage.getItem('LanguageLocal'); // T.к. уже есть переносим его значение в select
      Translate(); // Вызываем функцию при старте страницы , но после обработки локального хранилища
    }
    AddEventAllCheck();
  }

  //    filterUsers();
}

export function createParamOption() {
  let param1 = document.getElementById('courseSelector');

  let courses =
    JSON.parse(
      getDataFrom(
        sessionStorage.getItem('typeBase'),
        sessionStorage.getItem('globalLogin'),
        'courses',
      ),
    ) || [];

  let options = courses;
  options = [...new Set(options.map(item => item.trim()))];

  param1.innerHTML = '';
  param1.innerHTML +=
    `<option value="Nothing" id="nocourse">` +
    String(localStorage.getItem('param1Name')) +
    `</option>`;

  param1.innerHTML += `</option>`;
  param1.innerHTML += `<option name="Any" value="Any" id="any">Any</option>`;

  for (let i = 0; i < options.length; i++) {
    let option = document.createElement('option');
    option.value = options[i].toString();
    option.innerHTML = options[i].toString();
    param1.appendChild(option);
  }

  //    ---------------------------------------------------------------

  let param2 = document.getElementById('levelSelector');

  let grades =
    JSON.parse(
      getDataFrom(
        sessionStorage.getItem('typeBase'),
        sessionStorage.getItem('globalLogin'),
        'grades',
      ),
    ) || [];

  options = grades;
  options = [...new Set(options.map(item => item.trim()))];

  param2.innerHTML = '';
  param2.innerHTML +=
    `<option value="Nothing" selected="" id="nolevel">` +
    String(localStorage.getItem('param2Name')) +
    `</option>`;

  param2.innerHTML += ``;
  param2.innerHTML += `<option name="Any" value="Any">Any</option>`;

  for (let i = 0; i < options.length; i++) {
    let option = document.createElement('option');
    option.value = options[i].toString();
    option.innerHTML = options[i].toString();
    param2.appendChild(option);
  }
}

export function offObjOnModal() {
  document.getElementById('dataTitle').style.display = 'none';
  document.getElementById('timeSelect').style.display = 'none';
  document.getElementById('timeSelectSpan').style.display = 'none';
  document.getElementById('briefName').style.display = 'none';
  document.getElementById('editDataHeader').style.display = 'none';
  document.getElementById('strCourseLevel').style.display = 'none';
  document.getElementById('checkShedule').style.display = 'none';
  document.getElementById('flexCheckDefault').style.display = 'none';
  document.getElementById('importSpan').style.display = 'none';
  document.getElementById('delColorTime').style.display = 'none';
  document.getElementById('onOffTask').style.display = 'none';
  document.getElementById('btnFullScreenBusy').style.display = 'none';
  document.getElementById('btnTodo').style.display = 'none';
  document.getElementById('sendCode2').style.display = 'none';
  document.getElementById('btnInformer').style.display = 'none';
}

export function onObjOnModal() {
  document.getElementById('dataTitle').style.display = 'inline';
  document.getElementById('timeSelect').style.display = 'inline';
  document.getElementById('timeSelectSpan').style.display = 'inline';
  document.getElementById('briefName').style.display = 'inline';
  document.getElementById('editDataHeader').style.display = 'flex';
  document.getElementById('checkShedule').style.display = 'inline';
  document.getElementById('flexCheckDefault').style.display = 'inline-block';
  document.getElementById('strCourseLevel').style.display = 'flex';
  document.getElementById('importSpan').style.display = 'block';
  document.getElementById('delColorTime').style.display = 'inline';

  if (toDoOn) {
    document.getElementById('onOffTask').style.display = 'inline';
    document.getElementById('btnTodo').style.display = 'inline';
  }

  document.getElementById('btnFullScreenBusy').style.display = 'inline';

  document.getElementById('sendCode2').style.display = 'inline';
  document.getElementById('btnInformer').style.display = 'block';
}
