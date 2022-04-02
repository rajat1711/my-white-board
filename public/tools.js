let optionCont = document.querySelector(".option-cont");
let toolsCont = document.querySelector(".tools-cont");
let pencilToolCont = document.querySelector(".pencil-tool-cont");
let eraserToolCont = document.querySelector(".eraser-tool-cont");
let pencil = document.querySelector(".tools-cont").children[0];
let eraser = document.querySelector(".tools-cont").children[1];
let upload = document.querySelector(".tools-cont").children[5];
let sticky = document.querySelector(".tools-cont").children[6];
let optionFlag = true;
let pencilFlag = false;
let eraserFlag = false;
optionCont.addEventListener("click", (e) =>{
    optionFlag = !optionFlag;
    if(optionFlag){
        openTools();    
    }
    else{
        closeTools();
    }

})


function openTools(){
    let img = optionCont.children[0];
    img.classList.remove("fa-xmark");
    img.classList.add("fa-bars");
    img.style.fontSize = "2rem";
    toolsCont.style.display = "flex";
}

function closeTools(){
    let img = optionCont.children[0];
    img.classList.remove("fa-bars");
    img.classList.add("fa-xmark");
    img.style.fontSize = "2.5rem";
    toolsCont.style.display = "none";
    pencilToolCont.style.display= "none";
    eraserToolCont.style.display= "none";
}


pencil.addEventListener("click", (e) =>{
    pencilFlag = !pencilFlag;

    if(pencilFlag) pencilToolCont.style.display = "block";
    else pencilToolCont.style.display = "none";
})
eraser.addEventListener("click", (e) =>{
    eraserFlag = !eraserFlag;

    if(eraserFlag) eraserToolCont.style.display = "flex";
    else eraserToolCont.style.display = "none";
})

sticky.addEventListener("click", (e) =>{
    let stickyTemplateHTML = `
    <div class="header-cont">
        <div class="minimise"></div>
        <div class="remove"></div>
    </div>
    <div class="note-cont">
        <textarea spellcheck="false"></textarea>
    </div>`;
    createStickyNote(stickyTemplateHTML);
})

function noteActions(minimise, remove, stickyCont){
    remove.addEventListener("click", (e) =>{
        stickyCont.remove();
    })
    minimise.addEventListener("click", (e) => {
        let noteCont = stickyCont.querySelector(".note-cont");
        let display = getComputedStyle(noteCont).getPropertyValue("display");
        if(display === "none"){
            noteCont.style.display = "block";
        }
        else{
            noteCont.style.display = "none";
        }
    })
}
upload.addEventListener("click", (e) =>{
    let input = document.createElement("input");
    input.setAttribute("type", "file");
    input.click();
    input.addEventListener("change", (e) =>{
        let file = input.files[0];
        let url = URL.createObjectURL(file);
        let stickyTemplateHTML = `
        <div class="header-cont">
            <div class="minimise"></div>
            <div class="remove"></div>
        </div>
        <div class="note-cont">
            <img src="${url}"/>
        </div>`
        createStickyNote(stickyTemplateHTML);
    })

})
function dragAndDrop(stickyCont){
    stickyCont.onmousedown = function(event) {

        let shiftX = event.clientX - stickyCont.getBoundingClientRect().left;
        let shiftY = event.clientY - stickyCont.getBoundingClientRect().top;
      
        stickyCont.style.position = 'absolute';
        stickyCont.style.zIndex = 1000;
      
        moveAt(event.pageX, event.pageY);
      
        // moves the stickyCont at (pageX, pageY) coordinates
        // taking initial shifts into account
        function moveAt(pageX, pageY) {
          stickyCont.style.left = pageX - shiftX + 'px';
          stickyCont.style.top = pageY - shiftY + 'px';
        }
      
        function onMouseMove(event) {
          moveAt(event.pageX, event.pageY);
        }
      
        // move the stickyCont on mousemove
        document.addEventListener('mousemove', onMouseMove);
      
        // drop the stickyCont, remove unneeded handlers
        stickyCont.onmouseup = function() {
          document.removeEventListener('mousemove', onMouseMove);
          stickyCont.onmouseup = null;
        };
      
      };
      
      stickyCont.ondragstart = function() {
        return false;
      };
}

function createStickyNote(stickyTemplateHTML){
    let stickyCont = document.createElement("div");
        stickyCont.setAttribute("class", "sticky-cont");
        stickyCont.innerHTML = stickyTemplateHTML;
            document.body.appendChild(stickyCont);
            let minimise = stickyCont.querySelector(".minimise");
            let remove = stickyCont.querySelector(".remove");
            noteActions(minimise, remove, stickyCont);
            dragAndDrop(stickyCont);
}


