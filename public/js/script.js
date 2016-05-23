$(function(){

  $('.tabular.menu .item').tab({history:false});

  $('#search').submit(function(e){
    e.preventDefault();
    var pageID = $('#pageID').val()
    $('#results').html('')
    FB.api('/' + pageID + '/posts?fields=full_picture,type,name,likes.limit(1).summary(true),shares,comments.limit(1).summary(true)', function(feed) {
      populateResults(feed)
    });
  })
})

function populateResults(results){
  var data = []
  results.data.map((item) => {
    if (item.type !== 'status') {
      data.push({
        name: item.name || ''
        , type: item.type
        , img: item.full_picture
        , shares: item.shares ? item.shares.count : 0
        , likes: item.likes.summary ? item.likes.summary.total_count : 0
        , comments: item.comments.summmary ? item.comments.summmary.total_count : 0
      })
    }
  })
  data.sort((a, b) => {
    return b.likes - a.likes
  })
  data.pop()
  data.map((card, i) => {
    $('#results').append($('<div/>', {
      class: 'card'
    , html: '<div class="image">                                               \
        <img src="'+card.img+'">                                               \
      </div>                                                                   \
      <div class="content">                                                    \
        <div class="header">'+card.name+'</div>                                \
        <div class="meta">                                                     \
          <a>'+card.type+'</a>                                                 \
        </div>                                                                 \
        <div class="description">                                              \
        </div>                                                                 \
      </div>                                                                   \
      <div class="extra content">                                              \
        <span>                                                                 \
          <i class="user icon"></i>                                            \
          '+card.shares+'                                                      \
        </span>                                                                \
        <span class="right floated">                                           \
          '+card.comments+'                                                    \
        </span>                                                                \
      </div>'
    }))
  })
}
