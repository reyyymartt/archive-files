








const dbName = "Files"
console.log(indexedDB.databases())
const request = indexedDB.open(dbName,1)

window.onload = function (){
  console.log(window)
  const newButton = document.getElementById("new")
  newButton.onclick = function (){
    window.location.replace("new.html")
  }
}
const sid = function(){
  return Math.floor(100000000 + Math.random() * 900000000).toString()
}
const starter_files = [
  {
    name: "Whispers of love",
    link: "whispersoflove.html",
    date: new Date(),
    id: sid()
  }
]

request.onsuccess = (event) =>{
  const db = event.target.result
  const filesObject = db.transaction("files","readwrite")
  const files_access = filesObject.objectStore("files")
  const link_list = document.getElementById("link-list")
  const listoffiles = files_access.getAll()
  listoffiles.onsuccess=(event)=>{
    const list = event.target.result
    console.log(list)
    list.forEach((file)=>{
      const div = document.createElement("div")
      const img = document.createElement("img")
      const a = document.createElement("a")
      
      div.className = "item"
      img.className = "file-logo"
      a.className = "link-text"
      
      img.src = "assets/file.png"
      a.value = `https://html-preview.github.io/?url=https://github.com/reyyymartt/projects/blob/main/${file.link}`
      a.onclick = function (){
        localStorage.viewlink = a.value
        localStorage.viewname = file.name
        localStorage.viewid = file.id
        window.location.href="view.html"
      }
      a.innerText = `${file.name}`
      div.appendChild(img)
      div.appendChild(a)
      link_list.appendChild(div)
    })
  }
}
request.onerror = (event) =>{
  console.log("an error occured, data couldn't loaded")
}
request.onupgradeneeded = (event) =>{
  const db = event.target.result
  
  const filesObject = db.createObjectStore("files",{keyPath: "id"})
  filesObject.createIndex("name","name")
  filesObject.createIndex("link","link")
  filesObject.createIndex("date","date")
  filesObject.createIndex("id","id")
  
  filesObject.transaction.oncomplete=(event)=>{
    const files = db.transaction("files","readwrite").objectStore("files")
    starter_files.forEach((file)=>{
      files.add(file)
    })
  }
}

