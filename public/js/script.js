$(function(){

  $('.tabular.menu .item')

  .tab({
    history:false
  })
  ;

  $('.ui.dropdown')
    .dropdown()
  ;

  $('.event.example .image')
    .dimmer({
      on: 'hover'
    })
  ;

  loadPages()

  $('#search').submit(function(e){
    e.preventDefault();
    var pageID = $('#pageID').val()
    searchPage(pageID)
  })

  $(document).on('click', function(evt) {
    if ( $(evt.target).data('type') ) {
      var filter = $(evt.target).data('type');
      $('.result').each(function(i){
        var type = $(this).data('type')
        if (filter == 'all') {
          return $(this).parent().fadeIn(1)
        }
        if (type !== filter) {
          $(this).parent().fadeOut(1)
        } else {
          $(this).parent().fadeIn(1)
        }
      })
    }
  });

})

const maxFetch = 600;
var fetchCount = 0;
var articles = [];

function filterResults(){
  var filter = $(this).data('type')
  $('.result').each(function(i, card){
    if (filter == 'all') {
      $(this).fadeIn(550)
    } else {
      var type = $(this).data('type')
      if (type !== filter) {
        $(this).fadeOut(500)
      } else {
        $(this).fadeIn(1200)
      }
    }
  })
}

function fetch(url){
  $.get(url, function(data){
    populateResults(data)
    fetchCount++
    if (fetchCount < maxFetch) {
      setTimeout(function(){
        fetch(data.paging.next)
      }, 1000)
    }
  })
}

function populateAnaltics(stats){
  var days = [];
  var total = 0;
  stats[0].values.map(function(day){
    var count = 0;
    for (i in day.value) {
      count += parseInt(day.value[i])
    }
    total += count
    days.push(count)
  })
  var today = days[days.length-1] - days[days.length-2]
  $('#like-stats-total, #like-stats-today').removeClass('hidden-fields')
  var options = {
    useEasing : true,
    useGrouping : true,
    separator : ',',
    decimal : '.',
    prefix : '',
    suffix : ''
  };
  var totalLikes = new CountUp("total-likes", 0, days[days.length-1], 0, 2.5, options);
  totalLikes.start();
}

function populateResults(results){
  var data = [];
  results.data.map(function(item){
    if (item.type !== 'status') {
      var likes = 0;
      if (item.likes && item.likes.summary) {
        likes = item.comments.summary.total_count
      }
      var card = {
          pageID: currentPageID || ''
        , fbID: item.id
        , name: item.name || ''
        , caption: item.caption || ''
        , type: item.type
        , img:  item.full_picture
        , shares: item.shares ? item.shares.count : 0
        , likes: likes
        , comments: item.comments.summary ? item.comments.summary.total_count : 0
        , link: item.link
        , description: item.description || ''
        , date: item.created_time
        , elapsedTime: moment(item.created_time).fromNow()
      }
      if (card.type == 'photo') {
        card.name = ''
      }
      articles.push(card);
      data.push(card)
    }
  })
  data.sort((a, b) => {
    return b.likes - a.likes
  })
  saveBatch(data)
  //renderResults(data)
}

function renderResults(data){
  data.map((card, i) => {
    setTimeout(function(){
      $('<div/>', {
        class: 'card'
        , "data-link": card.link
        , "data-card": card
        , html: '<div class="result image" data-type="'+card.type+'">                             \
        <i class="card-type '+card.type+' "></i>                                                  \
        <img src="'+card.img+'">                                                                  \
        <span class="card-time" onClick="addArticle.bind('+card+','+this+')">'+card.elapsedTime+'</span>   \
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
        , click: function(e){
          if (e.target.tagName == 'IMG') {
            var win = window.open($(this).data('link'), '_blank');
            win.focus();
          }
          if (e.target.tagName == 'I') {
            addArticle(card, e.currentTarget)
          }
        }
      }).hide().appendTo('#results').fadeIn(75)
      .hover(function(){
        $(this).find('.card-type,.card-time').fadeOut(0)
      }, function(){
        $(this).find('.card-type,.card-time').fadeIn(0)
      })
    }, i * 55)
  })
}

var sorted = false;

function sortResults(){
  if ( ! sorted ) {
    $('#results').html('')
    data.sort((a, b) => {
      return b.likes - a.likes
    })
    renderResults(data)
  }
}

var currentPageID = '';

function searchPage(pageID){
  currentPageID = pageID
  addPage(pageID)
  $('#results').html('')
  $('#like-stats-total, #like-stats-today').addClass('hidden-fields')
  FB.api('/' + pageID + '/insights/page_fans_country?period=lifetime', function(insights) {
    $('#like-stats-total').velocity({
      height: '120px'
    }, 110)
    setTimeout(function(){
      populateAnaltics(insights.data)
    }, 250)
  })
  FB.api('/' + pageID + '/posts?fields=link,created_time,full_picture,type,name,description,caption,likes.limit(1).summary(true),shares,comments.limit(1).summary(true)', function(feed) {
    populateResults(feed)
    fetch(feed.paging.next)
  });
}

function addPage(pageID){
  $.post('/api/v1/pages', {
    fbID: pageID
  }
  , function(res){
    console.log(res);
  })
}

function addArticle(article, card){
  $.post('/api/v1/articles', article
  , function(res){
    console.log(res);
    if (res.editLink) {
      var win = window.open(res.editLink, '_blank');
      win.focus();
    }
  })
  if (card) {
    $(card).fadeOut(500)
  }
}

function saveBatch(articles) {
  $.post('/api/v1/articles/batch', {
    articles: articles
  }
  , function(res){
    console.log(res);
    console.log("Last Article", res.articles['articles'][0].date);
  })
}

function loadPages(){
  $.get('/api/v1/pages', function(pages){
    var content = []
    for (i in pages) {
      content.push({
        pageID: pages[i].fbID
      })
    }
    console.log("content", content);
    $('.ui.search')
    .search({
      fields: {
        title   : 'pageID'
      },
      source : content,
      searchFields: [
        'pageID'
      ],
      onSelect: function(result, response){
        searchPage(result.pageID)
      }
    })
    ;
  })
}
