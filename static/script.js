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
            },
            error: function(xhr) {
                alert(xhr.responseJSON.msg);
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
        console.log(content);
        let csrf_token = getCookie('csrf_access_token');
        
        $.ajax({
            type: "POST",
            url: "/admin/blog_post",
            contentType: 'application/json',
            data: JSON.stringify({ 
                title: title,
                content: content
            }),
            dataType: "json",
            xhrFields: { withCredentials: true },
            headers: { 'X-CSRF-TOKEN': csrf_token },
            success: function (response) {
                console.log('Blog post added successfully');
                let id = response.id;
                let title = response.title;
                let content = response.content;
                let date_posted = response.upload_date;
                let post_html = `<tr id="post-${id}-row">
                                    <th scope="row" class="align-middle">${id}</th>
                                    <th scope="row" class="align-middle" id="post-${id}-title">${title}</th>
                                    <th scope="row" class="align-middle" id="post-${id}-content">${content}</th>
                                    <th scope="row" class="align-middle">${date_posted}</th>
                                    <th scope="row" class="align-middle">
                                        <button class="delete-post" data-bs-toggle="modal" data-bs-target="#deletePostModal" data-post-id="${id}">Delete</button>
                                        <button class="edit-post" data-bs-toggle="modal" data-bs-target="#editPostModal" data-post-id="${id}">Edit</button>
                                    </th>
                                </tr>`;
                $('#blogPostTable tbody').append(post_html);
            },
            error: function (xhr) {
                console.log('Error:', xhr.responseText);
            },
            complete: function () {
                $('#add-post-title').val('');
                $('#add-post-content').val('');
                $('#addPostModal').modal('hide');
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
        let content = $('textarea#edit-post-content').val();
        let id = $(this).attr('data-post-id');
        let csrf_token = getCookie('csrf_access_token');
        console.log(content);

        $.ajax({
            type: "PUT",
            url: "admin/blog_post/" + id,
            contentType: 'application/json',
            data: JSON.stringify({
                'title': title,
                'content': content
            }),
            dataType: "json",
            xhrFields: { withCredentials: true },
            headers: { 'X-CSRF-TOKEN': csrf_token },
            success: function (response) {
                console.log('Blog post edited successfully');
                let id = response.id;
                let title = response.title;
                let content = response.content
                $('#post-'+id+'-title').html(title);
                $('#post-'+id+'-content').html(content);
            },
            error: function(xhr) {
                console.log('Error', xhr.responseText);
            },
            complete: function () {
                $('#edit-post-title').val('');
                $('#edit-post-content').val('');
                $('#editPostModal').modal('hide');
            }
        });
    });

    $('button.delete-post').click(function(){
        let id = $(this).attr('data-post-id');
        let title = $('#post-'+id+'-title').html();

        $('#deletePostModal div.modal-body').html('<p>Are you sure you want to delete the blog post: ' + title + '?</p>');
        $('#deletePostModalConfirm').attr('data-post-id', id);
    });

    $('#deletePostModalConfirm').click(function(){
        let id = $(this).attr('data-post-id');
        let csrf_token = getCookie('csrf_access_token');

        $.ajax({
            type: 'DELETE',
            url: 'admin/blog_post/' + id,
            xhrFields: { withCredentials: true },
            headers: { 'X-CSRF-TOKEN': csrf_token },
            success: function (response){
                console.log('Blog post deleted successfully');
                $(`#post-${id}-row`).remove();
                $('#deletePostModal').modal('hide');
            },
            error: function (xhr) {
                console.log('Error', xhr.responseText);
            }
        });
    });

    $('button.delete-user').click(function(){
        let id = $(this).attr('data-user-id');
        let name = $('#user-'+id+'-name').html();
        $('#deleteSignedModal div.modal-body').html(`<p>Are you sure you want to delete the user: ${name}?</p>`)
        $('#deleteSignedModalConfirm').attr('data-user-id', id);
    });

    $('#deleteSignedModalConfirm').click(function(){
        let id = $(this).attr('data-user-id');
        let csrf_token = getCookie('csrf_access_token');

        $.ajax({
            type: 'DELETE',
            url: '/admin/signed_name/' + id,
            xhrFields: { withCredentials: true },
            headers: { 'X-CSRF-TOKEN': csrf_token },
            success: function(response){
                console.log('Signed name deleted successfully');
                $(`#user-${id}-row`).remove();
                $('#deleteSignedModal').modal('hide');
            },
            error: function(xhr) {
                console.log('Error', xhr.responseText);
            }
        });
    });
});