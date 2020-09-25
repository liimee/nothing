var core = {
  root: document.documentElement,
  openHome: function() {
    document.querySelector('#overlay').style.display = 'block';
    document.querySelector('#home').removeAttribute('onclick');
    document.querySelector('#overlay').style.opacity = 0.85;
    document.querySelector('#home').style.transform = 'scale(0, 0)';
    $('#home').attr('onclick', 'core.closeHome();');
    setTimeout(function() {
      $('#home').attr('class', 'bx bx-x');
      document.querySelector('#home').style.transform = 'scale(1, 1)';
    }, 500);
  },
  closeHome: function() {
    document.querySelector('#home').removeAttribute('onclick');
    document.querySelector('#overlay').style.opacity = 0;
    document.querySelector('#home').style.transform = 'scale(0, 0)';
    $('#home').attr('onclick', 'core.openHome();');
    setTimeout(function() {
      $('#home').attr('class', 'bx bx-circle');
      document.querySelector('#home').style.transform = 'scale(1, 1)';
      document.querySelector('#overlay').style.display = 'none';
    }, 500);
  },
  openApp: function(app) {
    core.closeHome();
    $('body').append('<div class="window" style="top: 70px;"><div class="top">Test</div><iframe src="' + app + '"></iframe></div>');
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

// interact.js
const position = { x: 0, y: 0 }
interact('.window').draggable({
  allowFrom: '.top',
  listeners: {
    move (event) {
      position.x += event.dx
      position.y += event.dy

      event.target.style.transform =
        `translate(${position.x}px, ${position.y}px)`
    },
  }
});
