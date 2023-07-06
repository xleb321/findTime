import Translator from "../api/lang.json" assert { type: "json" };

export let Translate = () => {
	let Language;
	let type = ["text", "select", "button", "input"]; // типы данных со значениями
	try {
		if (localStorage.getItem("LanguageLocal")) {
			Language = localStorage.getItem("LanguageLocal");
		} else {
			Language = document.getElementById("Trans").value;
		} // Ищем нынешнее значение языка

		for (let x = 0; x < type.length; x++) {
			// Пробегаем по всему типажу доступному из массива выше
			for (let i = 0; i < document.querySelectorAll(`${type[x]}`).length; i++) {
				// Пробегается по всем объектам с тегом Z
				// console.clear();
				// console.log("Последний изменяемый элемент",document.querySelectorAll(`${type[x]}`)[i]);
				if (
					document.querySelectorAll(`${type[x]}`)[i].hasAttribute("name") &&
					document.querySelectorAll(`${type[x]}`)[i].attributes.name.value !=
						"disable" &&
					document.querySelectorAll(`${type[x]}`)[i].attributes.name.value !=
						"exampleRadios" &&
					document
						.querySelectorAll(`${type[x]}`)
						[i].attributes.name.value.replace(/ /g, "") != ""
				) {
					// Проверка , есть ли data-set и значение в нём во избежание ошибок или не отключено изменение
					let DataSet = document.querySelectorAll(`${type[x]}`)[i].attributes
						.name.value; // Ищет data-name для переводчика
					if (type[x] == "text") {
						// Если текст - <z> ... </z>
						document.querySelectorAll(`${type[x]}`)[
							i
						].innerHTML = `${Translator.Text[DataSet][Language]}`; // Подставляет по data-name и языку новое значение
					} else if (type[x] == "input") {
						if (
							document.querySelectorAll(`${type[x]}`)[i].attributes.type
								.value == "radio"
						) {
						} else if (
							document.querySelectorAll(`${type[x]}`)[i].placeholder != ``
						) {
							// placholder
							document.querySelectorAll(`${type[x]}`)[
								i
							].placeholder = `${Translator.InputePlacholder[DataSet][Language]}`; // меняем значени placholder'a
						} else if (document.querySelectorAll(`${type[x]}`)[i].value != ``) {
							document.querySelectorAll(`${type[x]}`)[
								i
							].value = `${Translator.InputeValue[DataSet][Language]}`; // Меняем значение value
						}
					} else if (type[x] == "select") {
						// Если select - option
						for (
							let y = 0;
							y < document.querySelectorAll(`${type[x]}`)[i].children.length;
							y++
						) {
							// Пробегает по каждому option в select
							if (
								document.querySelectorAll(`${type[x]}`)[i].children[y]
									.attributes.name.value === "disable"
							)
								continue;
							document.querySelectorAll(`${type[x]}`)[i].children[
								y
							].innerHTML = `${
								Translator.OptionSelect[
									document.querySelectorAll(`${type[x]}`)[i].children[y]
										.attributes.name.value
								][Language]
							}`;
						}
					} else if (type[x] == "button") {
						if (
							document.querySelectorAll(`${type[x]}`)[i].hasChildNodes("text")
						) {
							// Проверка на наличие ребёнка только с текстом
							for (
								let y = 0;
								y <
								document.querySelectorAll(`${type[x]}`)[i].childNodes.length;
								y++
							) {
								// Пробегаемся по дочерним элементам
								if (
									document.querySelectorAll(`${type[x]}`)[i].childNodes[y]
										.nodeName == "#text" &&
									document
										.querySelectorAll(`${type[x]}`)
										[i].childNodes[y].nodeValue.replace(/ /g, "") != ""
								) {
									// находим элементы с текстом , но пустые в виде ' ' пропускаем
									document.querySelectorAll(`${type[x]}`)[i].childNodes[
										y
									].textContent = `${Translator.TextInButton[DataSet][Language]}`; // Меняем текст контент
								}
							}
						}
					} else if (type[x] == "value") {
						if (document.querySelectorAll(`${type[x]}`)[i].attributes) {
						}
						console.log(document.querySelectorAll(`${type[x]}`)[i]);
					}
				}
			}
		}
	} catch (e) {
		console.log(e.message);
	}
};


