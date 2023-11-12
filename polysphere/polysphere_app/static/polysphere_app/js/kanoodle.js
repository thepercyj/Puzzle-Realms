(function ($, $$) {
  try {
    let mousePaintState;

    document.registerElement("puzzle-board-cell", {
      prototype: Object.create(HTMLElement.prototype, {
        state: {
          get: function () {return this.getAttribute("state");},
          set: function (value) {this.setAttribute("state", value);} },

        bkgd: {
          get: function () {return this.getAttribute("bkgd");},
          set: function (value) {this.setAttribute("bkgd", value);} },

        number: {
          get: function () {return this.getAttribute("number");},
          set: function (value) {this.setAttribute("number", value);} },

        createdCallback: {
          value: function () {
            let cont = this.appendChild(document.createElement("div"));
            cont.classList.add("cell-ink-container");
            this.inkContainer = cont.appendChild(document.createElement("div"));
            this.inkContainer.classList.add("cell-ink-static");

            this.numberEl = this.appendChild(document.createElement("div"));
            this.numberEl.classList.add("cell-number");

            this.hl = this.appendChild(document.createElement("div"));
            this.hl.classList.add("cell-highlight");

            this.setAttribute("state", 0);
            this.setAttribute("number", undefined);

            this.addEventListener("mousedown", e => {
              e.preventDefault();

              let state;
              if (e.button === 0 && e.buttons === 1) state = 1;else
              if (e.button === 2 && e.buttons === 2) state = 2;else
              return;

              mousePaintState = this.state = parseInt(this.state) === state ? 0 : state;
            });

            this.addEventListener("mousemove", e => {
              if (!(e.buttons === 1 || e.buttons === 2)) return;

              let hit = document.elementFromPoint(e.clientX, e.clientY);

              do {if (window.CP.shouldStopExecution(0)) break;
                if (hit.matches("puzzle-board-cell")) {
                  hit.state = mousePaintState;
                  break;
                }
              } while (hit = hit.parentNode);window.CP.exitedLoop(0);
            });

            this.addEventListener("mouseup", e => {
              e.preventDefault();
            });

            this.addEventListener("touchstart", e => {
              e.preventDefault();
              //this.classList.add("active");

              this.paintState = this.state = (parseInt(this.state) + 1) % 3;
            });

            this.addEventListener("touchmove", e => {
              for (let i = 0; i < e.changedTouches.length; i++) {if (window.CP.shouldStopExecution(1)) break;
                let touch = e.changedTouches[i],
                hit = document.elementFromPoint(touch.clientX, touch.clientY);

                do {if (window.CP.shouldStopExecution(2)) break;
                  if (hit.matches("puzzle-board-cell")) {
                    hit.state = this.paintState;
                    break;
                  }
                } while (hit = hit.parentNode);window.CP.exitedLoop(2);
              }window.CP.exitedLoop(1);
            });

            this.addEventListener("touchend", e => {
              e.preventDefault();
              //this.classList.remove("active");
            });

            //this.addEventListener("click", e => {
            //this.classList.toggle("checked");
            //});
          } },

        attributeChangedCallback: {
          value: function (name, from, to) {
            switch (name) {
              case "state":
                if (from == null) break;
                if (this.hasAttribute("number")) {
                  this.removeAttribute("state");
                }
                let ink = this.inkContainer.appendChild(document.createElement("div"));
                ink.classList.add("cell-ink");
                ink.dataset["bkgd"] = this.state;

                ink.addEventListener("animationend", e => {
                  this.bkgd = e.target.dataset["bkgd"];
                  this.inkContainer.removeChild(e.target);
                });

                break;
              case "number":
                if (to == null || isNaN(to) || to < 0) {
                  this.removeAttribute("number");
                  break;
                }

                this.numberEl.innerText = to;

                break;}

          } } }) });


            class PuzzleBoard extends HTMLElement {
            constructor() {
                super();
                this.rows = [];
                this.cells = [];
                this.createBoard();
            }

            createBoard() {
                for (let r = 0; r < 7; r++) {
                    let rowEl = document.createElement("div");
                    rowEl.classList.add("puzzle-board-row");
                    this.appendChild(rowEl);
                    this.rows.push(rowEl);

                    let rowArr = [];
                    this.cells.push(rowArr);

                    for (let c = 0; c < 7; c++) {
                        let cellEl = document.createElement("div");
                        cellEl.classList.add("puzzle-board-cell");
                        rowEl.appendChild(cellEl);
                        rowArr.push(cellEl);

                        // Add your additional cell setup here
                    }
                }
            }
        }

        customElements.define('puzzle-board', PuzzleBoard);

//    document.registerElement("puzzle-board", {
//      prototype: Object.create(HTMLElement.prototype, {
//        createdCallback: {
//          value: function () {
//            this.rows = [];
//            this.cells = [];
//            for (let r = 0; r < 7; r++) {if (window.CP.shouldStopExecution(3)) break;
//              let rowEl = this.appendChild(document.createElement("div"));
//              this.rows.push(rowEl);
//              rowEl.classList.add("puzzle-board-row");
//
//              let rowArr = [];
//              this.cells.push(rowArr);
//
//              for (let c = 0; c < 7; c++) {if (window.CP.shouldStopExecution(4)) break;
//                let cellEl = rowEl.appendChild(document.createElement("puzzle-board-cell"));
//                rowArr.push(cellEl);
//
//                //if (r == 0 && c == 0) cellEl.number = 1;
//
//                //cellEl.addEventListener("touchend", (e) => {
//                //e.preventDefault();
//                //});
//
//                //cellEl.addEventListener("click", (e) => {
//                //cellEl.classList.toggle("checked");
//                //});
//              }window.CP.exitedLoop(4);
//            }window.CP.exitedLoop(3);
//          } } }) });




    window.addEventListener("contextmenu", e => {
      e.preventDefault();

      return false;
    });
  } catch (e) {
    document.write(e);
  }
})(document.querySelector.bind(document),
document.querySelectorAll.bind(document));