(function() {
  Polymer({
    is: 'kf-mixer',

    properties: {
      radios: {
        type: Array
      },
      playlist: {
        type: Array,
        value: [{
          title: 'a'
        }],
        notify: true
      }
    },

    loaded: function() {

    },
    prepare: function() {
      if (!this.radios) {
        var r = [];
        for (var i = this.items.length - 1; i >= 0; i--) {
          var radio = {
            'name': this.items[i].name,
            'key': this.items[i].__firebaseKey__,
            'image': this.items[i].icon || '../../images/' + this.items[i].__firebaseKey__ + '.png',
            'sliderval': 0
          };
          r.push(radio);
        }
        this.set('radios', r);
        console.log('Prepared');

        document.querySelector("#loginbox").addEventListener("response", function(e) {
          console.log("Your spotify bearer token is" + e.detail["!/#access_token"]);
        });
      }
    },
    ready: function() {
      console.log(this.radios);
    },
    loginToSpotify: function() {
      this.$.loginbox.open();
    },
    sliderChanged: function(e, detail, sender) {

      console.log('Slider changed for channel ' + e.model.item.key + ' to ' + detail.value);

    },
    sendVals: function() {
      var self = this;
      var currentday = Math.floor(Date.now() / 8.64e7);
      console.log("Current day=" + currentday);

      var playlistlength = 20;

      var totalweight = 0;
      this.radios.map(function(radio) {
        totalweight += radio.sliderval;
      });


      this.radios.map(function(radio) {
        if (radio.sliderval > 0) {
          var list = new Firebase("https://popping-heat-1762.firebaseio.com/radioplus/playlists/" + radio.key + "/" + (currentday - 1));
          list.once('value', function(snapshot) {

            var requestedsongs = Math.floor(playlistlength * (radio.sliderval / totalweight));
            var addedsongs = 0;
            var channel_playlist = snapshot.val();
            for (var index in channel_playlist) {
              if (channel_playlist.hasOwnProperty(index)) {
                if (addedsongs < requestedsongs) {
                  var song = channel_playlist[index];
                  self.push('playlist', song);
                  addedsongs++;
                }
              }
            }
          });
        }
      });
    },

  });
})();