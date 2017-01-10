<template>
  <div class="ui very padded text segment">
    <div class="ui stackable two column grid">
      <div class="row">
          <div class="ui six wide column">
            <a :href="article.link" target="_blank">
              <img class="ui huge image" :src="article.img" >
            </a>
          </div>
          <div class="ui five wide column">
            <div class="ui fluid centered grid">
              <div class="centered column">
                <div class="ui blue huge statistic">
                  <div class="value">
                    {{ article.likes | number }}
                  </div>
                  <div class="label">
                    Likes
                  </div>
                </div>
                <br>
                <div class="ui black huge statistic">
                  <div class="value">
                    {{ article.comments | number }}
                  </div>
                  <div class="label">
                    Coments
                  </div>
                </div>
                <br>
                <div class="ui red huge statistic">
                  <div class="value">
                    {{ article.shares | number }}
                  </div>
                  <div class="label">
                    Shares
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script>

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-84488578-1', 'auto');
ga('send', 'pageview');

export default {

  props: ['settings'],

  data () {
    return {
      id: this.$route.params.guid,
      article: {
        likes: 0,
        img: '',
        link: ''
      },
      video: '',
      player: null
    }
  },

  created () {
    $.get(this.settings.baseURI + '/article/' + this.id, (article) => {
      this.article = article;
    })
  },

  mounted () {
    $('.menu .item')
      .tab()
    ;
    $('.preview-image').popup({
      inline: false
    })
  },

  beforeDestroy () {
  },


  filters: {
    capitalize: function (value) {
      if (!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    },
    number: function (value) {
      var value = value || 0;
      return value.toLocaleString();
    }
  },

  methods: {
    save: function () {
      var self = this;
      var id = self.asset['_id'];
      var asset = self.asset;
      delete asset['_id']
      var settings = {
        "async": true,
        "crossDomain": true,
        "url": this.settings.baseURI + '/api/v1/assets/' + id,
        "method": "POST",
        "headers": {
          "content-type": "application/json"
        },
        "processData": false,
        "data": JSON.stringify(asset)
      }

      $.ajax(settings).done(function (xhr) {
        this.asset = xhr.updated;
      }.bind(this));
    }
  }

}

$(document).ready(() => {

})

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.item {
  cursor: pointer;
}

.add.icon {
  position: absolute !important;
  top: 15px;
  right: 20px;
  cursor: pointer;
  opacity: .3;
}

.add.icon:hover {
  opacity: 1;
}

.remove.icon {
  position: absolute;
  top: 7px;
  right: 6px;
  cursor: pointer;
  opacity: .3;
}

.remove.icon:hover {
  opacity: 1;
}

</style>
