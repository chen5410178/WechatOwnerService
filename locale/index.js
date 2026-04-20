import Vue from 'vue'
import VueI18n from 'vue-i18n'

import settingsMsg from './pages/settings/settings_message'
import loginMsg from './pages/login/login_message'
import myMsg from './pages/my/my_message'
import indexMsg from './pages/index/index_message'
import serviceMsg from './pages/index/service_message'
import repairMsg from './pages/repair/repair_message'
import complaintMsg from './pages/complaint/complaint_message'
import familyMsg from './pages/family/family_message'
import noticeMsg from './pages/notice/notice_message'
import feeMsg from './pages/fee/fee_message'
import carMsg from './pages/car/car_message'
import visitMsg from './pages/visit/visit_message'
import machineMsg from './pages/machine/machine_message'
import activityMsg from './pages/activity/activity_message'
import invoiceMsg from './pages/invoice/invoice_message'
import couponMsg from './pages/coupon/coupon_message'
import addressMsg from './pages/address/address_message'
import applicationKeyMsg from './pages/applicationKey/applicationKey_message'
import appointmentMsg from './pages/appointment/appointment_message'
import accountMsg from './pages/account/account_message'
import applyRoomMsg from './pages/applyRoom/applyRoom_message'
import shopMsg from './pages/shop/shop_message'
import communityMsg from './pages/community/community_message'
import commonPageMsg from './pages/common_page/common_page_message'
import itemReleaseMsg from './pages/itemRelease/itemRelease_message'
import reserveMsg from './pages/reserve/reserve_message'
import meterMsg from './pages/meter/meter_message'
import locationMsg from './pages/location/location_message'
import commonMsg from './common/common_message'
import componentMsg from './components/component_message'
import renovationMsg from './pages/renovation/renovation_message'

const messages = {
  'zh-CN': {
    ...commonMsg['zh-CN'],
    ...componentMsg['zh-CN'],
    ...settingsMsg['zh-CN'],
    ...loginMsg['zh-CN'],
    ...myMsg['zh-CN'],
    ...indexMsg['zh-CN'],
    ...serviceMsg['zh-CN'],
    ...repairMsg['zh-CN'],
    ...complaintMsg['zh-CN'],
    ...familyMsg['zh-CN'],
    ...noticeMsg['zh-CN'],
    ...feeMsg['zh-CN'],
    ...carMsg['zh-CN'],
    ...visitMsg['zh-CN'],
    ...machineMsg['zh-CN'],
    ...activityMsg['zh-CN'],
    ...invoiceMsg['zh-CN'],
    ...couponMsg['zh-CN'],
    ...addressMsg['zh-CN'],
    ...applicationKeyMsg['zh-CN'],
    ...appointmentMsg['zh-CN'],
    ...accountMsg['zh-CN'],
    ...applyRoomMsg['zh-CN'],
    ...shopMsg['zh-CN'],
    ...communityMsg['zh-CN'],
    ...commonPageMsg['zh-CN'],
    ...itemReleaseMsg['zh-CN'],
    ...reserveMsg['zh-CN'],
    ...meterMsg['zh-CN'],
    ...locationMsg['zh-CN'],
    ...renovationMsg['zh-CN']
  },
  'en': {
    ...commonMsg['en'],
    ...componentMsg['en'],
    ...settingsMsg['en'],
    ...loginMsg['en'],
    ...myMsg['en'],
    ...indexMsg['en'],
    ...serviceMsg['en'],
    ...repairMsg['en'],
    ...complaintMsg['en'],
    ...familyMsg['en'],
    ...noticeMsg['en'],
    ...feeMsg['en'],
    ...carMsg['en'],
    ...visitMsg['en'],
    ...machineMsg['en'],
    ...activityMsg['en'],
    ...invoiceMsg['en'],
    ...couponMsg['en'],
    ...addressMsg['en'],
    ...applicationKeyMsg['en'],
    ...appointmentMsg['en'],
    ...accountMsg['en'],
    ...applyRoomMsg['en'],
    ...shopMsg['en'],
    ...communityMsg['en'],
    ...commonPageMsg['en'],
    ...itemReleaseMsg['en'],
    ...reserveMsg['en'],
    ...meterMsg['en'],
    ...locationMsg['en'],
    ...renovationMsg['en']
  },
  'zh-TW': {
    ...commonMsg['zh-TW'],
    ...componentMsg['zh-TW'],
    ...settingsMsg['zh-TW'],
    ...loginMsg['zh-TW'],
    ...myMsg['zh-TW'],
    ...indexMsg['zh-TW'],
    ...serviceMsg['zh-TW'],
    ...repairMsg['zh-TW'],
    ...complaintMsg['zh-TW'],
    ...familyMsg['zh-TW'],
    ...noticeMsg['zh-TW'],
    ...feeMsg['zh-TW'],
    ...carMsg['zh-TW'],
    ...visitMsg['zh-TW'],
    ...machineMsg['zh-TW'],
    ...activityMsg['zh-TW'],
    ...invoiceMsg['zh-TW'],
    ...couponMsg['zh-TW'],
    ...addressMsg['zh-TW'],
    ...applicationKeyMsg['zh-TW'],
    ...appointmentMsg['zh-TW'],
    ...accountMsg['zh-TW'],
    ...applyRoomMsg['zh-TW'],
    ...shopMsg['zh-TW'],
    ...communityMsg['zh-TW'],
    ...commonPageMsg['zh-TW'],
    ...itemReleaseMsg['zh-TW'],
    ...reserveMsg['zh-TW'],
    ...meterMsg['zh-TW'],
    ...locationMsg['zh-TW'],
    ...renovationMsg['zh-TW']
  }
}

Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: 'zh-CN',
  messages
})

export default i18n
