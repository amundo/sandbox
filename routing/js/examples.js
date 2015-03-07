// Render scripts into an HTML page.
// 
// to render an inline script tag, give it a class of 'example':
//    <script class=example> ... </script>
// 
// A <code class=example></code> element containing the content of the 
// script will be inserted automatically
// into the DOM after the script element.  Note that the default 
// styling for <code> elements collapses whitespace (strangely), so 
// it's helpful to some CSS rules like 
// 
// code.example { display:block; white-space: pre; }
// 
// to make sure it's legible.

function renderScripts(){
  var scripts = Array.prototype.slice.call(document.querySelectorAll('script.example'));

  function toCode(script){
    var code = document.createElement('code');
    code.textContent = script.textContent;
    code.classList.add('example');

    return code;
  }

  scripts.map(function(script){ 
    var code = toCode(script);
    script.parentNode.insertBefore(code, script.nextSibling)
  })
}

document.addEventListener('DOMContentLoaded', renderScripts, false)
