import Vue from 'vue'
import VueI18n from 'vue-i18n'

import accountMsg from './components/account/account_lang'
import blockExplainMsg from './components/block-explain/block-explain_lang'
import addMemberCarMsg from './components/car/add-member-car_lang'
import modifyCarNumMsg from './components/car/modify-car-num_lang'
import chargeMsg from './components/charge/charge_lang'
import codecookCarnumberMsg from './components/codecook-carnumber/codecook-carnumber_lang'
import codecookKeyboardMsg from './components/codecook-keyboard/codecook-keyboard_lang'
import giftCouponMsg from './components/coupon/gift-coupon_lang'
import qrcodeReceiveMsg from './components/coupon/qrcode-receive_lang'
import qrcodeFeeDetailMsg from './components/fee/qrcode-fee-detail_lang'
import qrcodeOweFeeMsg from './components/fee/qrcode-owe-fee_lang'
import fixedSearchMsg from './components/fixed-search/fixed-search_lang'
import flixedaddMsg from './components/flixedadd/flixedadd_lang'
import callPropertyMsg from './components/index/call-property_lang'
import indexActivitiesMsg from './components/index/index-activities_lang'
import indexTopMsg from './components/index/index-top_lang'
import mgbAppointmentMsg from './components/mgb-appointment/mgb-appointment_lang'
import authOwnerDialogMsg from './components/owner/auth-owner-dialog_lang'
import tipsMsg from './components/owner/tips_lang'
import pickerAddressMsg from './components/pickerAddress/pickerAddress_lang'
import reserveGoodsMsg from './components/reserve/reserve-goods_lang'
import reserveServiceNowMsg from './components/reserve/reserve-service-now_lang'
import selectedGoodsMsg from './components/reserve/selected-goods_lang'
import selectCarnumMsg from './components/select-carnum/select-carnum_lang'
import successAdsMsg from './components/success/success-ads_lang'
import successGoodsMsg from './components/success/success-goods_lang'
import noDataPageMsg from './components/no-data-page/no-data-page_lang'
import vcCategoryMsg from './components/vc-category/vc-category_lang'
import vcCategoryHomemakingMsg from './components/vc-category-homemaking/vc-category-homemaking_lang'
import vcRecommendMsg from './components/vc-recommend/vc-recommend_lang'
import vcServeMsg from './components/vc-serve/vc-serve_lang'
import vcUploadMsg from './components/vc-upload/vc-upload_lang'
import vcActivityCardMsg from './components/vc-activity-card/vc-activity-card_lang'
import vcAdsMsg from './components/vc-ads/vc-ads_lang'
import vcBottomBlackMsg from './components/vc-bottom-black/vc-bottom-black_lang'
import vcCommentMsg from './components/vc-comment/vc-comment_lang'
import vcDiscountMsg from './components/vc-discount/vc-discount_lang'
import vcEmptyMsg from './components/vc-empty/vc-empty_lang'
import vcRecommendHomemakingMsg from './components/vc-recommend-homemaking/vc-recommend-homemaking_lang'
import vcShopMsg from './components/vc-shop/vc-shop_lang'
import vcUploadAsyncMsg from './components/vc-upload-async/vc-upload-async_lang'
import vcUserAccountMsg from './components/vc-user-account/vc-user-account_lang'
import viewImageMsg from './components/view-image/view-image_lang'
import communityRecommendMsg from './components/community-recommend/community-recommend_lang'
import wechatLoginMsg from './components/user/wechat-login_lang'
import uniDatetimePickerMsg from './components/uni-datetime-picker/uni-datetime-picker_lang'
import uniLoadMoreMsg from './components/uni-load-more/uni-load-more_lang'
import uniNumberBoxMsg from './components/uni-number-box/uni-number-box_lang'

import commonMsg from './common/common_message'
import componentMsg from './components/component_message'

import pagesLangMsg from './pages/index'

const messages = {
  'zh-CN': {
    ...commonMsg['zh-CN'],
    ...componentMsg['zh-CN'],
    ...blockExplainMsg['zh-CN'],
    ...addMemberCarMsg['zh-CN'],
    ...modifyCarNumMsg['zh-CN'],
    ...chargeMsg['zh-CN'],
    ...codecookCarnumberMsg['zh-CN'],
    ...codecookKeyboardMsg['zh-CN'],
    ...giftCouponMsg['zh-CN'],
    ...qrcodeReceiveMsg['zh-CN'],
    ...qrcodeFeeDetailMsg['zh-CN'],
    ...qrcodeOweFeeMsg['zh-CN'],
    ...fixedSearchMsg['zh-CN'],
    ...flixedaddMsg['zh-CN'],
    ...callPropertyMsg['zh-CN'],
    ...indexActivitiesMsg['zh-CN'],
    ...indexTopMsg['zh-CN'],
    ...mgbAppointmentMsg['zh-CN'],
    ...authOwnerDialogMsg['zh-CN'],
    ...tipsMsg['zh-CN'],
    ...pickerAddressMsg['zh-CN'],
    ...reserveGoodsMsg['zh-CN'],
    ...reserveServiceNowMsg['zh-CN'],
    ...selectedGoodsMsg['zh-CN'],
    ...selectCarnumMsg['zh-CN'],
    ...successAdsMsg['zh-CN'],
    ...successGoodsMsg['zh-CN'],
    ...noDataPageMsg['zh-CN'],
    ...vcCategoryMsg['zh-CN'],
    ...vcCategoryHomemakingMsg['zh-CN'],
    ...vcRecommendMsg['zh-CN'],
    ...vcServeMsg['zh-CN'],
    ...vcUploadMsg['zh-CN'],
    ...vcActivityCardMsg['zh-CN'],
    ...vcAdsMsg['zh-CN'],
    ...vcBottomBlackMsg['zh-CN'],
    ...vcCommentMsg['zh-CN'],
    ...vcDiscountMsg['zh-CN'],
    ...vcEmptyMsg['zh-CN'],
    ...vcRecommendHomemakingMsg['zh-CN'],
    ...vcShopMsg['zh-CN'],
    ...vcUploadAsyncMsg['zh-CN'],
    ...vcUserAccountMsg['zh-CN'],
    ...viewImageMsg['zh-CN'],
    ...communityRecommendMsg['zh-CN'],
    ...wechatLoginMsg['zh-CN'],
    ...uniDatetimePickerMsg['zh-CN'],
    ...uniLoadMoreMsg['zh-CN'],
    ...uniNumberBoxMsg['zh-CN'],
    ...pagesLangMsg['zh-CN']
  },
  'en': {
    ...commonMsg['en'],
    ...componentMsg['en'],
    ...blockExplainMsg['en'],
    ...addMemberCarMsg['en'],
    ...modifyCarNumMsg['en'],
    ...chargeMsg['en'],
    ...codecookCarnumberMsg['en'],
    ...codecookKeyboardMsg['en'],
    ...giftCouponMsg['en'],
    ...qrcodeReceiveMsg['en'],
    ...qrcodeFeeDetailMsg['en'],
    ...qrcodeOweFeeMsg['en'],
    ...fixedSearchMsg['en'],
    ...flixedaddMsg['en'],
    ...callPropertyMsg['en'],
    ...indexActivitiesMsg['en'],
    ...indexTopMsg['en'],
    ...mgbAppointmentMsg['en'],
    ...authOwnerDialogMsg['en'],
    ...tipsMsg['en'],
    ...pickerAddressMsg['en'],
    ...reserveGoodsMsg['en'],
    ...reserveServiceNowMsg['en'],
    ...selectedGoodsMsg['en'],
    ...selectCarnumMsg['en'],
    ...successAdsMsg['en'],
    ...successGoodsMsg['en'],
    ...noDataPageMsg['en'],
    ...vcCategoryMsg['en'],
    ...vcCategoryHomemakingMsg['en'],
    ...vcRecommendMsg['en'],
    ...vcServeMsg['en'],
    ...vcUploadMsg['en'],
    ...vcActivityCardMsg['en'],
    ...vcAdsMsg['en'],
    ...vcBottomBlackMsg['en'],
    ...vcCommentMsg['en'],
    ...vcDiscountMsg['en'],
    ...vcEmptyMsg['en'],
    ...vcRecommendHomemakingMsg['en'],
    ...vcShopMsg['en'],
    ...vcUploadAsyncMsg['en'],
    ...vcUserAccountMsg['en'],
    ...viewImageMsg['en'],
    ...communityRecommendMsg['en'],
    ...wechatLoginMsg['en'],
    ...uniDatetimePickerMsg['en'],
    ...uniLoadMoreMsg['en'],
    ...uniNumberBoxMsg['en'],
    ...pagesLangMsg['en']
  },
  'zh-TW': {
    ...commonMsg['zh-TW'],
    ...componentMsg['zh-TW'],
    ...blockExplainMsg['zh-TW'],
    ...addMemberCarMsg['zh-TW'],
    ...modifyCarNumMsg['zh-TW'],
    ...chargeMsg['zh-TW'],
    ...codecookCarnumberMsg['zh-TW'],
    ...codecookKeyboardMsg['zh-TW'],
    ...giftCouponMsg['zh-TW'],
    ...qrcodeReceiveMsg['zh-TW'],
    ...qrcodeFeeDetailMsg['zh-TW'],
    ...qrcodeOweFeeMsg['zh-TW'],
    ...fixedSearchMsg['zh-TW'],
    ...flixedaddMsg['zh-TW'],
    ...callPropertyMsg['zh-TW'],
    ...indexActivitiesMsg['zh-TW'],
    ...indexTopMsg['zh-TW'],
    ...mgbAppointmentMsg['zh-TW'],
    ...authOwnerDialogMsg['zh-TW'],
    ...tipsMsg['zh-TW'],
    ...pickerAddressMsg['zh-TW'],
    ...reserveGoodsMsg['zh-TW'],
    ...reserveServiceNowMsg['zh-TW'],
    ...selectedGoodsMsg['zh-TW'],
    ...selectCarnumMsg['zh-TW'],
    ...successAdsMsg['zh-TW'],
    ...successGoodsMsg['zh-TW'],
    ...noDataPageMsg['zh-TW'],
    ...vcCategoryMsg['zh-TW'],
    ...vcCategoryHomemakingMsg['zh-TW'],
    ...vcRecommendMsg['zh-TW'],
    ...vcServeMsg['zh-TW'],
    ...vcUploadMsg['zh-TW'],
    ...vcActivityCardMsg['zh-TW'],
    ...vcAdsMsg['zh-TW'],
    ...vcBottomBlackMsg['zh-TW'],
    ...vcCommentMsg['zh-TW'],
    ...vcDiscountMsg['zh-TW'],
    ...vcEmptyMsg['zh-TW'],
    ...vcRecommendHomemakingMsg['zh-TW'],
    ...vcShopMsg['zh-TW'],
    ...vcUploadAsyncMsg['zh-TW'],
    ...vcUserAccountMsg['zh-TW'],
    ...viewImageMsg['zh-TW'],
    ...communityRecommendMsg['zh-TW'],
    ...wechatLoginMsg['zh-TW'],
    ...uniDatetimePickerMsg['zh-TW'],
    ...uniLoadMoreMsg['zh-TW'],
    ...uniNumberBoxMsg['zh-TW'],
    ...pagesLangMsg['zh-TW']
  }
}

Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: 'zh-CN',
  messages
})

export default i18n