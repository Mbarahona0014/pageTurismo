<!--Formulario de contacto-->
<div class="row bg-marn-lgray m-0 p-3">
    <div class="col-12 text-center p-3">
        <h3>CONTÁCTANOS</h3>
    </div>
    <div class="col-lg-6 col-md-6 col-sm-12 p-5">
        <div class="form">
            <div class="mb-3 row">
                <label for="nombre" class="col-lg-5 col-md-5 col-sm-12 col-12 col-form-label col-form-label fs-6">NOMBRE</label>
                <div class="col-lg-7 col-md-7 col-sm-12 col-12">
                    <input type="text" class="form-control" id="nombre" />
                </div>
            </div>
            <div class="mb-3 row">
                <label for="telefono" class="col-lg-5 col-md-5 col-sm-12 col-12 col-form-label fs-6">TELÉFONO</label>
                <div class="col-lg-7 col-md-7 col-sm-12 col-12">
                    <input type="text" class="form-control" id="telefono" />
                </div>
            </div>
            <div class="mb-3 row">
                <label for="correo" class="col-lg-5 col-md-5 col-sm-12 col-12 col-form-label fs-6">CORREO</label>
                <div class="col-lg-7 col-md-7 col-sm-12 col-12">
                    <input type="text" class="form-control" id="correo" />
                </div>
            </div>
            <div class="mb-3 row">
                <label for="pregunta" class="col-lg-5 col-md-5 col-sm-12 col-12 col-form-label fs-6">TU PREGUNTA</label>
                <div class="col-lg-7 col-md-7 col-sm-12 col-12">
                    <textarea class="form-control" id="pregunta" rows="3"></textarea>
                </div>
            </div>
            <div class="mb-3 row">
                <div class="d-grid gap-2">
                    <button id="send-correo" class="btn bg-marn-blue text-white" type="button">
                        ENVIAR
                    </button>
                </div>
            </div>
        </div>
    </div>
    <div class="col-lg-6 col-md-6 col-sm-12 p-5">
        <div class="mb-3 row mb-5">
            <div class="col-lg-1 col-md-1 col-sm-12 col-12">
                <i class="fa fa-map-marker-alt fa-xl"></i>
            </div>
            <div class="col-lg-11 col-md-11 col-sm-12 col-12">
                <label>Ministerio De Medio Ambiente Y Recursos Naturales KILÓMETRO 5½
                    CARRETERA A SANTA TECLA, CALLE Y COLONIA LAS MERCEDES, EDIFICIOS
                    MARN SAN SALVADOR. EL SALVADOR. CENTROAMÉRICA</label>
            </div>
        </div>
        <div class="mb-3 row mb-5">
            <div class="col-lg-1 col-md-1 col-sm-12 col-12">
                <i class="fa fa-phone fa-xl"></i>
            </div>
            <div class="col-lg-11 col-md-11 col-sm-12 col-12">
                <label>2132-6276</label>
            </div>
        </div>
        <div class="mb-3 row mb-5">
            <div class="col-lg-1 col-md-1 col-sm-12 col-12">
                <i class="fa fa-envelope fa-xl"></i>
            </div>
            <div class="col-lg-11 col-md-11 col-sm-12 col-12">
                <label>medioambiente@ambiente.gob.sv</label>
            </div>
        </div>
    </div>
</div>
<script src="./js/correo.js"></script>