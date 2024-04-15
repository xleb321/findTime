const params = {
    globalLogin: "oleg",
    item: "users"
}

document.getElementById("btn").addEventListener("click", async () => {
    const json = await (await loadData(params, '../php/loadJSON.php', 'POST')).json()    
    document.getElementById('text').innerHTML = `<pre>${JSON.stringify(json, null, 2)}</pre>`
    alert("Data has been delivered")
})

//const json = await (await loadData(params, '../php/loadJSON.php', 'POST')).json()    
//alert("22")

async function loadData(parameters=null, url, method) {
    let params

    if(parameters){
        params = new URLSearchParams()
        params.set('login', parameters.globalLogin)
        params.set('item', parameters.item)
    }

    const res = await fetch(url, {
        method: method,
        body: params
    })

    return res
}
