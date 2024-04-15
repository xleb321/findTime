import {
    Translate
} from "./translator.js";

const body = document.querySelector("body");
const nbts = document.querySelector(".nbts");
const nbtc = document.querySelector(".nbtc");
const nbtct = document.querySelector(".nbtct");
const nbtcl = document.querySelector(".nbtcl");
const creatingButton = document.getElementById("create");
//const creatingButton = document.getElementById("create");
const showingCodeButton = document.getElementById("showingCodeButton");
// const userSelect = document.getElementById("userSelector");
const selectCourse = document.getElementById("courseSelector");
const selectLevel = document.getElementById("levelSelector");
const fullName = document.getElementById("YourName");
const nobodyIsSelected = document.getElementById("nobody");
const nocourseIsSelected = document.getElementById("nocourse");
const nolevelIsSelected = document.getElementById("nolevel");
// const autoLoadElement = document.getElementById("autoLoad");
const studentTableDiv = document.getElementById("nav-profile");
const businessTableDiv = document.getElementById("nav-contact");
const timeSelector = document.getElementById("timeSelect");
const timeSelectorSpan = document.getElementById("timeSelectSpan");
const selectCourseSpan = document.getElementById("courseSelectorSpan");
const selectLevelSpan = document.getElementById("levelSelectorSpan");
// const gradeTextArea = document.getElementById("gradeTextArea");
// const courseTextArea = document.getElementById("courseTextArea");
const gradeSubmittingButton = document.getElementById("gradeNameSubmit");
const courseSubmittingButton = document.getElementById("courseNameSubmit");
const scheduleLoadingCheckBox = document.getElementById("scheduleLoaded");

const scheduleAutoSavingCheckBox = document.getElementById("scheduleAutoSaved");
const importInput = document.getElementById("importInput");
const importButton = document.getElementById("importButton");
let loading = JSON.parse(localStorage.getItem("schedule-loading")) || false;
let autoSaving =
    JSON.parse(localStorage.getItem("schedule-auto-saving")) || false;
let dayWeek = document.getElementsByClassName("allday");
let allColor = "transparent";
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
let filteredCourses = [];
let filteredGrades = [];
let filteredUsers = [];
let gradeText;
let courseText;

const colorStudent = [
	"PaleGreen",
	"MediumAquamarine",
	"DarkSeaGreen",
	"LightCyan",
	"PaleTurquoise",
	"Beige",
	"PowderBlue",
	"LightBlue",
	"LightSkyBlue",
	"Thistle",
	"LightYellow",
	"PapayaWhip",
	"PeachPuff",
	"MistyRose",
	"Wheat",
	"Lavender",
	"LightPink",
	"LemonChiffon",
]; // Oleg
let cndCoincid = 0; // Oleg
let numberStudent = 0; // Oleg

function allDaySelect(thisy) {
    let curDayWeek = thisy.getAttribute("lock");
    if (thisy.checked) allColor = "seagreen";
    else allColor = "transparent";
    let allDay = document
        .querySelector(".modal-content")
        .getElementsByClassName(curDayWeek); //колонка
    for (let i = 0; i < allDay.length; i++) {
        allDay[i].style.background = allColor;
    }
}

function checkDec() {
    let binDay = [];
    let decDay = [];

    for (let i = 0; i < 7; i++) {
        let curObjDay = ".day" + String(i);
        let curDay = document
            .querySelector(".modal-content")
            .querySelectorAll(curObjDay);
        binDay[i] = "1";
        decDay[i] = 0;
        curDay.forEach(dv => {
            if (dv.style.background !== "transparent") binDay[i] += "1";
            else binDay[i] += "0";
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
    fullName.value = "";

    cndCoincid = 0; // Oleg
    numberStudent = 0; // Oleg
    try {
        for (let i = 0; i < 7; i++) {
            let curObjDay = ".day" + String(i);
            let cur = document.querySelectorAll(".tableSchedule");
            cur.forEach(kkk => {
                let curDay = kkk.querySelectorAll(curObjDay);

                curDay.forEach(item => {
                    item.style.background = "transparent";

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
        let curObjDay = ".day" + String(i);
        let curDay = document
            .querySelector(".modal-content")
            .querySelectorAll(curObjDay);

        curDay.forEach(item => (item.style.background = "transparent"));
    }

    importInput.value = "";

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
            let curObjDay = ".day" + String(i);
            let cur = document.querySelectorAll(".tableSchedule");
            cur.forEach(kkk => {
                let curDay = kkk.querySelectorAll(curObjDay);

                for (let j = 0; j < curDay.length; j++) {
                    if (binArray[i][j + 1] === "1") {
                        curDay[j].classList.add(currentUser.name.replace(/ /g, "%"));
                        if (curDay[j].style.background === "transparent") {
                            curDay[j].style.background = curColorStudent; // Oleg
                        } else if (curDay[j].style.background === "skyblue") {
                            curDay[j].style.background = "IndianRed";
                        } else {
                            curDay[j].style.background = "GreenYellow";
                            curDay[j].style.fontSize = "12px";
                            curDay[j].style.fontWeight = "500";

                            if (curDay[j].children.length === 0) {
                                let matching = document.createElement("p");
                                matching.innerHTML = 2;
                                curDay[j].appendChild(matching);
                                curDay[j].addEventListener("click", () => {
                                    let temp = [];
                                    curDay[j].classList.forEach(item =>
//                                      temp.push(item.replace("%", " "))   
                                        temp.push(item.replace(/%/g, " "))
                                                                
                                    );

                                    alerter(
                                        "<Text trans='text+:MatchTime;'>Is a match in time</Text>",
                                        `<Text trans='text+:MatchTimeText;'>Names of those who matched at this time:<br><b></Text> ${temp
											.slice(1)
											.join(", ")}</b>`
                                    );
                                });
                            } else {
                                curDay[j].firstChild.innerHTML = +curDay[j].firstChild.textContent + 1;
                            }

                            const curMatch = [
								+curDay[j].firstChild.textContent,
								curDay[j].parentNode.id,
								curDay[j].classList[0],
							];

                            if (allMatches.length > 0) {
                                const index = allMatches.findIndex(
                                    item => item[1] === curMatch[1] && item[2] === curMatch[2]
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
            let curObjDay = ".day" + String(i);
            let cur = document.querySelectorAll(".tableSchedule");
            cur.forEach(kkk => {
                let curDay = kkk.querySelectorAll(curObjDay);

                for (let j = 0; j < curDay.length; j++) {
                    if (binArray[i][j + 1] === "1") {
                        if (curDay[j].style.background === "transparent") {
                            curDay[j].style.background = "Skyblue";
                        } else {
                            curDay[j].style.background = "Indianred";
                        }
                    }
                }
            });
        }
    }
}

function clearTable() {
    for (let i = 0; i < 7; i++) {
        let curObjDay = ".day" + String(i);
        let cur = document.querySelectorAll(".tableSchedule");
        cur.forEach(kkk => {
            let curDay = kkk.querySelectorAll(curObjDay);

            curDay.forEach(item => {
                item.style.background = "transparent";

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

    const section = document.getElementById("section");
    if (
        section &&
        section.querySelector(".user-table") &&
        section.querySelector(".user-table").querySelector("tbody")
    ) {
        const tbody = section.querySelector(".user-table").querySelector("tbody");
        const userChildren = tbody.children;

        for (let i = 0; i < userChildren.length; i++) {
            if (
                userChildren[i].firstElementChild.classList.contains(
                    "bi-check-square-fill"
                )
            ) {
                userChildren[i].firstElementChild.classList.remove(
                    "bi-check-square-fill"
                );
                userChildren[i].firstElementChild.classList.add("bi-square");
            }
        }
    }

    if (
        businessTableDiv &&
        businessTableDiv.querySelector("section") &&
        businessTableDiv.querySelector("section").lastElementChild &&
        businessTableDiv
        .querySelector("section")
        .lastElementChild.querySelector("tbody")
    ) {
        const busyChildren = businessTableDiv
            .querySelector("section")
            .lastElementChild.querySelector("tbody").children;

        for (let i = 0; i < busyChildren.length; i++) {
            if (
                busyChildren[i].firstElementChild.classList.contains(
                    "bi-check-square-fill"
                )
            ) {
                busyChildren[i].firstElementChild.classList.remove(
                    "bi-check-square-fill"
                );
                busyChildren[i].firstElementChild.classList.add("bi-square");
            }
        }
    }

    displayUsersAndBusiness();
}

function changeName() {
    if (currentUsers.length > 1) {
        clearTable();

        nobodyIsSelected.selected = true;
    }
}

function clickColor() {
    if (this.style.background !== "transparent") {
        this.style.background = "transparent";
    } else {
        this.style.background = "seagreen";
    }
}

function getCurrentCourse(event) {
    if (event.target.value !== "Nothing") {
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
    if (event.target.value !== "Nothing") {
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
        let curObjDay = ".day" + String(i);
        let curDay = document
            .querySelector(`.${type}-content`)
            .querySelectorAll(curObjDay);

        curDay.forEach(item => {
            if (ability) {
                item.addEventListener("click", clickColor);
            } else {
                item.removeEventListener("click", clickColor);
            }
        });
    }
}

function checkOut() {
    let dayWeek = document.getElementsByClassName("allday");
    for (let i = 0; i < dayWeek.length; i++) {
        dayWeek[i].checked = false;
    }
}

function loadStudentsTable() {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const filteredUsers =
        JSON.parse(localStorage.getItem("filteredUsers")) || users;

    let rightToolBar = document.createElement("span");

    rightToolBar.classList.add = "reverseToolBar";

    if (!document.getElementById("plus-button")) {
        const plusButton = document.createElement("button");
        plusButton.setAttribute("name", "PlusButton");
        plusButton.innerHTML = "";
        plusButton.style.boxSizing = "border-box";
        plusButton.style.padding = "5px 3px 3px 3px";
        plusButton.style.borderRadius = "2px";
        plusButton.style.fontWeight = "300";
        plusButton.style.borderWidth = "0px";
        plusButton.id = "plus-button";
        let plusButtonIcon = document.createElement("i");
        plusButtonIcon.setAttribute("class", "bi bi-plus");
        plusButtonIcon.style.color = "tean";
        plusButtonIcon.style.fontSize = "1.1em";
        plusButtonIcon.style.fontWeight = "bold";
        plusButton.appendChild(plusButtonIcon);
        plusButton.setAttribute("data-bs-toggle", "modal");
        plusButton.setAttribute("data-bs-target", "#staticBackdrop");
        rightToolBar.append(plusButton);
        studentTableDiv.appendChild(rightToolBar);

        document.getElementById("plus-button").addEventListener("click", () => {
            timeSelectorSpan.style.display = "block";
        });
    }
    timeSelectorSpan.style.display = "block";

    if (!document.getElementById("filter-button")) {
        const filterButton = document.createElement("button");
        filterButton.setAttribute("trans", "text:FilterButton;");
        filterButton.innerHTML = "";
        filterButton.style.padding = "5px 3px 3px 3px";
        filterButton.style.backgroundColor = "cornflowerblue";
        filterButton.style.borderRadius = "2px";
        filterButton.style.color = "white";
        filterButton.style.fontWeight = "100";
        filterButton.style.borderWidth = "0px";
        filterButton.id = "filter-button";
        let filterButtonIcon = document.createElement("i");
        filterButtonIcon.setAttribute("class", "bi bi-funnel-fill mx-1");
        filterButtonIcon.style.fontSize = "1.1em";
        filterButton.appendChild(filterButtonIcon);
        rightToolBar.append(filterButton);
        //alert("Filter-"+String(document.getElementById("numTab").value))
        filterButton.onclick = () => createModal();
    }

    //	document.getElementById("erase-button").style.display = "block"
    document.getElementById("filter-button").style.display = "block";

    if (
        (users.length === 0 &&
            filteredGrades.length === 0 &&
            filteredCourses.length === 0) ||
        filteredUsers.length === 0
    ) {
        // console.log("Привет");
        if (studentTableDiv.querySelector("section")) {
            studentTableDiv.removeChild(studentTableDiv.querySelector("section"));
        }

        if (document.getElementById("sorting-span")) {
            studentTableDiv.removeChild(document.getElementById("sorting-span"));
        }

        if (document.getElementById("LOMATEL")) {
            // console.log("IT's here");
            studentTableDiv.removeChild(document.getElementById("LOMATEL"));
        }

        const div = document.createElement("div");
        const h6 = document.createElement("h6");
        const text = document.createElement("Text");
        text.innerHTML = "Unfortunately, the list of users' free time is empty";
        text.setAttribute("trans", "text+:EmptinessOfUsersList;");
        text.id = "EmptinessOfUsersList";
        h6.appendChild(text);
        h6.style.margin = "5px";
        h6.style.width = "80%";
        h6.style.fontSize = "0.8em";
        h6.style.textAlign = "justify";

        rightToolBar.append(h6);
        rightToolBar.style.paddingBottom = "10px";
        //		div.appendChild(h6);

        div.id = "LOMATEL";

        studentTableDiv.appendChild(div);
        studentTableDiv.appendChild(rightToolBar);

        Translate();

        return;
    }

    if (document.getElementById("LOMATEL")) {
        console.log("IT's here");
        studentTableDiv.removeChild(document.getElementById("LOMATEL"));
        document.getElementById("EmptinessOfUsersList").remove();
    }

    if (!document.getElementById("section")) {
        const span = document.createElement("span");
        //		span.style.backgroundColor = "red";
        const div = document.createElement("div");
        const label = document.createElement("label");
        const text = document.createElement("text");

        text.setAttribute("trans", "text+:SortingLabel;");
        text.innerHTML = "Sort by ";

        text.style.fontSize = "0.75em";
        text.style.fontWeight = "500";
        text.style.margin = "5px;";

        label.appendChild(text);
        label.style.padding = "0 5px 0 0";
        const select = document.createElement("select");
        const nameAscendingOption = document.createElement("option");
        const nameDescendingOption = document.createElement("option");
        const numAscendingOption = document.createElement("option");
        const numDescendingOption = document.createElement("option");
        const courseAscendingOption = document.createElement("option");
        const courseDescendingOption = document.createElement("option");
        const gradeAscendingOption = document.createElement("option");
        const gradeDescendingOption = document.createElement("option");

        select.style.fontSize = "0.75em";
        select.style.fontWeight = "500";

        nameAscendingOption.value = "nameAscending";
        nameAscendingOption.setAttribute("trans", "text+:NameAscending;");
        nameAscendingOption.innerHTML = "&#8595; name asc";
        nameDescendingOption.value = "nameDescending";
        nameDescendingOption.setAttribute("trans", "text+:NameDescending;");
        nameDescendingOption.innerHTML = "&#8593; name desc";
        numAscendingOption.value = "numAscending";
        numAscendingOption.innerHTML = "&#8595; num asc";
        numAscendingOption.setAttribute("trans", "text+:NumAscending;");
        numDescendingOption.value = "numDescending";
        numDescendingOption.innerHTML = "&#8593; num desc";
        numDescendingOption.setAttribute("trans", "text+:NumDescending;");
        courseAscendingOption.value = "courseAscending";
        courseAscendingOption.innerHTML = "&#8595; course asc";
        courseAscendingOption.setAttribute("trans", "text+:CourseAscending;");
        courseDescendingOption.value = "courseDescending";
        courseDescendingOption.innerHTML = "&#8593; course desc";
        courseDescendingOption.setAttribute("trans", "text+:CourseDescending;");
        gradeAscendingOption.value = "gradeAscending";
        gradeAscendingOption.innerHTML = "&#8595; grade asc";
        gradeAscendingOption.setAttribute("trans", "text+:GradeAscending;");
        gradeDescendingOption.value = "gradeDescending";
        gradeDescendingOption.innerHTML = "&#8593; grade desc";
        gradeDescendingOption.setAttribute("trans", "text+:GradeDescending;");

        select.appendChild(numAscendingOption);
        select.appendChild(numDescendingOption);
        select.appendChild(nameAscendingOption);
        select.appendChild(nameDescendingOption);
        select.appendChild(courseAscendingOption);
        select.appendChild(courseDescendingOption);
        select.appendChild(gradeAscendingOption);
        select.appendChild(gradeDescendingOption);

        select.id = "userSorting";
        select.onchange = () => sortUsers();

        numAscendingOption.selected = true;

        span.id = "sorting-span";

        div.appendChild(label);
        div.appendChild(select);
        span.appendChild(div);

        const section = document.createElement("section");
        const firstTable = document.createElement("table");
        const firstTHead = document.createElement("thead");
        const firstTr = document.createElement("tr");
        const tableFirstTd = document.createElement("td");
        const tableSecondTd = document.createElement("td");
        const tableThirdTd = document.createElement("td");
        const tableSixthTd = document.createElement("td");
        const tableSeventhTd = document.createElement("td");

        const bottomSpace = document.createElement("div");
        bottomSpace.style.height = "45px";
        bottomSpace.style.backgroundColor = "orange";

        const classesForSection = "s3 position-relative m-0 p-0 w-100";
        const classesForTable = "table table-bordered m-0 w-100";

        const textElement = document.createElement("Text");

        section.style.position = "relative";
        section.classList = classesForSection;
        firstTable.classList = classesForTable;
        firstTable.style.backgroundColor = "gray";
        firstTable.appendChild(firstTHead);
        firstTHead.appendChild(firstTr);

        const tableFirstTdIcon = document.createElement("i");
        tableFirstTdIcon.setAttribute("class", "text-light bi bi-square-fill");
        tableFirstTdIcon.setAttribute("id", "allCheckFree");
        tableFirstTd.appendChild(tableFirstTdIcon);
        //		tableFirstTd.textContent = "A";

        tableFirstTd.style.width = "10%";
        tableSecondTd.textContent = "№";
        tableSecondTd.style.width = "7%";
        textElement.textContent = ` Name [Course] [Grade]`;
        textElement.setAttribute("trans", "text+:NameGradeCourse;");
        tableThirdTd.appendChild(textElement);
        tableThirdTd.style.width = "61%";

        const tableSixthTdIcon = document.createElement("i");
        tableSixthTdIcon.setAttribute("class", "bi bi-pencil-square");
        tableSixthTd.appendChild(tableSixthTdIcon);
        //		tableSixthTd.textContent = "M";

        tableSixthTd.style.width = "10%";

        const tableSeventhTdIcon = document.createElement("i");
        tableSeventhTdIcon.setAttribute("class", "bi bi-x-square");
        tableSeventhTd.appendChild(tableSeventhTdIcon);
        //		tableSeventhTd.textContent = "D";

        tableSeventhTd.style.width = "12%";
        firstTr.appendChild(tableFirstTd);
        firstTr.appendChild(tableSecondTd);
        firstTr.appendChild(tableThirdTd);
        firstTr.appendChild(tableSixthTd);
        firstTr.appendChild(tableSeventhTd);
        studentTableDiv.appendChild(span);
        studentTableDiv.appendChild(section);
        section.appendChild(firstTable);

        section.id = "section";
        section.appendChild(bottomSpace);

        Translate();
    }

    try {
        const section = document.getElementById("section");
        if (
            section &&
            section.children &&
            section.children.length &&
            section.children.length === 2
        ) {
            section.removeChild(section.lastChild);
        }

        const table = document.createElement("table");
        const tbody = document.createElement("tbody");

        section.appendChild(table);
        table.appendChild(tbody);
        for (let i = 0; i < sortedFilteredUsers.length; i++) {
            const tr = document.createElement("tr");
            const tableFirstTd = document.createElement("td");
            let item = sortedUsers.find(c => c.id === sortedFilteredUsers[i].id);

            // console.log(sortedUsers);
            // console.log(sortedFilteredUsers);
            // console.log(item);

            tr.id = `${item.id}`;

            const tableFirstTdIcon = document.createElement("i");
            tableFirstTd.append(tableFirstTdIcon);
            tableFirstTd.classList = "bi bi-square text-primary hovered checkFreeBtn";

            tableFirstTd.addEventListener("click", () => {
                tableFirstTd.classList.toggle("bi-square");
                tableFirstTd.classList.toggle("bi-check-square-fill");
            });
            tableFirstTd.id = `${item.id}_1`;

            tableFirstTd.removeEventListener("click", displayUsersAndBusiness);
            tableFirstTd.addEventListener("click", displayUsersAndBusiness);

            const tableSecondTd = document.createElement("td");

            const tableThirdTd = document.createElement("td");
            tableThirdTd.style.textAlign = "left";

            const tableSixthTd = document.createElement("td");

            const tableSixthTdIcon = document.createElement("i");

            tableSixthTd.append(tableSixthTdIcon);
            tableSixthTd.classList = "bi bi-calendar3 hovered";

            tableSixthTd.addEventListener("click", () => {
                showUpdatingModal("freeTime");
                displayOneUserModal(item);
            });

            const tableSeventhTd = document.createElement("td");
            const tableSeventhTdIcon = document.createElement("i");
            tableSeventhTd.append(tableSeventhTdIcon);
            tableSeventhTd.classList = "bi bi-trash text-danger hovered";

            tableSeventhTd.addEventListener("click", () => {
                if (
                    window.confirm("Are you sure that you are going to delete this user?")
                ) {
                    deleteUser(item);
                    Translate();
                }
            });

            const classes =
                "user-table table table-bordered table text-dark table-striped";

            table.classList = classes;

            tableFirstTd.textContent = ``;
            tableFirstTd.style.width = "10%";
            tableSecondTd.textContent = `${
				users.findIndex(user => user.id === item.id) + 1
			}`;
            tableSecondTd.style.width = "7%";
            //		tableThirdTd.textContent = ` ${item.name} [${item.currentLevel}] [${item.currentCourse.slice(0, 7)}]`;

            if (Number(window.innerWidth) < 400) {
                tableThirdTd.innerHTML = ` ${
					item.name
				} [<span style="color:RoyalBlue; font-weight:400;">${item.currentCourse.slice(
					0,
					8
				)}</span>] [<span style="color:#48c2a9; font-weight:500;">${
					item.currentLevel
				}</span>]`;
            } else {
                tableThirdTd.innerHTML = ` ${item.name} [<span style="color:RoyalBlue; font-weight:400;">${item.currentCourse}</span>] [<span style="color:#48c2a9; font-weight:500;">${item.currentLevel}</span>]`;
            }

            tableThirdTd.style.width = "61%";
            tableThirdTd.style.paddingLeft = "5px";
            tableSixthTd.textContent = ``;
            tableSixthTd.style.width = "10%";
            tableSeventhTd.textContent = ``;
            tableSeventhTd.style.width = "12%";
            tr.appendChild(tableFirstTd);
            tr.appendChild(tableSecondTd);
            tr.appendChild(tableThirdTd);
            tr.appendChild(tableSixthTd);
            tr.appendChild(tableSeventhTd);
            tbody.appendChild(tr);
        }
        //добавляем пустую строку к списку, чтобы видно было нижнюю строку из-за фиксированного футера
        //        let dop = document.createElement('p')
        //        dop.setAttribute("id", "dop")
        //        dop.innerHTML = " "
        //        dop.style.height = "16px";
        //        section.append(dop);
    } catch (e) {
        console.log(e);
    }

    gradeText = document.getElementById("gradeTextArea");
    courseText = document.getElementById("courseTextArea");
}

function sortUsers() {
    const select = document.getElementById("userSorting");
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
            grades.push([item.currentLevel, item.id])
        );

        let sortedNames = [...names].sort();
        let sortedCourses = [...courses].sort();
        let sortedGrades = [...grades].sort();

        let temp = [];

        switch (sorting) {
            case "numAscending":
                sortedUsers = [...users];
                break;
            case "numDescending":
                sortedUsers = [...users].reverse();
                break;
            case "nameAscending":
                for (let i = 0; i < sortedNames.length; i++) {
                    let user = [...users].find(
                        item =>
                        item.name === sortedNames[i][0] && item.id === sortedNames[i][1]
                    );
                    temp.push(user);
                }
                sortedUsers = temp;
                temp = [];
                break;
            case "nameDescending":
                // console.log(sortedNames);
                for (let i = sortedNames.length - 1; i >= 0; i--) {
                    let user = [...users].find(
                        item =>
                        item.name === sortedNames[i][0] && item.id === sortedNames[i][1]
                    );
                    // console.log(user);
                    temp.push(user);
                }
                sortedUsers = temp;
                temp = [];
                break;
            case "courseAscending":
                for (let i = 0; i < sortedNames.length; i++) {
                    let user = [...users].find(
                        item =>
                        item.currentCourse === sortedCourses[i][0] &&
                        item.id === sortedCourses[i][1]
                    );
                    // console.log(user);
                    temp.push(user);
                }
                // console.log(temp);
                sortedUsers = temp;
                temp = [];
                break;
            case "courseDescending":
                for (let i = sortedNames.length - 1; i >= 0; i--) {
                    let user = [...users].find(
                        item =>
                        item.currentCourse === sortedCourses[i][0] &&
                        item.id === sortedCourses[i][1]
                    );
                    temp.push(user);
                }
                sortedUsers = temp;
                temp = [];
                break;
            case "gradeAscending":
                for (let i = 0; i < sortedNames.length; i++) {
                    let user = [...users].find(
                        item =>
                        item.currentLevel === sortedGrades[i][0] &&
                        item.id === sortedGrades[i][1]
                    );
                    temp.push(user);
                }
                sortedUsers = temp;
                temp = [];
                break;
            case "gradeDescending":
                for (let i = sortedNames.length - 1; i >= 0; i--) {
                    let user = [...users].find(
                        item =>
                        item.currentLevel === sortedGrades[i][0] &&
                        item.id === sortedGrades[i][1]
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

    loadStudentsTable();
    clearTable();
}

function loadBusinessTable() {
    const business = JSON.parse(localStorage.getItem("business")) || [];

    if (business.length === 0) {
        if (businessTableDiv.querySelector("section")) {
            businessTableDiv.removeChild(businessTableDiv.lastChild);
        }

        if (businessTableDiv.querySelector("span")) {
            businessTableDiv.removeChild(businessTableDiv.lastChild);
        }

        const div = document.createElement("div");
        div.style.display = "flex";

        let spanLeft = document.createElement("span");
        spanLeft.style.width = "80%";

        let spanRight = document.createElement("span");
        spanRight.style.width = "15%";

        const h6 = document.createElement("h6");
        const text = document.createElement("Text");
        text.innerHTML =
            "Unfortunately, the list of busy time is empty. Add busy time.";
        text.setAttribute("trans", "text+:EmptinessOfBusinessList;");

        //        alert("no busytime1")


        h6.appendChild(text);
        h6.style.margin = "5px";
        h6.style.width = "80%";
        h6.style.fontSize = "0.8em";
        h6.style.textAlign = "justify";

        spanLeft.appendChild(h6);
        spanRight.style.textAlign = "right";

        let rightToolBarBusy = document.createElement("span");
        //		rightToolBarBusy.classList.add = "reverseToolBar";

        if (!document.getElementById("plus-button-busy")) {

            //            alert("no busytime2-",document.getElementById("plus-button-busy"))



            const plusButtonBusy = document.createElement("button");
            plusButtonBusy.setAttribute("name", "PlusButtonBusy");
            plusButtonBusy.innerHTML = "";
            plusButtonBusy.style.boxSizing = "border-box";
            plusButtonBusy.style.margin = "5px 3px";
            plusButtonBusy.style.borderRadius = "2px";
            plusButtonBusy.style.fontWeight = "300";
            plusButtonBusy.style.borderWidth = "0px";
            plusButtonBusy.style.width = "28px";
            plusButtonBusy.style.height = "28px";
            plusButtonBusy.style.backgroundColor = "#48c2a9";
            plusButtonBusy.id = "plus-button-busy";
            let plusButtonIconBusy = document.createElement("i");
            plusButtonIconBusy.setAttribute("class", "bi bi-plus");
            plusButtonIconBusy.style.color = "black";
            plusButtonIconBusy.style.fontSize = "1.0em";
            plusButtonIconBusy.style.fontWeight = "bold";
            plusButtonBusy.appendChild(plusButtonIconBusy);
            plusButtonBusy.setAttribute("data-bs-toggle", "modal");
            plusButtonBusy.setAttribute("data-bs-target", "#staticBackdrop");
            rightToolBarBusy.appendChild(plusButtonBusy);

            //            alert("button created!")

            plusButtonBusy.addEventListener("click", () => {
                timeSelectorSpan.style.display = "block";
            });
        }

        spanRight.appendChild(rightToolBarBusy);
        div.appendChild(spanLeft);
        div.appendChild(spanRight);
        businessTableDiv.appendChild(div);

        if (businessTableDiv.querySelector("#spanTop")) {
            businessTableDiv.querySelector("#spanTop").remove();
        }

        return;
    }

    if (businessTableDiv.querySelector("div")) {
        businessTableDiv.removeChild(businessTableDiv.lastChild);
    }

    if (businessTableDiv.children.length === 0) {
        let spanTop = document.createElement("span");
        spanTop.style.display = "flex";
        spanTop.style.height = "38px";
        spanTop.id = "spanTop";

        let spanLeft = document.createElement("span");
        spanLeft.style.width = "80%";

        let spanRight = document.createElement("span");
        spanRight.style.width = "20%";

        const span = document.createElement("span");

        const label = document.createElement("label");
        const text = document.createElement("Text");
        text.innerHTML = "Sort by ";

        text.style.fontSize = "0.75em";
        text.style.fontWeight = "500";

        text.setAttribute("trans", "text+:SortingLabel;");
        label.appendChild(text);
        label.style.padding = "2px 5px";
        const select = document.createElement("select");
        const nameAscendingOption = document.createElement("option");
        const nameDescendingOption = document.createElement("option");
        const numAscendingOption = document.createElement("option");
        const numDescendingOption = document.createElement("option");

        select.style.fontSize = "0.75em";
        select.style.fontWeight = "500";

        nameAscendingOption.value = "nameAscending";
        nameAscendingOption.innerHTML = "&#8595; description asc";
        nameAscendingOption.setAttribute("trans", "text+:DescAscending;");
        nameDescendingOption.value = "nameDescending";
        nameDescendingOption.innerHTML = "&#8593; description desc";
        nameDescendingOption.setAttribute("trans", "text+:DescDescending;");
        numAscendingOption.value = "numAscending";
        numAscendingOption.innerHTML = "&#8595; num asc";
        numAscendingOption.setAttribute("trans", "text+:NumAscending;");
        numDescendingOption.value = "numDescending";
        numDescendingOption.innerHTML = "&#8593; num desc";
        numDescendingOption.setAttribute("trans", "text+:NumDescending;");

        select.appendChild(numAscendingOption);
        select.appendChild(numDescendingOption);
        select.appendChild(nameAscendingOption);
        select.appendChild(nameDescendingOption);

        select.id = "businessSorting";
        select.onchange = () => sortBusiness();

        numAscendingOption.selected = true;

        span.appendChild(label);
        span.appendChild(select);

        spanLeft.appendChild(span);
        spanLeft.style.paddingTop = "4px";

        spanLeft.appendChild(label);
        spanLeft.appendChild(select);

        let rightToolBarBusy = document.createElement("span");

        if (!document.getElementById("plus-button-Busy1")) {
            const plusButtonBusy = document.createElement("button");
            plusButtonBusy.setAttribute("name", "PlusButtonBusy");
            plusButtonBusy.innerHTML = "";
            plusButtonBusy.style.boxSizing = "border-box";
            plusButtonBusy.style.margin = "5px 3px";
            plusButtonBusy.style.borderRadius = "2px";
            plusButtonBusy.style.fontWeight = "300";
            plusButtonBusy.style.borderWidth = "0px";
            plusButtonBusy.style.backgroundColor = "#48c2a9";
            plusButtonBusy.id = "plus-button-Busy1";
            let plusButtonIconBusy = document.createElement("i");
            plusButtonIconBusy.setAttribute("class", "bi bi-plus");
            plusButtonIconBusy.style.color = "black";
            plusButtonIconBusy.style.fontSize = "1.0em";
            plusButtonIconBusy.style.fontWeight = "bold";
            plusButtonBusy.appendChild(plusButtonIconBusy);
            plusButtonBusy.setAttribute("data-bs-toggle", "modal");
            plusButtonBusy.setAttribute("data-bs-target", "#staticBackdrop");
            rightToolBarBusy.appendChild(plusButtonBusy);

            plusButtonBusy.addEventListener("click", () => {
                timeSelectorSpan.style.display = "block";
            });
        }

        spanRight.appendChild(rightToolBarBusy);

        spanTop.appendChild(spanLeft);
        spanTop.appendChild(spanRight);
        //		spanLeft.style.backgroundColor = "red"
        //		spanRight.style.backgroundColor = "blue"
        spanRight.style.textAlign = "right";

        businessTableDiv.appendChild(spanTop);

        //		Таблица
        const section = document.createElement("section");
        const firstTable = document.createElement("table");
        const firstTHead = document.createElement("thead");
        const firstTr = document.createElement("tr");
        const tableFirstTd = document.createElement("td");
        const tableSecondTd = document.createElement("td");
        const tableThirdTd = document.createElement("td");
        const tableSixthTd = document.createElement("td");
        const tableSeventhTd = document.createElement("td");

        const textElement = document.createElement("Text");

        const classesForSection = "s3 position-relative m-0 p-0 w-100";
        const classesForTable = "table table-bordered m-0 w-100";
        section.classList = classesForSection;
        firstTable.classList = classesForTable;
        firstTable.style.backgroundColor = "gray";
        firstTable.appendChild(firstTHead);
        firstTHead.appendChild(firstTr);

        const tableFirstTdIcon = document.createElement("i");
        tableFirstTdIcon.setAttribute("class", "text-light bi bi-square-fill");
        tableFirstTdIcon.setAttribute("id", "allCheckBusy");
        tableFirstTd.appendChild(tableFirstTdIcon);

        //		tableFirstTd.textContent = "A";

        tableFirstTd.style.width = "10%";
        tableSecondTd.textContent = "№";
        tableSecondTd.style.width = "7%";
        textElement.textContent = "Description";
        textElement.setAttribute("trans", "text+:Description;");
        tableThirdTd.appendChild(textElement);
        tableThirdTd.style.width = "61%";

        const tableSixthTdIcon = document.createElement("i");
        tableSixthTdIcon.setAttribute("class", "bi bi-pencil-square");
        tableSixthTd.appendChild(tableSixthTdIcon);
        //		tableSixthTd.textContent = "M";

        tableSixthTd.style.width = "10%";

        const tableSeventhTdIcon = document.createElement("i");
        tableSeventhTdIcon.setAttribute("class", "bi bi-x-square");
        tableSeventhTd.appendChild(tableSeventhTdIcon);
        //		tableSeventhTd.textContent = "D";

        tableSeventhTd.style.width = "12%";
        firstTr.appendChild(tableFirstTd);
        firstTr.appendChild(tableSecondTd);
        firstTr.appendChild(tableThirdTd);
        firstTr.appendChild(tableSixthTd);
        firstTr.appendChild(tableSeventhTd);
        businessTableDiv.appendChild(span);
        businessTableDiv.appendChild(section);
        section.appendChild(firstTable);
        section.id = "section1";
    }

    const section = document.getElementById("section1");

    if (section.children.length === 2) {
        section.removeChild(section.lastChild);
    }

    const table = document.createElement("table");
    const tbody = document.createElement("tbody");

    section.appendChild(table);
    table.appendChild(tbody);

    for (let i = 0; i < sortedBusiness.length; i++) {
        const tr = document.createElement("tr");
        const tableFirstTd = document.createElement("td");

        tr.id = `${sortedBusiness[i].id}`;

        const tableFirstTdIcon = document.createElement("i");
        tableFirstTd.append(tableFirstTdIcon);
        tableFirstTd.classList = "bi bi-square text-primary hovered checkBusyBtn";
        tableFirstTd.addEventListener("click", () => {
            tableFirstTd.classList.toggle("bi-square");
            tableFirstTd.classList.toggle("bi-check-square-fill");
        });
        tableFirstTd.id = `${sortedBusiness[i].id}_1`;

        // if (loading && i === 0) {
        // 	tableFirstTd.classList.remove("bi-arrow-left-square");
        // 	tableFirstTd.classList.add("bi-arrow-left-square-fill");
        // }

        tableFirstTd.removeEventListener("click", displayUsersAndBusiness);
        tableFirstTd.addEventListener("click", displayUsersAndBusiness);

        const tableSecondTd = document.createElement("td");

        const tableThirdTd = document.createElement("td");
        tableThirdTd.style.textAlign = "left";
        const tableSixthTd = document.createElement("td");

        const tableSixthTdIcon = document.createElement("i");

        tableSixthTd.append(tableSixthTdIcon);
        tableSixthTd.classList = "bi bi-calendar3 hovered";

        tableSixthTd.addEventListener("click", () => {
            showUpdatingModal("busyTime");
            displayOneBusyModal(sortedBusiness[i]);
        });

        const tableSeventhTd = document.createElement("td");
        const tableSeventhTdIcon = document.createElement("i");
        tableSeventhTd.append(tableSeventhTdIcon);
        tableSeventhTd.classList = "bi bi-trash text-danger hovered";

        tableSeventhTd.addEventListener("click", () => {
            //			alert(confirm("<Text name='Warning'>Предупреждение!</Text>","<Text name='AreSure'>Tы уверен?</Text>"));

            if (
                //				confirm("<Text name='Warning'>Предупреждение!</Text>","<Text name='AreSure'>Tы уверен?</Text>")
                confirm("Вы уверены, что хотите удалить эту запись?")
            ) {
                deleteBusy(sortedBusiness[i]);
                Translate();
            }
        });

        const classes =
            "user-table table table-bordered table text-dark table-striped";

        table.classList = classes;

        tableFirstTd.textContent = ``;
        tableFirstTd.style.width = "10%";
        tableSecondTd.textContent = `${
			business.findIndex(busy => busy.id === sortedBusiness[i].id) + 1
		}`;
        tableSecondTd.style.width = "7%";
        tableThirdTd.textContent = `${sortedBusiness[i].description}`;
        tableThirdTd.style.width = "61%";
        tableThirdTd.style.paddingLeft = "5px";
        tableSixthTd.textContent = ``;
        tableSixthTd.style.width = "10%";
        tableSeventhTd.textContent = ``;
        tableSeventhTd.style.width = "12%";
        tr.appendChild(tableFirstTd);
        tr.appendChild(tableSecondTd);
        tr.appendChild(tableThirdTd);
        tr.appendChild(tableSixthTd);
        tr.appendChild(tableSeventhTd);
        tbody.appendChild(tr);
    }

    //обавляем пустую строку к списку, чтобы видно было нижнюю строку из-за фиксированного футера
    //    let dop = document.createElement('p')
    //    dop.innerHTML = " "
    //    dop.style.height = "16px";
    //    section.append(dop);
}

function sortBusiness() {
    const select = document.getElementById("businessSorting");
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
            case "numAscending":
                sortedBusiness = [...business];
                break;
            case "numDescending":
                sortedBusiness = [...business].reverse();
                break;
            case "nameAscending":
                // sortedBusiness = [...business].sort();
                for (let i = 0; i < sortedDescs.length; i++) {
                    let busy = [...business].find(
                        item =>
                        item.description === sortedDescs[i][0] &&
                        item.id === sortedDescs[i][1]
                    );
                    temp.push(busy);
                }
                sortedBusiness = temp;
                temp = [];
                break;
            case "nameDescending":
                for (let i = sortedDescs.length - 1; i >= 0; i--) {
                    let busy = [...business].find(
                        item =>
                        item.description === sortedDescs[i][0] &&
                        item.id === sortedDescs[i][1]
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
    const section = document.getElementById("section");

    if (
        section &&
        section.querySelector(".user-table") &&
        section.querySelector(".user-table").querySelector("tbody")
    ) {
        const tbody = section.querySelector(".user-table").querySelector("tbody");
        const userChildren = tbody.children;

        for (let i = 0; i < userChildren.length; i++) {
            let id = parseInt(userChildren[i].id);
            if (
                userChildren[i].firstElementChild.classList.contains(
                    "bi-check-square-fill"
                )
            ) {
                if (!usersToDisplay.find(user => user.id === id)) {
                    usersToDisplay.push(users.find(item => item.id === id));
                }
            } else {
                usersToDisplay =
                    usersToDisplay.length > 0 ?
                    usersToDisplay.filter(user => user.id !== id) : [];
            }
        }

        for (let i = 0; i < usersToDisplay.length; i++) {
            setItems(usersToDisplay[i]);
        }

        const bestMatches = findBestMatch();
        // console.log(bestMatches);
        bestMatches.forEach(item => {
            const el = document.getElementById(item[1]).querySelector(`.${item[2]}`);
            el.style.background = "DarkOrange";
            el.style.boxSizing = "border-box";
            el.style.fontSize = "13px";
            el.style.fontWeight = "800";
            el.style.paddingBottom = "0";
        });
    }

    if (
        businessTableDiv &&
        businessTableDiv.querySelector("section") &&
        businessTableDiv.querySelector("section").lastElementChild &&
        businessTableDiv
        .querySelector("section")
        .lastElementChild.querySelector("tbody")
    ) {
        const busyChildren = businessTableDiv
            .querySelector("section")
            .lastElementChild.querySelector("tbody").children;

        for (let i = 0; i < busyChildren.length; i++) {
            let index =
                parseInt(
                    busyChildren[i].firstElementChild.nextElementSibling.textContent
                ) - 1;
            if (
                busyChildren[i].firstElementChild.classList.contains(
                    "bi-check-square-fill"
                )
            ) {
                if (!businessToDisplay.find(busy => busy.id === business[index].id)) {
                    businessToDisplay.push(business[index]);
                }
            } else {
                businessToDisplay =
                    businessToDisplay.length > 0 ?
                    businessToDisplay.filter(busy => busy.id !== business[index].id) : [];
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
        let curObjDay = ".day" + String(i);
        let curDay = document
            .querySelector(".modal-content")
            .querySelectorAll(curObjDay);

        for (let j = 0; j < curDay.length; j++) {
            if (binArray[i][j + 1] === "1") {
                curDay[j].style.background = curColorStudent;
            }
        }
    }

    fullName.value = currentUser.name;

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

function saveUser() {
    const {
        decDay
    } = checkDec();

    if (currentCourse && currentLevel && fullName.value !== "") {
        // console.log(currentCourse, currentLevel, fullName.value);
        if (currUser) {
            const index = users.findIndex(user => user.id === currUser.id);
            let updatedUser = {
                ...currUser,
                name: fullName.value,
                currentCourse,
                currentLevel,
                days: decDay,
            };

            users[index] = updatedUser;
        } else {
            let user = {
                id: new Date().getTime(),
                name: fullName.value,
                currentCourse,
                currentLevel,
                days: decDay,
            };

            users.push(user);
            console.log(users);
        }

        if (users.length === 1) {
            sortedUsers = [...users];
            sortedFilteredUsers = [...sortedUsers];
        } else {
            filterUsers();
        }

        importInput.value = "";

        localStorage.setItem("users", JSON.stringify(users));
        filterUsers();
        $("#staticBackdrop").modal("hide");
        Translate();
    } else {
        alerter("Error", "Fill needed information for FreeTime");
    }
}

function deleteUser(userToDelete) {
    users = users.filter(user => user.id !== userToDelete.id);
    filterUsers();
    localStorage.setItem("users", JSON.stringify(users));
    clearShowingButtons();
    // loadStudentsTable();
}

function clearModalTable() {
    for (let i = 0; i < 7; i++) {
        let curObjDay = ".day" + String(i);
        let curDay = document
            .querySelector(".modal-content")
            .querySelectorAll(curObjDay);

        curDay.forEach(item => (item.style.background = "transparent"));
    }
}

function clearShowingButtons() {
    clearEverything();
    const section = document.getElementById("section");

    if (
        section &&
        section.querySelector(".user-table") &&
        section.querySelector(".user-table").querySelector("tbody")
    ) {
        const tbody = section.querySelector(".user-table").querySelector("tbody");
        const userChildren = tbody.children;

        for (let i = 0; i < userChildren.length; i++) {
            if (
                userChildren[i].firstElementChild.classList.contains(
                    "bi-check-square-fill"
                )
            ) {
                userChildren[i].firstElementChild.classList.remove(
                    "bi-check-square-fill"
                );
                userChildren[i].firstElementChild.classList.add("bi-square");
            }
        }
    }

    if (
        businessTableDiv &&
        businessTableDiv.querySelector("section") &&
        businessTableDiv.querySelector("section").lastElementChild &&
        businessTableDiv
        .querySelector("section")
        .lastElementChild.querySelector("tbody")
    ) {
        const busyChildren = businessTableDiv
            .querySelector("section")
            .lastElementChild.querySelector("tbody").children;

        for (let i = 0; i < busyChildren.length; i++) {
            if (
                busyChildren[i].firstElementChild.classList.contains(
                    "bi-check-square-fill"
                )
            ) {
                busyChildren[i].firstElementChild.classList.remove(
                    "bi-check-square-fill"
                );
                busyChildren[i].firstElementChild.classList.add("bi-square");
            }
        }
    }
}

function saveBusySchedule() {
    const {
        decDay
    } = checkDec();

    if (fullName.value !== "") {
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

        importInput.value = "";

        localStorage.setItem("business", JSON.stringify(business));
        loadBusinessTable();
        $("#staticBackdrop").modal("hide");
    } else {
        alerter("Error", "Fill needed information  for BusyTime");
    }
}

function displayOneBusyModal(currentBusiness) {
    clearEverything();

    let binArray = toBinArray(currentBusiness);

    for (let i = 0; i < 7; i++) {
        let curObjDay = ".day" + String(i);
        let curDay = document
            .querySelector(".modal-content")
            .querySelectorAll(curObjDay);

        for (let j = 0; j < curDay.length; j++) {
            if (binArray[i][j + 1] === "1") {
                curDay[j].style.background = "RoyalBlue";
            }
        }
    }

    fullName.value = currentBusiness.description;
    currBusiness = currentBusiness;
}

function deleteBusy(busyToDelete) {
    business = business.filter(busy => busy.id !== busyToDelete.id);
    sortBusiness();
    localStorage.setItem("business", JSON.stringify(business));
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

    if (time === "freeTime") {
        fullName.setAttribute("trans", "text+:name;");
        selectCourseSpan.style.display = "inline-block";
        selectLevelSpan.style.display = "inline-block";
        document.getElementById("level1").style.display = "inline-block";
        document.getElementById("level2").style.display = "inline-block";
        
        document.getElementsByName("Level1").style.display = "inline-block";
        document.getElementsByName("Level2").style.display = "inline-block";
        
        nbts.removeEventListener("click", saveBusySchedule);
        nbts.addEventListener("click", saveUser);
    } else {
        fullName.setAttribute("trans", "text+:desc;");
        document.getElementsByName("Level1").style.display = "none";
        document.getElementsByName("Level2").style.display = "none";
        selectCourseSpan.style.display = "none";
        selectLevelSpan.style.display = "none";
        document.getElementById("level1").style.display = "none";
        document.getElementById("level2").style.display = "none";
        nbts.removeEventListener("click", saveUser);
        nbts.addEventListener("click", saveBusySchedule);
    }

    Translate();
}

function showUpdatingModal(type) {
    if (type === "freeTime") {
        fullName.setAttribute("trans", "text+:name;");
        // fullName.placeholder = "Name";
        selectCourseSpan.style.display = "inline-block";
        selectLevelSpan.style.display = "inline-block";
        nbts.removeEventListener("click", saveBusySchedule);
        nbts.addEventListener("click", saveUser);
    } else {
        fullName.setAttribute("trans", "text+:desc;");
        // fullName.placeholder = "Description";
        selectCourseSpan.style.display = "none";
        selectLevelSpan.style.display = "none";
        nbts.removeEventListener("click", saveUser);
        nbts.addEventListener("click", saveBusySchedule);
    }

    timeSelectorSpan.style.display = "none";
    for (let i = 0; i < timeSelector.children.length; i++) {
        if (type === timeSelector.children[i].value) {
            timeSelector.children[i].selected = true;
        }
    }

    $("#staticBackdrop").modal("show");
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

    return result;
}

function creatingOptions(array, type) {
    for (let i = 0; i < array.length; i++) {
        let option = document.createElement("option");
        option.value = array[i].toString();
        option.innerHTML = array[i].toString();

        if (type === "course") {
            selectCourse.appendChild(option);
        } else if (type === "grade") {
            selectLevel.appendChild(option);
        }
    }
}

function splittingCourses() {
    const text = courseText.value;

    // if ()
    let courses = JSON.parse(localStorage.getItem("courses")) || [];
    // else
    // 	let course = удаленно

    let filteredCourses =
        JSON.parse(localStorage.getItem("filteredCourses")) || courses;
    let options = text.split(",");
    options = [...new Set(options.map(item => item.trim()))];

    creatingOptions(options, "course");

    localStorage.setItem("courses", JSON.stringify([...courses, ...options]));
    localStorage.setItem(
        "filteredCourses",
        JSON.stringify([...filteredCourses, ...options])
    );

    courseText.value = "";
    // console.log(options.at(-1));
}

function splittingGrades() {
    const text = gradeText.value;
    let grades = JSON.parse(localStorage.getItem("grades")) || [];
    let filteredGrades =
        JSON.parse(localStorage.getItem("filteredGrades")) || grades;
    let options = text.split(",");
    options = [...new Set(options.map(item => item.trim()))];

    creatingOptions(options, "grade");

    localStorage.setItem("grades", JSON.stringify([...grades, ...options]));
    localStorage.setItem(
        "filteredGrades",
        JSON.stringify([...filteredGrades, ...options])
    );

    gradeText.value = "";
    // console.log(options.at(-1));
}

function decodeTheTimeCode(value) {
    let result = [];
    try {
        result = Array.from(value)
            .reduce(
                (acc, char) => acc.concat((char.charCodeAt() - 952).toString(2)),
				[]
            )
            .map(bin => "0".repeat(8 - bin.length) + bin);
    } catch (e) {
        result = [];
        alerter("Error", "Неверный формат");
    }
    return result;
}

function fCompressCodeTime(codeTime) {
    let compressCodeTime = "";
    let abc28 = "0123456789ABCDEFGHIJKLMNOPQRS";
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

function fDeCompressCodeTime(compressCodeTime) {
    let codeTime = "";
    let abc28 = "0123456789ABCDEFGHIJKLMNOPQRS";
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
    clearModalTable();
    let code = fDeCompressCodeTime(importInput.value).trim();
    //	alert(fDeCompressCodeTime(importInput.value))
    //	let code = importInput.value;

    let binCode = decodeTheTimeCode(code);
    let res = [];
    let str = "";
    binCode.forEach((item, index) => {
        if (index % 4 === 0) str += "1";
        if ((index + 1) % 4 === 0) {
            str += item[0];
            res.push(str);
            str = "";
        } else {
            str += item;
        }
    });
    importInput.value = "";

    for (let i = 0; i < 7; i++) {
        let curObjDay = ".day" + String(i);
        let curDay = document
            .querySelector(".modal-content")
            .querySelectorAll(curObjDay);

        for (let j = 0; j < curDay.length; j++) {
            if (res.length === 7) {
                if (res[i][j + 1] === "1") {
                    curDay[j].style.background = "seagreen";
                }
            } else {
                curDay[j].style.background = "transparent";
            }
        }
    }
}

function filterUsers() {
    filteredUsers = [];
    users.forEach(item => {
        if (
            (filteredCourses.includes(item.currentCourse) ||
                item.currentCourse === "Any") &&
            (filteredGrades.includes(item.currentLevel) ||
                item.currentLevel === "Any")
        ) {
            filteredUsers.push(item);
        }
    });

    localStorage.setItem("filteredUsers", JSON.stringify(filteredUsers));

    sortUsers();
}

function createModal() {
    if (!body.contains(document.querySelector(".filter-modal"))) {
        const div = document.createElement("div");

        div.classList.add("filter-modal", "blocked");
        // div.classList.add("blocked");
        div.setAttribute("name", "close-modal");
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

        const modalBody = document.createElement("div");
        modalBody.style.backgroundColor = "Gainsboro";
        //		modalBody.style.height = "60%";

        if (window.innerWidth < 400) modalBody.style.width = "320px";
        else if (window.innerWidth < 600) modalBody.style.width = "420px";
        else modalBody.style.width = "600px";

        modalBody.style.overflowY = "auto";
        const title = document.createElement("div");
        const titleText = document.createElement("Text");
        title.className = "filter-modal-title";
        titleText.innerHTML = "Фильтры";
        titleText.setAttribute("trans", "text+:FilterTitle;");
        title.appendChild(titleText);
        modalBody.className = "filter-modal-body";
        modalBody.appendChild(title);

        const filtersDiv = document.createElement("div");

        //		filtersDiv.style.backgroundColor="red"

        const coursesDiv = document.createElement("div");
        //		coursesDiv.style.backgroundColor="blue"
        const gradesDiv = document.createElement("div");
        //		gradesDiv.style.backgroundColor="indianred"

        const coursesDivTitle = document.createElement("Text");
        const gradesDivTitle = document.createElement("Text");

        coursesDivTitle.innerHTML = "Курсы";
        coursesDivTitle.id = "courses-div-title";
        gradesDivTitle.innerHTML = "Уровни";
        gradesDivTitle.id = "grades-div-title";

        coursesDivTitle.setAttribute("trans", "text+:CoursesDivTitle;");
        gradesDivTitle.setAttribute("trans", "text+:GradesDivTitle;");

        coursesDiv.appendChild(coursesDivTitle);
        gradesDiv.appendChild(gradesDivTitle);

        filtersDiv.className = "filter-modal-div";
        coursesDiv.className = "filter-modal-courses-div";
        gradesDiv.className = "filter-modal-grades-div";
        filtersDiv.appendChild(coursesDiv);
        filtersDiv.appendChild(gradesDiv);

        let divBntApply = document.createElement("div");

        let applyFilterEsc = document.createElement("button");
        let applyFilterTextEsc = document.createTextNode(" Cancel ");
        applyFilterEsc.appendChild(applyFilterTextEsc);
        applyFilterEsc.setAttribute("trans", "text+:Close;");
        applyFilterEsc.style.margin = "20px";
        applyFilterEsc.style.color = "white";
        applyFilterEsc.style.borderRadius = "2px";
        applyFilterEsc.style.fontSize = "12px";
        applyFilterEsc.style.fontWeight = "500";
        applyFilterEsc.style.backgroundColor = "gray";
        applyFilterEsc.style.padding = "4px 15px";
        applyFilterEsc.style.border = "0";

        applyFilterEsc.addEventListener("click", () => {
            document.querySelector(".filter-modal").classList.remove("blocked");
            document.querySelector(".filter-modal").classList.add("closed");
        });

        let applyFilter = document.createElement("button");
        let applyFilterText = document.createTextNode("Apply");
        applyFilter.appendChild(applyFilterText);
        applyFilter.setAttribute("trans", "text+:Apply;");
        applyFilter.style.margin = "20px";
        applyFilter.style.color = "white";
        applyFilter.style.borderRadius = "2px";
        applyFilter.style.fontSize = "12px";
        applyFilter.style.fontWeight = "500";
        applyFilter.style.padding = "4px 15px";
        applyFilter.style.backgroundColor = "CornflowerBlue";
        applyFilter.style.border = "0";
        applyFilter.setAttribute("class", "bnt btn-sm");

        applyFilter.addEventListener("click", () => {
            if (document.getElementById("dop")) {
                document.getElementById("dop").remove();
            }

            filterUsers();
            localStorage.setItem(
                "filteredCourses",
                JSON.stringify(filteredCourses.filter(item => item !== "All"))
            );
            localStorage.setItem(
                "filteredGrades",
                JSON.stringify(filteredGrades.filter(item => item !== "All"))
            );
            document.querySelector(".filter-modal").classList.remove("blocked");
            document.querySelector(".filter-modal").classList.add("closed");
        });

        divBntApply.appendChild(applyFilterEsc);
        divBntApply.appendChild(applyFilter);
        divBntApply.style.width = "100%";
        divBntApply.style.textAlign = "center";

        divBntApply.classList = "filter-modal-footer";

        modalBody.appendChild(filtersDiv);
        modalBody.append(divBntApply);

        div.appendChild(modalBody);

        Translate();
    }
    document.querySelector(".filter-modal").classList.remove("closed");
    document.querySelector(".filter-modal").classList.add("blocked");
    const coursesDiv = document.querySelector(".filter-modal-courses-div");
    const gradesDiv = document.querySelector(".filter-modal-grades-div");

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

    courses = JSON.parse(localStorage.getItem("courses")) || [];
    grades = JSON.parse(localStorage.getItem("grades")) || [];
    filteredCourses = JSON.parse(localStorage.getItem("filteredCourses")) || [];
    filteredGrades = JSON.parse(localStorage.getItem("filteredGrades")) || [];

    let allCourses = ["All", ...courses];
    let allGrades = ["All", ...grades];

    for (let i = 0; i < allCourses.length; i++) {
        const div = document.createElement("span");
        div.classList.add("course-or-grade", "course");
        const checkbox = document.createElement("input");
        const label = document.createElement("label");

        checkbox.type = "checkbox";
        checkbox.className = "PRIVET";
        checkbox.style.float = "left";

        if (filteredCourses.includes(allCourses[i])) {
            checkbox.checked = true;
        }

        label.innerHTML = allCourses[i];
        label.style.display = "inline";
        div.appendChild(checkbox);
        div.appendChild(label);
        div.style.backgroundColor = "white";
        div.style.display = "inline-block";
        div.style.margin = "2px";
        coursesDiv.appendChild(div);

        checkbox.onchange = e => {
            const item = allCourses.find(
                c => c === e.target.nextElementSibling.textContent
            );
            const checkboxes = document.querySelectorAll(".PRIVET");
            // console.log(item);
            if (e.target.checked) {
                if (item === "All") {
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
                if (item === "All") {
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
        document.querySelectorAll(".PRIVET").forEach(item => (item.checked = true));
    }

    for (let i = 0; i < allGrades.length; i++) {
        const div = document.createElement("span");
        div.classList.add("course-or-grade", "grade");
        const checkbox = document.createElement("input");
        const label = document.createElement("label");

        checkbox.type = "checkbox";
        checkbox.className = "POKA";
        checkbox.style.float = "left";

        if (filteredGrades.includes(allGrades[i])) {
            checkbox.checked = true;
        }

        label.innerHTML = allGrades[i];
        label.style.display = "inline";
        div.appendChild(checkbox);
        div.appendChild(label);
        div.style.backgroundColor = "white";
        div.style.display = "inline-block";
        div.style.margin = "2px";
        gradesDiv.appendChild(div);

        checkbox.onchange = e => {
            const item = allGrades.find(
                c => c === e.target.nextElementSibling.textContent
            );
            const checkboxes = document.querySelectorAll(".POKA");
            if (e.target.checked) {
                if (item === "All") {
                    filteredGrades = [...allGrades];
                    checkboxes.forEach(item => (item.checked = true));
                } else {
                    filteredGrades.push(item);
                    if (filteredGrades.length === allGrades.length - 1) {
                        checkboxes[0].checked = true;
                    }
                }
            } else {
                if (item === "All") {
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
        document.querySelectorAll(".POKA").forEach(item => (item.checked = true));
    }
}

function getTimeCode() {
    const {
        binDay
    } = checkDec();
    const days = {};
    let string = "";
    binDay.forEach((item, index) => {
        const length = 8;
        const pattern = new RegExp(".{1," + length + "}", "ig");

        const res = item
            .replace(item[0], "")
            .match(pattern)
            .map(_item => _item.padEnd(length, "0"))
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

window.onload = () => {
    users = JSON.parse(localStorage.getItem("users")) || [];
    business = JSON.parse(localStorage.getItem("business")) || [];
    courses = JSON.parse(localStorage.getItem("courses")) || [];
    grades = JSON.parse(localStorage.getItem("grades")) || [];
    sortedBusiness = business;
    sortedUsers = users;
    filteredUsers = JSON.parse(localStorage.getItem("filteredUsers")) || users;
    sortedFilteredUsers = filteredUsers;
    filteredCourses =
        JSON.parse(localStorage.getItem("filteredCourses")) || courses;
    filteredGrades = JSON.parse(localStorage.getItem("filteredGrades")) || grades;
    allMatches = [];

    if (courses.length !== 0) {
        creatingOptions(courses, "course");
    }

    if (grades.length !== 0) {
        creatingOptions(grades, "grade");
    }

    loadStudentsTable();
    loadBusinessTable();
    clearEverything();
    toggleCellClickAbility(true, "modal");
    toggleCellClickAbility(false, "tab");
    nbtc.addEventListener("click", clearEverything);
    nbtct.addEventListener("click", clearTable);
    nbts.addEventListener("click", saveUser);
    nbtcl.addEventListener("click", clearTable);

    document.getElementById('btnDelFull2').addEventListener("click", clearTable)

    //	alert(creatingButton);
    //

    creatingButton.addEventListener("click", () => {
        currBusiness = null;
        currUser = null;
        timeSelectorSpan.style.display = "block";
        clearEverything();
    });


    //    alert(document.getElementById('createFull'))
    //    
    //    document.getElementById('createFull').addEventListener("click", () => {
    //        currBusiness = null;
    //        currUser = null;
    //        timeSelectorSpan.style.display = "block";
    //        clearEverything();
    //    });







    timeSelector.addEventListener("change", changeTimeSelector);
    gradeSubmittingButton.addEventListener("click", splittingGrades);
    courseSubmittingButton.addEventListener("click", splittingCourses);
    scheduleLoadingCheckBox.addEventListener("change", () =>
        localStorage.setItem(
            "schedule-loading",
            JSON.stringify(scheduleLoadingCheckBox.checked)
        )
    );
    //    scheduleAutoSavingCheckBox.addEventListener("change", () =>
    //        localStorage.setItem(
    //            "schedule-auto-saving",
    //            JSON.stringify(scheduleAutoSavingCheckBox.checked)
    //        )
    //    );
    selectLevel.addEventListener("change", e => getCurrentLevel(e));
    selectCourse.addEventListener("change", e => getCurrentCourse(e));
    fullName.addEventListener("change", changeName);
    importButton.addEventListener("click", importTime);
    showingCodeButton.addEventListener("click", () =>
        alerter("Timecode", "<b>" + fCompressCodeTime(getTimeCode()) + "<b>")
    );

    gradeText = document.getElementById("gradeTextArea");
    courseText = document.getElementById("courseTextArea");

    //    if (!autoSaving) {
    //        scheduleAutoSavingCheckBox.checked = false;
    //    }

    if (!loading) {
        scheduleLoadingCheckBox.checked = false;
    } else {


        //        Показывает в расписании только первое дело
        //        alert(sortedBusiness[0].id)

        //        if (sortedBusiness[0]) {
        //            let td = document.getElementById(`${sortedBusiness[0].id}_1`) || null;
        //            if (td) {
        //                td.classList.remove("bi-square");
        //                td.classList.add("bi-check-square-fill");
        //
        //                displayUsersAndBusiness();
        //            }
        //        }

        tbodySchedule.innerHTML = localStorage.getItem("tableSchedule");

        alert(" Пытаюсь загрузить таблицу 2 ")
        tbodyScheduleFull2.innerHTML = localStorage.getItem("tableSchedule");
                
//        notifyer("Данные загружены из хранилища!")


    }





    for (let i = 0; i < dayWeek.length; i++) {
        dayWeek[i].addEventListener("change", () => allDaySelect(dayWeek[i]));
    }

    if (localStorage.length && localStorage.getItem("LanguageLocal")) {
        // Наличие localStorege и нашего LanguageLocal в нём
        document.getElementById("Trans").value =
            localStorage.getItem("LanguageLocal"); // T.к. уже есть переносим его значение в select
        Translate(); // Вызываем функцию при старте страницы , но после обработки локального хранилища
    }

    AddEventAllCheck();



};

//select all freetime and busytime
//window.addEventListener('load', AddEventAllCheck)

function AddEventAllCheck() {
    if (document.getElementById("allCheckFree")) {
        let allCheckFree = document.getElementById("allCheckFree");

        allCheckFree.addEventListener("click", () => {
            let checkAll = false;
            if (allCheckFree.classList[2] == "bi-check-square-fill") {
                checkAll = true;
            } else {
                checkAll = false;
            }

            allCheckFree.classList.toggle("bi-square-fill");
            allCheckFree.classList.toggle("bi-check-square-fill");

            let leftBtnFree = document.querySelectorAll(".checkFreeBtn");

            for (let i = 0; i < leftBtnFree.length; i++) {
                if (checkAll) {
                    leftBtnFree[i].classList.remove("bi-square");
                    leftBtnFree[i].classList.remove("bi-check-square-fill");
                    leftBtnFree[i].classList.add("bi-square");
                } else {
                    leftBtnFree[i].classList.remove("bi-square");
                    leftBtnFree[i].classList.remove("bi-check-square-fill");
                    leftBtnFree[i].classList.add("bi-check-square-fill");
                }
            }
            displayUsersAndBusiness();
        });
    }
    if (document.getElementById("allCheckBusy")) {
        let allCheckBusy = document.getElementById("allCheckBusy");

        allCheckBusy.addEventListener("click", () => {
            let checkAll = false;
            if (allCheckBusy.classList[2] == "bi-check-square-fill") {
                checkAll = true;
            } else {
                checkAll = false;
            }

            allCheckBusy.classList.toggle("bi-square-fill");
            allCheckBusy.classList.toggle("bi-check-square-fill");

            let leftBtnBusy = document.querySelectorAll(".checkBusyBtn");
            for (let i = 0; i < leftBtnBusy.length; i++) {
                if (checkAll) {
                    leftBtnBusy[i].classList.remove("bi-square");
                    leftBtnBusy[i].classList.remove("bi-check-square-fill");
                    leftBtnBusy[i].classList.add("bi-square");
                } else {
                    leftBtnBusy[i].classList.remove("bi-square");
                    leftBtnBusy[i].classList.remove("bi-check-square-fill");
                    leftBtnBusy[i].classList.add("bi-check-square-fill");
                }
            }
            displayUsersAndBusiness();
        });
    }
}

//update courses list

let courseNameSubmitUpdate = document.getElementById("courseNameSubmitUpdate");
courseNameSubmitUpdate.addEventListener("click", () => {
    //	alert(document.getElementById("courseTextArea").value.length)
    if (document.getElementById("courseTextArea").value.length > 3) {
        if (confirm("Есть данные в хранилище. Обновить?")) {
            localStorage.removeItem("courses");
            splittingCourses();
            notifyer("Данные обновлены!");
        }
    } else {
        alerter("Внимание!", "Введите или загрузите из хранилища данные по курсам");
    }
});

let gradeNameSubmitUpdate = document.getElementById("gradeNameSubmitUpdate");
gradeNameSubmitUpdate.addEventListener("click", () => {
    //	alert(document.getElementById("gradeTextArea").value.length)
    if (document.getElementById("gradeTextArea").value.length > 0) {
        if (confirm("Есть данные в хранилище. Обновить?")) {
            localStorage.removeItem("grades");
            splittingGrades();
            notifyer("Данные обновлены!");
        }
    } else {
        alerter("Внимание", "Введите или загрузите из хранилища данные по уровням");
    }
});
//
//notifyer("Идет обновление сервиса!");


// WINDOWS 


//Окно уведомителя
export function notifyer(
    text,
    time = 1000,
    bgcolor = "MediumSeaGreen",
    textcolor = "white"
) {
    let divNotifyer = document.createElement("div");
    let textNotifyer = document.createTextNode(text);
    divNotifyer.classList.add("mainNotifyer");
    divNotifyer.style.position = "absolute";
    divNotifyer.style.left = "36%";
    divNotifyer.style.top = "10px";
    divNotifyer.style.lineHeight = "0.9em";
    if (Number(window.innerWidth) < 400) {
        divNotifyer.style.width = "35%";
    } else {
        divNotifyer.style.width = "15%";
    }
    divNotifyer.style.padding = "5px";
    divNotifyer.style.borderRadius = "3px";
    divNotifyer.style.textAlign = "center";
    divNotifyer.style.fontSize = "0.7em";
    divNotifyer.style.zIndex = "10000";

    divNotifyer.appendChild(textNotifyer);
    divNotifyer.style.backgroundColor = bgcolor;
    divNotifyer.style.color = textcolor;
    document.body.appendChild(divNotifyer);

    let timerNotifyer1 = setTimeout(() => {
        divNotifyer.classList.toggle("invsNotifyer");
        clearTimeout(timerNotifyer1);
    }, 500);

    let timerNotifyer2 = setTimeout(() => {
        divNotifyer.classList.toggle("invsNotifyer");
        clearTimeout(timerNotifyer2);
    }, 3500);
}

//Окно своего алерта

export function alerter(titleWin = " title", bodyWin = "body", footer = "") {
    let alertWin = document.querySelector(".alertWin");
    alertWin.classList.add("alertinvs");

    if (window.innerWidth < 400) alertWin.style.width = "320px";
    else if (window.innerWidth < 600) alertWin.style.width = "400px";
    else alertWin.style.width = "400px";

    let labelAlert = document.getElementById("alerterLabel");
    labelAlert.innerHTML = titleWin;
    let bodyAlert = document.getElementById("modalBodyAlert");
    bodyAlert.innerHTML = bodyWin;

    let modalFooterAlert = document.getElementById("modalFooterAlert");
    modalFooterAlert.innerHTML = `<div><button type="button" trans="text+:Close;" class="btn btn-secondary btn-sm btnCloseAlert m-2 " style="font-weight: 500;color: white; font-size: 1em">Close</button></div>`;

    let btnCloseAlert = document.querySelectorAll(".btnCloseAlert");
    btnCloseAlert[0].addEventListener("click", () => {
        alertWin.classList.remove("alertinvs");
    });
    btnCloseAlert[1].addEventListener("click", () => {
        alertWin.classList.remove("alertinvs");
    });

    Translate();
}




document.getElementById("F4Team").addEventListener("click", F4Team);

function F4Team() {
    let titleWin = `<span trans="text+:TeamDev;"> Группа разработки</span>`;
    let bodyWin = `<div class="pl-2" style=""> <b>Белозеров Олег</b> - front, desing, idea<br> <b>Бондаренко Николай</b> - JsDev (main programm)<br> <b>Сазонов Глеб</b> -  JsDev (translater)<br> <b>Антоненко Евгений</b> - PhPDev <br> <b>Кузнецов Владислав</b> - JsDev, PhPDev<br> <b>Фирсов Ярослав</b> - JsDev</div>`;

    alerter(titleWin, bodyWin);
}

//Окно своего конфирма
document
    .getElementById("testConfirmer")
    .addEventListener("click", confirmer.bind("тело", "заголовок"));

//confirmer("<Text name='Warning'>Предупреждение!</Text>","<Text name='AreSure'>ты уверен?</Text>")

export function confirmer(titleWinContent = " title", bodyWinContent) {
    //	alert(titleWinContent+"="+bodyWinContent)

    let alertWin = document.querySelector(".alertWin");
    alertWin.classList.add("alertinvs");

    if (window.innerWidth < 400) alertWin.style.width = "320px";
    else if (window.innerWidth < 600) alertWin.style.width = "400px";
    else alertWin.style.width = "400px";

    let labelAlert = document.getElementById("alerterLabel");
    labelAlert.innerHTML = titleWinContent;
    let bodyAlert = document.getElementById("modalBodyAlert");
    bodyAlert.innerHTML = bodyWinContent;

    let modalFooterAlert = document.getElementById("modalFooterAlert");
    modalFooterAlert.innerHTML = `<button type="button" trans="text+:ConfirmerOk;" id="ConfirmerOk"  class="btn btn-primary btn-sm m-2 " style="font-weight: 500; font-size: 1em">&nbsp;&nbsp;&nbsp;&nbsp;Oк&nbsp;&nbsp;&nbsp;&nbsp;</button>
<button type="button" trans="text+:ConfirmerEsc;" id="ConfirmerEsc" class="btn btn-outline-secondary btn-sm  m-2 " style="font-weight: 500;font-size: 1em">Отмена</button>`;
    //
    //	Translate();

    let btnCloseAlert = document.querySelector(".btnCloseAlert");
    btnCloseAlert.addEventListener("click", () => {
        alertWin.classList.remove("alertinvs");
        //        alert("false")
        return false;
    });

    document.getElementById("ConfirmerOk").addEventListener("click", () => {
        alertWin.classList.remove("alertinvs");
        //        alert("true")
        return true;
    });

    document.getElementById("ConfirmerEsc").addEventListener("click", () => {
        alertWin.classList.remove("alertinvs");
        //		alert("закрываю и не удаляю")
        return false;
    });
}

//var myModal = new bootstrap.Modal(document.getElementById('myModalFull'), { 
//  keyboard: false
//})
//
//myModal.show()



if ((!localStorage.getItem('users')) && (!localStorage.getItem('business'))) {

    if (confirm("Добро пожаловать в НайдиВремя! \nВы первый раз запустили нашу систему управления временем. \nЗагрузить тестовые данные для демонстрации работы системы? \nДалее Вы их можете удалить и продолжить работу!")) {
        
        let users_demo = '[{"id": 1662373008414,"name": "Иванов Семен (Demo)",    "currentCourse": "Scratch", "currentLevel": "1","days": [33554432, 33554656, 33554432, 33554432, 33554432, 33554432, 33554432]}, {"id": 1662374017631,   "name": "Степанов Иван (Demo)","currentCourse": "Scratch","currentLevel": "1",    "days": [33554432, 33554656, 33554432, 33554432, 33554432, 33554432, 33554432]}, {"id": 1662374546140,"name": "Саблин Дмитрий (Demo)","currentCourse": "WebStartHTML+CSS","currentLevel": "1","days": [33554432, 33554880, 33554432, 33554432, 33554432, 33554432, 33554432]}, {"id": 1662374737036,"name": "Диденко Кирилл (Demo)","currentCourse": "JavaScriptStart","currentLevel": "1","days": [33554432, 33556476, 33556476, 33556476, 33556476, 33556476, 33556476]}, {    "id": 1662375208126,    "name": "Дорохов Платон (Demo)","currentCourse": "PythonStart","currentLevel": "1","days": [33554432, 33554686, 33554686, 33554686, 33554686, 33554686, 33554686]}]'
        
        localStorage.setItem('users', users_demo);
        localStorage.setItem('filteredUsers', users_demo);

        let business_demo = '[{"id":1662373691437,"description":"Класс  1(Demo)","days":[58720256,58720256,58720256,58720256,58720256,60784640,58720256]},{"id":1662373704669,"description":"Класс 2 (Demo)","days":[33554432,33554432,33554432,33554432,33554432,33554432,33554432]},{"id":1662374339780,"description":"Белозеров Олег (Demo)","days":[33685504,33556476,49815550,33556479,33677310,40910846,33554432]},{"id":1672065745981,"description":"Антоненко Евгений (Demo)","days":[67108863,67108608,67108608,67108608,67108608,67108863,58720255]}]'

        localStorage.setItem('business', business_demo);

        let courses_demo = '["Пробное", "Kodu", "Scratch", "CoSpaces", "MitApp Inventor", "Pencil Code", "PythonStart", "Godot", "WebStart", "JavaScript Start", "JavaScripts Front", "JavaScript GameDev", "PHP", "C# Start", "Unity", "Java Start", "Fusion 3D", "ОГЭ", "ЕГЭ", "Project Team"]'

        localStorage.setItem('courses', courses_demo);
        localStorage.setItem('filteredCourses', courses_demo);

        let grades_demo = '["1","2","3","4"]';
        
        localStorage.setItem('grades', grades_demo);
        localStorage.setItem('filteredGrades', grades_demo);

    }

}

Translate();
