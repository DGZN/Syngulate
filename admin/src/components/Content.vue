<template>
  <div class="">
    <div id="filter-panel" class="ui padded segment">
      <div class="ui transparent icon search input">
        <input id="search" type="text" placeholder="Search...">
      </div>
      <div class="ui text right aligned filter ">
        <select name="typeDropdown" multiple="" class="ui types multiple selection tiny dropdown">
          <option v-for="type in types" :value="lowercase(type)">{{ type }}</option>
        </select>
        <div class="view icons">
          <i v-show="view == 'table'" @click="panelView()" class="ui browser icon"></i>
          <i v-show="view == 'panel'" @click="tableView()" class="ui tasks icon"></i>
        </div>
      </div>
    </div>
    <div v-show="view == 'table'" class="ui padded text segment">
      <table class="ui table">
        <tbody>
          <tr v-for="article in articles" class="top aligned" @click="routeTo(article.fbID)">
            <td>
              <h2 class="ui dividing header">
                {{ article.name }}
              </h2 class="ui dividing header">
              <img :src="article.img" alt="" />
            </td>
            <td>
              <div class="ui very padded segment">
                <div class="ui fluid centered grid">
                  <div class="centered column">
                    <div class="ui blue medium statistic">
                      <div class="value">
                        {{ article.likes }}
                      </div>
                      <div class="label">
                        Likes
                      </div>
                    </div>
                    <br>
                    <div class="ui black medium statistic">
                      <div class="value">
                        {{ article.comments }}
                      </div>
                      <div class="label">
                        Coments
                      </div>
                    </div>
                    <br>
                    <div class="ui red medium statistic">
                      <div class="value">
                        {{ article.shares }}
                      </div>
                      <div class="label">
                        Shares
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <th></th>
            <th colspan="2"></th>
          </tr>
        </tfoot>
      </table>
    </div>
    <div v-show="view == 'panel'" class="ui padded text segment">
      <div class="ui doubling cards">
        <div @click="routeTo(article.fbID)" class="ui centered raised card" v-for="article in orderedArticles" v-show="match(article.pageID)">
          <div class="image">
            <img :src="article.img">
          </div>
          <div class="content">
            <h5>
              {{ article.name }}
            </h5>
          </div>
          <div class="extra content">
            <h5>
              {{ article.pageID }}
            </h5>
          </div>
          <a class="ui bottom right attached label">{{ article.likes }} likes</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {

    props: ['settings'],

    data () {
      return {
        view: 'panel',
        keyword: '',
        filter: {
          types: []
        },
        articles: []
      }
    },
    computed: {
      orderedArticles: function () {
        var articles = this.articles.sort((a, b) => {
          return b.likes - a.likes;
        })
        if (this.filter.types.length==0) {
          return articles;
        } else {
          var articles = [];
          var filters = this.filter.types;
          this.articles.filter((article) => {
            if (filters.indexOf(article.type)>=0) {
              articles.push(article)
            }
          })
          return articles.sort((a, b) => {
            return b.likes - a.likes;
          })
        }
      },
      types: function () {
        return ['Link', 'Photo', 'Video'];
      },
    },
    created: function () {
      $.get(this.settings.baseURI + '/articles', (articles) => {
        this.articles = articles;
      })
    },
    mounted: function () {
      var self = this;
      $('.ui.dropdown')
        .dropdown('set text', 'Types')
        .dropdown({
          onAdd: (added) => {
            if (this.filter.types.indexOf(added)==-1)
              this.filter.types.push(added)
          },
          onRemove: (removed) => {
            var types = this.filter.types;
            this.filter.types.splice(types.indexOf(removed), 1)
          },
          onLabelCreate: function (value, text) {
            $(this).addClass('tiny')
            return $(this)
          }
        })
      ;
      $('#search')
        .bind('input', function() {
          var keyword = $(this).val()
          if ( keyword.length > 3 ) {
            self.keyword = keyword
          } else {
            self.keyword = ''
          }
        })
      ;
      function scroll(e) {
        var currentTop = $(window).scrollTop()
        if (currentTop > 50) {
          $('#filter-panel').addClass('fixed menu')
        } else {
          $('#filter-panel').removeClass('fixed menu')
        }
      }
      window.onscroll = scroll;
    },
    methods: {
      match: function (pageID) {
        if (this.keyword.length) {
          var match = pageID.toLowerCase().search(this.keyword.toLowerCase())
          if ( match == -1 )
            return false;
        }
        return true;
      },
      uppercase: function (string) {
        return string.toUpperCase()
      },
      lowercase: function (string) {
        return string.toLowerCase()
      },
      route: function (guid) {
        return '/content/' + guid
      },
      routeTo: function (id) {
        this.$router.push({ path: '/content/' + id })
      },
      tableView: function () {
        this.view = 'table'
      },
      panelView: function () {
        this.view = 'panel'
      }
    }
  }
</script>

<style scoped>
  tr {
    position: relative;
    vertical-align: top;
  }
  tr > td {
    cursor: pointer;
  }

  h1 {
    margin: 0.5rem 0 0.4rem 0 !important;
    font-size: 1.6rem !important;
    font-weight: 300 !important;
  }

  h2 {
    font-size: 1.2rem !important;
    font-weight: 200 !important;
  }

  h3 {
    font-size: 1.2rem !important;
    font-weight: 200 !important;
  }

  .description {
    max-width: 55%;
  }

  .icon {
    cursor: pointer;
  }

  .card {
    cursor: pointer;
  }

  .filter {
    position: absolute;;
    top: 0.68rem;
    right: 2rem;
    float: right;
    display: block;
  }

  .ui.label.tiny {
    font-size: 0.8em !important;
  }

  .search.input {
    width: 55% !important;
  }

  .view.icons {
    position: relative;
    float: right;
    margin-top: 0.8rem;
    margin-right: 1.7rem;
    margin-left: 2rem;
  }
</style>
