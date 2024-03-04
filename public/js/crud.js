function updateDeleteButtons() {
  const btnsEliminar = document.getElementsByClassName("eliminar");

  // Itera sobre cada botón y asigna el evento 'click'
  for (let i = 0; i < btnsEliminar.length; i++) {
    btnsEliminar[i].addEventListener("click", async function () {
      // Usa 'this' para referirte al botón que fue clickeado
      const id = this.dataset.id;
      console.log(id);

      try {
        const data = await fetch(`/miniature/${id}`, {
          method: "DELETE",
        });

        const res = await data.json();
        console.log(res);

        if (res.estado) {
          const fila = document.getElementById(`fila-${id}`);
          if (fila) {
            // Elimina la fila de la tabla
            fila.remove();
          }
        } else {
          console.log(res);
        }
      } catch (error) {
        console.log(error);
      }
    });
  }
}
function updateEditButtons() {
  const formsEditar = document.getElementsByClassName("editar");

  for (let i = 0; i < formsEditar.length; i++) {
    formsEditar[i].addEventListener("submit", async (e) => {
      e.preventDefault();

      // Obtener el ID de la miniatura desde el atributo data-id del formulario
      const _id = formsEditar[i].dataset.id;

      // Obtener los valores de los campos del formulario

      const cantidad = formsEditar[i].elements["cantidad"].value;

      try {
        // Enviar los datos al servidor usando fetch y el método PUT
        const data = await fetch(`/miniature/${_id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cantidad }),
        });

        const res = await data.json();

        if (res.estado) {
          const cant = document.getElementById(`cant-${_id}`);
          if (cant) {
            cant.textContent = cantidad;
          }
        } else {
          console.log(res);
        }
      } catch (error) {
        console.log(error);
      }
    });
  }
}
const createMiniature = document.getElementById("createMiniature");

createMiniature.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Obtener los datos del formulario
  const formData = {
    id: createMiniature.elements["id"].value,
    nombre: createMiniature.elements["nombre"].value,
    faccion: createMiniature.elements["faccion"].value,
    cantidad: createMiniature.elements["cantidad"].value,
  };

  try {
    // Realizar la solicitud POST utilizando fetch
    const response = await fetch("/miniature/crear", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Especifica el tipo de contenido como JSON
      },
      body: JSON.stringify(formData),
    });

    // Manejar la respuesta del servidor
    const result = await response.json();

    if (result.estado) {
      console.log(result.mensaje);
      console.log(result.miniature._id);
      // Redireccionar o realizar otras acciones después de crear la miniatura
      // Agregar una nueva fila a la tabla con los datos de la miniatura
      const tableBody = document.querySelector("tbody");
      const newRow = document.createElement("tr");
      newRow.id = "fila-" + result.miniature._id;
      newRow.innerHTML = `
                <th scope="row">${formData.id}</th>
                <td>${formData.nombre}</td>
                <td>${formData.faccion}</td>
                <td id="cant-${result.miniature._id}">${formData.cantidad}</td>
                <td>
                  <button type="button" class="btn btn-warning btn-sm" data-bs-toggle="modal"
                    data-bs-target="#modalEditar-${result.miniature._id}">
                    Editar
                  </button>
                  <button type="button" class="btn btn-danger btn-sm" data-bs-toggle="modal"
                    data-bs-target="#modalEliminar-${result.miniature._id}">
                    Eliminar
                  </button>
                </td>
              `;
      tableBody.appendChild(newRow);

      createEditModal(result.miniature);
      createDeleteModal(result.miniature);
      updateDeleteButtons();
      updateEditButtons();
    } else {
      // Manejar errores o mostrar mensajes de error
      console.error(result.mensaje);
    }
  } catch (error) {
    console.error("Error al enviar la solicitud:", error);
  }
});

// Función para crear un nuevo modal
function createEditModal(miniature) {
  const newModal = document.createElement("div");
  newModal.className = "modal fade";
  newModal.id = `modalEditar-${miniature._id}`;
  newModal.tabIndex = "-1";
  newModal.setAttribute("aria-labelledby", "exampleModalLabel");
  newModal.setAttribute("aria-hidden", "true");

  // Contenido del nuevo modal
  newModal.innerHTML = `
    <div class="modal-dialog">
      <div class="modal-content">
        <!-- Cabecera del modal -->
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Editar Miniatura</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>

        <!-- Contenido del modal para editar miniatura -->
        <div class="modal-body">
          <!-- Formulario de edición -->
          <form class="editar" id="formEditar-${miniature._id}" data-id="${miniature._id}">
            <div class="mb-3">
              <label for="cantidad" class="form-label">Cantidad:</label>
              <input type="number" class="form-control" id="cantidad" name="cantidad" value="${miniature.cantidad}">
            </div>

            <!-- Botón de envío del formulario -->
            <button type="submit" class="btn btn-primary" data-bs-dismiss="modal">Guardar Cambios</button>
          </form>
        </div>
      </div>
    </div>
  `;

  // Agregar el nuevo modal al documento
  document.body.appendChild(newModal);
}

function createDeleteModal(miniature) {
  const newModal = document.createElement("div");
  newModal.className = "modal fade";
  newModal.id = `modalEliminar-${miniature._id}`;
  newModal.tabIndex = "-1";
  newModal.setAttribute("aria-labelledby", "exampleModalLabel");
  newModal.setAttribute("aria-hidden", "true");

  newModal.innerHTML = `
        <div class="modal-dialog">
          <div class="modal-content">
            <!-- Contenido del modal para eliminar miniatura -->
            <div class="modal-body">
              <!-- Mensaje de confirmación -->
              <p>¿Estás seguro de que quieres eliminar la miniatura?</p>

              <!-- Botón de confirmación -->
              <button type="button" class="btn btn-danger mt-3 eliminar" data-id="${miniature._id}"
                data-bs-dismiss="modal">
                Eliminar
              </button>
            </div>
          </div>
      `;
  document.body.appendChild(newModal);
}

document.addEventListener("DOMContentLoaded", function() {
  updateDeleteButtons();
  updateEditButtons();
}); 
