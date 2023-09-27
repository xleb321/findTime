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
import {
	start
} from './main.js';
import {
	filterUsers
} from './main.js';
import {
	saveDataTo
} from './main.js';
import {
	splittingGrades
} from './main.js';
import {
	closeTodoLayers,
	loadTodoLayers,
	isLayersCanBeDisplayed
} from './todo.js';


//save&load schedule

let tbodySchedule = document.getElementById('tbodySchedule');
let tbodyScheduleFull = document.getElementById('tbodyScheduleFull');

let btnSaveTableSchedule = document.getElementById('btnSaveTableSchedule');
let btnSaveTableScheduleFull = document.getElementById(
	'btnSaveTableScheduleFull'
);

let btnLoadTableSchedule = document.getElementById('btnLoadTableSchedule');
let btnLoadTableScheduleFull = document.getElementById(
	'btnLoadTableScheduleFull'
);

btnSaveTableSchedule.addEventListener('click', saveTableSchedule);
btnSaveTableScheduleFull.addEventListener('click', saveTableSchedule);

function saveTableSchedule() {
	if (localStorage.getItem('tableSchedule')) {
		if (confirm('Есть данные в хранилище. Перезаписать?')) {
			localStorage.setItem('tableSchedule', tbodySchedule.innerHTML);
			notifyer('Данные расписания изменены!');
		}
	} else {
		localStorage.setItem('tableSchedule', tbodySchedule.innerHTML);
		notifyer('Данные расписания изменены!');
	}
}

btnLoadTableSchedule.addEventListener('click', loadTableSchedule);
btnLoadTableScheduleFull.addEventListener('click', loadTableSchedule);

function loadTableSchedule() {
	if (localStorage.getItem('tableSchedule')) {
		tbodySchedule.innerHTML = localStorage.getItem('tableSchedule');
		tbodyScheduleFull.innerHTML = localStorage.getItem('tableSchedule');
		//        tbodyScheduleFull2.innerHTML = localStorage.getItem("tableSchedule");
		notifyer('Данные загружены из хранилища!');
	} else {
		alert('Сохраненных данных нет');
	}
}

//work with grades&courses

let gradeNameSubmitLoad = document.getElementById('gradeNameSubmitLoad');

function listGrades() {
	//    let listGrades = JSON.parse(localStorage.getItem('grades'));
	let listGrades = JSON.parse(getDataFrom(sessionStorage.getItem('typeBase'), sessionStorage.getItem('globalLogin'), 'grades'));


	let strokeGrades = '';
	for (let i = 0; i < listGrades.length; i++) {
		strokeGrades += String(listGrades[i]) + ',';
	}
	document.getElementById('gradeTextArea').value = strokeGrades;
}

gradeNameSubmitLoad.addEventListener('click', listGrades);

//listGrades();

//let gradeNameSubmitDel = document.getElementById('gradeNameSubmitDel');
//gradeNameSubmitDel.addEventListener('click', () => {
//	if (confirm('В хранилище есть данные по уровням. Удалить?')) {
//		localStorage.removeItem('grades');
//		notifyer('grades delete in local storage');
//	}
//});

let gradeNameSubmitDel = document.getElementById('gradeNameSubmitDel');
gradeNameSubmitDel.addEventListener('click', () => {
	if (confirm('В хранилище есть данные по уровням. Удалить?')) {

		let grades_null = '["1"]';
		if ((sessionStorage.getItem("typeBase") == "remote") && (sessionStorage.getItem("globalAccess") == 7)) {
			sessionStorage.setItem('grades', grades_null);
			sessionStorage.setItem('filteredGrades', grades_null);

			saveDataTo(
				sessionStorage.getItem('typeBase'),
				sessionStorage.getItem('globalLogin'),
				'grades', grades_null);
			saveDataTo(
				sessionStorage.getItem('typeBase'),
				sessionStorage.getItem('globalLogin'),
				'filteredGrades', grades_null);
			alert("deleted!!!")

		} else if (sessionStorage.getItem("typeBase") == "local") {
			localStorage.setItem('grades', grades_null);
			localStorage.setItem('filteredGrades', grades_null);
		}

		let listGrades = JSON.parse(getDataFrom(sessionStorage.getItem('typeBase'), sessionStorage.getItem('globalLogin'), 'grades'));
		JSON.parse(getDataFrom(sessionStorage.getItem('typeBase'), sessionStorage.getItem('globalLogin'), 'filteredGrades'));
		document.getElementById('gradeTextArea').value = listGrades;
		notifyer('grades delete in local storage');
	}
});


let gradeNameSubmitUpdate = document.getElementById('gradeNameSubmitUpdate');
gradeNameSubmitUpdate.addEventListener('click', () => {
	//	alert(document.getElementById("gradeTextArea").value.length)
	if (document.getElementById('gradeTextArea').value.length > 0) {
		if (confirm('Есть данные в хранилище. Обновить?')) {
			localStorage.removeItem('grades');
			splittingGrades();
			notifyer('Данные обновлены!');
		}
	} else {
		alerter(
			'<Text trans="text+:AlertAttention;">Внимание!</Text>',
			'<Text trans="text+:AlertAttention2;">Введите или загрузите из хранилища данные по уровням</Text>',
			'standart',
			'warning',
			'standart'
		);
	}
});





function listCourses() {
	//    let listCourses = JSON.parse(localStorage.getItem('courses'));
	let listCourses = JSON.parse(getDataFrom(sessionStorage.getItem('typeBase'), sessionStorage.getItem('globalLogin'), 'courses'));



	let strokeCourses = '';
	if (listCourses) {
		for (let i = 0; i < listCourses.length; i++) {
			strokeCourses += String(listCourses[i]) + ',';
		}
	}
	document.getElementById('courseTextArea').value = strokeCourses;
}

let courseNameSubmitLoad = document.getElementById('courseNameSubmitLoad');
courseNameSubmitLoad.addEventListener('click', listCourses);
//listCourses();

let courseNameSubmitDel = document.getElementById('courseNameSubmitDel');
courseNameSubmitDel.addEventListener('click', () => {
	if (confirm('В хранилище есть данные по курсам. Удалить?')) {
		localStorage.removeItem('courses');
		notifyer('course delete in local storage');
	}
});

//Work with tabs
if (!localStorage.getItem('numTab')) {
	localStorage.setItem('numTab', 1);
}
let numTab = Number(localStorage.getItem('numTab'));
let numTabSelect = document.getElementById('numTab');

numTabSelect.value = numTab;

numTabSelect.addEventListener('change', () => {
	localStorage.setItem('numTab', document.getElementById('numTab').value);
});

if (numTab != 3) {
	let numTabObj = document.getElementById('numTab');
	document.getElementById('numTab').value = numTab;
	numTabObj.addEventListener('change', () => {
		numTab = document.getElementById('numTab').value;
		let tabEl = document.querySelectorAll('.nav-link');
		let tab = new bootstrap.Tab(tabEl[numTab]);
		tab.show();
		if (document.getElementById('checkSaveNumTab').checked) {
			localStorage.setItem('numTab', numTab);
		}
	});
	let tabEl = document.querySelectorAll('.nav-link');
	let tab = new bootstrap.Tab(tabEl[numTab]);
	alertEmptyStart();
	tab.show();
	showShedulePanel();
	Translate();
}

alertEmptyStart();

function alertEmptyStart() {
	let tableObj = document.querySelectorAll('#tbodySchedule');
	let tableObjFull = document.querySelectorAll('#tbodyScheduleFull');
	let checkFlagTime = document.querySelectorAll('.bi-check-square-fill');

	if (checkFlagTime.length == 0) {
		//      alert("добавляю клик: чеков "+String(checkFlagTime.length));
		tableObj[0].addEventListener('click', alertEmpty);
		tableObjFull[0].addEventListener('click', alertEmpty);
	} else {
		//        alert("удаляю клик: чеков "+String(checkFlagTime.length));
		tableObj[0].removeEventListener('click', alertEmpty);
		tableObjFull[0].removeEventListener('click', alertEmpty);
	}

	function alertEmpty() {
		checkFlagTime = document.querySelectorAll('.bi-check-square-fill');
		//        alert(checkFlagTime.length)
		if (checkFlagTime.length == 0) {
			alerter(
				'<Text trans="text+:Danger;">Внимание!</Text>',
				'<Text trans="text+:AlertEmpty;">Отметьте сначала записи <img src="/img/check-square-fill.svg"> во вкладках <b>"Cвободное время"</b> и(или) <b>"Занятое время"</b> и затем вернитесь на вкладку <b>"Расписание"</b>. На ней будет отмечено совпадения по времени.<p style="text-align: justify;">Перед началом работы, пожалуйста, ознакомьтесь c <a href="guide.html"> <b>"Руководством пользователя".</b></a></Text>',
				'standart',
				'danger',
				'standart'
			);
		}
	}
}

function showShedulePanel() {
	var tabElControl = document.querySelectorAll('button[data-bs-toggle="tab"]');

	for (let nTab = 0; nTab < tabElControl.length; nTab++) {
		//		tabElControl[nTab].addEventListener('shown.bs.tab', function (event) {
		//			//			if (nTab == 0) {
		//			//				document.getElementById('btnclear').style.display = "block";
		//			//				document.getElementById('btnSaveTableSchedule').style.display = "block";
		//			//				document.getElementById('btnLoadTableSchedule').style.display = "block";
		//			//			} else {
		//			//				document.getElementById('btnclear').style.display = "none";
		//			//				document.getElementById('btnSaveTableSchedule').style.display = "none";
		//			//				document.getElementById('btnLoadTableSchedule').style.display = "none";
		//			//			}
		//		})
	}
}

// radio Login - Registration
//login

let moveWin = document.querySelector('.moveWin');
let btnCloses = document.querySelectorAll('.btnCloseEnter');

let buttonEnter = document.querySelector('#buttonEnter');
let modalBody = document.getElementById('modalBody');
let areaAnswer = document.getElementById('areaAnswer');

let modalBodyInputs = modalBody.innerHTML;

let inputLogin = document.getElementById('InputLogin');
let input1Pass = document.getElementById('InputPassword');
let input2Pass = document.getElementById('InputPassword2');
let emailReg = document.getElementById('Email');

//if (localStorage.getItem('typeBase') == 'remote') {
//	moveWin.classList.toggle('invs');
//}

let btnModalEnter = document.getElementById('btnModalEnter');
btnModalEnter.addEventListener('click', () => {
	moveWin.classList.toggle('invs');
});

if (window.innerWidth < 400) moveWin.style.width = '320px';
else if (window.innerWidth < 600) moveWin.style.width = '400px';
else moveWin.style.width = '450px';

btnCloses[0].addEventListener('click', () => {
	moveWin.classList.toggle('invs');
});

btnCloses[1].addEventListener('click', () => {
	moveWin.classList.toggle('invs');
});


document.getElementById('logout').addEventListener('click', () => {
	sessionStorage.setItem("numLoad", 0)

	if (sessionStorage.getItem("typeBase") == 'local') {
		modalBody.style.display = 'block';
		areaAnswer.innerHTML = '';

		modalBody.innerHTML = modalBodyInputs;
		document
			.getElementById('btnModalEnterIcon')
			.classList.replace('bi-person-check', 'bi-box-arrow-in-right');
		document.getElementById('btnModalEnterIcon').style.color = 'black';
		document.getElementById('logout').disabled = true;
		document.querySelector('#buttonEnter').disabled = false;

		remoteBase.disabled = true;
		document.getElementById('importButtonBase').disabled = true;
		document.getElementById('flexRadioDefault1').checked = true;


		selectRadio = 'loginEnter';

		rad = document.getElementsByName('inpRadioEnter');
		rad[0].checked = true;
		rad[1].checked = false;



	} else if (sessionStorage.getItem("typeBase") == 'remote') {
		globalLogin = '';
		globalAccess = 0;

		sessionStorage.setItem('globalLogin', globalLogin);
		sessionStorage.setItem('globalAccess', globalAccess);
		sessionStorage.setItem("typeBase", 'local');
		localStorage.setItem("typeBase", 'local');

		sessionStorage.removeItem('users');
		sessionStorage.removeItem('business');
		sessionStorage.removeItem('grades');
		sessionStorage.removeItem('courses');
		sessionStorage.removeItem('filteredUsers');
		sessionStorage.removeItem('filteredCourses');
		sessionStorage.removeItem('filteredGrades');

		alerter(
			'<Text trans="text+:AlertChangeStorageHeader;">Смена типа хранилища</Text>',
			'<Text trans="text+:AlertChangeStorageBody;">Тип базы данных будет изменён c сетевого на локальный после перезагрузки.</Text>',
			'standart',
			'warning',
			'standart'
		);
		setTimeout("location.replace('index.html')", 3000);

	}


	//	loadBusinessTable()
	//	filterUsers()
	//	start()
	//	filterUsers()


	//	selectRadioEnter();
	//	rad = document.getElementsByName('inpRadioEnter');
	//	rad[0].addEventListener('click', selectRadioEnter);
	//	rad[1].addEventListener('click', selectRadioEnter);

	//    moveWin.classList.toggle('invs');
});



buttonEnter.addEventListener("click", async () => {

	let inputLogin = document.getElementById('InputLogin');
	let input1Pass = document.getElementById('InputPassword');
	let input2Pass = document.getElementById('InputPassword2');
	let emailReg = document.getElementById('Email');

	let action = 'login';
	let сommand = document.querySelectorAll('input[name="inpRadioEnter"]');
	for (const f of сommand) {
		if (f.checked) {
			action = f.value;

		}
	}

	let validLetters = /^[а-яА-ЯёЁa-zA-Z0-9]+$/;

	if (inputLogin.value.trim() == "") {
		alerter(
			'<Text trans="text+:AlertErrorHeader;">Ошибка</Text>',
			'<Text trans="text+:AlertErrorlogin1;">Пустой логин</Text>',
			'standart',
			'danger',
			'standart'
		);

	} else if (inputLogin.value.trim().length < 6) {
		alerter(
			'<Text trans="text+:AlertErrorHeader;">Ошибка</Text>',
			'<Text trans="text+:AlertErrorlogin2;">Логин должен быть не менее 6 знаков</Text>',
			'standart',
			'danger',
			'standart'
		);
	} else if (!(validLetters.test(inputLogin.value.trim()))) {
		alerter(
			'<Text trans="text+:AlertErrorHeader;">Ошибка</Text>',
			'<Text trans="text+:AlertErrorlogin22;">В логине могут быть только буквы и цифры. Пробелы и другие символы использовать нельзя.</Text>',
			'standart',
			'danger',
			'standart'
		);
	} else if (input1Pass.value.trim().length < 6) {
		alerter(
			'<Text trans="text+:AlertErrorHeader;">Ошибка</Text>',
			'<Text trans="text+:AlertErrorlogin3;">Пароль должен быть не менее 6 знаков</Text>',
			'standart',
			'danger',
			'standart'
		);

	} else if (!(validLetters.test(input1Pass.value.trim()))) {
		alerter(
			'<Text trans="text+:AlertErrorHeader;">Ошибка</Text>',
			'<Text trans="text+:AlertErrorlogin33;">В пароле могут быть только буквы и цифры. Пробелы и другие символы использовать нельзя.</Text>',
			'standart',
			'danger',
			'standart'
		);
	} else if ((action == "singin") && ((input1Pass.value.trim() == "") || (input2Pass.value.trim() == ""))) {
		alerter(
			'<Text trans="text+:AlertErrorHeader;">Ошибка</Text>',
			'<Text trans="text+:AlertErrorlogin4;">Не заполнено одно из полей с паролями</Text>',
			'standart',
			'danger',
			'standart'
		);
	} else if ((action == "singin") && (input1Pass.value.trim() != input2Pass.value.trim())) {
		alerter(
			'<Text trans="text+:AlertErrorHeader;">Ошибка</Text>',
			'<Text trans="text+:AlertErrorlogin5;">Пароли не совпадают</Text>',
			'standart',
			'danger',
			'standart'
		);

	} else if ((action == "singin") && (emailReg.value.trim() == "")) {
		alerter(
			'<Text trans="text+:AlertErrorHeader;">Ошибка</Text>',
			'<Text trans="text+:AlertErrorlogin6;">Пустой email</Text>',
			'standart',
			'danger',
			'standart'
		);

	} else if ((action == "singin") && ((emailReg.value.trim().includes("@") == false) || (emailReg.value.trim().includes(".")) == false)) {
		alerter(
			'<Text trans="text+:AlertErrorHeader;">Ошибка</Text>',
			'<Text trans="text+:AlertErrorlogin7;">Неправильный формат email</Text>',
			'standart',
			'danger',
			'standart'
		);

	} else {
		const params = {
			login: inputLogin.value,
			password: input1Pass.value,
			email: emailReg.value,
			action: action
		}

		async function loadDataEnter(parameters = null, url, method) {
			let params
			if (parameters) {
				params = new URLSearchParams()
				params.set('login', parameters.login)
				params.set('password', parameters.password)
				params.set('email', parameters.email)
				params.set('action', parameters.action)
			}
			const res = await fetch(url, {
				method: method,
				body: params
			})
			return res
		}

		const json = await (await loadDataEnter(params, '../php/enter4.php', 'POST')).json()
		areaAnswer.innerHTML = genContentWinEnter(json);

		if (document.getElementById('start2Net').checked && globalAccess == 7) {

			localStorage.setItem("typeBase", "remote");
			sessionStorage.setItem("typeBase", "remote");

			alerter(
				'<Text trans="text+:AlertChangeStorageHeader;">Смена типа хранилища</Text>',
				'<Text trans="text+:AlertChangeStorageBody;">Производится подключение к сетевому хранилищу данных.</Text>',
				'standart',
				'warning',
				'standart'
			);
			setTimeout("location.replace('index.html')", 2000);
		}
	}
})

//ВХОД В СЕССИЮ======================================================================

var globalLogin = '';
var globalAccess = 0;

if (sessionStorage.getItem('globalAccess') == 7) {
	globalAccess = sessionStorage.getItem('globalAccess');
	globalLogin = sessionStorage.getItem('globalLogin');
}


if (globalAccess == 7) {



	document
		.getElementById('btnModalEnterIcon')
		.classList.replace('bi-box-arrow-in-right', 'bi-person-check');
	document.getElementById('btnModalEnterIcon').style.color = '#48c2a9';

	modalBody.innerHTML = sessionStorage.getItem('modalBody');
	document.getElementById('logout').disabled = false;
	document.querySelector('#buttonEnter').disabled = true;

	if (localStorage.getItem('typeBase') == 'remote') {
		//        alert("База удаленная 1")

		document.getElementById('flexRadioDefault2').disabled = false;
		document.getElementById('flexRadioDefault2').checked = true;
		document.getElementById('flexRadioDefault1').checked = false;
		document.getElementById('importButtonBase').disabled = false;
	} else {
		document.getElementById('flexRadioDefault1').disabled = false;
		document.getElementById('flexRadioDefault2').disabled = false;
		document.getElementById('flexRadioDefault1').checked = true;
		document.getElementById('flexRadioDefault2').checked = false;
		document.getElementById('importButtonBase').disabled = false;

		//        alert("База локальная 1")
	}
} else {
	document.getElementById('flexRadioDefault2').disabled = true;
	document.getElementById('flexRadioDefault1').checked = true;
	document.getElementById('flexRadioDefault1').disabled = false;
	document.getElementById('importButtonBase').disabled = true;
}


function genContentWinEnter(text) {
	//	alert(text);
	//	let objectPHP = JSON.parse(text);
	let objectPHP = text;
	//    return objectPHP["txtMsg"]

	let contentWinEnter = '';

	globalLogin = objectPHP['login'];
	globalAccess = Number(objectPHP['access']);

	sessionStorage.setItem('globalLogin', globalLogin);
	sessionStorage.setItem('globalAccess', globalAccess);


	if (!globalAccess) {
		remoteBase.disabled = true;
		document.getElementById('importButtonBase').disabled = true;
	} else {
		remoteBase.disabled = false;
		document.getElementById('importButtonBase').disabled = false;
	}

	//    ДОСТУПА В СИСТЕМУ НЕТ.
	if (Number(objectPHP['access']) == 0) {

		modalBody.style.display = 'block';

		contentWinEnter +=
			'Доступ  в систему: <b style="color:indianred;">НЕ ВЫПОЛНЕН!</b><br>Ошибка в логине или пароле. Повторите ввод!<br><br>';

		document.getElementById('logout').disabled = true;
		document.querySelector('#buttonEnter').disabled = false;
	}






	// регистрация
	else if (Number(objectPHP['access']) == 13) {
		modalBody.style.display = 'none';
		areaAnswer.innerHTML = '';

		globalLogin = objectPHP['login'];
		globalAccess = objectPHP['access'];

		document.getElementById('logout').disabled = false;
		document.querySelector('#buttonEnter').disabled = true;

		document.getElementById('btnModalEnterIcon').classList.replace('bi-box-arrow-in-right', 'bi-person-exclamation');
		document.getElementById('btnModalEnterIcon').style.color = 'deepskyblue';

		contentWinEnter += '<p style="margin-top:7px">Добрый день <b>' + objectPHP['login'] + '!</b></p>';
		contentWinEnter += '<p>' + objectPHP['txtMsg'] + ' Вы вошли в систему составления расписания, организации встреч и работы со временем <b>ДелуВремя! </b><br>';
		contentWinEnter +=
			'<div style="width:95%;text-align:left;padding-left:10px; margin-top:12px;">Зарегистрированный логин: <b style="color:#48c2a0;"> '
		contentWinEnter += objectPHP['login']
		contentWinEnter += ' </b></div>';
		contentWinEnter +=
			'<div style="width:95%;text-align:left;padding-left:10px;">Расширенный функционал: <b style="color:indianred;">Не активирован!</b></div>';


		contentWinEnter +=
			'<div style="width:95%;text-align:left;padding-left:10px;">Дополнительные сервисы до: <b  style="color:#48c2a0;">' +
			objectPHP['expiredDate'] +
			'</b></div>';


		contentWinEnter += '<br><p><b>Подключите до 31.12.2023 г. бесплатно</b> дополнительные сервисы в системе, перейдя по ссылке в письме которое Вам поступило после регистрации.</p><br>'


	}


	//    логин зарегистрировн
	else if (Number(objectPHP['access']) == 7) {
		//ДОСТУП НОРМАЛЬНЫЙ
		modalBody.style.display = 'none';
		areaAnswer.innerHTML = '';

		document
			.getElementById('btnModalEnterIcon')
			.classList.replace('bi-box-arrow-in-right', 'bi-person-check');
		document.getElementById('btnModalEnterIcon').style.color = '#48c2a9';

		document.querySelector('#buttonEnter').disabled = true;
		document.getElementById('logout').disabled = false;

		globalLogin = objectPHP['login'];

		contentWinEnter += '<p style="margin-top:7px">Добрый день <b>' + objectPHP['login'] + '!</b></p>';
		contentWinEnter += '<p>' + objectPHP['txtMsg'] + ' Вы вошли в систему составления расписания, организации встреч и работы со временем <b>ДелуВремя! </b><br>';
		contentWinEnter +=
			'<div style="width:95%;text-align:left;padding-left:10px; margin-top:12px;">Зарегистрированный логин: <b style="color:#48c2a0;"> '
		contentWinEnter += objectPHP['login']
		contentWinEnter += ' </b></div>';
		contentWinEnter +=
			'<div style="width:95%;text-align:left;padding-left:10px;">Расширенный функционал: <b style="color:#48c2a0;">Активирован!</b></div>';
		contentWinEnter +=
			'<div style="width:95%;text-align:left;padding-left:10px;">Дополнительные сервисы до: <b  style="color:#48c2a0;">' +
			objectPHP['expiredDate'] +
			'</b></div>';

		contentWinEnter +=
			'<div style="width:95%; text-align:left;margin-left:10px; margin-top:10px;"><b>Ваша ссылка-приглашение:<br><a id="invite" style="font-size:1em;font-weight:500;" href="';
		contentWinEnter +=
			'https://settime.online?invite=' + globalLogin;
		contentWinEnter += '">';
		contentWinEnter +=
			'https://settime.online?invite=' + globalLogin;
		contentWinEnter += '</a>';
		contentWinEnter += `<span id="clipboardPlus2" style="font-size: 1.7em; margin: 10px 15px 0 3px; color: #1AB395; cursor: pointer; padding-top: 12px; vertical-align: -3px;"><i class="bi bi-clipboard-plus"></i></span>`;


		//
		//        contentWinEnter += '<p>Текст приглашения</p>';
		//
		//        contentWinEnter += `<span class="d-flex flex-row align-items-center justify-content-around">`
		//
		//        contentWinEnter += `<textarea style="width:70%;font-size:0.85em;" name="txtInvite" rows=4 placeholder="Заполните и сохраните текст приглашения на встречу или просьбу заполнить свое время. Если поле будет пустое, то клиент получит стандартное приглашение."></textarea></p><br>`;
		//
		//
		//
		//
		//        contentWinEnter += `<span style="padding-top:0.5em";><button onclick="alert(document.getElementById('txtInvite')); return false;" class="d-block mt-0 btnOnPhoneLeft" id="btnSaveTxtInvite" value="Clear font-weight-bold " style="
		//													
		//													border-width: 0px;
		//													margin: 0.5em;
		//													background-color: #23c6c8;
		//													color: black;
		//                                                    font-weight:300;
		//                                                    padding: 0 8px;
		//												">
		//                                            <i class="bi bi-upload font-weight-bold mx-0" style="margin-top: 0.75em"></i>
		//                                            <span trans="text+:btnSave;">сохранить</span>
		//                                        </button>
		//
		//                                        <button class="btnOnPhoneLeft d-block" id="btnLoadTxtInvite" value="Clear font-weight-bold " style="
		//													
		//													border-width: 0px;
		//													margin: 0.5em;
		//                                                    background-color: lightskyblue;
		//													color: black;
		//                                                    letter-spacing:0.03em;
		//                                                    padding: 0 8px;
		//												">
		//                                            <i class="bi bi-download font-weight-bold mx-0" style="margin-top: 0.75em"></i>
		//                                            <span trans="text+:clickLoad">загрузить</span>
		//                                        </button></span>`;
		//
		//        contentWinEnter += `</span>`
		contentWinEnter += `<br><br>`

		//
		//                document.getElementById("clipboardPlus2").addEventListener('click', (e) => {
		//                    let data4Clippoard = document.getElementById("invite").href
		//                    alert(data4Clippoard);
		//                    if (data4Clippoard) {
		//                        navigator.clipboard.writeText(data4Clippoard)
		//                            .then(() => {
		//                                notifyer('Код скопирован! Можете переслать его другому пользователю.', '500')
		//                            })
		//                            .catch(err => {
		//                                alert('Something went wrong', err);
		//                            });
		//                    } else {
		//        
		//                        alert('Something went wrong', err);
		//                    }
		//                });



	} else if (Number(objectPHP['access']) == 4) {


		modalBody.style.display = 'none';
		areaAnswer.innerHTML = '';

		document
			.getElementById('btnModalEnterIcon')
			.classList.replace('bi-box-arrow-in-right', 'bi-person-exclamation');
		document.getElementById('btnModalEnterIcon').style.color = 'indianred';

		document.querySelector('#buttonEnter').disabled = true;
		document.getElementById('logout').disabled = false;

		globalLogin = objectPHP['login'];

		contentWinEnter += '<p style="margin-top:7px">Добрый день <b>' + objectPHP['login'] + '!</b></p>';
		contentWinEnter += '<p>' + objectPHP['txtMsg'] + ' Вы вошли в систему составления расписания, организации встреч и работы со временем <b>ДелуВремя! </b><br>';
		contentWinEnter +=
			'<div style="width:95%;text-align:left;padding-left:10px; margin-top:12px;">Зарегистрированный логин: <b style="color:#48c2a0;"> '
		contentWinEnter += objectPHP['login']
		contentWinEnter += ' </b></div>';
		contentWinEnter +=
			'<div style="width:95%;text-align:left;padding-left:10px;">Расширенный функционал: <b style="color:indianred;">Не активирован!</b></div>';


		contentWinEnter += '<br><p>Для активации дополнительных сервисов системы перейдите по ссылке в письме которое Вы получили при регистрации.</p><br>'



	} else if (Number(objectPHP['access']) == 6) {

		modalBody.style.display = 'none';
		areaAnswer.innerHTML = '';

		document
			.getElementById('btnModalEnterIcon')
			.classList.replace('bi-box-arrow-in-right', 'bi-person-exclamation');
		document.getElementById('btnModalEnterIcon').style.color = '#48c2a9';

		document.querySelector('#buttonEnter').disabled = true;
		document.getElementById('logout').disabled = false;

		globalLogin = objectPHP['login'];

		contentWinEnter += '<p style="margin-top:7px">Добрый день <b>' + objectPHP['login'] + '!</b></p>';
		contentWinEnter += '<p>' + objectPHP['txtMsg'] + ' Вы вошли в систему составления расписания, организации встреч и работы со временем <b>ДелуВремя! </b><br>';
		contentWinEnter +=
			'<div style="width:95%;text-align:left;padding-left:10px; margin-top:12px;">Зарегистрированный логин: <b style="color:#48c2a0;"> '
		contentWinEnter += objectPHP['login']
		contentWinEnter += ' </b></div>';
		contentWinEnter +=
			'<div style="width:95%;text-align:left;padding-left:10px;">Расширенный функционал: <b style="color:#48c2a0;">Активирован!</b></div>';

		contentWinEnter +=
			'<div style="width:95%;text-align:left;padding-left:10px;">Дополнительные сервисы до: <b  style="color:indianred;">' +
			objectPHP['expiredDate'] +
			'</b></div>';

		contentWinEnter +=
			'<div style="width:95%; text-align:left;margin-left:10px; margin-top:10px;"><b>Ваша ссылка-приглашение:<br><a id="invite" style="font-size:0.9em;font-weight:500;" href="';
		contentWinEnter +=
			'https://settime.online?invite&user=' + globalLogin;
		contentWinEnter += '">';
		contentWinEnter +=
			'https://settime.online?invite&user=' + globalLogin;
		contentWinEnter += '</a>';



		//        contentWinEnter += '<span id="clipboardPlus2" style="font-size: 1.7em; margin: 10px 15px 0 3px; color: #1AB395; cursor: pointer; padding-top: 12px; vertical-align: -3px;" title="Скопировать в память"><i class="bi bi-clipboard-plus-fill"></i></span>';

		contentWinEnter += '</b><br><p  style="width:100%; font-weight:500; text-align: center; color:indianred; margin-top:7px;">У Вас закончился доступ к расширенной функциональности системы!<br><a href="" style="color:black";> Продлите доступ БЕСПЛАТНО до 31.12.2023!</a></p><br>'






	} else if (Number(objectPHP['access']) == 8) {
		contentWinEnter = '<p style="color:indianred;font-weight:500">Такой логин уже есть в системе!<br><p>Попробуйте еще раз!</p><br>'
	} else {

	}



	sessionStorage.setItem('modalBody', contentWinEnter);
	return contentWinEnter;
}

//=============================================================
//	Тестирование передачи данных из локального хранилища
//	аякс запросом на сервер и сохрание в файл в формате JSON POST
//=============================================================
let importButtonBase = document.getElementById('importButtonBase');

importButtonBase.addEventListener('click', export2net);

export function export2net() {
	let listLocalitems = [
		'users',
		'business',
		'grades',
		'courses',
		'filteredUsers',
		'filteredCourses',
		'filteredGrades',
	];
	listLocalitems.forEach((item) => saveData(item));

	notifyer('Данные сохранены на сервер');

	function saveData(item) {
		let localData = localStorage.getItem(item);
		var params = new URLSearchParams();

		params.set('login', sessionStorage.getItem('globalLogin'));
		params.set('item', item);
		params.set('data', localData);

		fetch('https://settime.online/php/saveData.php', {
				method: 'POST',
				body: params,
			})
			.then((response) => {
				return response.text();
			})
			.then((text) => {
				//                alert('Данные '+item+' записаны на сервер')
			});
		//        event.preventDefault();
	}
}

function loadFiles(globalLogin, item) {
	let dataItem =
		'https://settime.online/php/' +
		globalLogin +
		'/' +
		globalLogin +
		'_' +
		item +
		'.json';

	fetch(dataItem)
		.then((response) => {
			return response.text();
		})
		.then((text) => {
			return text;
		});
}

let remoteBase = document.getElementById('flexRadioDefault2');
let localBase = document.getElementById('flexRadioDefault1');

let typeBase = 'local';

if (
	localStorage.getItem('typeBase') &&
	globalLogin != '' &&
	globalAccess != 0
) {
	typeBase = localStorage.getItem('typeBase');
}

remoteBase.addEventListener('change', radioSelect);
localBase.addEventListener('change', radioSelect);

function radioSelect() {
	if (remoteBase.checked) typeBase = 'remote';
	else typeBase = 'local';

	localStorage.setItem('typeBase', typeBase);

	sessionStorage.setItem('typeBase', typeBase);
	sessionStorage.setItem('globalLogin', globalLogin);
	sessionStorage.setItem('globalAccess', globalAccess);

	sessionStorage.removeItem('users');
	sessionStorage.removeItem('business');
	sessionStorage.removeItem('grades');
	sessionStorage.removeItem('courses');
	sessionStorage.removeItem('filteredUsers');
	sessionStorage.removeItem('filteredCourses');
	sessionStorage.removeItem('filteredGrades');

	alerter(
		'<Text trans="text+:AlertChangeStorageHeader;">Смена типа хранилища</Text>',
		'<Text trans="text+:AlertChangeStorageBody;">Тип базы данных будет изменён после перезагрузки.</Text>',
		'standart',
		'warning',
		'standart'
	);
	setTimeout("location.replace('index.html')", 4000);
	//    location.reload();
}

document.getElementById('Trans').addEventListener('change', () => {
	let Language = document.getElementById('Trans').value; // Ищем нынешнее значение языка
	localStorage.setItem('LanguageLocal', Language); // Сохранение в локальное хранилище

	Translate();
	if (Language == 'ru' && Number(window.innerWidth) < 400) {
		//		document.getElementById('create').append(document.createTextNode="");
	} else if (Language == 'fr' && Number(window.innerWidth) < 400) {
		//		document.getElementById('create').style.marginLeft="1.2em";
		//
	} else {
		//		document.getElementById('create').style.marginLeft="0.2em";
		//		document.getElementById('create').style.backgroundColor="white";
	}
});

document.querySelectorAll('.help')[0].addEventListener('click', () => {
	window.location.href = './guide.html';
});

document.getElementById('sendCode2').addEventListener('click', sendCodeFunc);

function sendCodeFunc() {
	{
		let action = 'sendCode2email';
		let nameUser = document.getElementById('YourName').value;
		let sendTimeCode = document.getElementById('importInput').value;
		let loginSendTimeCode = document.getElementById('loginSendTimeCode').value;
		let courseUser = document.getElementById('courseSelector').value;
		let levelUser = document.getElementById('levelSelector').value;

		let typeTime;
		if (document.getElementById('timeSelect').name == 'FreeTime') {
			typeTime = 'FreeTime';
		} else if (document.getElementById('timeSelect').name == 'BusyTime') {
			typeTime = 'BusyTime';
		} else {
			typeTime = document.getElementById('timeSelect').value;
		}

		//        alert(typeTime);

		if (nameUser == '') {
			alerter(
				'<Text trans="text+:AlertErrorHeader;">Ошибка</Text>',
				'<Text trans="text+:sendCodeError4;">Нет данных по имени. Введите его!</Text>',
				'standart',
				'danger',
				'standart'
			);
		} else if (sendTimeCode == '') {
			alerter(
				'<Text trans="text+:AlertErrorHeader;">Ошибка</Text>',
				'<Text trans="text+:sendCodeError1;">Нет данных по коду времени! Cформируйте его, нажав на кнопку </Text><button class="btn btn-sm" id="showingCodeButton1" style="box-sizing: border-box; padding: 2px 6px; font-size: 1em; font-weight: bold; background-color:#23C6C8; lightskyblue; border-radius: 2px; margin-left: 0px"><i class="bi bi-code-square" title="load" ></i></button>.',
				'standart',
				'danger',
				'standart'
			);

			const showingCodeButton1 = document.getElementById('showingCodeButton1');
			showingCodeButton1.addEventListener('click', () => {
				document.getElementById('importInput').value = fCompressCodeTime(
					getTimeCode()
				);
				notifyer(
					'Сформирован Ваш код времени! Можете его отправить пользователю системы',
					500
				);
			});
		} else if (loginSendTimeCode == '') {
			alerter(
				'<Text trans="text+:AlertErrorHeader;">Ошибка</Text>',
				'<Text trans="text+:sendCodeError2;">Нет данных по логину или email пользователя систему которому отправляем код времени. Введите его!</Text>',
				'standart',
				'danger',
				'standart'
			);
		} else {
			let searchParams = new URLSearchParams();
			searchParams.set('typeTime', typeTime);
			searchParams.set('nameUser', nameUser);
			searchParams.set('courseUser', courseUser);
			searchParams.set('levelUser', levelUser);
			searchParams.set('sendTimeCode', sendTimeCode);
			searchParams.set('loginSendTimeCode', loginSendTimeCode);
			searchParams.set('action', action);

			fetch('https://settime.online/php/sendCode.php', {
					method: 'POST',
					body: searchParams,
				})
				.then((response) => {
					return response.text();
				})
				.then((text) => {
					let textFrom = text;
					alerter(
						'<Text trans="text+:info;">Информация!</Text>',
						'<Text trans="text+:SendCode;"></Text> ' + text,
						'standart',
						'info',
						'standart'
					);
				});
			event.preventDefault();
		}
	}
}

document.getElementById('clipboardPlus1').addEventListener('click', (e) => {
	//clipBoard operation 1
	let data4Clippoard = document.getElementById('importInput').value;
	if (data4Clippoard) {
		navigator.clipboard
			.writeText(data4Clippoard)
			.then(() => {
				notifyer(
					'Код скопирован! Можете переслать его другому пользователю.',
					'500'
				);
			})
			.catch((err) => {
				alert('Something went wrong', err);
			});
	} else {
		alerter(
			'<Text trans="text+:AlertErrorHeader;">Ошибка</Text>',
			'<Text trans="text+:sendCodeError1;">Нет данных по коду времени! Cформируйте его, нажав на кнопку </Text><button class="btn btn-sm" id="showingCodeButton2" style="box-sizing: border-box; padding: 2px 6px; font-size: 1em; font-weight: bold; background-color:#23C6C8; lightskyblue; border-radius: 2px; margin-left: 0px"><i class="bi bi-code-square" title="load"></i></button>.',
			'standart',
			'danger',
			'standart'
		);
		const showingCodeButton2 = document.getElementById('showingCodeButton2');
		showingCodeButton2.addEventListener('click', () => {
			document.getElementById('importInput').value = fCompressCodeTime(
				getTimeCode()
			);
			notifyer(
				'Сформирован Ваш код времени! Можете его отправить пользователю системы',
				500
			);
		});
	}
});


document.getElementById('clipboardLinkBusy').addEventListener('click', (e) => {

	let txtLink = "";


	txtLink += `Добрый день! Вам отправлено приглашение от пользователя `;
	txtLink += globalLogin;
	txtLink += ` заполнить данные по Вашему свободному времени для составления оптимального расписания в системе "ДелуВремя!". Перейдите пожалуйста по ссылке, отметьте в таблице время для занятий и нажмите кнопку 'ОТПРАВИТЬ'! Спасибо!
`;

	txtLink += `https://settime.online/?invite=`;
	txtLink += globalLogin;
	txtLink += `&nameUser=`;
	txtLink += document.getElementById('YourName').value.replace(/\s+/g, '_');
	txtLink += `&sendTimeCode=`;
	txtLink += document.getElementById('importInput').value;
	txtLink += `&typeTime=`;
	txtLink += document.getElementById('timeSelect').value;

	if (document.getElementById('importInput').value) {
		navigator.clipboard
			.writeText(txtLink)
			.then(() => {
				notifyer(
					'Ссылка сформирована и сохранена в памяти! Можете переслать её другому пользователю.',
					'500'
				);
			})
			.catch((err) => {
				alert('Something went wrong', err);
			});
	} else {
		alerter(
			'<Text trans="text+:AlertErrorHeader;">Ошибка</Text>',
			'<Text trans="text+:sendCodeError1;">Нет данных по коду времени! Cформируйте его, нажав на кнопку </Text><button class="btn btn-sm" id="showingCodeButton2" style="box-sizing: border-box; padding: 2px 6px; font-size: 1em; font-weight: bold; background-color:#23C6C8; lightskyblue; border-radius: 2px; margin-left: 0px"><i class="bi bi-code-square" title="load"></i></button>.',
			'standart',
			'danger',
			'standart'
		);
		const showingCodeButton2 = document.getElementById('showingCodeButton2');
		showingCodeButton2.addEventListener('click', () => {
			document.getElementById('importInput').value = fCompressCodeTime(
				getTimeCode()
			);
			notifyer(
				'Сформирован Ваш код времени! Можете его отправить пользователю системы',
				500
			);
		});
	}
});






function startLoadFromRemote(globalLogin, item) {
	loadFromRemote(globalLogin, item)
	let dataFromRemote = sessionStorage.getItem(item);
	return dataFromRemote;
}

function loadFromRemote(globalLogin, item) {

	if (sessionStorage.getItem("globalAccess") != 7) {
		return false;
	}


	var params = new URLSearchParams();
	params.set('login', globalLogin);
	params.set('item', item);
	fetch('https://settime.online/php/lload.php', {
		method: 'POST',
		body: params
	}).then(
		response => {
			return response.text();
		}
	).then(
		text => {
			sessionStorage.setItem(item, text);
		}
	);
}

function startLoadFromLocal(item) {
	return localStorage.getItem(item)
}

function getDataFrom(typeBase, globalLogin, item) {
	let dataLoad;
	if (typeBase == "local") {
		dataLoad = startLoadFromLocal(item);
	} else if (typeBase == "remote") {
		dataLoad = startLoadFromRemote(globalLogin, item);
	} else {
		dataLoad = startLoadFromLocal(item);
		//                alert("error typeBase")
	}
	return dataLoad
}

//Открытие таблицы времени клиента на полный экран и свёрнутый

btnFullScreenBusy.addEventListener('click', fullBreif)

function fullBreif() {
	let btnFullScreenBusy = document.getElementById("btnFullScreenBusy")
	let briefName = document.getElementById("briefName")
	let tds = document.querySelectorAll("#tableUser td");
	let tdsDays = document.querySelectorAll("#tableDays td");
	//let tabledDays = document.querySelectorAll("#tableDays");
	if (btnFullScreenBusy.dataset.target == "full") {
		btnFullScreenBusy.setAttribute("data-target", "brief")
		btnFullScreenBusy.innerHTML = `<i class="bi bi-arrows-collapse font-weight-bold mx-0" style="margin-top: 0.65em"></i>`
		document.getElementById("editDataHeader").style.display = "none";
		if (Number(window.innerWidth) < 400) {
			briefName.innerHTML = document.getElementById("YourName").value.slice(0, 10) + "..."
		} else {
			briefName.innerHTML = document.getElementById("YourName").value
		}
		for (let i = 0; i < tds.length; i++) {
			tds[i].style.padding = "0px 2px";
			//tds[i].style.fontSize = "0.75em";
		}
		for (let i = 0; i < tdsDays.length; i++) {
			tdsDays[i].style.padding = "0px 3px";
			//tds[i].style.fontSize = "0.75em";
		}
	} else {
		btnFullScreenBusy.setAttribute("data-target", "full")
		btnFullScreenBusy.innerHTML = `<i class="bi bi-arrows-expand font-weight-bold mx-0" style="margin-top: 0.65em"></i>`
		//tabledDays.style.marginTop = "0px";
		//tabledDays.style.marginTop = "0px";
		document.getElementById("editDataHeader").style.display = "block";
		briefName.innerHTML = ""
		for (let i = 0; i < tds.length; i++) {
			tds[i].style.padding = "8px 1.6px"
			//tds[i].style.fontSize = "0.9em";
		}
		for (let i = 0; i < tdsDays.length; i++) {
			tdsDays[i].style.padding = "8px 1.6px";
			//tds[i].style.fontSize = "0.9em";
		}
	}

	closeTodoLayers(
		document.querySelector('#staticBackdrop').querySelector('.modal-content').children[2].children[0]
	);
	isLayersCanBeDisplayed(
		document.querySelector('#staticBackdrop').querySelector('.modal-content').children[2].children[0],
		document.querySelector('#staticBackdrop').querySelector('#btnTodo').dataset.id,
		loadTodoLayers
	)
	// loadTodoLayers(
	// 	document.querySelector('#staticBackdrop').querySelector('.modal-content').children[2].children[0],
	// 	document.querySelector('#staticBackdrop').querySelector('#btnTodo').dataset.id
	// );

}
