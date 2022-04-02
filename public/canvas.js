
let canvas = document.querySelector("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let tool = canvas.getContext("2d");
let mouseDown = false;

let pencilColorCont = document.querySelectorAll(".pencil-color");
let pencilWidthElem = document.querySelector(".pencil-width");
let eraserWidthElem = document.querySelector(".eraser-width");

let download = document.querySelector(".tools-cont").children[2];
let redo = document.querySelector(".redo");
let undo = document.querySelector(".undo");

let pencilColor = "red";
let eraserColor = "white";

let undoRedoTracker = [];
let track = 0;
undoRedoTracker.push(canvas.toDataURL());
let pencilWidth = pencilWidthElem.value;
let eraserWidth = eraserWidthElem.value;

tool.lineWidth = pencilWidth;
tool.strokeStyle = pencilColor;



canvas.addEventListener("mousedown", (e) => {
    mouseDown = true;
    // startPath({
    //     x : e.clientX,
    //     y : e.clientY,
    //     color : eraserFlag ? eraserColor : pencilColor,
    //     width : eraserFlag ? eraserWidth : pencilWidth
    // });
    let data = {
        x : e.clientX,
        y : e.clientY,
        color : eraserFlag ? eraserColor : pencilColor,
        width : eraserFlag ? eraserWidth : pencilWidth
    };
    socket.emit("beginPath", data);
})
canvas.addEventListener("mousemove", (e) =>{
    
    if(mouseDown == true){
        let data = {
            x : e.clientX,
            y : e.clientY,
            color : eraserFlag ? eraserColor : pencilColor,
            width : eraserFlag ? eraserWidth : pencilWidth
        };
        socket.emit("drawLine", data);
    }
})
// canvas.addEventListener("mouseup", (e) =>{
//     mouseDown = false;
//     let url = canvas.toDataURL();
//     undoRedoTracker.push(url);
//     track = undoRedoTracker.length - 1;
// })

function startPath(strokeObj){
    tool.strokeStyle = strokeObj.color;
    tool.lineWidth = strokeObj.width;
    tool.beginPath();
    tool.moveTo(strokeObj.x, strokeObj.y);
}
function drawLine(strokeObj){
    tool.strokeStyle = strokeObj.color;
    tool.lineWidth = strokeObj.width;
    tool.lineTo(strokeObj.x, strokeObj.y);
    tool.stroke();
}

pencilColorCont.forEach((colorElem) =>{
    colorElem.addEventListener("click", (e) =>{
        let color = colorElem.classList[0];
        pencilColor = color;
        tool.strokeStyle = pencilColor;
    })
})

pencilWidthElem.addEventListener("change", (e) =>{
    pencilWidth = pencilWidthElem.value;
    tool.lineWidth = pencilWidth;

})

eraser.addEventListener("click", (e) =>{
    if(eraserFlag){
        tool.strokeStyle = "white";
    }
    else{
        tool.strokeStyle = pencilColor;
    }
})
eraserWidthElem.addEventListener("change", (e) =>{
    eraserWidth = eraserWidthElem.value;
    tool.lineWidth = eraserWidth;
})

download.addEventListener("click", (e) =>{
    let url = canvas.toDataURL();
    let a = document.createElement("a");
    a.href = url;
    a.download = "board.jpg";
    a.click();

})

// redo.addEventListener("click", (e) =>{
//     if(track < undoRedoTracker.length - 1) track++;

//     let trackObj = {
//         trackValue : track,
//         undoRedoTracker
//     }
//     undoRedoCanvas(trackObj);

   
// })

// undo.addEventListener("click", (e) =>{
//     // console.log("in undo");
//     // console.log(undoRedoTracker);
//     // console.log(track);
//     if(track > 0) track--;
//     let trackObj = {
//         trackValue : track,
//         undoRedoTracker
//     }
//     undoRedoCanvas(trackObj);
// })

// function undoRedoCanvas(trackObj) {
//     track = trackObj.trackValue;
//     undoRedoTracker = trackObj.undoRedoTracker;

//     let url = undoRedoTracker[track];
//     let img = new Image(); // new image reference element
//     img.src = url;
//     img.onload = function () {
//         tool.drawImage(img, 0, 0, canvas.width, canvas.height);
//     }
// }




canvas.addEventListener("mouseup", (e) => {
    mouseDown = false;

    let url = canvas.toDataURL();
    undoRedoTracker.push(url);
    track = undoRedoTracker.length - 1;
    console.log("event " + track);
})

undo.addEventListener("click", (e) => {
    if (track > 0) track--;
    // track action
    let data = {
        trackValue: track,
        undoRedoTracker
    }
    socket.emit("undoRedo",data);
    // undoRedoCanvas(data);
})
redo.addEventListener("click", (e) => {
    if (track < undoRedoTracker.length-1) track++;
    // track action
    let data = {
        trackValue: track,
        undoRedoTracker
    }
    socket.emit("undoRedo",data);
    // undoRedoCanvas(data);
})

function undoRedoCanvas(trackObj) {
    track = trackObj.trackValue;
    undoRedoTracker = trackObj.undoRedoTracker;

    let url = undoRedoTracker[track];
    let img = new Image(); // new image reference element
    tool.clearRect(0, 0, canvas.width, canvas.height);
    img.src = url;
    img.onload = (e) => {
        tool.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
}


socket.on("beginPath", (data) =>{
    startPath(data);
})

socket.on("drawLine", (data) =>{
    drawLine(data);
})

socket.on("undoRedo", (data) =>{
    undoRedoCanvas(data);
})