class SingIn extends HTMLElement {
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
          console.log(response);
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
        .then(() => this.getElems())
    }
  
    getElems() {
      this.userEmail = this.shadow.querySelector("#input-email")
      this.userPassword = this.shadow.querySelector("#input-password")
      this.openRegisterPage = this.shadow.querySelector("#open-register-button")
      this.closeButton = this.shadow.querySelector("#myBtn");
      this.singInBotton = this.shadow.querySelector("#sing-in-botton")
      this.errorSpace = this.shadow.querySelector("#error")
      this.singInBotton.disabled = true
      
      
  console.log(
    this.userEmail, this.userPassword,
    this.openRegisterPage, this.closeButton,this.singInBotton
  )
  this.closeBut = function() {
    this.style.display = "none";
  }.bind(this)
  this.closeButton.onclick = function (event) {
    this.closeBut()
  }.bind(this)


  this.userPassword.onchange = function (event) {
    document.cookie = `hash=${Sha256.hash(event.target.value)}`
    event.target.valid = event.target.value.length >= 8
    if (this.userPassword.valid && this.userEmail.valid){
        this.singInBotton.disabled = false
        
    }
}.bind(this)

this.userEmail.onchange = function (event) {
    event.target.valid = event.target.value.length >= 5 && event.target.value.indexOf("@") > 0
    if (this.userPassword.valid && this.userEmail.valid){
        this.singInBotton.disabled = false
        
    }
}.bind(this)



this.singInBotton.onclick = function (event) {
    let email = this.userEmail.value
    let pass = Sha256.hash(this.userPassword.value)
    let err = this.errorSpace
    let closer = this.closeBut.bind(this)
    async function checker(email, pass, closer) {
        let response = await fetch("https://curasa.glitch.me/users")
        let arrayOfObj = await response.json()
        let currentUser = arrayOfObj.find( function(user) { 
            return user.email === email})
        if (currentUser) {
            if(currentUser.userPassword === `hash=${pass}`) {
                document.cookie =`userId=${currentUser.id}`
                err.innerHTML = ""
                closer()
                document.getElementById("sin").style.display = "none"
                
                document.getElementById("out").style.display = "inline"
            }
            else {
                err.innerHTML = "Wrong password"
            }
        }
        else {
            err.innerHTML = "Wrong email"
        }
    }
    checker(email, pass, closer)
}.bind(this)

  
      
this.openRegisterPage.onclick = function (event) {
           
  let regpage = document.body.appendChild(document.createElement("register-page"));
  regpage.setAttribute("markup", "../chanks/Registration.html");
  regpage.setAttribute("css", "../css/Registration.css");
  
     
    this.style.display = "none";
    
      
}.bind(this);

  
        
  
    }
  
  }
  customElements.define("signin-page", SingIn)
  