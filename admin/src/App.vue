<template>
  <div class="app">
    <div class="ui fluid container">
      <div class="ui padded menu">
        <router-link to="/" class="item" active-class="active" exact>
            Dashboard
        </router-link>
        <router-link to="/content" class="item" active-class="active" exact>
          Content
        </router-link>
      </div>
    </div>
      <EditContentModal />
      <div class="ui fluid container">
        <router-view :settings="settings"></router-view>
      </div>
  </div>
</template>

<script>

import EditContentModal from './components/EditContentModal';


export default {
  data () {
    return {
      settings: {
        baseURI: 'http://dgzn.io:3131/api/v1'
      }
    }
  },
  components: {
    EditContentModal
  },
  methods: {
    toggleEditContentModal: () => {
      triggerModal()
    }
  }
}

function triggerModal(){
  $('.fullscreen.modal')
    .modal('show')
  ;
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Slabo+27px&subset=latin-ext');
</style>

<style>

html {
  height: 100%;
}

body {
  height: 100%;
  background-color: #75A3D1 !important;
}

/* Navbar Menu CSS */

.ui.menu .item > i.icon {
  margin: 0em !important;
}

</style>
