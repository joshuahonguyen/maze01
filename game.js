var debug = true;
var g_width;
var g_height;

var grid;

var maze01;
var maze02;
var maze03;
function run() {
	init();
	update(5);
}

function init() {
	create_grid(100, 100);
	try {
	maze([2,25], [2,25]);
	}
	finally {
			maze([50,75], [2,25]);
	}
}

function update(speed) {
}

function containsObj(obj, x12, y12) {
	for (var i = x12[0]; i <= x12[1]; i++) {
		for (var j = y12[0]; j <= y12[1]; j++) {
			object = grid.rows[j].cells[i];
			if (object.className == obj) {
				return true;
			}
		}
	}
	return false;
}

function create_grid(width, height) {
	g_width = width;
	g_height = height;
	grid = document.createElement("table");
	grid.id = "game";
	grid.style.borderCollapse = "collapse";
	for (var i = 0; i <= height; i++) {
		var row = grid.insertRow(i);
		for (var j = 0; j <= width; j++) {
			var cell = row.insertCell(j);
			if (j == 0 || j == width || i == 0 || i == height) {
				create_obj("wall", j, i);
			}
			else {
				create_obj("floor", j, i);
			}
		}
	}
	document.body.appendChild(grid);
}

function generate(obj, rangeX, rangeY, params) {
	var notexists = false;
	var x, x1, x2;
	var y, y1, y2;

	if (rangeX[0] != rangeX[1]) {
		x1 = Math.min(rangeX[0], rangeX[1]);
		x2 = Math.max(rangeX[0], rangeX[1]);
	
		x = Math.floor(Math.random() * ((x2) - (x1) + 1) ) + x1;
	}
	else {
		x = rangeX[0];
	}

	if (rangeY[0] != rangeY[1]) {
		y1 = Math.min(rangeY[0], rangeY[1]);
		y2 = Math.max(rangeY[0], rangeY[1]);
	
		y = Math.floor(Math.random() * ((y2) - (y1) + 1) ) + y1;
	}
	else {
		y = rangeY[0];
	}
	var object = grid.rows[y].cells[x];
	if (obj == "entity" && params.includes("person")) {
		if (containsObj("floor", [x1,x2],[y1,y2]) == true) {
			obj = "person";
			while (object.className != "floor") {
				if (rangeX[0] != rangeX[1]) {
					x = Math.floor(Math.random() * ((x2) - (x1) + 1) ) + x1;
				}
	
				if (rangeY[0] != rangeY[1]) {
					y = Math.floor(Math.random() * ((y2) - (y1) + 1) ) + y1;
				}
				object = grid.rows[y].cells[x];
			}
		}
		else if (containsObj("floor", [x1,x2],[y1,y2]) == false) {
			notexists = true;
		}
	}
	else if (obj == "goal") {
		if (containsObj("floor", [x1,x2],[y1,y2]) == true) {
			obj = "goal";
			while (object.className != "floor") {
				if (rangeX[0] != rangeX[1]) {
					x = Math.floor(Math.random() * ((x2) - (x1) + 1) ) + x1;
				}
	
				if (rangeY[0] != rangeY[1]) {
					y = Math.floor(Math.random() * ((y2) - (y1) + 1) ) + y1;
				}
				object = grid.rows[y].cells[x];
			}
		}
		else if (containsObj("floor", [x1,x2],[y1,y2]) == false) {
			notexists = true;
		}

	}
	else if (obj == "entity" && params.includes("ant")) {
		if (!params.includes("secondary")) {
			if (containsObj("unknown", [x1,x2],[y1,y2]) == true) {
				obj = "ant";
				while (object.className != "unknown") {
					if (rangeX[0] != rangeX[1]) {
						x = Math.floor(Math.random() * ((x2) - (x1) + 1) ) + x1;
					}
	
					if (rangeY[0] != rangeY[1]) {
						y = Math.floor(Math.random() * ((y2) - (y1) + 1) ) + y1;
					}
					object = grid.rows[y].cells[x];
				}
			}
			else if (containsObj("unknown", [x1,x2],[y1,y2]) == false) {
				notexists = true;
			}
		}
		
	}
	else if (obj == "entity" && params.includes("building") && params.includes("door")) {
		obj = "door";
		if (!params.includes("nodiag")) {
			if (containsObj("wall", [x1,x2], [y1,y2]) == true) {
				while (object.className != "wall") {
					if (rangeX[0] != rangeX[1]) {
						x = Math.floor(Math.random() * ((x2) - (x1) + 1) ) + x1;
					}
	
					if (rangeY[0] != rangeY[1]) {
						y = Math.floor(Math.random() * ((y2) - (y1) + 1) ) + y1;
					}
					object = grid.rows[y].cells[x];
				}
				if (y == y2) {
					create_obj("known", x, y2-1)
				}

			}
			else {
					notexists = true;
			}
		}
		else {
			if (containsObj("wall", [x1,x2], [y1,y2]) == true) {
				while (object.className != "wall" || (x == x1 && y == y1) || (x == x1 && y == y2)||(x == x2 && y == y1) || (x == x2 && y == y2)) {
					if (rangeX[0] != rangeX[1]) {
						x = Math.floor(Math.random() * ((x2) - (x1) + 1) ) + x1;
					}
		
					if (rangeY[0] != rangeY[1]) {
						y = Math.floor(Math.random() * ((y2) - (y1) + 1) ) + y1;
					}
					object = grid.rows[y].cells[x];
				}
			}
			else {
				notexists = true;
			}
		}
	}
	if (notexists == false) {
		return create_obj(obj, x, y);
	}
	else {
		if (debug) {
			alert("WARNING: could not generate item");
			console.log("WARNING: not able to generate item");
		}
		return false;

	}
}

function create_obj(obj, x, y) {
	var object = grid.rows[y].cells[x];
	object.style.width = "16px";
	object.style.height = "16px";

	if (object.className != "person") {
		if (debug) {
			if (object.className != "" && object.className != "floor") {
				console.log("checkObj:", obj, "replaces", object.className);	
				console.log("x:",x);
				console.log("y:",y);
		
				switch (obj) {
					case "goal":
						if (grid.rows[y+1].cells[x].className == "wall" && grid.rows[y-1].cells[x].className == "wall" && grid.rows[y].cells[x-1].className == "wall" && grid.rows[y].cells[x+1].className == "wall") {
							alert("WARNING: cannot reach goal");
							console.log("WARNING: cannot reach goal");
							console.log("X:",x);
							console.log("Y:",y);
						}
				}
			}
		}

		switch (obj) {
			case "goal":
				object.innerHTML = "!";
				object.className = "entity";
				object.id = "goal";
				break;
			case "wall":
				object.innerHTML = "#";
				object.className = "wall";
				object.id = "";
				break;
			case "floor":
				object.innerHTML = ".";
				object.className = "floor";
				object.id = "";
				break;
			case "person":
				object.innerHTML = "@";
				object.className = "entity";
				object.id = "person";
				return new PERSON([x, y]);
				break;
			case "door":
				object.innerHTML = "|";
				object.className = "entity";
				object.id = "door";
				break;
			case "ant":
				object.innerHTML = "<";
				object.className = "entity";
				object.id = "ant";
				return new ANT([x, y]);
				break;
			case "unknown":
				object.innerHTML = "?";
				object.className = "unknown";
				object.id = "";
				break;
			case "known":
				object.innerHTML = "!";
				object.className = "known";
				object.id = "";
				break;
			case "termite":
				object.innerHTML = ">";
				object.className = "entity";
				object.id = "termite";
				return new TERMITE([x, y]);
				break;
		}
		return [x, y];

	}
	else {
		if (debug) {
			alert("WARNING: cannot replace person");	
			console.log("WARNING:" ,obj, "tried to replace person");
			console.log("X:",x);
			console.log("Y:",y);
		}
	}
}

function rect(type, x1x2, y1y2, material) {
	x1 = Math.min(x1x2[0], x1x2[1]);
	x2 = Math.max(x1x2[0], x1x2[1]);

	y1 = Math.min(y1y2[0], y1y2[1]);
	y2 = Math.max(y1y2[0], y1y2[1]);	


	if (type == "open") {
		for (var i = x1+1; i < x2; i++) {
			create_obj(material, i, y1);
			create_obj(material, i, y2);
		}
		for (var j = y1; j < y2; j++) {
			create_obj(material, x1, j);
			create_obj(material, x2, j);
		}
		create_obj(material, x1, y2);
		create_obj(material, x2, y2);
	}
	else {
		for (var i = y1; i <= y2; i++) {
			for (var j = x1; j <= x2; j++) {
				create_obj(material,j, i);
			}
		}
	}
}

function maze(x12, y12) {
	if (x12[0] != x12[1] || y12[0] != y12[1]) {
		 x1 = Math.min(x12[0], x12[1]);
		 x2 = Math.max(x12[0], x12[1]);

		 y1 = Math.min(y12[0], y12[1]);
		 y2 = Math.max(y12[0], y12[1]);	
		rect("open", [x1,x2], [y1,y2], "wall");
		rect("closed", [x1+1,x2-1], [y1+1, y2-1], "unknown");
		var door = generate("entity", [x1-1,x2+1], [y1-1,y2+1], ["door", "building", "nodiag"]);
		var ant = generate("entity", [x1+1,x2-1], [y1+1,y2-1], ["ant"]);
		try {
		ant.generate();
		}
		finally {
		if (door[1] == y12[1]) {
			var termite = create_obj("termite", door[0], door[1]-1)
		}
		else if (door[1] == y12[0]) {
			var termite = create_obj("termite", door[0], door[1]+1);
		}
		else if (door[0] == x12[0]) {
			var termite = create_obj("termite", door[0]+1, door[1]);
		}
		else if (door[0] == x12[1]) {
			var termite = create_obj("termite", door[0]-1, door[1]);
		}
		termite.generate();
		for (var i = x1; i <= x2; i++) {
			for (var j = y1; j <= y2; j++) {
				if (grid.rows[i].cells[j].className != "floor") {
					create_obj("wall", j, i);	
				}
			}

		}
		var goal = generate("goal", [x1+1,x2-1], [y1+1,y2-1], []);
		var person = generate("entity", [x1+1,x2-1], [y1+1,y2-1], ["person"]);
		}
		
	
	}
	else {
		if (debug) {
			alert("WARNING: cannot create maze");
		}
	}
}

class TERMITE {
	constructor(pos) {
		this.x = pos[0];
		this.y = pos[1];
	}
	generate() {
        create_obj("floor", this.x, this.y);
		
		if (grid.rows[this.y].cells[this.x-1].className == "known" || grid.rows[this.y].cells[this.x-1].id == "ant" || grid.rows[this.y].cells[this.x+1].className == "known" || grid.rows[this.y].cells[this.x+1].id == "ant" || grid.rows[this.y-1].cells[this.x].className == "known" || grid.rows[this.y-1].cells[this.x].id == "ant" || grid.rows[this.y+1].cells[this.x].className == "known" || grid.rows[this.y+1].cells[this.x].id == "ant") {
		if (grid.rows[this.y].cells[this.x-1].className == "known" || grid.rows[this.y].cells[this.x-1].id == "ant") {	
			var termite = create_obj("termite", this.x-1, this.y);
			termite.generate();
		}
		if (grid.rows[this.y].cells[this.x+1].className == "known" || grid.rows[this.y].cells[this.x+1].id == "ant") {
			var termite = create_obj("termite", this.x+1, this.y);
			termite.generate();
		}
		if (grid.rows[this.y-1].cells[this.x].className == "known" || grid.rows[this.y-1].cells[this.x].id == "ant") {
			var termite = create_obj("termite", this.x, this.y-1);	
			termite.generate();
		}
		if (grid.rows[this.y+1].cells[this.x].className == "known" || grid.rows[this.y+1].cells[this.x].id == "ant") {
			var termite = create_obj("termite", this.x, this.y+1);
			termite.generate();
		}
		}
		else {
		if (grid.rows[this.y+1].cells[this.x+1].className == "known" || grid.rows[this.y+1].cells[this.x+1].id == "ant") {
			var termite = create_obj("termite", this.x, this.y+1);
			termite.generate();

		}
		else if (grid.rows[this.y-1].cells[this.x-1].className == "known" || grid.rows[this.y-1].cells[this.x-1].id == "ant") {
			var termite = create_obj("termite", this.x, this.y-1);
			termite.generate();

		}
		else if (grid.rows[this.y+1].cells[this.x-1].className == "known" || grid.rows[this.y-1].cells[this.x-1].id == "ant") {
			var termite = create_obj("termite", this.x-1, this.y);
			termite.generate();

		}
		else if (grid.rows[this.y-1].cells[this.x+1].className == "known" || grid.rows[this.y-1].cells[this.x-1].id == "ant") {
			var termite = create_obj("termite", this.x+1, this.y);
			termite.generate();

		}
		}
		
		


			
	}
}

class ANT {
	constructor(pos) {
		this.x = pos[0];
		this.y = pos[1];
	}
	generate(prevDir) {
		create_obj("known", this.x, this.y);
		
		var cur_x = this.x;
		var cur_y = this.y;	
		var dir = prevDir;
		
		while (dir == prevDir) {
			dir = Math.floor(Math.random() * 4) + 1;
		}

		/*
		if (grid.rows[cur_y+1].cells[cur_x].id == "door") {
		var termite = create_obj("termite", cur_x, cur_y);
			return termite.generate();
		}
		else if (grid.rows[cur_y-1].cells[cur_x].id == "door") {
		var termite = create_obj("termite", cur_x, cur_y);
			return termite.generate();
		}
		else if (grid.rows[cur_y].cells[cur_x+1].id == "door") {
		var termite = create_obj("termite", cur_x, cur_y);
			return termite.generate();
		}
		else if (grid.rows[cur_y].cells[cur_x-1].id == "door") {
		var termite = create_obj("termite", cur_x, cur_y);
			return termite.generate();
		}
		*/

		switch (dir) {
			case 1:
				cur_x += 1;
				var cur_dir = "right";
				break;
			case 2:
				cur_y += 1;
				var cur_dir = "down";
				break;
			case 3:
				cur_x -= 1;
				var cur_dir = "left";
				break;
			case 4:
				cur_y -= 1;
				var cur_dir = "up";
				break;
		}
		
		/*
		if (grid.rows[cur_y+1].cells[cur_x].id == "door") {
		var termite = create_obj("termite", cur_x, cur_y);
			return termite.generate();
		}
		else if (grid.rows[cur_y-1].cells[cur_x].id == "door") {
		var termite = create_obj("termite", cur_x, cur_y);
			return termite.generate();
		}
		else if (grid.rows[cur_y].cells[cur_x+1].id == "door") {
		var termite = create_obj("termite", cur_x, cur_y);
			return termite.generate();
		}
		else if (grid.rows[cur_y].cells[cur_x-1].id == "door") {
		var termite = create_obj("termite", cur_x, cur_y);
			return termite.generate();
		}
		*/

		if (cur_dir == "left") {
			if (grid.rows[cur_y].cells[cur_x-1].className == "unknown") {
				create_obj("known", cur_x, cur_y);
				var ant = create_obj("ant", cur_x-1, cur_y);
				return ant.generate(dir);
			}
			else if (grid.rows[cur_y].cells[cur_x-1].className == "known") {
				var ant = create_obj("ant", cur_x-1, cur_y);
				return ant.generate(dir);
			}
			else if (grid.rows[cur_y].cells[cur_x-1].className == "wall") {
				
				var ant = create_obj("ant", cur_x+1, cur_y);
				return ant.generate(dir);	
			}
		}
		else if (cur_dir == "right") {
			if (grid.rows[cur_y].cells[cur_x+1].className == "unknown") {
				create_obj("known", cur_x, cur_y);
				var ant = create_obj("ant", cur_x+1, cur_y);
				return ant.generate(dir);
			}
			else if (grid.rows[cur_y].cells[cur_x+1].className == "known") {
				var ant = create_obj("ant", cur_x+1, cur_y);
				return ant.generate(dir);

			}	
			else if (grid.rows[cur_y].cells[cur_x+1].className == "wall") {
				var ant = create_obj("ant", cur_x-1, cur_y);
				return ant.generate(dir);	

			}
		}
		else if (cur_dir == "up") {
			if (grid.rows[cur_y-1].cells[cur_x].className == "unknown") {
				create_obj("known", cur_x, cur_y);
				var ant = create_obj("ant", cur_x, cur_y-1);	
				return ant.generate(dir);
			}
			else if (grid.rows[cur_y-1].cells[cur_x].className == "known") {
				var ant = create_obj("ant", cur_x, cur_y-1);
				return ant.generate(dir);
			}
			else if (grid.rows[cur_y-1].cells[cur_x].className == "wall") {
			var ant = create_obj("ant", cur_x, cur_y+1);
				return ant.generate(dir);	

			}
		}
		else if (cur_dir == "down") {
			if (grid.rows[cur_y+1].cells[cur_x].className == "unknown") {
				create_obj("known", cur_x, cur_y);
				var ant = create_obj("ant", cur_x, cur_y+1);
				
				return ant.generate(dir);
			}
			else if (grid.rows[cur_y+1].cells[cur_x].className == "known") {
				var ant = create_obj("ant", cur_x, cur_y+1);
				return ant.generate(dir);

			}
			else if (grid.rows[cur_y+1].cells[cur_x].className == "wall") {
				var ant = create_obj("ant", cur_x, cur_y-1);
				return ant.generate(dir);	
			}
		}
			var ant = create_obj("ant", this.x, this.y);
				return ant.generate(dir);	
	}
}

class PERSON {
	constructor(pos) {
		this.x = pos[0];
		this.y = pos[1];
	}
	find(goal){
		
	}

}

//if goal achieved
run();
