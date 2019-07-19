class AdminPanel extends HTMLElement {
    constructor() {
        super()
        this.shadow = this.attachShadow({mode: "closed"})
        this.shadow.innerHTML = `
        <link rel="stylesheet" href="css/admin.css">
            <section> 

            </section>
        `

    }

    connectedCallback() {
        this.getdata()
    }

    async getdata() {
        this.section = this.shadow.querySelector("section")
        this.games = await (await fetch("https://fea13-sema.glitch.me/games")).json() 
        this.games.forEach(rebus => this.updatePocket(rebus))
    }

    updatePocket(pocket) {
        let elem = this.section.appendChild(
            document.createElement("div")
        )
        let name = elem.appendChild(
            document.createElement("input")
        )
        rebus ? name.value = rebus["pocket-name"] : null
        let image = elem.appendChild(
            document.createElement("img")
        )
        let input = elem.appendChild(
            document.createElement("input")
        )
        input.type = "file"

        image.src = rebus ? rebus["rebus-photo"] : "http://sun9-29.userapi.com/c824201/v824201969/173425/UZNGRozhtic.jpg?ava=1"
        input.onchange = function(event) {
            let file = event.target.files[0]
            let fileReader = new FileReader
            fileReader.onload = function(ev) {
                image.src = ev.target.result
               
            }
            fileReader.readAsDataURL(file)
        }

        name.onchange = function(event) {
           
        }
        let button = elem.appendChild(
            document.createElement("button")
        )
        button.innerHTML = "SAVE IMAGE"
        button.onclick = function (event) {
            console.log(text.value, rebus.id, image.src)
            fetch(`https://fea13-sema.glitch.me/games"/${rebus.id}`, {
                method: rebus ? "PUT" : "POST",
                headers: {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify({
                    "pocket-photo" : image.src,
                    "pocket-name" : text.value
                })
            })
        }
    }
   


}
customElements.define("admin-panel", AdminPanel )
