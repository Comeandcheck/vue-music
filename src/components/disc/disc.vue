<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import MusicList from 'components/music-list/music-list'
import { getSongList } from 'api/recommend'
import { getSongUrl } from 'api/song'
import { ERR_OK } from 'api/config'
import { mapGetters } from 'vuex'
import { createSong } from 'common/js/song'

export default {
  computed: {
    title() {
      return this.disc.dissname
    },
    bgImage() {
      return this.disc.imgurl
    },
    ...mapGetters([
      'disc'
    ])
  },
  data() {
    return {
      songs: []
    }
  },
  created() {
    this._getSongList()
  },
  methods: {
    _getSongList() {
      if (!this.disc.dissid) {
        this.$router.push('/recommend')
        return
      }
      getSongList(this.disc.dissid).then((res) => {
        const getData = res.data
        if (getData.code === ERR_OK) {
          this.songs = this._normalizeSongs(getData.cdlist[0].songlist)
        }
      })
    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach((musicData) => {
        if (musicData.songid && musicData.albummid) {
          let song = createSong(musicData)
          getSongUrl(song, musicData.songmid)
          ret.push(song)
        }
      })
      return ret
    }
  },
  components: {
    MusicList
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s
}

.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0)
}
</style>