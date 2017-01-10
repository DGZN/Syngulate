<template>
  <div class="ui fullscreen modal">
    <i class="close icon"></i>
    <div class="ui text segment upload-panel">



    </div>
    <div v-show="false" class="ui very padded text segment content">
      <div class="ui one column grid">
        <div class="row">
          <div class="ui very column">
            <h3 class="ui header">{{ asset.title }}</h3>
            <div class="desc">
              {{ asset.description }}
            </div>
          </div>
        </div>
      </div>
      <div class="ui two stackable column grid">
        <div class="row">
            <div class="ui eight wide column">
              <div id="player"></div>
            </div>
            <div class="ui eight wide column">
              <div class="ui two column stackable grid">
                <div class="column">
                  <h4 class="ui  header">Cast</h4>
                  <table class="ui compact small table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Character</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="person in asset.cast">
                        <td>
                          {{ person.name }}
                        </td>
                        <td>
                          {{ person.character }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="column">
                  <h4 class="ui header">Crew</h4>
                  <table class="ui compact small table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Roles</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="person in asset.crew">
                        <td>
                          {{ person.name }}
                        </td>
                        <td>
                          {{ roles(person.roles) }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      guid: this.$route.params.guid,
      asset: '',
      video: ''
    }
  },

  created () {
    
  },

  methods: {
    roles: (roles) => {
      return roles.join(' / ')
    },
    playVideo: function (url) {
      if ( ! url.length )
        return;
      this.video = url
      jwplayer("player").setup({
        "file": url,
        "fullscreen": true,
        "autostart": true,
      });
    }
  }

}


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.item {
  cursor: pointer;
}

.upload-panel {
  min-height: 600px;
  background-color: #373737;
}

</style>
