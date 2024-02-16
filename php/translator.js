import Translator from '../api/lang.json' assert { type: 'json' };

export function Translate() {
	let language;

	if (localStorage.getItem('LanguageLocal')) {
		language = localStorage.getItem('LanguageLocal');
	} else {
		language = document.getElementById('Trans').value;
	} // Ищем нынешнее значение языка

	document.querySelectorAll('[trans]').forEach((elem) => {
		// разбивает всю строку на массив, где:
		// 1 элемент - что меняет
		// 2 элемент - на что из JSON

		let masWord = elem.attributes.trans.value
			.replace(/[:;/'"|`=()]/g, ' ')
			.split(' ')
			.filter((n) => n);

		// Если чего-то не хватает, выводим ошибку
		if (masWord.length % 2 != 0) {
			console.error('Условия неверные', [masWord, elem]);
			return;
		}

		// обработка попарно
		for (let i = 0; i <= masWord.length / 2; i += 2) {
			try {
				// Меняем по данным условиям
				// Если не Text, то как атрибут
				if (masWord[i] == 'text+') {
					elem.innerHTML = Translator[masWord[i + 1]][language];
				} else if (masWord[i] == 'text') {
					elem.textContent = Translator[masWord[i + 1]][language];
				} else if (masWord[i] == 'class') {
					elem.classList = Translator[masWord[i + 1]][language];
				} else {
					elem[masWord[i]] = Translator[masWord[i + 1]][language];
				}
			} catch {
				// Неужача => выводится ошибка
//				временно закомментирована до отлади загрузки с сети
//				console.log(
		//					'Ошибка в переводчеке',
		//					'\n',
		//					[elem],
		//					masWord[i + 1],
		//					language
		//				);
			}
		}
	});
}

Translate();

document.querySelector('#Trans').addEventListener('change', (e) => {
	let Language = e.target.value; // Ищем нынешнее значение языка
	localStorage.setItem('LanguageLocal', Language); // Сохранение в локальное хранилище
	Translate();
});
