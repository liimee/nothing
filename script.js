var core = {
  root: document.documentElement,
  openHome: function() {
    document.querySelector('#home').removeAttribute('onclick');
    document.querySelector('#overlay').style.opacity = 0.85;
    document.querySelector('#home').style.transform = 'scale(0, 0)';
    setTimeout(function() {
      $('#home').attr('class', 'bx bx-x');
      document.querySelector('#home').style.transform = 'scale(1, 1)';
      $('#home').attr('onclick', 'core.closeHome();');
    }, 500);
  },
  closeHome: function() {
    document.querySelector('#home').removeAttribute('onclick');
    document.querySelector('#overlay').style.opacity = 0;
    document.querySelector('#home').style.transform = 'scale(0, 0)';
    setTimeout(function() {
      $('#home').attr('class', 'bx bx-circle');
      document.querySelector('#home').style.transform = 'scale(1, 1)';
      $('#home').attr('onclick', 'core.openHome();');
    }, 500);
  }
};

if(localStorage.getItem('wp') === null) {
  localStorage.setItem('wp', 'd-1');
  core.root.style.setProperty('--bg-img', "url('images/wallpaper-1.png')");
} else {
  switch(localStorage.getItem('wp')) {
    case 'd-1':
    core.root.style.setProperty('--bg-img', "url('images/wallpaper-1.png')");
  }
}

if(localStorage.getItem('wprepeat') === null) {
  localStorage.setItem('wprepeat', 'false');
  core.root.style.setProperty('--bg-repeat', 'no-repeat');
} else {
  switch(localStorage.getItem('wprepeat')) {
    case 'false':
    core.root.style.setProperty('--bg-repeat', 'no-repeat');
  }
}

if(localStorage.getItem('dm') === null || localStorage.getItem('dm') == 'false') {
  localStorage.setItem('dm', 'false');
  core.root.style.setProperty('--bar-bg', '#fff');
  core.root.style.setProperty('--text-color', 'black');
} else {
  core.root.style.setProperty('--bar-bg', '#212121');
  core.root.style.setProperty('--text-color', 'white');
}
