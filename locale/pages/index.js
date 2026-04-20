import index_1 from './index_1'
import index_2 from './index_2'
import index_3 from './index_3'
import index_4 from './index_4'

export default {
  'zh-CN': {
    ...index_1['zh-CN'],
    ...index_2['zh-CN'],
    ...index_3['zh-CN'],
    ...index_4['zh-CN']
  },
  'en': {
    ...index_1['en'],
    ...index_2['en'],
    ...index_3['en'],
    ...index_4['en']
  },
  'zh-TW': {
    ...index_1['zh-TW'],
    ...index_2['zh-TW'],
    ...index_3['zh-TW'],
    ...index_4['zh-TW']
  }
}