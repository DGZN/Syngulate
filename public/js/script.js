$(function(){

  $('.tabular.menu .item')

  .tab({
    history:false
  })
  ;

  $('.ui.sticky')
  .sticky({
    context: '#example1'
  })
  ;

  $('#search').submit(function(e){
    e.preventDefault();
    var pageID = $('#pageID').val()
    $('#results').html('')
    FB.api('/' + pageID + '/posts?fields=link,created_time,full_picture,type,name,description,likes.limit(1).summary(true),shares,comments.limit(1).summary(true)', function(feed) {
      populateResults(feed)
      fetch(feed.paging.next)
    });
  })


})
const maxFetch = 4;
var fetchCount = 0;
function fetch(url){
  $.get(url, function(data){
    populateResults(data)
    fetchCount++
    if (fetchCount < maxFetch)
      fetch(data.paging.next)
  })
}

function populateResults(results){
  var data = []
  results.data.map((item) => {
    if (item.type !== 'status') {
      var card = {
          name: item.name || ''
        , type: item.type
        , img:  item.full_picture
        , shares: item.shares ? item.shares.count : 0
        , likes: item.likes.summary ? item.likes.summary.total_count : 0
        , comments: item.comments.summary ? item.comments.summary.total_count : 0
        , link: item.link
        , description: item.description || ''
        , date: item.created_time
        , elapsedTime: moment(item.created_time).fromNow()
      }
      if (card.type == 'photo') {
        card.name = ''
      }
      data.push(card)
    }
  })
  data.sort((a, b) => {
    return b.likes - a.likes
  })
  //data.pop()
  data.map((card, i) => {
    console.log(card);
    $('#results').append($('<div/>', {
      class: 'card'
    , "data-link": card.link
    , html: '<div class="image">                                               \
        <i class="card-type '+card.type+' "></i>                               \
        <img src="'+card.img+'">                                               \
        <span class="card-time">'+card.elapsedTime+'</span>                    \
      </div>                                                                   \
      <div class="content">                                                    \
        <div class="header">'+card.name+'</div>                                \
        <div class="meta">                                                     \
        '+card.description+'                                                   \
        </div>                                                                 \
        <div class="description">                                              \
        </div>                                                                 \
      </div>                                                                   \
      <div class="extra content">                                              \
        <span>                                                                 \
          <i class="likes icon"></i>                                           \
          '+card.likes+'                                                       \
        </span>                                                                \
        <span>                                                                 \
          <i class="_comments icon"></i>                                       \
          '+card.comments+'                                                    \
        </span>                                                                \
        <span>                                                                 \
          <i class="shares icon"></i>                                          \
          '+card.shares+'                                                      \
        </span>                                                                \
      </div>'
      , click: function(){
          var win = window.open($(this).data('link'), '_blank');
          win.focus();
        }
    }).hover(function(){
        $(this).find('.card-type,.card-time').fadeOut(0)
      }, function(){
        $(this).find('.card-type,.card-time').fadeIn(2800)
      })
    )
  })
}
