import { Translate } from './translator.js';
import { notifyer } from './main.js';
import { alerter } from './main.js';
import { confirmer } from './main.js';
import { fCompressCodeTime } from './main.js';
import { fDeCompressCodeTime } from './main.js';
import { getTimeCode } from './main.js';

//save&load schedule

let tbodySchedule = document.getElementById('tbodySchedule');
let tbodyScheduleFull = document.getElementById('tbodyScheduleFull');
//let tbodyScheduleFull2 = document.getElementById("tbodyScheduleFull2");

let btnSaveTableSchedule = document.getElementById('btnSaveTableSchedule');
let btnSaveTableScheduleFull = document.getElementById(
	'btnSaveTableScheduleFull'
);
//let btnSaveTableScheduleFull2 = document.getElementById("btnSaveTableScheduleFull2");

let btnLoadTableSchedule = document.getElementById('btnLoadTableSchedule');
let btnLoadTableScheduleFull = document.getElementById(
	'btnLoadTableScheduleFull'
);
//let btnLoadTableScheduleFull2 = document.getElementById("btnLoadTableScheduleFull2");

btnSaveTableSchedule.addEventListener('click', saveTableSchedule);
btnSaveTableScheduleFull.addEventListener('click', saveTableSchedule);
//btnSaveTableScheduleFull2.addEventListener('click', saveTableSchedule);

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
//btnLoadTableScheduleFull2.addEventListener('click', loadTableSchedule);

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
	let listGrades = JSON.parse(localStorage.getItem('grades'));
	let strokeGrades = '';
	for (let i = 0; i < listGrades.length; i++) {
		strokeGrades += String(listGrades[i]) + ',';
	}
	document.getElementById('gradeTextArea').value = strokeGrades;
}

gradeNameSubmitLoad.addEventListener('click', listGrades);

listGrades();

let gradeNameSubmitDel = document.getElementById('gradeNameSubmitDel');
gradeNameSubmitDel.addEventListener('click', () => {
	if (confirm('В хранилище есть данные по уровням. Удалить?')) {
		localStorage.removeItem('grades');
		notifyer('grades delete in local storage');
	}
});

function listCourses() {
	let listCourses = JSON.parse(localStorage.getItem('courses'));
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
listCourses();

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

//Если поле пустое, то появляется подсказка

//let tab1 = document.getElementById('nav-home-tab');
//let tab2 = document.getElementById('nav-profile-tab');
//let tab2 = document.getElementById('nav-contact-tab');
//
//tab1.addEventListener('click', alertEmptyStart)
//tab2.addEventListener('click', alertEmptyStart)
//tab3.addEventListener('click', alertEmptyStart)

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

//
//alert(numTab);
//if (numTab >=2 ) {
//    var myModal2 = new bootstrap.Modal(document.getElementById('myModalFull'), {})
//    myModal2.show()
//}

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

let input1Pass = document.getElementById('InputLogin');
let input2Pass = document.getElementById('InputPassword');
let emailReg = document.getElementById('Email');

//alert(emailReg.value)

let btnModalEnter = document.getElementById('btnModalEnter');
btnModalEnter.addEventListener('click', () => {
	moveWin.classList.toggle('invs');
});

if (window.innerWidth < 400) moveWin.style.width = '320px';
else if (window.innerWidth < 600) moveWin.style.width = '400px';
else moveWin.style.width = '400px';

btnCloses[0].addEventListener('click', () => {
	moveWin.classList.toggle('invs');
});

btnCloses[1].addEventListener('click', () => {
	moveWin.classList.toggle('invs');
});

document.getElementById('logout').addEventListener('click', () => {
	modalBody.style.display = 'block';
	areaAnswer.innerHTML = '';

	modalBody.innerHTML = modalBodyInputs;
	document
		.getElementById('btnModalEnterIcon')
		.classList.replace('bi-person-check', 'bi-box-arrow-in-right');
	document.getElementById('btnModalEnterIcon').style.color = 'black';
	document.getElementById('logout').disabled = true;
	document.querySelector('#buttonEnter').disabled = false;

	globalLogin = '';
	globalAccess = 0;

	remoteBase.disabled = true;
	document.getElementById('importButtonBase').disabled = true;
	document.getElementById('flexRadioDefault1').checked = true;

	moveWin.classList.toggle('invs');
});

buttonEnter.addEventListener('click', function (event) {
	let action = 'login';

	let сommand = document.querySelectorAll('input[name="inpRadioEnter"]');
	for (const f of сommand) {
		if (f.checked) {
			action = f.value;
			//			alert(action);
		}
	}

	let searchParams = new URLSearchParams();
	searchParams.set('login', input1Pass.value);
	searchParams.set('password', input2Pass.value);
	searchParams.set('email', emailReg.value);
	searchParams.set('action', action);

	fetch('https://findtime.online/php/enter4.php', {
		method: 'POST',
		body: searchParams,
	})
		.then((response) => {
			return response.text();
		})
		.then((text) => {
			//            alert(genContentWinEnter(text));
			areaAnswer.innerHTML = genContentWinEnter(text);
		});

	//    alert("4444")
	//            //clipBoard operation 2
	//            document.getElementById("clipboardPlus2").addEventListener('click', (e) => {
	//                    let linkInvite = document.getElementById("invite").href
	//                    alert(linkInvite)
	//                });

	event.preventDefault();
});

//Вход в сессию

var globalLogin = '';
var globalAccess = 0;

if (sessionStorage.getItem('globalLogin')) {
	globalLogin = sessionStorage.getItem('globalLogin');
}

if (sessionStorage.getItem('globalAccess')) {
	globalAccess = sessionStorage.getItem('globalAccess');
}

//alert(globalLogin)
//alert(globalAccess)

if (globalAccess == 1) {
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
} else if (globalAccess == 2) {
	document
		.getElementById('btnModalEnterIcon')
		.classList.replace('bi-box-arrow-in-right', 'bi-person-exclamation');
	document.getElementById('btnModalEnterIcon').style.color = 'IndianRed';

	modalBody.innerHTML = sessionStorage.getItem('modalBody');
	document.getElementById('logout').disabled = false;
	document.querySelector('#buttonEnter').disabled = true;

	if (localStorage.getItem('typeBase') == 'remote') {
		//        alert("База удаленная 2")

		document.getElementById('flexRadioDefault2').disabled = false;
		document.getElementById('flexRadioDefault1').checked = false;
		document.getElementById('flexRadioDefault2').checked = true;
		document.getElementById('importButtonBase').disabled = false;
	} else {
		document.getElementById('flexRadioDefault1').disabled = false;
		document.getElementById('flexRadioDefault2').disabled = false;
		document.getElementById('flexRadioDefault1').checked = true;
		document.getElementById('flexRadioDefault2').checked = false;
		document.getElementById('importButtonBase').disabled = true;
	}
} else {
	document.getElementById('flexRadioDefault2').disabled = true;
	document.getElementById('flexRadioDefault1').checked = true;
	document.getElementById('flexRadioDefault1').disabled = false;
	document.getElementById('importButtonBase').disabled = true;
}

function genContentWinEnter(text) {
	//		alert(text);
	let objectPHP = JSON.parse(text);
	//    return objectPHP["txtMsg"]

	let contentWinEnter = '';

	globalLogin = objectPHP['login'];
	globalAccess = Number(objectPHP['access']);

	if (!globalAccess) {
		remoteBase.disabled = true;
		document.getElementById('importButtonBase').disabled = true;
	} else {
		remoteBase.disabled = false;
		document.getElementById('importButtonBase').disabled = false;
	}

	//    ДОСТУПА В СИСТЕМУ НЕТ.
	if (Number(objectPHP['access']) == 0) {
		//        contentWinEnter = '<b>Добрый день ' + objectPHP["login"] + '!</b><br><br>';
		modalBody.style.display = 'block';

		if (objectPHP['answer'] == 'noUser') {
			contentWinEnter +=
				'Доступ  в систему: <b style="color:indianred;">НЕ ВЫПОЛНЕН!</b><br>';
			contentWinEnter += objectPHP['txtMsg'];
		} else if (objectPHP['answer'] == 'presentUser') {
			contentWinEnter +=
				'Регистрация в системе: <b style="color:indianred;">НЕ ВЫПОЛНЕНА!</b><br>';
			contentWinEnter += objectPHP['txtMsg'];
		} else {
			contentWinEnter +=
				'Доступ  в систему: <b style="color:indianred;">НЕ ВЫПОЛНЕН!</b>';
		}

		document.getElementById('btnModalEnterIcon').style.color = 'black';
		document.getElementById('logout').disabled = true;
		document.querySelector('#buttonEnter').disabled = false;
	}

	// ДЕМО ДОСТУК К СИСТЕМЕ НОВЫХ ПОЛЬЗОВАТЕЛЕЙ НА 30 ДНЕЙ!
	else if (Number(objectPHP['access']) == 2) {
		modalBody.style.display = 'none';
		areaAnswer.innerHTML = '';

		contentWinEnter += '<p>Добрый день <b>' + objectPHP['login'] + '!</b></p>';
		contentWinEnter +=
			'<p style="font-weight:400;color="skyblue">' +
			objectPHP['txtMsg'] +
			'<br></p><br>';
		contentWinEnter +=
			'<div style="width:95%; text-align:left;margin-left:10px;">Доступ в систему: <b style="color:#48c2a0;">ВЫПОЛНЕН В ДЕМО-РЕЖИМЕ!</b></div>';

		document
			.getElementById('btnModalEnterIcon')
			.classList.replace('bi-box-arrow-in-right', 'bi-person-exclamation');
		document.getElementById('btnModalEnterIcon').style.color = 'IndianRed';

		contentWinEnter +=
			'<div style="width:95%; text-align:left;margin-left:10px;">Дата окончание доступа: <b style="color:indianred;">' +
			objectPHP['expiredDate'] +
			'</b><br></div>';

		globalLogin = objectPHP['login'];
		globalAccess = objectPHP['access'];

		contentWinEnter +=
			'<div style="width:95%; text-align:left;margin-left:10px;">Ваша ссылка-приглашение:<br><a id="invite" style="font-size:0.8em;font-weight:500;" href="';
		contentWinEnter +=
			'https://findtime.online?action=invite&loginUser=' + globalLogin;
		contentWinEnter += '">';
		contentWinEnter +=
			'https://findtime.online?action=invite&loginUser=' + globalLogin;
		contentWinEnter += '</a>';

		//		alert(globalAccess)
		if (Number(globalAccess) != 0) {
			document.getElementById('flexRadioDefault2').disabled = false;
			document.getElementById('importButtonBase').disabled = false;

			document.getElementById('logout').disabled = false;
			document.querySelector('#buttonEnter').disabled = true;
		} else {
			document.getElementById('flexRadioDefault2').disabled = true;
			document.getElementById('importButtonBase').disabled = true;

			document.getElementById('logout').disabled = true;
			document.querySelector('#buttonEnter').disabled = false;
			modalBody.innerHTML = modalBodyInputs;
		}
	} else {
		//ДОСТУП НОРМАЛЬНЫЙ
		modalBody.style.display = 'none';
		areaAnswer.innerHTML = '';

		contentWinEnter += '<p>Добрый день <b>' + objectPHP['login'] + '!</b></p>';
		contentWinEnter += '<p><b>' + objectPHP['txtMsg'] + '!</b><br><br>';
		contentWinEnter +=
			'<div style="width:95%;text-align:left;padding-left:10px;">Доступ в систему: <b style="color:#48c2a0;">ВЫПОЛНЕН!</b></div>';
		contentWinEnter +=
			'<div style="width:95%;text-align:left;padding-left:10px;">Дата окончание доступа: <b  style="color:#48c2a0;">' +
			objectPHP['expiredDate'] +
			'</b></div>';
		document
			.getElementById('btnModalEnterIcon')
			.classList.replace('bi-box-arrow-in-right', 'bi-person-check');
		document.getElementById('btnModalEnterIcon').style.color = '#48c2a9';

		document.querySelector('#buttonEnter').disabled = true;
		document.getElementById('logout').disabled = false;

		globalLogin = objectPHP['login'];

		contentWinEnter +=
			'<div style="width:95%; text-align:left;margin-left:10px;">Ваша ссылка-приглашение:<br><a id="invite" style="font-size:0.9em;font-weight:500;" href="';
		contentWinEnter +=
			'https://findtime.online?action=invite&loginUser=' + globalLogin;
		contentWinEnter += '">';
		contentWinEnter +=
			'https://findtime.online?action=invite&loginUser=' + globalLogin;
		contentWinEnter += '</a>';

		//                contentWinEnter += '<span id="clipboardPlus2" style="font-size: 1.7em; margin: 2px 15px 0 3px; color: #1AB395; cursor: pointer; padding-top: 12px; vertical-align: -3px;" title="Скопировать в память"><i class="bi bi-clipboard-plus-fill"></i></span></div>';

		//        document.getElementById("clipboardPlus2").addEventListener('click', (e) => {
		//            let data4Clippoard = document.getElementById("invite").href
		//            alert(data4Clippoard);
		//            if (data4Clippoard) {
		//                navigator.clipboard.writeText(data4Clippoard)
		//                    .then(() => {
		//                        notifyer('Код скопирован! Можете переслать его другому пользователю.', '500')
		//                    })
		//                    .catch(err => {
		//                        alert('Something went wrong', err);
		//                    });
		//            } else {
		//
		//                alert('Something went wrong', err);
		//            }
		//        });
		//
	}
	sessionStorage.setItem('modalBody', contentWinEnter);
	return contentWinEnter;
}

//=============================================================
//	Тестирование передачи данных из локального хранилища
//	аякс запросом на сервер и сохрание в файл в формате JSON POST
//=============================================================
let importButtonBase = document.getElementById('importButtonBase');

importButtonBase.addEventListener('click', () => {
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

		params.set('login', globalLogin);
		params.set('item', item);
		params.set('data', localData);

		fetch('https://findtime.online/php/saveData.php', {
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
});

function loadFiles(globalLogin, item) {
	let dataItem =
		'https://findtime.online/php/' +
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

let import2 = document.getElementById('testPHP');
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

//document.getElementById("testConfirmer").addEventListener("click", confirmer.bind("тело", "заголовок"));

function radioSelect() {
	if (remoteBase.checked) typeBase = 'remote';
	else typeBase = 'local';

	localStorage.setItem('typeBase', typeBase);

	sessionStorage.setItem('typeBase', typeBase);
	sessionStorage.setItem('globalLogin', globalLogin);
	sessionStorage.setItem('globalAccess', globalAccess);

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

import2.addEventListener('click', () => {
	alert(
		'Глобальный логин: ' + globalLogin + ' Доступ в систему: ' + globalAccess
	);

	if (!globalAccess) {
		remoteBase.disabled = true;
	} else {
		remoteBase.disabled = false;
	}
});

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

			fetch('https://findtime.online/php/sendCode.php', {
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

//clipBoard operation 1

document.getElementById('clipboardPlus1').addEventListener('click', (e) => {
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
