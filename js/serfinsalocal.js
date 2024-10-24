//var path = "http://localhost:15754/";
var path = "https://www.serfinsacheckout.com/";
//var path = "https://bdpdev.redserfinsa.com:8088/";
//var path = "https://www.serfinsacheckout.com/";
var $ = jQuery;

if (window.addEventListener) {
    window.addEventListener("message", onMessage, false);
}

else if (window.attachEvent) {
    window.attachEvent("onmessage", onMessage, false);
}

function onMessage(event) {
    var data = event.data;

    if (typeof (window[data.func]) == "function") {
        window[data.func].call(null, data.message);
    }
}

function CallBackPay(message) {
    if (PayResult) {
        PayResult(message);
    }
}

function CallBackPayJson(message) {
    if (PayResultJson) {
        PayResultJson(message);
    }
}

function CallBackError(e) {
    try {
        if (CallBackErrorCliente) {
            CallBackErrorCliente(e);
        }
    }catch (e) {
    }

}

function CallBackPopUpEvent(e) {
    try {
        if (CallBackPopUp) {
            CallBackPopUp(e);
        }
    } catch (e) {
    }

}

var windowspop;

function paymentSerfinsa() {

    var merchantToken = $("#MerchantToken").val();
    var data;
    windowspop = null;
    try {
        if (merchantToken === undefined) {
            data=GetView()
        } else {
            if (merchantToken != "") {
                data = GetViewByMerchantToken(merchantToken);
            }
            else {
                alert("Autenticacion del comercio no completada");
            }
        }


        if (data != null)
                CallBackPopUpEvent(data);
        else
            alert("No se puede procesar la transacción");

    } catch (e) {
        CallBackError(e);
        console.error(e);
    }

}

function GetViewByMerchantToken(merchantToken) {

    var rutaToken = path + "api/PayApi/TokeyTranJwt";

    var datos = {
        TokeyComercio:merchantToken
    };

    data = postData(rutaToken, datos);

    return data;

}

function GetView() {
    var datos;
    var rutaToken = path + "api/PayApi/TokeyTran";
    var isMarket = $("#isMarket").val();
    var adicionales = $("#Adicionales").val();
    if (isMarket == "true") {
        var ordenCompra = {
            OrdenId: $("#IdTransaccion").val(),
            Dui: $("#documento").val(),
            NombreCliente: $("#cliente").val(),
            EmailCliente: $("#email").val(),
            TelContacto: $("#telefono").val(),
            DireccionEntrega: $("#direccion").val(),

            CantidadProducto: $("#cantidad").val()
        };
        datos = {
            TokeyComercio: $("#TokenSerfinsa").val(),
            Monto: $("#MontroTransaccion").val(),
            IdTransaccionCliente: $("#IdTransaccion").val(),
            Adicionales: adicionales,
            ConceptoPago: $("#ConceptoPago").val(),
            IsMarket: true,
            UrlRespuesta: $("#UrlRespuesta").val(),
            OrdenCompra: ordenCompra

        };
    }
    else {
        datos = {
            TokeyComercio: $("#TokenSerfinsa").val(),
            Monto: $("#MontroTransaccion").val(),
            IdTransaccionCliente: $("#IdTransaccion").val(),
            ConceptoPago: $("#ConceptoPago").val(),
            Adicionales: adicionales
        };
    }

    data = postData(rutaToken, datos);

    return data;

}

function postData(rutaToken, data) {

    try {
        var rt;
        $.ajax({
            url: rutaToken,
            type: "POST",
            data: JSON.stringify(data),
            async: false,
            contentType: 'application/json',
            headers: { "Access-Control-Allow-Origin": "*" },
            xhrFields: {
                withCredentials: false
            }
        }).done(function (data) {
            if (data.Satisfactorio == false) {
                CallBackError(data.Mensaje);
                alert(data.Mensaje);
                windowspop = null;
            }
            else {
                var url = path + "Pay/GateWaySecurity?token=";
                var urlMask = path + "Pay/Payment/";
                var urlpost = url + data.Datos.Token;
                var tituloPop = "SERFINSA CHECKOUT"
                

                var urlPost = path + data.Datos.UrlPost;
                //var top = (screen.height) / 1.5;
                var width = (screen.width - 250) / 2;
                var height = window.screen.height;
                var left = (screen.width - width) / 2;
                var top = (screen.height - height) / 2;
                var params = 'width=' + width + ', height=' + height;
                params += ', top=' + top + ', left=' + left;
                params += ', directories=no';
                params += ', location=no';
                params += ', menubar=no';
                params += ', resizable=no';
                params += ', scrollbars=no';
                params += ', status=no';
                params += ', toolbar=no';
                windowspop = { url: urlpost, titulo: tituloPop, paramsPopUp: params, urlMask: urlMask, urlData: urlPost};

            }
        }).fail(function (xhr, textStatus, errorThrown) {
            CallBackError(errorThrown);
        });
        return windowspop;
    } catch (e) {

        CallBackError(e);
        console.log(e);
    }
}

$(document).ready(function () {

    $("#btPagar").click(function () {
        paymentSerfinsa();
    });

});