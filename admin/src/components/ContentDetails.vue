<template>
  <div class="ui very padded text segment">
    <div class="ui two stackable column grid">
      <div class="row">
          <div class="ui eight wide column">
            <div id="playerdiv"></div>
          </div>
          <div class="ui eight wide column" v-show="true">
            <div class="ui top attached tabular menu">
              <a class="item active" data-tab="general">General</a>
              <a class="item" data-tab="cast-crew">People</a>
              <a class="item" data-tab="meta">Meta</a>
              <a class="item" data-tab="details">Details</a>
              <a class="item" data-tab="assets">Assets</a>
              <a class="right item">
                <i @click="save" class="save icon"></i>
              </a>
            </div>
            <div class="ui bottom attached tab segment active" data-tab="general">
              <div class="ui one column stackable grid">
                <div class="column">
                  <div class="ui form">
                    <div class="ui two column stackable form grid">
                      <div class="column">
                        <div class="field">
                          <label>Title</label>
                          <input type="text" placeholder="Title..." v-model="asset.title">
                        </div>
                      </div>
                      <div class="column">
                        <div class="field">
                          <label>GUID</label>
                          <input type="text" placeholder="GUID..." v-model="asset.guid">
                        </div>
                      </div>
                      <div class="sixteen wide column">
                        <div class="field">
                          <label>Description</label>
                          <textarea rows="5" v-model="asset.description"></textarea>
                        </div>
                      </div>
                      <div class="column">
                        <div class="field">
                          <label>Distributor</label>
                          <div class="ui fluid input">
                            <input type="text" placeholder="Distributor..." v-model="asset.distributor">
                          </div>
                        </div>
                      </div>
                      <div class="column">
                        <div class="field">
                          <label>Language</label>
                          <div class="ui fluid input">
                            <input type="text" placeholder="Language..." v-model="asset.language">
                          </div>
                        </div>
                      </div>
                      <div class="column">
                        <div class="field">
                          <label>Type</label>
                          <div class="ui fluid input">
                            <input type="text" placeholder="Type..." v-model="asset.type">
                          </div>
                        </div>
                      </div>
                      <div class="column">
                        <div class="field">
                          <label>Runtime</label>
                          <div class="ui fluid input">
                            <input type="text" placeholder="Runtime..." v-model="asset.runtime">
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="ui bottom attached tab segment" data-tab="cast-crew">
              <div class="ui two column stackable grid">
                <div class="column">
                  <h5 class="ui  header">Cast</h5>
                  <i @click="addCast()" class="add icon"></i>
                  <table class="ui compact small table">
                    <tbody>
                      <tr v-for="person, index in asset.cast">
                        <td>
                          <div class="ui fluid input">
                            <input type="text" placeholder="Name..." v-model="person.name">
                          </div>
                        </td>
                        <td>
                          <div class="ui fluid input">
                            <input type="text" placeholder="Character..." v-model="person.character">
                            <i @click="removeCast(index)" class="remove icon"></i>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="column">
                  <h5 class="ui header">Crew</h5>
                  <i @click="addCrew()" class="add icon"></i>
                  <table class="ui compact small table">
                    <tbody>
                      <tr v-for="person, index in asset.crew">
                        <td>
                          <div class="ui fluid input">
                            <input type="text" placeholder="Name..." v-model="person.name">
                          </div>
                        </td>
                        <td>
                          <div class="ui fluid input">
                            <input type="text" placeholder="Roles..." :value="formatRoles(person.roles)">
                            <i @click="removeCrew(index)" class="remove icon"></i>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

              </div>
            </div>
            <div class="ui bottom attached tab segment" data-tab="meta">
              <div class="ui two column stackable grid">
                <div class="column">
                  <h5 class="ui header">Genres</h5>
                  <i @click="addGenre()" class="add icon"></i>
                  <table class="ui compact small table">
                    <tbody>
                      <tr v-for="genre, index in asset.genres">
                        <td>
                          <div class="ui fluid input">
                            <input type="text" placeholder="Genre..." v-model="genre.name">
                            <i @click="removeGenre(index)" class="remove icon"></i>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="column">
                  <h5 class="ui header">Ratings</h5>
                  <i @click="addRating()" class="add icon"></i>
                  <table class="ui compact small table">
                    <thead v-show="false">
                      <tr>
                        <th>Country</th>
                        <th>Rating</th>
                        <th>Code</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="rating, index in asset.ratings">
                        <td>
                          <div class="ui fluid input">
                            <input type="text" placeholder="Country..." v-model="rating.country">
                          </div>
                        </td>
                        <td>
                          <div class="ui fluid input">
                            <input type="text" placeholder="Rating..." v-model="rating.code">
                          </div>
                        </td>
                        <td>
                          <div class="ui fluid input">
                            <input type="text" placeholder="Code..." v-model="rating.name">
                            <i @click="removeRating(index)" class="remove icon"></i>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div class="ui bottom attached tab segment" data-tab="details">
              <div class="ui two column stackable grid">
                <div class="ui sixteen wide column">
                  <div class="ui two column stackable grid">
                    <div class="ui form column">
                      <div class="field">
                        <label>Category Title</label>
                        <div class="ui fluid input">
                          <input type="text" placeholder="Category Title..." v-model="asset.tags.categoryTitle">
                        </div>
                      </div>
                    </div>
                    <div class="ui form column">
                      <div class="field">
                        <label>Subscriber Type</label>
                        <div class="ui fluid input">
                          <input type="text" placeholder="Expiry Date..." v-model="asset.tags.subscriberType">
                        </div>
                      </div>
                    </div>
                    <div class="ui form column">
                      <div class="field">
                        <label>Expiry Date</label>
                        <div class="ui fluid input">
                          <input type="text" placeholder="Expiry Date..." v-model="asset.expiryDate">
                        </div>
                      </div>
                    </div>
                    <div class="ui form column">
                      <div class="field">
                        <label>Release Date</label>
                        <div class="ui fluid input">
                          <input type="text" placeholder="Expiry Date..." v-model="asset.releaseDate">
                        </div>
                      </div>
                    </div>
                    <div class="ui form column">
                      <div class="field">
                        <label>Source</label>
                        <div class="ui fluid input">
                          <input type="text" placeholder="Source..." v-model="asset.source">
                        </div>
                      </div>
                    </div>
                    <div class="ui form column">
                      <div class="field">
                        <label>Quality</label>
                        <div class="ui fluid input">
                          <input type="text" placeholder="Quality..." v-model="asset.quality">
                        </div>
                      </div>
                    </div>
                    <div class="ui form column">
                      <div class="field">
                        <label>DRM</label>
                        <div class="ui fluid input">
                          <input type="text" placeholder="DRM..." v-model="asset.drm">
                        </div>
                      </div>
                    </div>
                    <div class="ui form column">
                      <div class="field">
                        <label>Subtitles</label>
                        <div class="ui fluid input">
                          <input type="text" placeholder="Subtitles..." v-model="asset.subtitles">
                        </div>
                      </div>
                    </div>
                    <div class="ui form column">
                      <div class="field">
                        <label>Star Rating</label>
                        <div class="ui fluid input">
                          <input type="text" placeholder="Star Rating..." v-model="asset.starRating">
                        </div>
                      </div>
                    </div>
                    <div class="ui form column">
                      <div class="field">
                        <label>Order Priority</label>
                        <div class="ui fluid input">
                          <input type="text" placeholder="Order Priority..." v-model="asset.orderPriority">
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="ui one column stackable grid">
                    <div class="ui form column">
                      <div class="field">
                        <label>Video URL</label>
                        <div class="ui fluid input">
                          <input type="text" placeholder="JW Platform Video URL..." v-model="asset.videos[0].url">
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="ui bottom attached tab segment" data-tab="assets">
                <div class="preview-image" v-for="image in asset.images">
                  <img :src="image.url" >
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
      guid: this.$route.params.guid,
      asset: {
        tags: {
          subscriberType: '',
          categoryTitle: ''
        },
        images: [],
        videos: [{
          url: ''
        }]
      },
      video: '',
      player: null
    }
  },

  created () {
    $.get(this.settings.baseURI + '/api/v1/assets', (assets) => {
      this.assets = assets;
      var matched = '';
      assets.map((asset) => {
        if (asset.guid == this.guid) {
          this.asset = asset;
          this.video = asset.videos[0].url;
          this.playVideo(this.video)
        }
      })
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
    if (this.player)
      this.player.remove()
  },


  filters: {
    capitalize: function (value) {
      if (!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
  },

  methods: {
    playVideo: function (url) {
      if ( ! url.length )
        return '';
      this.player = jwplayer("playerdiv").setup({
        "file": url,
        "fullscreen": false,
        "autostart": false,
      });
    },
    addGenre: function () {
      this.asset.genres.push({
        name: ''
      })
    },
    addRating: function () {
      this.asset.ratings.push({
        name: '',
        country: '',
        code: ''
      })
    },
    addCast: function () {
      this.asset.cast.push({
        name: '',
        character: ''
      })
    },
    addCrew: function () {
      this.asset.crew.push({
        name: '',
        roles: []
      })
    },
    removeGenre: function (index) {
      this.asset.genres = this.asset.genres.filter((genre, i) => {
        if (i != index)
          return true;
      })
    },
    removeRating: function (index) {
      this.asset.ratings = this.asset.ratings.filter((rating, i) => {
        if (i != index)
          return true;
      })
    },
    removeCast: function (index) {
      this.asset.cast = this.asset.cast.filter((cast, i) => {
        if (i != index)
          return true;
      })
    },
    removeCrew: function (index) {
      this.asset.crew = this.asset.crew.filter((crew, i) => {
        if (i != index)
          return true;
      })
    },
    formatRoles: function (roles) {
      return roles.join(', ')
    },
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
