var por2, data;
var tabb = '🏠 Home';
window.addEventListener('message', (e) => {
  por2 = e.ports[0];
  if (e.data.name == 'init') {
    read();
  } else if (e.data.name == 'apps') show(e.data.value);
});

fetch('repo.json').then(r => { return r.json() }).then(d => {
  data = d;
  if (tabb == '🏠 Home') {
    document.querySelector('#b').children[0].click();
  }
});

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
      document.querySelector('#main').appendChild(h);
    })
  }
}

function show(aa) {
  alert(JSON.stringify(aa))
}

function read() {
  por2.postMessage({
    name: 'apps'
  });
}