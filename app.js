function saveUser(){
  const name = document.getElementById('user-name').value;
  let phone = document.getElementById('user-phone').value;

  if(!name || !phone){
    alert("תמלא שם וטלפון");
    return;
  }

  phone = phone.replace(/^0/, '972');

  localStorage.setItem("userName", name);
  localStorage.setItem("userPhone", phone);

  document.getElementById("login-box").style.display = "none";
}

window.onload = function(){
  const phone = localStorage.getItem("userPhone");

  if(phone){
    const box = document.getElementById("login-box");
    if(box) box.style.display = "none";
  }
}
