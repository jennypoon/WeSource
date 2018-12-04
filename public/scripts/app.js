$(() => {
//------------ HOMEPAGE  ------------ //
  if (top.location.pathname === '/') {
    $.ajax({
    method: "GET",
    url: "/homepage"

  }).done((response) => {
    response.forEach(item => {
      $(`<a href="/resources/${item.resources_id}"><div class="card card-pin"><img class="card__img" src="${item.resources_imgurl}"/><p class="card__title">${item.resources_title}</p><p class="card__description">${item.resources_description}</p><p class="card__cat ${item.categories_category}">${item.categories_category}</p></div></a>`).prependTo($('.card-columns'));
    })
    });
  };

  //RATING BARS
  $(document).ready(function(){

    /* 1. Visualizing things on Hover - See next part for action on click */
    $('#stars li').on('mouseover', function(){
      let onStar = parseInt($(this).data('value'), 10); // The star currently mouse on

      // Now highlight all the stars that's not after the current hovered star
      $(this).parent().children('li.star').each(function(e){
        if (e < onStar) {
          $(this).addClass('hover');
        }
        else {
          $(this).removeClass('hover');
        }
      });

    }).on('mouseout', function(){
      $(this).parent().children('li.star').each(function(e){
        $(this).removeClass('hover');
      });
    });


    /* 2. Action to perform on click */
    $('#stars li').on('click', function(){
      let onStar = parseInt($(this).data('value'), 10); // The star currently selected
      let stars = $(this).parent().children('li.star');

      for (i = 0; i < stars.length; i++) {
        $(stars[i]).removeClass('selected');
      }

      for (i = 0; i < onStar; i++) {
        $(stars[i]).addClass('selected');
      }

      // JUST RESPONSE (Not needed)
      let ratingValue = parseInt($('#stars li.selected').last().data('value'), 10);
      let msg = "";
      if (ratingValue > 1) {
          msg = "Thanks! You rated this " + ratingValue + " stars.";
      }
      else {
          msg = "We will improve ourselves. You rated this " + ratingValue + " stars.";
      }
      responseMessage(msg);

    });
  });


  function responseMessage(msg) {
    $('.success-box').fadeIn(200);
    $('.success-box div.text-message').html("<span>" + msg + "</span>");
  }

//------------ SEARCH QUERY ------------ //

  $("#searchButton").on("click", (e) => {
    e.preventDefault();
    let searchKeyword = $('#searchKeyword').val();
    $('.searchAlert').hide();

    if (!searchKeyword) {
      console.log("nothing to search!!!!!");
      $('.searchAlert').show();
      return;
    }

    $.ajax({
      url: "/homepage/search",
      method: "GET",
      data: {
        search: searchKeyword
      },
      dataType: "json",
      success: function(response){
        $('.card-columns').empty();
        response.forEach(item => {
          $(`<a href="/resources/${item.resources_id}"><div class="card card-pin"><img class="card__img" src="${item.resources_imgurl}"/><p class="card__title">${item.resources_title}</p><p class="card__description">${item.resources_description}</p><p class="card__cat ${item.categories_category}">${item.categories_category}</p></div></a>`).prependTo($('.card-columns'));
        })
    },
      error: function(err){
        console.log("Search err", err);
      }
    });
  });

//------------ USER PROFILE PAGE ------------ //

 $('#edit').on('click', (e) => {
    e.preventDefault();
    console.log("edit button clicked!")
    $('body').addClass('fixed');
    $('#profileModal').show();
    $('#overlay').show();

    let data  = {
      name: $('#username').val(),
      aboutme: $('#useraboutme').val(),
      email: $('#useremail').val(),
      password: $('#password').val()
    };

$.ajax({
      url: "profile",
      type: "POST",
      data: data,
      success: function(response){
      console.log("success")
        $('#overlay').hide();
        $('#profileModal').hide();
        location.reload();
      },
      error: function(err){
        console.log("Search err", err);
      }
    });
});

//MODALS

//------------ LOGIN ------------ //
    $('#addLoggedOut').on('click', (e) => {
    e.preventDefault();
    $('body').addClass('fixed');
    $('#loginModal').show();
    $('#overlay').show();
  })

//------------ ADD NEW RESOURCE ------------ //

  $('#add').on('click', (e) => {
    e.preventDefault();
    $('body').addClass('fixed');
    $('#addResourceModal').show();
    $('#overlay').show();
  })

//------------ REGISTER USER ------------ //

  $('#registerUser').on('click', (e) => {
    e.preventDefault();
    $('body').addClass('fixed');
    $('#registerModal').show();
    $('#overlay').show();
  })

//------------ EDIT PROFILE MODAL ------------ //
  $('.editProfile').on('click', (e) => {
    e.preventDefault();
    $('body').addClass('fixed');
    $('#profileModal').show();
    $('#overlay').show();
  })


  $('#overlay').on('click', function() {
    $(this).hide();
    $('body').removeClass('fixed');
    $('#addResourceModal, #registerModal, #loginModal, #profileModal').hide();
  })

  $('.fa-times').on('click', function() {
    $('#overlay').hide();
    $('body').removeClass('fixed');
    $('#addResourceModal, #registerModal, #loginModal, #profileModal').hide();
  })

//------------ ADDING NEW RESOURCE ------------ //

  $('#addResource').on('click', (e) => {
    e.preventDefault();
    let category_id = $('#addResourceModal #category').find(':selected').val();

    let data  = {
      link: $('#url').val(),
      title: $('#title').val(),
      description: $('#description').val(),
      category_id: category_id
    };

    $.ajax({
      url: '/resources/add',
      data: data,
      type:'POST',
      success: function(result){
        let newPost = $(`<div class="card card-pin"><img class="card__img" src="${result.imgurl}"/><p class="card__title">${result.title}</p><textarea class="card__description">${result.description}</textarea><a href="${result.link}">${result.link}</a><p class="card__cat ${result.category}">${result.category}</p></div>`);
        $(newPost).prependTo($('.card-columns'))
        $('#overlay').hide();
        $('#addResourceModal').hide();
        location.reload();
      },
      error: function(error){
        console.log("we are in error :(", error);
      }
    });
  })


//------------ REGISTER NEW USER ------------ //
$('#register').on('click', (e) => {
    e.preventDefault();

    let register_id = $('#register').find(':selected').val();

    let data  = {
      email: $('#useremail').val(),
      username: $('#username').val(),
      password: $('#password').val(),
    };
    $.ajax({
      url: '/users/register',
      data: data,
      type:'POST',
      success: function(result){
        console.log("we are in success");
        $('#overlay').hide();
        $('#registerModal').hide();
        $('.register_msg').show()
      },
      error: function(error){
        console.log("we are in error");
      }
    });
  })

  let globalresourceId;
  $('#like_button').on('click', (e) => {
    e.preventDefault();

    let currentText = $('#like_button').text();

    if(currentText === "Like"){
        globalresourceId = $('#like_button').attr('value');
        let data = {
          resource_id: $('#like_button').attr('value')
        };

      $.ajax({
        url: 'like',
        data: data,
        type: 'POST',
        success: function(result) {
          $('#like_button').attr('value', result).text('Unlike');
        },
        error: function(error) {
          console.log("Error-Deleting Like");
        }
      });

    } else if(currentText === "Unlike") {
      e.preventDefault();

      let data = {
        like_id: $('#like_button').attr('value')
      };

      $.ajax({
        url: 'deletelike',
        data: data,
        type: 'POST',
        success: function(result) {
          $('#like_button').attr('value',globalresourceId).text('Like');
        },
        error: function(error) {
          console.log("Error - Deleting Like");
        }
      });
    }
  });


});

