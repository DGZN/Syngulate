
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
        <td class="right aligned">\
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
        </td>'
      }).appendTo('#articles').click(function(){
        openPostModal($(this).data('article'))
      })
    }
  })

  $(document).on('click', function(evt) {
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
  });

})

function openPostModal(article){
  loadManagedPages()
  $('.ui.modal').data('article', article)
  $('#modal-title').html(article.name)
  $('#modal-img').attr('src', article.img)
  $('#modal-content').html(article.description)
  $('.ui.modal')
    .modal({
      onApprove : function() {
        publishArticle(article)
      }
    })
    .modal('show')
  ;
  console.log("I was clicked", $('.ui.modal').data('article'));
}

function publishArticle(article){
  console.log("publishing article", article);
  for (i in publishList) {
    var account = publishList[i]
    $.post('https://graph.facebook.com/v2.6/'+account.id+'/feed', {
      message: article.description || ':)'
    , picture: article.img
    , link: 'syngulate.com'
    , published: 1
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
