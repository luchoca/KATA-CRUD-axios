const d = document,
  $table = d.querySelector(".crud-table"),
  $form = d.querySelector(".crud-form"),
  $title = d.querySelector(".crud-title"),
  $template = d.getElementById("crud-template").content,
  $fragment = d.createDocumentFragment();

//for each por cada json que venga de la api
//lo va a colocar en el lugar donde corresponde , ejepmlo el.nombre en el .name
//FUNCION QUE TRAE TODOS LOS SANTOS
const getAll = async () => {
  try {
    let res = await axios.get("http://localhost:5555/santos"),
      json = await res.data;

    console.log(json);

    json.forEach((el) => {
      $template.querySelector(".name").textContent = el.nombre;
      $template.querySelector(".constellation").textContent = el.constelacion;
      //AGREGAR UNO NUEVO PARA MEJORAR
      $template.querySelector(".edit").dataset.id = el.id;
      $template.querySelector(".edit").dataset.name = el.nombre;
      $template.querySelector(".edit").dataset.constellation = el.constelacion;
      $template.querySelector(".delete").dataset.id = el.id;

      let $clone = d.importNode($template, true);
      $fragment.appendChild($clone);
    });

    $table.querySelector("tbody").appendChild($fragment);
  } catch (err) {
    let message = err.statusText || "Ocurrió un error";
    $table.insertAdjacentHTML(
      "afterend",
      `<p><b>Error ${err.status}: ${message}</b></p>`
    );
  }
};

d.addEventListener("DOMContentLoaded", getAll);

//en el submit/ enviar
// POST Y DELETE
//si el id (nombre="id") viene vacio lo va a poner (post)
//y si viene con informacion lo eliminar (DELETE)
d.addEventListener("submit", async (e) => {
  if (e.target === $form) {
    //esto se ejecuta si el objeto que ejecuta el evento sea el Formulario
    e.preventDefault(); // por eso cancelamos el default para que espere las ordenes de JS

    if (!e.target.id.value) {
      //si dentro del input no hay valor hacemos un POST
      //Create - POST
      try {
        let options = {
            method: "POST",
            headers: {
              "Content-type": "application/json; charset=utf-8",
            },
            data: JSON.stringify({
              //lo pasa a formato json
              //lo que para fetch es "body" aca en axios es "data"
              nombre: e.target.nombre.value, // son las cajas de texto (input) del form
              constelacion: e.target.constelacion.value, // son las cajas de texto (input) del form
            }),
          },
          res = await axios("http://localhost:4444/santos", options),
          json = await res.data; //aca en fetch seria json , pero en axios es data

        // AXIOS NO PRECISA MANIPULAR EL ERROR POR QUE LO MANDA DIRECTO AL CATCH

        location.reload(); // recarga pagina para nueva isercion
      } catch (err) {
        let message = err.statusText || "OH NO!!! ocurrio un error";
        $form.insertAdjacentHTML(
          // ponemos el mensaje de error abajo del form
          "afterend",
          `<p><b>Error ${err.status}: ${message}</b></p>`
        );
      }
    }
  }
});
