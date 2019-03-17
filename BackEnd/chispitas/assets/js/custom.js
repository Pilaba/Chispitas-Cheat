var opts = {
  lines: 13, // The number of lines to draw
  length: 20, // The length of each line
  width: 10, // The line thickness
  radius: 30, // The radius of the inner circle
  corners: 1, // Corner roundness (0..1)
  rotate: 0, // The rotation offset
  direction: 1, // 1: clockwise, -1: counterclockwise
  color: '#0101DF', // #rgb or #rrggbb or array of colors
  speed: 2, // Rounds per second
  trail: 60, // Afterglow percentage
  shadow: true, // Whether to render a shadow
  hwaccel: true, // Whether to use hardware acceleration
  className: 'spinner', // The CSS class to assign to the spinner
  zIndex: 2e9, // The z-index (defaults to 2000000000)
  top: '50%', // Top position relative to parent
  left: '50%' // Left position relative to parent
};

function fn_cargar_ajax_p(url,target,id,item1,item2,item3,item4,item5){
  $.ajax({
    url: url,
    cache: true,
    type: 'post',//get,post
    dataType: 'html',//(xml, json, script, or html))
    data:{id:id,item1:item1,item2:item2,item3:item3,item4:item4,item5:item5,'csrf_token': csrf_token},
    beforeSend: function(){
        $('#'+target).spin(opts);
    },
    error:function(){ 
        swal(
          '¡Changos!',
          'Hubo un error al procesar su solicitud.',
          'error'
        ).catch(swal.noop)
      $('#'+target).spin(false);
    },
    success: function(html) { 
      //$('html,body').animate({ scrollTop: $('#'+target).offset().top}, 800);
      $('#'+target).empty().html(html).fadeIn("fast");
      $('#'+target).spin(false);
    },
    timeout: 8000 // sets timeout to 8 seconds
  });
};

function fn_cargar_ajax_g(url,target,id,item1,item2,item3,item4,item5){
  $.ajax({
    url: url,
    cache: true,
    type: 'get',//get,post
    dataType: 'html',//(xml, json, script, or html))
    data:{id:id,item1:item1,item2:item2,item3:item3,item4:item4,item5:item5,'csrf_token': csrf_token },
    beforeSend: function(){
        $("#"+target).spin(opts);
    },
    error:function(){ 
         swal(
          '¡Changos!',
          'Hubo un error al procesar su solicitud.',
          'error'
        ).catch(swal.noop)
      $('#'+target).spin(false);
    },
    success: function(html) {
      //$('html,body').animate({ scrollTop: $('#'+target).offset().top}, 800);
      $('#'+target).empty().html(html).fadeIn("fast");
      $('#'+target).spin(false);
    },
    timeout: 8000 // sets timeout to 8 seconds
  });
};

function fn_exit(){
  swal({
    title: '¿Desea cerrar su sesión?',
    titleText: '¿Desea cerrar su sesión?', 
    text: "Esto cerrará la sesión de su Cuenta en este dispositivo.",
    type: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: '<i class="fa fa-sign-out" aria-hidden="true"></i>&nbsp;Si, Salir',
    cancelButtonText: '<i class="fa fa-thumbs-o-down" aria-hidden="true"></i>&nbsp;No',
    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey: false,
    focusCancel: true,
    showCloseButton: true,
    footer: '<i class="fa fa-info-circle" aria-hidden="true"></i>&nbsp;Para volver a entrar deberá iniciar sesión nuevamente.'
  }).then( (result) => {
    if (result.value){
      location.href="auth/logout";
    }
  }).catch(swal.noop);
}

function fn_printing(selector){
  $("#"+selector).printThis({
    debug: false,               // show the iframe for debugging
    importCSS: true,            // import parent page css
    importStyle: true,         // import style tags
    printContainer: true,       // print outer container/$.selector
    loadCSS: "",                // path to additional css file - use an array [] for multiple
    pageTitle: "",              // add title to print page
    removeInline: false,        // remove inline styles from print elements
    removeInlineSelector: "*",  // custom selectors to filter inline styles. removeInline must be true
    printDelay: 333,            // variable print delay
    header: null,               // prefix to html
    footer: null,               // postfix to html
    base: false,                // preserve the BASE tag or accept a string for the URL
    formValues: true,           // preserve input/form values
    canvas: true,               // copy canvas content
    doctypeString: '',          // enter a different doctype for older markup
    removeScripts: false,       // remove script tags from print content
    copyTagClasses: true,      // copy classes from the html & body tag
    beforePrintEvent: null,     // function for printEvent in iframe
    beforePrint: null,          // function called before iframe is filled
    afterPrint: null            // function called before iframe is removed
  });
}

function openmodal(url){
  window.open(url, 'formresult', 'scrollbars=yes,menubar=no,height=600,width=800,resizable=yes,toolbar=no,status=no');
}

function submitFORM(path, params, method) {
    method = method || "post"; 

    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);
    form.setAttribute("target", "formresult");// setting form target to a window named 'formresult'

    //Move the submit function to another variable
    //so that it doesn't get overwritten.
    form._submit_function_ = form.submit;

    for(var key in params) {
        if(params.hasOwnProperty(key)) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", params[key]);

            form.appendChild(hiddenField);
         }
    }

    document.body.appendChild(form);
    form._submit_function_();
}

function addElement(parentId, elementTag, elementId, html) {
  // Adds an element to the document
  var p = document.getElementById(parentId);
  var newElement = document.createElement(elementTag);
  newElement.setAttribute('id', elementId);
  newElement.innerHTML = html;
  p.appendChild(newElement);
}

function removeElement(elementId) {
  // Removes an element from the document
  var element = document.getElementById(elementId);
  element.parentNode.removeChild(element);
}

function isInt(value) {
  var x;
  if (isNaN(value)) {
    return false;
  }
  x = parseFloat(value);
  return (x | 0) === x;
}

function fn_screenshot(selector){
  html2canvas(document.querySelector("#"+selector)).then(canvas => {
      // Export the canvas to its data URI representation
      var base64image = canvas.toDataURL("image/png");

      // Open the image in a new window
      // window.open(base64image , "_blank");
      
      // Open Modal
      openmodal(base64image);
  });
}