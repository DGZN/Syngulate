
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

  $('.filters.dropdown')
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

  $('.filter-all').click(function(){
    filterArticles({
      type: 'all'
    })
  })

})

$.get('/api/v1/pages', function(pages){
  var content = []
  for (i in pages) {
    content.push({
      pageID: pages[i].fbID
    })
    $('<a />', {
      class: 'fbPage item'
    , "data-fbID": pages[i].fbID
    , html: pages[i].fbID
    }).appendTo('#filter-page-menu')
  }
  $('.fbPage').click(function(e){
    filterArticles({
      pageID: $(e.target).data('fbid')
    })
  })
  $('.filter-image').click(function(e){
    filterArticles({
      type: $(e.target).data('type')
    })
  })
  console.log("content", content);
})


$.get('/api/v1/articles/TheMindUnleashed?type=photo', function(data){
  articles = data;
  console.log("Article Count ", data.length);
  return renderResults(data)
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
      if ( $(evt.target).data('edit') ) {
        var articleID = $(evt.target).data('edit')
        window.location = '/articles/' + articleID;
        return false;
      }
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

var _articles = []

function renderResults(_articles) {
  $('#results').fadeOut(1).html('').fadeIn(10)
  _articles.sort((a, b) => {
    return b.likes - a.likes
  })
  _articles.map((card, i) => {
    setTimeout(function(){
      $('<div/>', {
        class: 'card'
        , "data-link": card.link
        , "data-card": card
        , html: '<div class="result image" data-type="'+card.type+'">                             \
        <i class="card-type '+card.type+' "></i>                                                  \
        <img src="'+card.img+'">                                                                  \
        <span class="card-time" onClick="addArticle.bind('+card+','+this+')">'+moment(card.date).fromNow()+'</span>   \
        <span class="add-article">                                                                \
          <i class="add circle icon"></i>                                                         \
        </span>                                                                                   \
        </div>                                                                                    \
        <div class="content">                                                                     \
        <div class="header">'+card.name+'</div>                                                   \
        <div class="meta">                                                                        \
        '+card.description+'                                                                      \
        </div>                                                                                    \
        <div class="description">                                                                 \
        </div>                                                                                    \
        </div>                                                                                    \
        <div class="extra content">                                                               \
        <span>                                                                                    \
        <i class="likes icon"></i>                                                                \
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
  article.img = 'https://scontent.fsnc1-2.fna.fbcdn.net/v/t1.0-1/c40.0.160.160/p160x160/13770261_1303710409654223_8338364428569364400_n.jpg?oh=871efa5aa69cabbb554592dbdbb7a224&oe=58300F9F'
  article.link = 'https://scontent.fsnc1-2.fna.fbcdn.net/v/t1.0-1/c40.0.160.160/p160x160/13770261_1303710409654223_8338364428569364400_n.jpg?oh=871efa5aa69cabbb554592dbdbb7a224&oe=58300F9F'
  // var account = {}
  // account.id = '1303709329654331'
  // console.log("publishing", article)
  // $.post('https://graph.facebook.com/v2.6/'+account.id+'/feed', {
  //   published: true
  // , message: article.description || ':)'
  // }
  // , function(res){
  //   console.log(res);
  // })
  for (i in publishList) {
    var account = publishList[i]
    console.log("account", account)
    // $.post('https://graph.facebook.com/v2.6/'+account.id+'/feed', {
    //   published: 1
    // , name: article.name
    // , caption: article.caption
    // , description: article.description
    // , link: article.link
    // , picture: article.img
    // , message: article.description || ':)'
    // , access_token: account.access_token
    // }
    // , function(res){
    //   console.log(res);
    // })
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
