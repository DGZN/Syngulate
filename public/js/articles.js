
var publishList = []

$(function(){

  $('.tabular.menu .item')

  .tab({
    history:false
  })
  ;

  $('.ui.dropdown')
    .dropdown({
      onAdd: function(token, name){
        var account = token.split('::')
        publishList.push({
          id: account[1]
        , name: token
        , access_token: account[0]
        })
        return true;
      }
    , onRemove: function(token, name){
        var account = token.split('::')
        for (i in publishList) {
          var _acct = publishList[i]
          if (_acct.id == account[1]) {
            delete publishList[i]
          }
        }
      }
    })
  ;

  $.get('/api/v1/articles', function(articles){
    for (i in articles) {
      var article = articles[i]
      $('<tr />', {
        "data-article": JSON.stringify(article)
      , html: '<td>\
        <img class="ui small image" src="'+article.img+'" /> \
        </td>\
        <td class="single line">\
        <span>'+article.description+'</span>\
        </td>\
        <td class="single line">\
        '+article.likes+'\
        </td>\
        <td>\
        '+article.comments+'\
        </td>\
        <td >\
        '+article.shares+'\
        </td>\
        <td>\
        '+moment(article.date).fromNow()+'\
        </td>\
        <td>\
        Jane Doe\
        </td>\
        <td>\
        <i class="remove article large circle icon" data-id="'+article._id+'"></i>\
        <i class="edit article large icon" data-edit="'+article.fbID+'"></i>\
        </td>'
      }).appendTo('#articles').click(function(e){
        if ( $(e.target).data('id') ) {
          var articleID = $(e.target).data('id')
          $.ajax({
            type: "POST",
            url: '/api/v1/articles/' + articleID,
            method: 'DELETE',
            success: function(res){
              $(e.target).parent().parent().fadeOut(250).remove()
            }
          });
        } else {
          openPostModal($(this).data('article'))
        }
      })
    }
  })

  $(document).on('click', function(evt) {
    evt.preventDefault()
    if ( $(evt.target).data('edit') ) {
      var articleID = $(evt.target).data('edit')
      window.location = '/articles/' + articleID;
      return false;
    } else {
      if ( $(evt.target).data('id') ) {
        var articleID = $(evt.target).data('id')
        $.ajax({
          type: "POST",
          url: '/api/v1/articles/' + articleID,
          method: 'DELETE',
          success: function(res){
            $(evt.target).parent().parent().fadeOut(250).remove()
          }
        });
      }
      if ( $(evt.target).data('article') ) {
        var articleID = $(evt.target).data('id')
        openPostModal($(this).data('article'))
      }
    }
  });

})

function openPostModal(article){
  loadManagedPages()
  $('.ui.modal').data('article', article)
  $('#article-img').attr('src', article.img)
  $('#article-caption').val(article.caption)
  $('#article-description').html(article.description)
  $('.ui.modal')
    .modal({
      onApprove : function() {
        publishArticle(article)
      }
    })
    .modal('show')
  ;
}

function publishArticle(article){
  article.name = $('#article-name').val();
  article.caption = $('#article-caption').val();
  article.description = $('#article-description').val();
  for (i in publishList) {
    var account = publishList[i]
    $.post('https://graph.facebook.com/v2.6/'+account.id+'/feed', {
      published: 1
    , name: article.name
    , caption: article.caption
    , description: article.description
    , link: article.link
    , picture: article.img
    , message: article.description || ':)'
    , access_token: account.access_token
    }
    , function(res){
      console.log(res);
    })
  }
}

function loadManagedPages(){
  FB.api('/me/accounts', function(accounts) {
    for (i in accounts.data) {
      var account = accounts.data[i]
      $('#publish-pages-list').append('<option value="'+account.access_token+'::'+account.id+'">'+account.name+'</option>')
    }
  })
}
