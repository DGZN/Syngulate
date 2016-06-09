
var publishList = []

$(function(){

  $('.tabular.menu .item')

  .tab({
    history:false
  })
  ;

  $('#pages')
    .dropdown()
  ;

  $('.ui.sticky')
  .sticky({
    context: '#results'
  })
;


})


$.get('/api/v1/scrapes', function(data){
  articles = data;
  return renderResults(data)
  for (i in articles) {
    var card = articles[i]
    setTimeout(function(){
      console.log(card);
      card.desc = card.desc.replace('<em>','').replace('</em>','').replace('<em>','').replace('</em>','').replace('<em>','').replace('</em>','')
      $('<div/>', {
        class: 'card'
        , html: '<div class="result image" style="background-image: url("'+card.img+'")">                             \                                               \
        <span class="card-time" >'+card.date+'</span>   \                                                                            \
        </div>                                                                                    \
        <div class="content">                                                                     \
        <div class="header">'+card.title+'</div>                                                   \
        <div class="meta">                                                                        \
        </h4>'+card.title+'                                                                      \
        '+card.desc+'                                                                      \
        </div>                                                                                    \
        <div class="description">                                                                 \
        </div>                                                                                    \
        </div>                                                                                    \
        <div class="extra content">                                                               \
        <span>                                                                                    \
        '+card.likes+'                                                                            \
        </span>                                                                                   \
        <span>                                                                                    \
        <i class="_comments icon"></i>                                                            \
        '+card.comments+'                                                                         \
        </span>                                                                                   \
        <span>                                                                                    \
        <i class="shares icon"></i>                                                               \
        '+card.shares+'                                                                           \
        </span>                                                                                   \
        </div>'
        , click: function(e){
          if (e.target.tagName == 'IMG') {
            var win = window.open($(this).data('link'), '_blank');
            win.focus();
          }

        }
      }).hide().appendTo('#results').fadeIn(75)
      .hover(function(){
        $(this).find('.card-type,.card-time').fadeOut(0)
      }, function(){
        $(this).find('.card-type,.card-time').fadeIn(0)
      })
    }, i * 55)
  }
})

var _articles = []

function renderResults(_articles) {
  $('#results').fadeOut(1).html('').fadeIn(10)
  _articles.sort((a, b) => {
    return b.likes - a.likes
  })
  _articles.map((card, i) => {
    setTimeout(function(){
      console.log(card);
      $('<div/>', {
        class: 'card'
        , "data-link": card.link
        , "data-card": card
        , html: '<div class="result image" data-type="'+card.type+'">                             \
        <img src="'+card.img+'">                                                                  \
        </div>                                                                                    \
        <div class="content">                                                                     \
        <div class="header">'+card.title+'</div>                                                   \
        <div class="meta">                                                                        \
        '+card.desc+'                                                                      \
        </div>                                                                                    \
        <div class="description">                                                                 \
        </div>                                                                                    \
        </div>                                                                                    \
        <div class="extra content">                                                               \
        <span>                                                                                    \
        </div>'
        , click: function(e) {
          if (e.target.tagName == 'IMG') {
            var win = window.open(card.link, '_blank');
            win.focus();
          }
        }
      }).hide().appendTo('#results').fadeIn(75)
    }, i * 15)
  })
}

function filterArticles(filter) {
  console.log("filtering articles", filter);
  articles.map((article) => {
    if (filter.type && filter.type == 'all') {
      return article;
    }
    if (filter.pageID) {
      if (article.pageID == filter.pageID)
        return article;
    }
    if (filter.type) {
      if (article.type == filter.type)
        return article;
    }
  })
  renderResults(articles)
}

function showFilterSidebar(){
  $('.demo.sidebar')
    .sidebar('toggle')
  ;
}

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
