import {commonParams, ERR_OK} from './config'
import axios from 'axios'
import jsonp from 'common/js/jsonp'
//  获取歌词
export function getLyric(mid) {
  const url = '/api/lyric'

  const data = Object.assign({}, commonParams, {
    songmid: mid,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    categoryId: 10000000,
    pcachetime: +new Date(),
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
// 获取vKey
function getSongVKey(songMid) {
  const url = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg'
  const data = Object.assign({}, commonParams, {
    hostUin: 0,
    format: 'jsonp',
    platform: 'yqq',
    needNewCode: 0,
    cid: 205361747,
    uin: 0,
    songmid: songMid,
    filename: `C400${songMid}.m4a`,
    guid: 4300126822
  })

  const option = {
    param: 'callback2'
  }
  return jsonp(url, data, option.param)
}

// 获取播放地址
export function getSongUrl(song, mid) {
  getSongVKey(mid).then(res => {
    if (res.code === ERR_OK) {
      if (res.data.items) {
        let item = res.data.items[0]
        song.url = `http://dl.stream.qqmusic.qq.com/${item.filename}?vkey=${item.vkey}&guid=4300126822&fromtag=66`
      }
    }
  })
}
