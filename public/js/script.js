$(function(){

  $('.tabular.menu .item')

  .tab({
    history:false
  })
  ;

  $('.ui.dropdown')
    .dropdown()
  ;

  $('#search').submit(function(e){
    e.preventDefault();
    var pageID = $('#pageID').val()
    $('#results').html('')
    $('#like-stats-total, #like-stats-today').addClass('hidden')
    FB.api('/' + pageID + '/insights/page_fans_country?period=lifetime', function(insights) {
      populateAnaltics(insights.data)
    })
    FB.api('/' + pageID + '/posts?fields=link,created_time,full_picture,type,name,description,likes.limit(1).summary(true),shares,comments.limit(1).summary(true)', function(feed) {
      populateResults(feed)
      fetch(feed.paging.next)
    });
  })

  $(document).on('click', function(evt) {
    if ( $(evt.target).data('type') ) {
      var filter = $(evt.target).data('type');
      $('.result').each(function(i){
        var type = $(this).data('type')
        if (type !== filter) {
          $(this).parent().fadeOut(250)
        } else {
          $(this).parent().fadeIn(550)
        }
      })
    }
  });

})

const maxFetch = 4;
var fetchCount = 0;

function filterResults(){
  var filter = $(this).data('type')
  console.log("filter", filter);
  $('.result').each(function(i, card){
    if (filter == 'all') {
      $(this).fadeIn(550)
    } else {
      var type = $(this).data('type')
      if (type !== filter) {
        $(this).fadeOut(200)
      } else {
        $(this).fadeIn(550)
      }
    }
  })
}

function fetch(url){
  $.get(url, function(data){
    populateResults(data)
    fetchCount++
    if (fetchCount < maxFetch)
      fetch(data.paging.next)
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
  $('#like-stats-total, #like-stats-today').removeClass('hidden')
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
  var data = []
  results.data.map(function(item){
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
    $('#results').append($('<div/>', {
      class: 'card'
    , "data-link": card.link
    , html: '<div class="result image" data-type="'+card.type+'">              \
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
