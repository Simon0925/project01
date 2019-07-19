class Rebus extends HTMLElement {
    constructor() {
        super()
        this.shadow = this.attachShadow({ mode: "closed" })


    }

    connectedCallback() {

    }
    static get observedAttributes() {
        return ["markup", "css"]
    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        fetch(newVal).then(response => response.text())
            .then(response => {

                if (attrName === "markup") {

                    let styles = this.shadow.innerHTML.split("<style>").length === 1 ?
                        "" : this.shadow.innerHTML.split("<style>")[1].split("</style>")[0]

                    this.shadow.innerHTML = response + `<style> ${styles} </style>`;

                }
                if (attrName === "css") {
                    let html = this.shadow.innerHTML.split("<style>")

                    let end = html.length === 1 ? "" : html[1].split("</style>")[1]
                    this.shadow.innerHTML = html[0] + `<style> ${response}</style>` + end
                }
            })
            .then(() => this.getData())
    }


    getData() {
        this.currentQuestion = 0
        this.image = this.shadow.querySelector("#image");
        this.input = this.shadow.querySelector("#inputext")
        this.buttons = this.shadow.querySelector("#variant2")
        this.checkButton = this.shadow.querySelector("#check")
        this.closeButton = this.shadow.querySelector("#myBtn");

        //  fetch(`https://fea13-sema.glitch.me/games/${this.getAttribute("currentQuestion")}`)
        fetch("https://fea13-sema.glitch.me/games")

            // fetch(`https://fea13-sema.glitch.me/games/${currentQwestion}`)
            .then(response => response.json())
            .then(response => {
                // console.log(response[currentQuestion]);
                showQuestion(response[this.currentQuestion]);
                // this.checkButton.addEventListener("click", event => {
                //     checkResult(response);
                // });
                // document.addEventListener("keypress", event => {
                //     if (event.key == "Enter") {
                //         checkResult(response);
                //     }
                // });
            });

            this.checkButton.onclick = function(event) {
                
                checkResult(this.input.value);
            }.bind(this)
            document.addEventListener("keypress", event => {
                
                if (event.key == "Enter") {
                    checkResult(this.input.value);
                }
            });

        let showQuestion = function ({ img, text }) {
            this.answer = text
            this.image.innerHTML = `<img alt="tip" src="${img}"></img>`;
            this.input.value = '';
            const letters = this.prepareButtons(text);

            this.buttons.innerHTML = "";
            letters.forEach(letter => {
                const btn = document.createElement("button");
                btn.textContent = letter.toLowerCase();
                this.buttons.appendChild(btn);
                btn.classList.add('words');
                var variants = this.shadow.querySelectorAll('.words');
                console.log(variants)
                for (let i = 0; i < variants.length; i++) {
                    variants[i].onclick = function () {

                        console.log(this.input);
                        this.input.value += variants[i].innerText;
                        variants[i].style.display = 'none';
                    }.bind(this)
                }

            });
        }.bind(this)
        let checkResult = function (gameData) {
          
            let inputdata = this.input.value.replace(/\s/g, '');

            if (inputdata !== this.answer) {
                alert("Думай");
                return;
            }

            if (this.currentQuestion >= 1) {
                this.shadow.querySelector(".foto").innerHTML = '<h1>Все ребусы успешно отгаданы, молодец!</h1>';
                return;
            }
            this.currentQuestion += 1;
            
            fetch("https://fea13-sema.glitch.me/games")
                .then(response => response.json())
                    .then(response => {
                       showQuestion(response[this.currentQuestion]);
                    });
            }.bind(this)
            this.closeBut = function() {
                this.style.display = "none";
              }.bind(this)
              this.closeButton.onclick = function (event) {
                this.closeBut()
              }.bind(this)

    };




    prepareButtons(text) {
        
        const letters = text.split("");
        letters.forEach(function (item, index, arr) {
            let randomNumber = num => Math.round(Math.random() * num);
            arr.push(String.fromCharCode(1040 + randomNumber(63)));
            let num = Math.round(Math.random() * (arr.length - 1));
            [arr[index], arr[num]] = [arr[num], arr[index]];
        });

        return letters;
    }


}
customElements.define("rebus-game", Rebus)