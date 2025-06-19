$(document).ready(function () {
   
    function getCookie(name) {
        const cookies = document.cookie.split('; ');

        for (const cookie of cookies) {
            const [cookieName, cookieValue] = cookie.split('=');
            if (cookieName === name) {
                return cookieValue;
            }
        }

        return undefined;
    }

    $('button.submit-name').click(function (e) { 
        e.preventDefault();
        
        let signed_name = $('input#signed-name').val().trim();

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

        let username = $('input#username').val().trim();
        let password = $('input#password').val().trim();

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

    $('#add-post-form').submit(function(e){
        e.preventDefault();
        let title = $('input#add-post-title').val().trim();
        let content = $('textarea#add-post-content').val();
        let csrf_token = getCookie('csrf_access_token');
        
        $.ajax({
            type: "POST",
            url: "/admin/blog_post",
            contentType: 'application/json',
            data: JSON.stringify({ 
                title: title,
                content: title
            }),
            dataType: "json",
            xhrFields: { withCredentials: true },
            headers: { 'X-CSRF-TOKEN': csrf_token },
            success: function (response) {
                // Close the modal and add the blog post dynamically to the page
                console.log('Blog post added successfully');
            },
            error: function (xhr) {
                console.log('Error:', xhr.responseText);
            }
        });
    });
    
    // Insert the content and title for the post to edit into the edit modal
    $('button.edit-post').click(function(e){
        let id = $(this).attr('data-post-id');
        let title = $('#post-'+id+'-title').html();
        let content = $('#post-'+id+'-content').html();

        $('#edit-post-title').val(title);
        $('#edit-post-content').val(content);
        $('#edit-post-form').attr('data-post-id', id)
    });

    $('#edit-post-form').submit(function(e){
        e.preventDefault();
        let title = $('input#edit-post-title').val().trim();
        let content = $('input#edit-post-content').val();
        let id = $(this).attr('data-post-id');
        let csrf_token = getCookie('csrf_access_token');

        $.ajax({
            type: "PUT",
            url: "admin/blog_post/" + id,
            contentType: 'application/json',
            data: JSON.stringify({
                'title': title,
                'content': content
            }),
            dataType: "dataType",
            xhrFields: { withCredentials: true },
            headers: { 'X-CSRF-TOKEN': csrf_token },
            success: function (response) {
                console.log('Blog post edited successfully');
            },
            error: function(xhr) {
                console.log('Error', xhr.responseText);
            },
            finally: function() {
                $('#edit-post-title').val('');
                $('#edit-post-content').val('');
            }
        });
    });

    $('button.delete-post').click(function(){
        let id = $(this).attr('data-post-id');
        let title = $('#post-'+id+'-title').html();

        $('#deletePostModal p').html('<p>Are you sure you want to delete the blog post: ' + title + '?</p>');
        $('#deleteModalConfirm').attr('data-post-id', id);
    });

    $('#deleteModalConfirm').click(function(){
        let id = $(this).attr('data-post-id');
        let csrf_token = getCookie('csrf_access_token');

        $.ajax({
            type: 'DELETE',
            url: 'admin/blog_post/' + id,
            xhrFields: { withCredentials: true },
            headers: { 'X-CSRF-TOKEN': csrf_token },
            success: function (response){
                console.log('Blog post deleted successfully');
            },
            error: function (xhr) {
                console.log('Error', xhr.responseText);
            }
        });
    });
});