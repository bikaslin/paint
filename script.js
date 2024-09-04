const canvas = document.getElementById("paintCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth - 40; // Adjust width according to the window size.
canvas.height = window.innerHeight - 150; // Adjust height for the toolbar.

let painting = false;
let undoStack = [];
let redoStack = [];

// Brush settings
let brushSize = document.getElementById("brushSize").value;
let brushColor = document.getElementById("colorPicker").value;
let isEraser = false;

// Start drawing
canvas.addEventListener("mousedown", (event) => {
	painting = true;
	ctx.lineWidth = brushSize;
	ctx.strokeStyle = isEraser ? "#ffffff" : brushColor; // Use white for eraser
	ctx.beginPath();
	ctx.moveTo(
		event.clientX - canvas.offsetLeft,
		event.clientY - canvas.offsetTop
	);
});

// Drawing on canvas
canvas.addEventListener("mousemove", (event) => {
	if (painting === true) {
		ctx.lineTo(
			event.clientX - canvas.offsetLeft,
			event.clientY - canvas.offsetTop
		);
		ctx.stroke();
	}
});

// Stop drawing
canvas.addEventListener("mouseup", () => {
	painting = false;
	ctx.closePath();
	addToUndoStack();
});

// Clear canvas
document.getElementById("clearBtn").addEventListener("click", () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	undoStack = [];
	redoStack = [];
});

// Undo function
document.getElementById("undoBtn").addEventListener("click", () => {
	if (undoStack.length > 0) {
		redoStack.push(undoStack.pop());
		redraw();
	}
});

// Redo function
document.getElementById("redoBtn").addEventListener("click", () => {
	if (redoStack.length > 0) {
		undoStack.push(redoStack.pop());
		redraw();
	}
});

// Eraser and pencil buttons
document.getElementById("eraserBtn").addEventListener("click", () => {
	isEraser = true;
});

document.getElementById("pencilBtn").addEventListener("click", () => {
	isEraser = false;
});

// Color picker
document.getElementById("colorPicker").addEventListener("input", (event) => {
	brushColor = event.target.value;
	if (!isEraser) {
		// Make sure the color is updated only if the pencil is selected
		ctx.strokeStyle = brushColor;
	}
});

// Brush size range
document.getElementById("brushSize").addEventListener("input", (event) => {
	brushSize = event.target.value;
});

// Add current state to the undo stack
function addToUndoStack() {
	undoStack.push(canvas.toDataURL());
	redoStack = []; // Clear redo stack on new action
}

// Redraw function to restore canvas
function redraw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	const img = new Image();
	img.src = undoStack[undoStack.length - 1]; // Get the last image state
	img.onload = () => {
		ctx.drawImage(img, 0, 0);
	};
}

// Ensure the canvas resizes with the window
window.addEventListener("resize", () => {
	canvas.width = window.innerWidth - 40;
	canvas.height = window.innerHeight - 150;
	redraw();
});
