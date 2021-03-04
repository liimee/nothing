window.onload = () => {
  var por2, data, ap, appps, install;
  var tabb = '🏠 Home';
  window.addEventListener('message', (e) => {
    por2 = e.ports[0];
    if (e.data.name == 'init') {
      read();
    } else if (e.data.name == 'apps') {
      appps = e.data.value;
    }
  });

  fetch('repo.json').then(r => { return r.json() }).then(d => {
    data = d;
    if (tabb == '🏠 Home') {
      document.querySelector('#b').children[0].click();
    }
  });

  function read() {
    var port2 = por2;
    por2.postMessage({
      name: 'apps'
    });
    install = function(s) {
      port2.postMessage({
        name: 'install',
        value: {
          name: ap.name,
          id: ap.id,
          icon: ap.icon,
          file: Object.values(ap.versions)[0].mf,
          version: Object.keys(ap.versions)[0]
        }
      });
    }

    function tab(a) {
      tabb = a.innerText;
      document.querySelector('#main').innerHTML = '';
      document.querySelectorAll('[green]')[0].setAttribute('black', true);
      document.querySelectorAll('[green]')[0].removeAttribute('green');
      a.removeAttribute('black');
      a.setAttribute('green', true);
      if (a.innerText == '🏠 Home') {
        let h;
        Object.values(data.apps).forEach(v => {
          h = document.createElement('div');
          h.className = 'apps';
          h.innerHTML = `<img src="${v.icon}" style="width: auto; height: 36px; vertical-align: middle; border-radius: 8px; display: inline-block; margin-right: 9px">${v.name}`;
          h.onclick = () => {
            ap = v;
            document.querySelector('#pp').style.top = 0;
            document.querySelector('#pp').innerHTML = `<div style="margin-bottom: 8px"><span onclick="document.querySelector('#pp').style.top='-110%';">⬅️</span></div><img src="${v.icon}" style="width: auto; height: 36px; vertical-align: middle; border-radius: 8px; display: inline-block; margin-right: 9px">${v.name}<div><button ${(v.id in appps)?'red':'blue'}>${(v.id in appps)?'Uninstall':'Install'}</button></div>`;
            document.querySelector('#pp').children[1].children[0].onclick = () => install(por2);
          }
          document.querySelector('#main').appendChild(h);
        })
      }
    }

    Object.values(document.querySelector('#b').children).forEach(v => {
      v.onclick = () => { tab(v) };
    })
  }
}