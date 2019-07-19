import(`js/sing_in.js`)
import(`js/rebus.js`)

function getCookie() {
  let id
  let pass
      if(document.cookie !== ""){
          if(document.cookie.split("; ").find(x => x.indexOf("userId") === 0) !== "" &&
              document.cookie.split("; ").find(x => x.indexOf("hash") === 0) !== "") {
                  id = document.cookie.split("; ").find(x => x.indexOf("userId") === 0).split("=")[1]
                  pass = document.cookie.split("; ").find(x => x.indexOf("hash") === 0).split("=")[1]
                  checker(id, pass)
          }
          async function checker(id, pass) {
              let response = await fetch(`https://curasa.glitch.me/users/${id}`)
              let user = await response.json()
                  if (user.userPassword === `hash=${pass}`) {
                      document.getElementById("sin").style.display = "none"
                      document.getElementById("out").style.display = "inline"
                      
                  }
            }  
      }   
}

getCookie()

const regBtn = document.getElementById('regBtn');
console.log(regBtn)
regBtn.onclick = function (event) {
  let regpage = document.body.appendChild(document.createElement("register-page"));
  regpage.setAttribute("markup", "chanks/Registration.html");
  regpage.setAttribute("css", "css/Registration.css");
  
}

// const rebusGame = document.getElementById('rebus');
// let gameR = document.createElement("rebus-game");
// gameR.setAttribute("markup", "../chanks/rebus.html");
// document.body.appendChild(gameR)
// fetch("https://fea13-sema.glitch.me/games")
//   .then(response => response.json())
//   .then(response => {
//     response.forEach(
//     (game,index) => gameR.setAttribute("currentQuestion", index);
//   ))
// rebusGame.onclick = function (event){
  
  
  
// }



const rebusGame = document.getElementById('rebus');
console.log(rebusGame)
rebusGame.onclick = function (event){
  let gameR = document.createElement("rebus-game");
  gameR.setAttribute("markup", "chanks/rebus.html");
  gameR.setAttribute("css", "chanks/rebus.css");
  document.body.appendChild(gameR)
}






const signIn = document.getElementById('signIn');
console.log(signIn)
 signIn.onclick = function (event) {
  let regpage2 = document.createElement("signin-page");

  regpage2.setAttribute("markup", "chanks/Sign_in.html");
  regpage2.setAttribute("css", "css/Sign_in.css");
  document.body.appendChild(regpage2)
  
}

const rebus = document.getElementById(`regBtn`);





// const ava = document.body.appendChild(new Image(150));
let userId = document.cookie.split('; ')
    .filter(item => item.indexOf('userId') === 0)[0];
userId = userId ? userId.split('=')[1] : null
let currentUser = null;

userId
  ? fetch(`https://curasa.glitch.me/users/${userId}`)
    .then(response => response.json())
    .then(user => currentUser = user)
    // .then(() => ava.src = currentUser.avatar)
  : null
