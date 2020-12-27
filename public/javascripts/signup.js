(function ($) {
    "use strict";

    /*==================================================================
    [ Validate ]*/
    const input = $('.validate-input .input100');

    $('.validate-form').submit(function(event) {

        event.preventDefault();

        let check = true;
        for(var i=0; i<input.length; i++) {
            if(validate(input[i]) === false){
                showValidate(input[i]);
                check=false;
            }
        }

        if(check) {
            const username = $('input[name="username"]').val();
            const password = $('input[name="pass"]').val();

            $.ajax({
                url: "/users",
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
                            failAlert.value = data.reason;
                            failAlert.addClass("alert-fail");
                            setTimeout(() => {
                                failAlert.removeClass("alert-fail");
                            }, 800);
                        }
                    }
                    else {
                        alert("회원가입이 완료되었습니다.");
                        location.href = data.href;
                    }
                },
                error: (req, state, error) => {
                    alert("회원가입 실패." + data.reason);
                    console.log(error);
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
        const name = $(input).attr("name");
        const val = $(input).val();
        console.log(name);

        if(val.trim() === "")
            return false;

        if(name === "username")
            return val.length < 5 ? false: true;
        else if(name === "pass")
            return val.length < 8 ? false : true;
        else {
            const pass = $("input[name='pass']").eq(0).val();
            return pass !== val ? false : true;
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