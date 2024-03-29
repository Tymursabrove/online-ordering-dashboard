
export default {

    /*Caterer API*/
    UPDATEcaterer: "/caterer/updatecaterer",
    UPDATEcatererpassword: "/caterer/updatecatererpassword",
    UPDATEcaterernameaddress: "/caterer/updatecaterernameaddress",
    GETcaterer: "/caterer/getcaterer",

    /*Lunch Menu API*/
    UPDATElunchmenu: "/lunchMenu/updateLunchMenu",
    UPDATE_default_lunchmenu: "/lunchMenu/makeDefault_LunchMenu",
    GETlunchmenu: "/lunchMenu/getLunchMenu",
    ADDlunchmenu: "/lunchMenu/addLunchMenu",
    DELETElunchmenu: "/lunchMenu/deleteLunchMenu",

    /*Lunch Order API*/
    GETlunchorder: "/lunchOrder/getlunchorder",
    GETlunchorder_customer: "/lunchOrder/getlunchorder_customer",
    PUTaccept_lunchorder: "/lunchOrder/acceptlunchorder",
    PUTreject_lunchorder: "/lunchOrder/rejectlunchorder",

    /*Payment API*/
    GETcaterer_paymentaccount: "/payment/get_caterer_paymentaccount",
    GETcaterer_person: "/payment/get_caterer_person",
    POSTconfirm_payment: "/payment/confirm_payment",
    POSTcreate_caterer_external_bankaccount: "/payment/create_caterer_external_bankaccount",
    PUTupdate_caterer_paymentaccount: "/payment/update_caterer_paymentaccount",
    POSTcreate_caterer_paymentaccount: "/payment/create_caterer_paymentaccount",
    PUTupdate_caterer_person: "/payment/update_caterer_person",
    PUTupdate_caterer_paymentaccount: "/payment/update_caterer_paymentaccount",
    PUTupdate_caterer_external_bankaccount: "/payment/update_caterer_external_bankaccount",
    DELETE_caterer_external_bankaccount: "/payment/delete_caterer_external_bankaccount",
    POSTcreate_accountlink: "/payment/create_accountlink",

    /*Review API*/
    GETreview: "/review/getreview",

    /*Auth API*/
    POSTcatererlogin: "/auth/catererlogin",
    GETcatererlogout: "/auth/logout",
    POSTpasswordreset: "/auth/resetpassword",
    GETresetpassword: '/auth/getresetpassword',
    PUTupdatepassword: '/auth/updatepassword',
  };



