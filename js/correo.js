function mainPage() {
  
  const btncorreo = document.getElementById("send-correo");
  
  btncorreo.addEventListener("click", async (e) => {
    var mensajeError = "";
    var error = 0;
    const nombre = document.getElementById("nombre").value;
    const telefono = document.getElementById("telefono").value;
    const correo = document.getElementById("correo").value;
    const pregunta = document.getElementById("pregunta").value;

    if (nombre == "") {
      mensajeError += "Verificar Nombre<br>";
      error++;
    }
    if (validarCorreo(correo)) {
      mensajeError += "Verificar Correo<br>";
      error++;
    }
    if (telefono == "") {
      mensajeError += "Verificar Telefono<br>";
      error++;
    }
    if (pregunta == "") {
      mensajeError += "Verificar Pregunta<br>";
      error++;
    }
    if (error > 0) {
      //alert("No se puede realizar la transaccion: \n"+mensajeError);
      Swal.fire({
        title: "<strong>No se puede enviar el correo</strong>",
        icon: "error",
        html: mensajeError,
        showCloseButton: true,
      });
    } else {
      const datos = new FormData();

      datos.append("accion","send");
      datos.append("nombre",nombre);
      datos.append("telefono",telefono);
      datos.append("correo",correo);
      datos.append("pregunta",pregunta);

      let response = await fetch(
        "https://megabytesv.com/pageTurismo/recursos/correo.controller.php",
        {
          method: "POST",
          body: datos
        }
      );
      
      const { success, mensaje } = await response.json();

      if (success) {
        Swal.fire({
          title: "<strong>"+mensaje+"</strong>",
          icon: "success",
          showCloseButton: true,
        });
      } else {
        Swal.fire({
          title: "<strong>"+mensaje+"</strong>",
          icon: "error",
          showCloseButton: true,
        });
      }
    }
  });
}

function validarCorreo(correo) {
  var expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  if (!expr.test(correo)) {
    return true;
  } else {
    return false;
  }
}

document.addEventListener("DOMContentLoaded", mainPage);
