const d = document,
  $table = d.querySelector(".crud-table"),
  $form = d.querySelector(".crud-form"),
  $title = d.querySelector(".crud-title"),
  $template = d.getElementById("crud-template").content,
  $fragment = d.createDocumentFragment();

//FUNCION QUE TRAE TODOS LOS SANTOS
const getAll = async () => {
  try {
    let res = await axios.get("http://localhost:5555/superhero"),
      json = await res.data;

    console.log(json);
    //for each por cada json que venga de la api
    //lo va a colocar en el lugar donde corresponde , ejepmlo el.nombre(nombre del elemento) en el .name
    json.forEach((el) => {
      $template.querySelector(".name").textContent = el.nombre;
      $template.querySelector(".grupo").textContent = el.grupo;
      $template.querySelector(".poder").textContent = el.poder; //SE AGREGO UN SELECTOR DEL TH DONDE VA el poder
      $template.querySelector(".edit").dataset.id = el.id;
      $template.querySelector(".edit").dataset.name = el.nombre;
      $template.querySelector(".edit").dataset.grupo = el.grupo;
      $template.querySelector(".edit").dataset.poder = el.poder;
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

d.addEventListener("DOMContentLoaded", getAll); // cuando se inicia el document se ejecuta getAll

//en el submit/enviar
// POST Y DELETE
//si el id (nombre="id") viene vacio lo va a poner (post)
//y si viene con informacion lo elimina (DELETE)
d.addEventListener("submit", async (e) => {
  if (e.target === $form) {
    //esto se ejecuta,si el objeto que ejecuta el evento es el Formulario
    e.preventDefault(); // por eso cancelamos el default para que espere las ordenes de JS

    //POST
    if (!e.target.id.value) {
      //si dentro del input "hidden" no hay valor de "id" hacemos un POST o sea insertamos algo
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
              grupo: e.target.grupo.value, // son las cajas de texto (input) del form
              poder: e.target.poder.value,
            }),
          },
          res = await axios("http://localhost:5555/superhero", options),
          json = await res.data; //aca en fetch seria json , pero en axios es data

        // AXIOS NO PRECISA MANIPULAR EL ERROR POR QUE LO MANDA DIRECTO AL CATCH
        limpiarInput = () => {
          $form.reset();
        };
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
    //PUT/ actualizacion //si en el input hidden hay valor lo actualiza
    else {
      //Update - PUT
      try {
        let options = {
            method: "PUT",
            headers: {
              "Content-type": "application/json; charset=utf-8",
            },
            data: JSON.stringify({
              nombre: e.target.nombre.value,
              grupo: e.target.grupo.value,
              poder: e.target.poder.value,
            }),
          },
          res = await axios(
            `http://localhost:5555/superhero/${e.target.id.value}`,
            options
          ),
          json = await res.data;

        location.reload();
      } catch (err) {
        let message = err.statusText || "OH NO!!! ocurrio un error";
        $form.insertAdjacentHTML(
          "afterend",
          `<p><b>Error ${err.status}: ${message}</b></p>`
        );
      }
    }
  }
});

d.addEventListener("click", async (e) => {
  if (e.target.matches(".edit")) {
    //con esta validacion detectamos quien inicio el evento y si coinicde con edit
    //va a cambiar los elementos del DOM cuando apretemos edit (titulos, nombre y constelacion del form)
    //EDIT
    $title.textContent = "Editar Super Heroe";
    $form.poder.value = e.target.dataset.poder;
    $form.nombre.value = e.target.dataset.name;
    $form.grupo.value = e.target.dataset.grupo;
    $form.id.value = e.target.dataset.id;
  }
  //FUNCION DELETE
  //con esta validacion detectamos quien inicio el evento y si coinicde con boton "delete" ejecutamos
  if (e.target.matches(".delete")) {
    let isDelete = confirm(
      `¿Estás seguro de eliminar el id ${e.target.dataset.id}?`
    );

    if (isDelete) {
      //Delete - DELETE
      try {
        let options = {
            method: "DELETE",
            headers: {
              "Content-type": "application/json; charset=utf-8",
            },
          },
          res = await axios(
            `http://localhost:5555/superhero/${e.target.dataset.id}`,
            options
          ),
          json = await res.data;

        location.reload();
      } catch (err) {
        let message = err.statusText || "Ocurrió un error";
        alert(`Error ${err.status}: ${message}`);
      }
    }
  }
});
