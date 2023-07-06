import {notifyer} from "./main.js";
import {alerter} from "./main.js";
import {confirmer} from "./main.js";


//  alerter("Смена типа хранилища","Тип базы данных будет изменён после перезагрузки.")
//
//    location.reload();


//alerter("111","2222")

//notifyer("jgfdjkbgjkdgrdjk")
//confirmer("jghjfj","jgjdfjfg")

//var answerConf = 0;
//
//function conf(titleWinContent = " title", bodyWinContent) {
//    //	alert(titleWinContent+"="+bodyWinContent)
//
//    let alertWinConf = document.querySelector(".alertWin");
//    alertWinConf.classList.add("alertinvs");
//
//    if (window.innerWidth < 400) alertWinConf.style.width = "320px";
//    else if (window.innerWidth < 600) alertWinConf.style.width = "400px";
//    else alertWinConf.style.width = "400px";
//
//    let labelAlertConf = document.getElementById("alerterLabel");
//    labelAlertConf.innerHTML = titleWinContent;
//    let bodyAlertConf = document.getElementById("modalBodyAlert");
//    bodyAlertConf.innerHTML = bodyWinContent;
//
//    let modalFooterAlertConf = document.getElementById("modalFooterAlert");
//    modalFooterAlertConf.innerHTML = `<button type="button" name="ConfirmerOk" id="ConfirmerOk"  class="btn btn-primary btn-sm m-2 " style="font-weight: 500; font-size: 1em">&nbsp;&nbsp;&nbsp;&nbsp;Oк&nbsp;&nbsp;&nbsp;&nbsp;</button>
//<button type="button" name="ConfirmerEsc" id="ConfirmerEsc" class="btn btn-outline-secondary btn-sm  m-2 " style="font-weight: 500;font-size: 1em">Отмена</button>`;
//    //
//    //	Translate();
//
//    let btnCloseAlertConf = document.querySelector(".btnCloseAlert");
//    btnCloseAlertConf.addEventListener("click", () => {
//        alertWinConf.classList.remove("alertinvs");
//        answerConf = 0
////        alert("false")
//        return 0;
//    });
//
//    document.getElementById("ConfirmerOk").addEventListener("click", () => {
//        alertWinConf.classList.remove("alertinvs");
//        answerConf = 1
////        alert("true")
//        return 1;
//    });
//
//    document.getElementById("ConfirmerEsc").addEventListener("click", () => {
//        alertWinConf.classList.remove("alertinvs");
//        //		alert("закрываю и не удаляю")
//        answerConf = 0
//        return 0;
//    });
//    
// 
//}


//
//async function f() {
//
//  let promise = new Promise((resolve, reject) => {
//    setTimeout(() => resolve("готово!"), 3000)
////      resolve (conf('5646','323423'))
//  });
//
//  let result = await promise; // будет ждать, пока промис не выполнится (*)
//
//  alert(result); // "готово!"
//}
//
//f();









//if localStorage.get()

//
//
//let listLocalitems = ['users', 'business', 'grades', 'courses', 'filteredUsers', 'filteredCourses', 'filteredGrades']
//
//if (!localStorage.getItem('users')) {
//    if (confirm("Вы первый раз запустили систему управления временем. Загрузить тестовые данные для демонстрации работы системы? Далее Вы их можете удалить и продолжить работу!")) {
//        let user_demo = '[{"id": 1662373008414,"name": "Иванов Семен (Demo)",    "currentCourse": "Scratch", "currentLevel": "1","days": [33554432, 33554656, 33554432, 33554432, 33554432, 33554432, 33554432]}, {"id": 1662374017631,   "name": "Степанов Иван (Demo)","currentCourse": "Scratch","currentLevel": "1",    "days": [33554432, 33554656, 33554432, 33554432, 33554432, 33554432, 33554432]}, {"id": 1662374546140,"name": "Саблин Дмитрий (Demo)","currentCourse": "WebStartHTML+CSS","currentLevel": "1","days": [33554432, 33554880, 33554432, 33554432, 33554432, 33554432, 33554432]}, {"id": 1662374737036,"name": "Диденко Кирилл (Demo)","currentCourse": "JavaScriptStart","currentLevel": "1","days": [33554432, 33556476, 33556476, 33556476, 33556476, 33556476, 33556476]}, {    "id": 1662375208126,    "name": "Дорохов Платон (Demo)","currentCourse": "PythonStart","currentLevel": "1","days": [33554432, 33554686, 33554686, 33554686, 33554686, 33554686, 33554686]}]'
//        localStorage.setItem('users', user_demo);
//    }
//
//}






//    window.onload = () => {
//        alert("start");
//            let flag = localStorage.getItem("numTab")
//            if (flag == 1) {
//                var myModal2 = new bootstrap.Modal(document.getElementById('myModalFull1'), {})
//                myModal2.show()
//            }
//        }



//Скрипт перезагрузки при смене типа данных с сохранением в локальном хранилище

//
//<div class="form-check">
//                    <input class="form-check-input" type="radio" name="radioBase" id="flexRadioDefault1" checked>
//                    <label class="form-check-label" for="flexRadioDefault1">
//                        <Text name="LcStor"> In the device's local storage</Text>
//                    </label>
//                </div>
//                <div class="form-check">
//                    <input disabled class="form-check-input" type="radio" name="radioBase" id="flexRadioDefault2">
//                    <label class="form-check-label" for="flexRadioDefault2">
//                        <Text name="RtStor"> In the remote database </Text>
//                    </label>
//                </div>


//document.getElementById("flexRadioDefault2").addEventListener('click', ()=>{
//    
//    alert("remoteBase")
//    
//})

//Кнопка сохранить и загрузить в полный акран модальное окно


//Скрипт открытия полного экрана при загрузке и настройка этого









//$('#full').modal('show')


//                            <div class="modal fade" id="full" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true" style="font-size: 0.85rem">



//const myModal = new bootstrap.Modal(document.getElementById('full'))


//let import1 = document.getElementById("importButtonFree")



//function loadFiles(globalLogin, loadItem) {
//    let dataItem = 'https://findtime.online/php/' + globalLogin + '/' + globalLogin + '_' + loadItem + '.json';
//
//    fetch(dataItem).then(response => {
//        return response.text();
//    }).then(text => {
//        if (confirm("Загрузить в локальное хранилище?")) localStorage.setItem('remote_'+loadItem, text);
//    });
//}
//
//
////load jsons
//
//loadItem = "users";
//loadFiles(globalLogin, loadItem);

//loadItem = "business";
//loadFiles(globalLogin, loadItem);
//
//loadItem = "filteredCourses";
//loadFiles(globalLogin, loadItem);
//
//loadItem = "grades";
//loadFiles(globalLogin, loadItem);
//
//loadItem = "courses";
//loadFiles(globalLogin, loadItem);


//let import2 = document.getElementById("importButtonBusy")
//import2.addEventListener('click',()=>{
//    alert ('Глобальный логин: '+globalLogin+' Доступ в систему: '+globalAccess);
//})
