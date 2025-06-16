$(document).ready(function () {
   
    $('button.submit-name').click(function (e) { 
        e.preventDefault();
        
        var signed_name = $('input#signed-name').val().trim();

        $.ajax({
            type: "POST",
            url: "sign_name",
            contentType: 'application/json',
            data: JSON.stringify({'signed_name': signed_name}),
            dataType: "json",
            success: function (response) {
                console.log(response);
                location.reload();
            }
        });        
    });

    $('#login-form').submit(function(e){
        e.preventDefault(); // Prevent normal form submission

        var username = $('input#username').val().trim();
        var password = $('input#password').val().trim();

        $.ajax({
            type: "POST",
            url: "login",
            contentType: 'application/json',
            data: JSON.stringify({
                'username': username,
                'password': password
            }),
            dataType: "json",
            success: function (response) {
                console.log(response);
                location.replace('admin');
            },
            error: function (response){
                alert(response.responseJSON.msg);
            }
        });
    });
});