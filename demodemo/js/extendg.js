import { Translate } from './translator.js';
import { notifyer } from './main.js';
import { alerter } from './main.js';
//import {
//    confirmer
//} from "./main.js";

//
//alerter('<Text name="alertHead">Предупреждение</Text>', '<Text name="txtUnderConstraction">Руководство по работе с системой еще в разработке.</Text>', 'standart', 'info', 'slim')

document
	.getElementById('btnSaveTableScheduleHelp')
	.addEventListener('click', () => {
		alerter(
			'<Text trans="text+:GuideInfo;">Информация</Text>',
			'<Text trans="text+:GuideInfoBody1;"> Сохраняет текущее расписание в памяти устройства.</Text>',
			'standart',
			'info',
			'standart'
		);
	});

document
	.getElementById('btnLoadTableScheduleHelp')
	.addEventListener('click', () => {
		alerter(
			'<Text trans="text+:GuideInfo;">Информация</Text>',
			'<Text trans="text+:GuideInfoBody2;">Загружает расписание из памяти устройства. Если в настройках установлена опция "Показывать загруженное расписание при открытии", то при открытии сразу будет показана сохранённая информация.</Text>',
			'standart',
			'info',
			'standart'
		);
	});

//document.getElementById("helpFull").addEventListener('click', () => {
//    alerter("Информация", '<p style="text-align:justify;text-indent:25px;margin-bottom:10px;">help</p><img src="img/full.jpg" width="55%"  border=1 >', 'standart', 'warning', 'slim')
//});
document.getElementById('helpFull').addEventListener('click', () => {
	alerter(
		'<Text trans="text+:GuideInfo;">Информация</Text>',
		'<Text trans="text+:GuideInfoBody3">Открывает расписание на весь экран. С него также можно посмотреть совпадения по времени, загрузить и выгрузить из памяти, удалить и добавить информацию по времени. Данное представление можно выбрать в настройках для показа при открытии системы.</Text>',
		'standart',
		'info',
		'standart'
	);
});

document.getElementById('erase-button1').addEventListener('click', () => {
	alerter(
		'<Text trans="text+:GuideInfo;">Информация</Text>',
		'<Text trans="text+:GuideInfoBody4;">Очищает таблицу расписания и снимает все отмеченные флаги в разделах "Свободное время" и "Занятое время"</Text>',
		'standart',
		'info',
		'standart'
	);
});

document.getElementById('create').addEventListener('click', () => {
	alerter(
		'<Text trans="text+:GuideInfo">Информация</Text>',
		'<Text trans="text+:GuideInfoBody5;">Открывает окно в котором можно добавить данные в разделы "Свободное время" или "Занятое время"</Text>',
		'standart',
		'info',
		'standart'
	);
});

document.querySelector('.filtr').addEventListener('click', () => {
	alerter(
		'<Text trans="text+:GuideInfo;">Информация</Text>',
		'<Text trans="text+:GuideInfoBody6;">Во вкладке "Свободное время" открывает окно в котором можно установить фильтр по уровням данных.</Text>',
		'standart',
		'info',
		'standart'
	);
});

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
//let numTab = Number(localStorage.getItem("numTab"));
let numTab = 0;
let numTabSelect = document.getElementById('numTab');

numTabSelect.value = 0;

numTabSelect.addEventListener('change', () => {
	localStorage.setItem('numTab', document.getElementById('numTab').value);
});

let numTabObj = document.getElementById('numTab');
document.getElementById('numTab').value = numTab;
numTabObj.addEventListener('change', () => {
	numTab = document.getElementById('numTab').value;
	//    let tabEl = document.querySelectorAll('.nav-link')
	//    let tab = new bootstrap.Tab(tabEl[numTab])
	//    tab.show()
	if (document.getElementById('checkSaveNumTab').checked) {
		localStorage.setItem('numTab', numTab);
	}
});
//let tabEl = document.querySelectorAll('.nav-link')
//let tab = new bootstrap.Tab(tabEl[numTab])
//tab.show();
//Translate();

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

let import2 = document.getElementById('testPHP');
let remoteBase = document.getElementById('flexRadioDefault2');
let localBase = document.getElementById('flexRadioDefault1');

//remoteBase.addEventListener('change', () => {
//    alerter("Смена типа хранилища", "Тип базы данных можно сменить на странице системы после успешного входа.")
//})
//
//localBase.addEventListener('change', () => {
//    alerter("Смена типа хранилища", "Тип базы данных можно сменить на странице системы после успешного входа.")
//});

import2.addEventListener('click', () => {
	alert(
		'Глобальный логин: ' + globalLogin + ' Доступ в систему: ' + globalAccess
	);
});

document.getElementById('Trans').addEventListener('change', () => {
	let Language = document.getElementById('Trans').value; // Ищем нынешнее значение языка
	localStorage.setItem('LanguageLocal', Language); // Сохранение в локальное хранилище
	//    alert("сменили язык");
	Translate();

	if (Language == 'ru' && Number(window.innerWidth) < 400) {
		//		document.getElementById('create').append(document.createTextNode="");
	} else if (Language == 'fr' && Number(window.innerWidth) < 400) {
		//		document.getElementById('create').style.marginLeft="1.2em";
		//
	} else {
	}
});
