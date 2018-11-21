// This function will set up the page for adding a restaurant to a list.
function recRR(usr_id, rr_id) {
    console.log("recRR entry called!" + usr_id + rr_id);
    location.href = "/recRR/" + usr_id + "/" + rr_id + "/";
  }

// This function will set up the page for adding a restaurant to a list.
function addRR(lst_id, usr_id) {
  console.log("addRR entry called!" + usr_id +lst_id);
  location.href = "/addRR/" + usr_id + "/" + lst_id + "/";
}

// This function will set up the page for adding a list.
function addList(usr_id) {
  console.log("addList called!");
  location.href = "/addList/" + usr_id + "/";
}

// This function will set up the page for find another user.
function findFriend(lst_id) {
  console.log("findFriend called!");
  location.href = "/findFriend/" + lst_id ;
}

// This function will set up the page for editing user account.
function edit() {
  console.log("edit called!");
  location.href = "/edit";
}

// This function will redirect to where users list page.
function show_lists(usr_id) {
    console.log("show lists called!");
    location.href = "/lists/" + usr_id;
}

// Function to show the restauraunts in a chosen list.
function show_this_list(lst_id, usr_id) {
    console.log("show this list called!");
    location.href = "/lists/" + usr_id + "/" + lst_id;
}

// Function to show the restauraunts in a chosen rec list.
function show_rec_list(lst_id, usr_id) {
    console.log("show this list called!");
    location.href = "/lists/" + usr_id + "/rec/" + lst_id;
}

function delete_rr(lst_id, usr_id, rr_id) {
    console.log("delete this list called!");
    $.ajax({
        url: '/lists/' + usr_id + "/" + lst_id + "/" + rr_id,
        type: 'DELETE',
        success: function(result){
            location.href = "/lists/" + usr_id;
        }
    });
}

$(document).ready(function() {
    $('#delete-list-button').on('click tap', function (e) {
        lst_id = $(this).data("value1");
        usr_id = $(this).data("value2");
        $.ajax({
            url: '/lists/' + usr_id + "/" + lst_id,
            type: 'DELETE',
            success: function(result){
                location.href = "/lists/" + usr_id;
            }
        });       
    });

    $('#delete-rec-list-button').on('click tap', function (e) {
        lst_id = $(this).data("value1");
        usr_id = $(this).data("value2");
        $.ajax({
            url: '/lists/' + usr_id + "/rec/" + lst_id,
            type: 'DELETE',
            success: function(result){
                location.href = "/lists/" + usr_id;
            }
        });       
    });

    $('#del-rr-button').on('click tap', function (e) {
        lst_id = $(this).data("value1");
        usr_id = $(this).data("value2");
        rr_id = $(this).data("value3");
        isRec = $(this).data("value4");
        if (isRec) {
            // Route to recommendation list delete.
            console.log("In is rec: " + lst_id + " : " + usr_id + " : " + rr_id);
            $.ajax({
                url: '/lists/' + usr_id + "/rec/" + lst_id + "/" + rr_id,
                type: 'DELETE',
                success: function(result){
                    location.href = "/lists/" + usr_id + "/rec/" + lst_id;
                }
            });
        } else {
            // Route to priority list delete.
            console.log("In else.");
            $.ajax({
                url: '/lists/' + usr_id + "/" + lst_id + "/" + rr_id,
                type: 'DELETE',
                success: function(result){
                    location.href = "/lists/" + usr_id + "/" + lst_id;
                }
            });
        }       
    });

    $('#search-button').on('click tap', function (e) {
        lst_id = $(this).data("value1");
        $.ajax({
            url: '/findFriend/list/' + lst_id,
            type: 'POST',
            data: $('#search-friend').serializeArray(),
            success: function(result){
                location.href = "/findFriend/list/" + lst_id;
            }
        });       
    });
});
