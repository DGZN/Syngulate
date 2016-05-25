$(function(){

  $('.tabular.menu .item')

  .tab({
    history:false
  })
  ;

  $('.ui.dropdown')
    .dropdown()
  ;

  $.get('/api/v1/articles', function(articles){
    for (i in articles) {
      var article = articles[i]
      $('#articles').append('<tr>\
      <td>\
      <img class="ui small image"\ src="'+article.img+'" /> \
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
      </td>\
      </tr>')
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
