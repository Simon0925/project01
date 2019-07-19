class RegisterPage extends HTMLElement {
    constructor() {
      super()
      this.shadow = this.attachShadow({ mode: "closed" })
  
    }
  
    connectedCallback() {
      // alert('uvaga');
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
        .then(() => this.getElems())
    }
  
    getElems() {
      this.userName = this.shadow.querySelector("#name")
      this.userEmail = this.shadow.querySelector("#input-email")
      this.userEmail.disabled = true
      this.userPhone = this.shadow.querySelector("#phone")
      this.userPhone.disabled = true
      this.userPassword = this.shadow.querySelector("#input-password")
      this.userPassword.disabled = true
      this.checkPassword = this.shadow.querySelector("#input-password2")
      this.checkPassword.disabled = true
      this.userPhoto = this.shadow.querySelector("#avatarka")
      this.errorSpace = this.shadow.querySelector("#error")
      this.registrationBtn = this.shadow.querySelector("#register-button")
      this.registrationBtn.disabled = true
      this.registrationBtn.innerHTML = "Fill all inputs"
      

      this.preview = this.shadow.querySelector("#preview")
      this.closeButton = this.shadow.querySelector("#myBtn");
      
  console.log(
    this.userName,this.userEmail, this.userPhone,  this.userPassword,
    this.userPhoto, this.registrationBtn, this.preview, this.closeButton ,
  )
  

  this.userName.onchange = function (event) {
    event.target.valid = event.target.value.length >= 2
   if(event.target.valid) {
    this.errorSpace.innerHTML = ""
    this.userEmail.disabled = false
    this.userPhone.disabled = false
   }
   else {
    this.errorSpace.innerHTML = "Enter correct name!"
    this.userEmail.disabled = true
    this.userPhone.disabled = true
   }
}.bind(this)

this.userEmail.onchange = function (event) {
  let err = this.errorSpace
  let check = event.target.value
  let pas1 = this.userPassword
  let pas2 = this.checkPassword
  let emInp = this.userEmail
  async function letCheck (pas1, pas2, check ) {
      let response = await fetch("https://curasa.glitch.me/users");
      let data = await response.json();
      let isReg = data.some(obj => obj.email === check)
      let vali = !isReg
      if (vali && check.indexOf("@") > 0) { 
          err.innerHTML = ""
          emInp.style.color = "green"
          pas1.disabled = false
          pas2.disabled = false
      }
      if (check.indexOf("@") < 0){
          err.innerHTML = "Enter correct email!"
          emInp.style.color = "red"
          pas1.disabled = true
          pas2.disabled = true
      }
      if (!vali) {
           err.innerHTML = "Your email is busy!"
           emInp.style.color = "red"
           pas1.disabled = true
           pas2.disabled = true
          }
      }
  letCheck(pas1, pas2, check)
}.bind(this)


this.userPassword.oninput = function ( event ) {
  let pass = event.target.value
  event.target.valid = pass.length > 8 && !!pass.match ( /\d/ ) && !!pass.match ( /\D/ )
  event.target.style.color = event.target.valid ? "green" : "red"
  this.checkPassword.disabled = !event.target.valid
}.bind(this)



this.checkPassword.oninput = function ( event ) {
  event.target.valid = event.target.value === this.userPassword.value
  event.target.style.color = event.target.valid ? "green" : "red"
  if(this.userPhone.valid && this.checkPassword.valid &&
      this.userEmail.valid && this.userName.valid) {
      this.registrationBtn.disabled = false
      this.registrationBtn.style.background = "red"
      this.registrationBtn.innerHTML = "Add photo"
 }
 else {
     this.registrationBtn.disabled = false               
 }
  var passSha = Sha256.hash(event.target.value)
  return passSha
}.bind(this)




this.userPhone.onchange = function(event) {
  event.target.valid = event.target.value.length >= 10
  if (event.target.valid) {
      this.errorSpace.innerHTML = ""
      this.userPassword.disabled = false
      this.checkPassword.disabled = false
  } 
  else {
      this.errorSpace.innerHTML = "Enter correct number!"
      this.userPassword.disabled = true
      this.checkPassword.disabled = true
  }
}.bind(this)



 
this.userPhoto.onchange = function ( event ) {
  this.preview.style.display = "none"
  let photo = event.target.files[0] ? event.target.files[0] : null
  if ( photo.type.indexOf( "image" ) === -1 ) {
      this.errorSpace.innerHTML = "Wrong type of file!"
      this.preview.style.display = "none"
      this.userPhoto.valid = false
  } 
  if (photo.type.indexOf ( "image" ) === 0 && photo.size > 500000 ) {
      this.errorSpace.innerHTML = "Image size is too big!"
      this.preview.style.display = "none"
      this.userPhoto.valid = false
  }
  if (photo.type.indexOf ( "image" ) === 0 && photo.size <= 500000 ) {
      this.errorSpace.innerHTML = ""
      let picture = URL.createObjectURL ( photo )
      this.preview.style.display = "block"
      this.preview.src = picture
      this.userPhoto.valid = true
      if(this.userPhone.valid && this.checkPassword.valid &&
          this.userPhoto.valid && this.userName.valid) {
         this.registrationBtn.disabled = false
         this.registrationBtn.style.background = "#4c4c4c"
         this.registrationBtn.innerHTML = "Register!"
     }
     else {
         this.registrationBtn.disabled = false               
     }
  }}.bind(this)



      
        
        
  
  
         this.closeButton.onclick = function closeWindow (event) {
          this.style.display = "none";
          
        }.bind(this)
  
  
  
  
  
      this.registrationBtn.onclick = function (event) {
        this.registrationBtn.remove()
        fetch("https://curasa.glitch.me/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: this.userName.value,
            email: this.userEmail.value,
            phone: this.userPhone.value,
            avatar: this.preview.src,
            userPassword: `hash=${Sha256.hash(this.userPassword.value)}`
        })
        }).then(
        response => response.json())
            .then(response => document.cookie =`userId=${response.id}; hash=${response.userPassword}`)
            this.style.display = "none";
    }.bind(this)
        
            
  
        
  
    }
  
  }
  customElements.define("register-page", RegisterPage)


