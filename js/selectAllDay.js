let dayWeek = document.getElementsByClassName("allday");
let allColor = "transparent";
for (let i = 0; i < dayWeek.length; i++) {
	dayWeek[i].addEventListener("change", () => allDaySelect(dayWeek[i]));
}

function allDaySelect(this) {
	console.log(this)
	let curDayWeek = this.name;
	if (this.checked) allColor = "green";
	else allColor = "transparent";
	let allDay = document
		.querySelector(".modal-content")
		.getElementsByClassName(curDayWeek); //колонка
	for (let i = 0; i < allDay.length; i++) {
		allDay[i].style.background = allColor;
	}

	// showCode();
}
