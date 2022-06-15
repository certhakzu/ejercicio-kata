const d = document,
            $table = d.querySelector(".crud-table"),
            $form = d.querySelector(".crud-form"),
            $title = d.querySelector(".crud-title"),
            $template = d.getElementById("crud-template").content,
            $fragment = d.createDocumentFragment();

        // Cargar todos los santos al HTML
        const getAll = async () => {
            try {
                let response = await fetch("http://localhost:3000/santos"), // cuando no se especifica el 2do parametro toma GET por defecto
                    json = await response.json(); // convierte la respuesta a json

                if (!response.ok) throw { status: response.status, statusText: response.statusText };

                console.log(json);
                json.forEach(el => {
                    $template.querySelector(".name").textContent = el.nombre;
                    $template.querySelector(".constellation").textContent = el.constelacion;
                    $template.querySelector(".armor").textContent = el.armadura;
                    $template.querySelector(".edit").dataset.id = el.id;
                    $template.querySelector(".edit").dataset.name = el.nombre;
                    $template.querySelector(".edit").dataset.constellation = el.constelacion;
                    $template.querySelector(".edit").dataset.armor = el.armadura;
                    $template.querySelector(".delete").dataset.id = el.id;

                    let $clone = d.importNode($template, true);
                    $fragment.appendChild($clone);
                });

                $table.querySelector("tbody").appendChild($fragment);

            } catch (error) {
                let message = error.statusText || "Ocurrió un Error";
                $table.insertAdjacentHTML("afterend", `<p><b>Error ${error.status}: ${message}</b></p>`);
            }
        }

        d.addEventListener("DOMContentLoaded", getAll);

        // Evento para Agregar o Actualizar un Santo
        d.addEventListener("submit", async e => {
            if (e.target === $form) {
                e.preventDefault();
                if (!e.target.id.value) {
                    // Create - POST
                    try {
                        let options = {
                            method: "POST",
                            headers: {
                                "Content-type": "application/json; charset=utf-8"
                            },
                            body: JSON.stringify({
                                nombre: e.target.nombre.value,
                                constelacion: e.target.constelacion.value,
                                armadura: e.target.armadura.value
                            })
                        }
                        response = await fetch("http://localhost:3000/santos", options), // cuando no se especifica el 2do parametro toma GET por defecto
                        json = await response.json();

                        if (!response.ok) throw { status: response.status, statusText: response.statusText };

                        location.reload();

                    } catch (error) {
                        let message = error.statusText || "Ocurrió un Error";
                        $form.insertAdjacentHTML("afterend", `<p><b>Error ${error.status}: ${message}</b></p>`);
                    }
                } else {
                    // Update - PUT
                    try {
                        let options = {
                            method: "PUT",
                            headers: {
                                "Content-type": "application/json; charset=utf-8"
                            },
                            body: JSON.stringify({
                                nombre: e.target.nombre.value,
                                constelacion: e.target.constelacion.value,
                                armadura: e.target.armadura.value
                            })
                        },
                            response = await fetch(`http://localhost:3000/santos/${e.target.id.value}`, options),
                            json = await response.json();

                        if (!response.ok) throw { status: response.status, statusText: response.statusText };

                        location.reload();

                    } catch (error) {
                        let message = error.statusText || "Ocurrió un error";
                        $form.insertAdjacentHTML("afterend", `<p><b>Error ${error.status}: ${message}</b></p>`);
                    }
                }
            }
        });

        d.addEventListener("click", async e => {
            if (e.target.matches(".edit")) {
                $title.textContent = "Editar Santo";
                $form.nombre.value = e.target.dataset.name;
                $form.constelacion.value = e.target.dataset.constellation;
                $form.armadura.value = e.target.dataset.armor;
                $form.id.value = e.target.dataset.id;
            }

            if (e.target.matches(".delete")) {
                let isDelete = confirm(`¿Estás seguro de eliminar el id ${e.target.dataset.id} - ${e.target.dataset.name}?`);

                if (isDelete) {
                    //Delete - DELETE
                    try {
                        let options = {
                            method: "DELETE",
                            headers: {
                                "Content-type": "application/json; charset=utf-8"
                            }
                        },
                            res = await fetch(`http://localhost:3000/santos/${e.target.dataset.id}`, options),
                            json = await res.json();

                        if (!res.ok) throw { status: res.status, statusText: res.statusText };

                        location.reload();

                    } catch (err) {
                        let message = err.statusText || "Ocurrió un error";
                        alert(`Error ${err.status}: ${message}`);
                    }
                }
            }
        })