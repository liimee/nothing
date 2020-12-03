function getBlob(code, tye) {
  const blob = new Blob([code], {type: tye})
  return URL.createObjectURL(blob)
}

function loadApp(ur) {
  fetch(ur)
    .then(response => {
      if (response.ok) return response.json()
      return 'load app failed';
    })
    .then((data) => {
      var g = JSON.parse(data);
      var b = {
        main: document.createElement('html'),
        body: document.createElement('body')
      };
     /* var s = {
        btn: document.createElement('button')
      }; */
      g.elements.forEach((v) => {
        switch(v.element) {
          case 'button':
            var s = document.createElement('button');
            s.innerHTML = v.text;
            b.body.appendChild(s)
        }
      });
      b.main.appendChild(b.body);
      let h = getBlob(`<!DOCTYPE HTML><html>${b.main.innerHTML}</html>`, 'text/html');
      return h;
    });
}