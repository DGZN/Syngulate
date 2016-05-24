$(function(){

  $('.tabular.menu .item').tab({history:false});

  $('#search').submit(function(e){
    e.preventDefault();
    var pageID = $('#pageID').val()
    $('#results').html('')
    FB.api('/' + pageID + '/posts?fields=link,full_picture,type,name,likes.limit(1).summary(true),shares,comments.limit(1).summary(true)', function(feed) {
      populateResults(feed)
    });
  })
})

function populateResults(results){
  var data = []
  console.log(results.data);
  results.data.map((item) => {
    if (item.type !== 'status') {
      var card = {
          name: item.name || ''
        , type: item.type
        , img: item.full_picture
        , shares: item.shares ? item.shares.count : 0
        , likes: item.likes.summary ? item.likes.summary.total_count : 0
        , comments: item.comments.summmary ? item.comments.summmary.total_count : 0
        , link: item.link
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
  console.log(data);
  data.pop()
  data.map((card, i) => {
    $('#results').append($('<div/>', {
      class: 'card'
    , "data-link": card.link
    , html: '<div class="image">                                               \
        <i class="card-type '+card.type+' "></i>                               \
        <img src="'+card.img+'">                                               \
      </div>                                                                   \
      <div class="content">                                                    \
        <div class="header">'+card.name+'</div>                                \
        <div class="meta">                                                     \
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
    }))
  })
}
