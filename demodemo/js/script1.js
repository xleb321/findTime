const params = {
    login: "222222",
    password: "222222",
	action:'login'
}

document.getElementById("btn").addEventListener("click", async () => {
	sessionStorage.setItem("work","yes")
    const json = await (await loadDataEnter(params, '../php/enter4.php', 'POST')).json()  
	
    sessionStorage.setItem('globalLogin', json["login"] )
	sessionStorage.setItem('globalAccess', json["access"] )
	sessionStorage.setItem('expiredDate', json["expiredDate"] )
	alert (json["login"])
})

async function loadDataEnter(parameters=null, url, method) {
    let params

    if(parameters){
        params = new URLSearchParams()
        params.set('login', parameters.login)
        params.set('password', parameters.password)
		params.set('action', parameters.action)
    }

    const res = await fetch(url, {
        method: method,
        body: params
    })

    return res
}
