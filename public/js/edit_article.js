
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

  $(document).on('click', function(evt) {
    if ( $(evt.target).data('edit') ) {
      var articleID = $(evt.target).data('edit')
      console.log('editing', articleID);
      return false;
    }
  });

  loadArticle()

})

function loadArticle(){
  var url = window.location.href.split('/')
  var articleID = url[url.length-1];
  $.get('/api/v1/article/' + articleID, function(article){
    $('#article-img').attr('src', article.img)
    $('#article-caption').val(article.caption)
    $('#article-description').html(article.description)
  })
}
