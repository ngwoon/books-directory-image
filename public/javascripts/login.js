(function ($) {
    "use strict";

    /*==================================================================
    [ Validate ]*/
    const input = $('.validate-input .input100');

    $('.validate-form').submit(function(event) {

        event.preventDefault();

        let check = true;
        for(var i=0; i<input.length; i++) {
            if(validate(input[i]) == false){
                showValidate(input[i]);
                check=false;
            }
        }

        if(check) {
            const username = $('input[name="username"]').val();
            const password = $('input[name="pass"]').val();

            $.ajax({
                url: "/session",
                async: true,
                dataType: "json",
                type: "POST",
                data: {
                    username: username,
                    pass: password,
                },
                success: (data) => {
                    console.log(data);
                    if(data.state === "fail") {
                        const failAlert = $(".fail").eq(0);
                        if(failAlert.css("visibility") === "hidden")
                            failAlert.css("visibility", "visible");
                        else {
                            failAlert.addClass("alert-fail");
                            setTimeout(() => {
                                failAlert.removeClass("alert-fail");
                            }, 800);
                        }
                    }
                    else
                        location.href = data.href;
                },
                error: (req, state, error) => {
                    alert(error);
                    console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
                },
            });
        }
    });

    $('.validate-form .input100').each(function(){
        $(this).focus(function(){
           hideValidate(this);
        });
    });

    function validate (input) {
        if($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
            if($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                return false;
            }
        }
        else {
            if($(input).val().trim() == ''){
                return false;
            }
        }
    }

    function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).removeClass('alert-validate');
    }
    
    

})(jQuery);