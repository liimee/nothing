console.log('%cWebDesktop WIP', 'padding: 8px; background-color: #007bff; color: white; border: 2px solid #00a1ff; font-size: 35px;');

var core = {
  root: document.documentElement,
  homeOpen: false,
  openHome: function() {
    document.querySelector('#home').removeAttribute('onclick');
    document.querySelector('#overlay').style.zIndex = 6;
    document.querySelector('#overlay').style.opacity = 0.85;
    document.querySelector('#home').style.transform = 'scale(0, 0)';
    $('#home').attr('onclick', 'core.closeHome();');
    core.homeOpen = true;
    setTimeout(function() {
      $('#home').attr('class', 'bx bx-x');
      document.querySelector('#home').style.transform = 'scale(1, 1)';
    }, 500);
  },
  closeHome: function() {
    core.homeOpen = false;
    document.querySelector('#home').removeAttribute('onclick');
    document.querySelector('#overlay').style.opacity = 0;
    document.querySelector('#overlay').style.zIndex = 0;
    document.querySelector('#home').style.transform = 'scale(0, 0)';
    $('#home').attr('onclick', 'core.openHome();');
    setTimeout(function() {
      $('#home').attr('class', 'bx bx-circle');
      document.querySelector('#home').style.transform = 'scale(1, 1)';
    }, 500);
  },
  openApp: function(app, title) {
    core.closeHome();
    $('#desktop').append('<div class="window" data-maximized="false" style="width: 300px; top: 75px; left: 85px;" ondblclick="core.maximizeWindow(this);"><div class="top"><i class="bx bx-x" onclick="core.closeWindow(this);" style="margin-right: 6px; background-color: #ff0000; color: white; border-radius: 30px; cursor: pointer;"></i>' + title + '</div><iframe src="' + app + '"></iframe></div>');
    let position = { x: 0, y: 0 }

    interact('.window').draggable({
      allowFrom: '.top',
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: 'parent',
          endOnly: false
        })
      ],
      listeners: {
        move (event) {
          position.x += event.dx
          position.y += event.dy

          event.target.style.transform =
            `translate(${position.x}px, ${position.y}px)`
        },
      }
    })

    interact('.window').resizable({
      edges: {
        top   : false,
        left  : true,
        bottom: true,
        right : true
      }
    }).on('resizemove', event => {
      let { x, y } = event.target.dataset;

      Object.assign(event.target.style, {
        width: `${event.rect.width}px`,
        height: `${event.rect.height}px`
      })

      Object.assign(event.target.dataset, { x, y })
    })
  },
  closeWindow: function(el) {
    $(el).parent().parent().remove();
  },
  maximizeWindow: function(el) {
    el.style.transition = '.4s';
    if(el.getAttribute('data-maximized') == 'false') {
      el.setAttribute('data-initial-pos', el.style.transform);
      el.style.transform = 'none';
      el.setAttribute('data-initial-width', el.style.width);
      el.setAttribute('data-initial-height', el.style.height);
      el.style.top = 'calc(25px + 8px + 12px)';
      el.style.left = '12px';
      el.style.width = '95%';
      el.style.height = '93%';
      el.setAttribute('data-maximized', 'true');
    } else {
      el.style.top = '75px';
      el.style.left = '85px';
      el.style.transform = el.getAttribute('data-initial-pos');
      el.style.width = el.getAttribute('data-initial-width');
      el.style.height = el.getAttribute('data-initial-height');
      el.setAttribute('data-maximized', 'false');
      el.removeAttribute('data-initial-width');
      el.removeAttribute('data-initial-height');
      el.removeAttribute('data-initial-pos');
    }
    setTimeout(function() {
      el.style.transition = 'initial';
    }, 500);
  },
  apps: function(app) {
    $('#apps').append('<span id="' + app.id + '" class="app" onclick="if(core.homeOpen) {core.openApp(\'' + app.file + '\', \'' + app.name + '\');}"><div class="icon"><img src="' + app.icon + '" width="45" height="45"></div><div class="appname">' + app.name + '</div></span>');
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
  core.root.style.setProperty('--window-top', '#dbdbdb');
  core.darkmode = false;
} else {
  core.root.style.setProperty('--bar-bg', '#212121');
  core.root.style.setProperty('--window-top', '#212121');
  core.root.style.setProperty('--text-color', 'white');
  core.darkmode = true;
}

document.addEventListener('DOMContentLoaded', function() {
if(localStorage.getItem('apps') === null) {
  let aps = {
    helloworld: {
      name: 'Hello, World!',
      file: 'hello-world.html',
      id: 'helloworld',
      icon: 'images/hello-world-icon.png'
    },
    CHEINSTTROARLY: {
      name: 'CHEINSTTROARLY',
      file: 'minusone.html',
      id: 'CHEINSTTROARLY',
      icon: 'images/minusone.png'
    }
  }
  localStorage.setItem('apps', JSON.stringify(aps));
  let ia = JSON.parse(localStorage.getItem('apps'));
  for (let l = 0; l < Object.keys(ia).length; l++) {
    core.apps(ia[Object.keys(ia)[l]]);
  }
} else {
  let ia = JSON.parse(localStorage.getItem('apps'));
  if (!('CHEINSTTROARLY' in ia)) {
    ia.CHEINSTTROARLY = {
      name: 'CHEINSTTROARLY',
      file: 'minusone.html',
      id: 'CHEINSTTROARLY',
      icon: 'images/minusone.png'
    };
    localStorage.setItem('apps', JSON.stringify(ia));
  }
  for (let l = 0; l < Object.keys(ia).length; l++) {
    core.apps(ia[Object.keys(ia)[l]]);
  }
}
});
document.addEventListener('keydown', function() {
  if (event.metaKey) {
    if(core.homeOpen) {
      core.closeHome();
    } else {
      core.openHome();
    }
  }
});
