$(document).ready(function () {
   
    $('button.submit-name').click(function (e) { 
        e.preventDefault();
        
        var signed_name = $('input#signed-name').val().trim();

        // console.log(signed_name);
        if (signed_name) {
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

        } else{
            alert("The name you want to sign cannot be empty!");
        }
    });

});