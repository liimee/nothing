function getBlob(code, tye) {
  const blob = new Blob([code], {type: tye})
  return URL.createObjectURL(blob)
}

async function loadApp(ur) {
  var res = await fetch(ur);
      var g = await res.json();
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
      console.log(h)
      return h;
}