import axios from "axios";
import config from "../config";

axios.defaults.baseURL = config.baseURL;

let token: string | undefined;

const responseBody = (res: any) => res.data;

const getHeader = () => {
  if (!token) {
    return {};
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const requests: any = {
  get: (url: string) => axios.get(url, getHeader()).then(responseBody),
  getBlob: (url: string, options: any) =>
    axios.get(url, { ...options, ...getHeader() }),
  post: (url: string, body: any) =>
    axios.post(url, body, getHeader()).then(responseBody),
  put: (url: string, body: any) =>
    axios.put(url, body, getHeader()).then(responseBody),
  patch: (url: string, body: any) =>
    axios.patch(url, body, getHeader()).then(responseBody),
  delete: (url: string, body: any) =>
    axios
      .delete(url, { headers: getHeader().headers, data: body })
      .then(responseBody),

  // delete: (url: string) =>
  // axios.delete(url, getHeader()).then(responseBody)
};

const Agency = {
  Client: {
    list: () => requests.get("/gsts"),
  },
};

function selectedEntryUrl(selectedEntry: any) {
  let selectedEntryUrl = "";
  for (var i = 0; i < selectedEntry.length; i++) {
    selectedEntryUrl += "&entryIds[]=" + selectedEntry[i];
  }
  return selectedEntryUrl;
}

const Auth = {
  //Login
  login: (username: string, password: string) =>
    requests.post("/auth/login", { username, password }),
  //Signup
  signup: (
    name: string,
    email: string,
    password: string,
    mobileNumber: number
  ) => requests.post("/auth/signup", { name, email, password, mobileNumber }),
  verifySignupOTP: (userId: string, otp: number) =>
    requests.post("/auth/verify/signup/otp", { userId, otp }),
  verifySignupToken: (token: string) =>
    requests.post("/auth/verify/signup/token", { token }),
  //Forgot Password
  forgotPassword: (email: string) =>
    requests.post("/auth/forgotPassword", { email }),
  verifyResetOtp: (userId: string, otp: number, password: string) =>
    requests.post("/auth/verify/reset/otp", { userId, otp, password }),
  verifyResetToken: (token: string, password: string) =>
    requests.post("/auth/verify/reset/token", { token, password }),
};

const Organisation = {
  getOrganisations: () => requests.get("/organisation/list"),
  addOrganisation: (
    name: string,
    gstin: string,
    gstRegistered: boolean,
    gstRegType: string,
    startingYear: string,
    gstRegistrationStatus: string,
    manageInventory: boolean,
    billingAddress: string,
    mainlyDealsIn: string
  ) =>
    requests.post("/organisation/add", {
      name,
      gstin,
      gstRegistered,
      gstRegType,
      startingYear,
      gstRegistrationStatus,
      manageInventory,
      billingAddress,
      mainlyDealsIn,
    }),
  editOrganisation: (organisationId: string, name: string) =>
    requests.patch("/organisation/updatename", { organisationId, name }),
  makeOrganisationInactive: (organisationId: string) =>
    requests.patch("/organisation/inactive", { organisationId }),
  makeOrganisationActive: (organisationId: string) =>
    requests.patch("/organisation/active", { organisationId }),
  listofInvitationSent: (organisationId: string) =>
    requests.get(
      `/organisation/listofinvitationsent?organisationId=${organisationId}`,
      {
        organisationId,
      }
    ),
  listofInvitationReceived: (organisationId: string) =>
    requests.get(
      `/organisation/listofinvitationreceived?organisationId=${organisationId}`,
      { organisationId }
    ),
  leaveOrganisation: (organisationId: string) =>
    requests.post("/organisation/leaveorganisation", { organisationId }),
  revokeInvitation: (organisationId: string, invitationId: string) =>
    requests.post("/organisation/revokeinvitation", {
      organisationId,
      invitationId,
    }),
  rejectInvitation: (organisationId: string, invitationId: string) =>
    requests.post("/organisation/rejecttinvitation", {
      organisationId,
      invitationId,
    }),
  acceptInvitation: (organisationId: string, invitationId: string) =>
    requests.post("/organisation/acceptinvitation", {
      organisationId,
      invitationId,
    }),
  addUser: (organisationId: string, userEmail: string) =>
    requests.post("/organisation/adduser", { organisationId, userEmail }),
  deleteOrganisation: (organisationId: string) =>
    requests.delete(
      `/organisation/delete?organisationId=${organisationId}`,
      {}
    ),
  getSettings: (organisationId: string) =>
    requests.get(
      `/settings/getorganisationsettings?organisationId=${organisationId}`
    ),
  postSettings: (
    organisationId: string,
    name: string,
    manageInventory: boolean,
    billingAddress: string
  ) =>
    requests.post(`/settings/organisation`, {
      organisationId,
      name,
      manageInventory,
      billingAddress,
    }),
};

const JournalEntry = {
  add: (
    organisationId: string,
    date: string,
    entries: any,
    narration: string,
    year: string
  ) =>
    requests.post("/journalentry/add", {
      organisationId,
      date,
      entries,
      narration,
      year,
    }),
  edit: (
    organisationId: string,
    entryId: string,
    date: string,
    entries: any,
    narration: string,
    year: string
  ) =>
    requests.post("/journalentry/edit", {
      organisationId,
      entryId,
      date,
      entries,
      narration,
      year,
    }),
  getsingleentrydetails: (organisationId: string, entryId: string) =>
    requests.get(
      `/journalentry/getsingleentrydetails?organisationId=${organisationId}&entryId=${entryId}`
    ),
  journalentrylist: (
    organisationId: string,
    year: string,
    skip: number,
    limit: number,
    download: boolean,
    sortBy: string,
    searchText: string
  ) =>
    download === false
      ? requests.get(
          `/journalentry/journalentrylist?organisationId=${organisationId}&year=${year}&skip=${skip}&limit=${limit}&sortBy=${sortBy}&download=${download}&searchText=${searchText}`
        )
      : requests.getBlob(
          `/journalentry/journalentrylist?organisationId=${organisationId}&year=${year}&skip=${skip}&limit=${limit}&sortBy=${sortBy}&download=${download}&searchText=${searchText}`,
          {
            responseType: "blob",
          }
        ),
  delete: (organisationId: string, entryIds: string[]) =>
    requests.delete(
      `/journalentry/delete?organisationId=${organisationId}${selectedEntryUrl(
        entryIds
      )}`
    ),

  getJournalEntry: (organisationId: string, entryId: string) =>
    requests.get(
      `/journalentry/getoldentrylist?organisationId=${organisationId}&entryId=${entryId}`
    ),

  getTemplatesList: (organisationId: string) =>
    requests.get(`/journalentry/gettemplates?organisationId=${organisationId}`),

  getOldEntry: (organisationId: string, entryId: string, version: number) =>
    requests.get(
      `/journalentry/getoldentrydetails?organisationId=${organisationId}&entryId=${entryId}&version=${version}`
    ),

  getTemplateDetails: (organisationId: string, templateId: string) =>
    requests.get(
      `/journalentry/gettemplatedetails?organisationId=${organisationId}&templateId=${templateId}`
    ),
  saveTemplate: (
    organisationId: string,
    name: string,
    entries: any,
    narration: string
  ) =>
    requests.post("/journalentry/addtemplate", {
      organisationId,
      name,
      entries,
      narration,
    }),
  editTemplate: (organisationId: string, name: string, templateId: string) =>
    requests.put("/journalentry/edittemplatename", {
      organisationId,
      name,
      templateId,
    }),

  deleteTemplate: (organisationId: string, templateId: string) =>
    requests.delete(
      `/journalentry/template?organisationId=${organisationId}&templateId=${templateId}`
    ),
};

const Account = {
  getAccountList: (
    organisationId: string,
    active: boolean,
    searchText: string,
    nature: string,
    type: string,
    year: string,
    download: boolean,
    date: string
  ) =>
    download === false
      ? requests.get(
          `/account/accountslist?organisationId=${organisationId}&active=${active}&searchText=${searchText}&nature=${nature}&type=${type}&year=${year}&download=${download}&date=${date}`
        )
      : requests.get(
          `/account/accountslist?organisationId=${organisationId}&active=${active}&searchText=${searchText}&nature=${nature}&type=${type}&year=${year}&download=${download}&date=${date}`,
          {
            responseType: "blob",
          }
        ),
  getAccountLog: (organisationId: string, accountId: string) =>
    requests.get(
      `/account/accountslog?organisationId=${organisationId}&accountId=${accountId}`
    ),
  accountnameavailablecheck: (
    organisationId: string,
    name: string,
    accountId: string
  ) =>
    requests.get(
      `/account/accountnameavailablecheck?organisationId=${organisationId}&name=${name}&accountId=${accountId}`
    ),
  gstinalreadypresent: (
    organisationId: string,
    gstin: string,
    entryId: string
  ) =>
    requests.get(
      `/account/gstinalreadypresent?organisationId=${organisationId}&gstin=${gstin}&entryId=${entryId}`
    ),
  addAccount: (
    name: string,
    nature: string,
    openingBalance: number,
    organisationId: string,
    gstin: string,
    gstRate: number,
    billingAddress: string,
    shippingAddress: string,
    mobileNo: string,
    email: string,
    pan: string,
    tan: string,
    gstType: string,
    gstRegDate: string,
    gstCanDate: string,
    gstRegStatus: string
  ) =>
    requests.post("/account/add", {
      name,
      nature,
      openingBalance,
      organisationId,
      gstin,
      gstRate,
      billingAddress,
      shippingAddress,
      mobileNo,
      email,
      pan,
      tan,
      gstType,
      gstRegDate,
      gstCanDate,
      gstRegStatus,
    }),
  editAccount: (
    accountId: string,
    name: string,
    nature: string,
    openingBalance: number,
    organisationId: string,
    gstin: string,
    gstRate: number,
    billingAddress: string,
    shippingAddress: string,
    mobileNo: string,
    email: string,
    pan: string,
    tan: string,
    gstType: string,
    gstRegDate: string,
    gstCanDate: string,
    gstRegStatus: string
  ) =>
    requests.put("/account/edit", {
      accountId,
      name,
      nature,
      openingBalance,
      organisationId,
      gstin,
      gstRate,
      billingAddress,
      shippingAddress,
      mobileNo,
      email,
      pan,
      tan,
      gstType,
      gstRegDate,
      gstCanDate,
      gstRegStatus,
    }),
  makeAccountInactive: (organisationId: string, accountId: string) =>
    requests.put("/account/inactive", { organisationId, accountId }),
  makeAccountActive: (organisationId: string, accountId: string) =>
    requests.put("/account/active", { organisationId, accountId }),
  accountTaskList: (organisationId: string) =>
    requests.get(
      `/account/listoftaskforstatus?organisationId=${organisationId}`
    ),
  delete: (accountId: string, organisationId: string) =>
    requests.delete("/account/delete", { accountId, organisationId }),
};

const PDF = {
  getPdf: (
    organisationId: string,
    transactionId: string,
    transactionType: string,
    noOfCopies: number
  ) =>
    requests.get(
      `/getpdf/transactionpdf?organisationId=${organisationId}&transactionId=${transactionId}&transactionType=${transactionType}&noOfCopies=${noOfCopies}`
    ),
  downloadPdf: (
    organisationId: string,
    transactionId: string,
    transactionType: string,
    noOfCopies: number
  ) =>
    requests.getBlob(
      `/getpdf/downloadtransactionpdf?organisationId=${organisationId}&transactionId=${transactionId}&transactionType=${transactionType}&noOfCopies=${noOfCopies}`,
      {
        responseType: "blob",
      }
    ),
};

const Search = {
  topSearch: (
    organisationId: string,
    year: string,
    searchText: string,
    searchIn: string
  ) =>
    requests.get(
      `/search/topsearch?organisationId=${organisationId}&year=${year}&searchText=${searchText}&searchIn=${searchIn}`
    ),
};

const Item = {
  add: (
    organisationId: string,
    name: string,
    description: string,
    type: string,
    openingBalanceQuantity: number,
    openingBalanceAmount: number,
    uom: string,
    standardSellingPrice: number,
    standardSaleDiscount: number,
    standardPurchasePrice: number,
    standardPurchaseDiscount: number,
    hsnCode: string,
    sacCode: string,
    gstRate: number
  ) =>
    requests.post("/item/add", {
      organisationId,
      name,
      description,
      type,
      openingBalanceQuantity,
      openingBalanceAmount,
      uom,
      standardSellingPrice,
      standardSaleDiscount,
      standardPurchasePrice,
      standardPurchaseDiscount,
      hsnCode,
      sacCode,
      gstRate,
    }),
  getItemList: (
    organisationId: string,
    active: boolean,
    searchText: string,
    type: string,
    year: string,
    download: boolean,
    date: string
  ) =>
    download === false
      ? requests.get(
          `/item/itemlist?organisationId=${organisationId}&active=${active}&searchText=${searchText}&type=${type}&year=${year}&download=${download}&date=${date}`
        )
      : requests.get(
          `/item/itemlist?organisationId=${organisationId}&active=${active}&searchText=${searchText}&type=${type}&year=${year}&download=${download}&date=${date}`,
          {
            responseType: "blob",
          }
        ),
  delete: (organisationId: string, itemId: string) =>
    requests.delete("/item/delete", { organisationId, itemId }),

  editAccount: (
    organisationId: string,
    itemId: string,
    name: string,
    description: string,
    type: string,
    openingBalanceQuantity: number,
    openingBalanceAmount: number,
    uom: string,
    standardSellingPrice: number,
    standardSaleDiscount: number,
    standardPurchasePrice: number,
    standardPurchaseDiscount: number,
    hsnCode: string,
    sacCode: string,
    gstRate: number
  ) =>
    requests.post("/item/edit", {
      organisationId,
      itemId,
      name,
      description,
      type,
      openingBalanceQuantity,
      openingBalanceAmount,
      uom,
      standardSellingPrice,
      standardSaleDiscount,
      standardPurchasePrice,
      standardPurchaseDiscount,
      hsnCode,
      sacCode,
      gstRate,
    }),
};

const User = {
  getSelfDeatils: () => requests.get(`/user/`),
  getUserList: (organisationId: string, active: boolean, searchText: string) =>
    requests.get(
      `/user/list?organisationId=${organisationId}&active=${active}&searchText=${searchText}`
    ),
  addUser: (
    organisationId: string,
    email: string,
    role: string,
    userRightsList: any
  ) =>
    requests.post("organisation/adduser", {
      organisationId,
      email,
      role,
      userRightsList,
    }),

  editUser: (
    organisationId: string,
    email: string,
    role: string,
    userRightsList: any
  ) =>
    requests.post("organisation/edituser", {
      organisationId,
      email,
      role,
      userRightsList,
    }),
  getUserRights: (organisationId: string, userId?: string) =>
    requests.get(
      `/user/rights?organisationId=${organisationId}${
        userId ? `&userId=${userId}` : ""
      }`
    ),
  makeUserInactive: (organisationId: string, userId: string) =>
    requests.patch("/user/inactive", { organisationId, userId }),
  makeUserActive: (organisationId: string, userId: string) =>
    requests.patch("/user/active", { organisationId, userId }),
  removeUser: (organisationId: string, userId: string) =>
    requests.post("/organisation/removeuser", { organisationId, userId }),
};

const Logs = {
  getAccountLogs: (organisationId: string, accountId: string) =>
    requests.get(
      `/account/accountslog?organisationId=${organisationId}&accountId=${accountId}`
    ),

  getItemLogs: (organisationId: string, itemId: string) =>
    requests.get(
      `/item/itemslog?organisationId=${organisationId}&itemId=${itemId}`
    ),
};

const Gst = {
  addGst: (gstin: string) => requests.post("/gsts", { gstin }),
  getAll: () => requests.get("/gsts"),
  getGst: (gstin: string) => requests.get(`/gst/?gstin=${gstin}`),
  changeName: (body: { id: string; name: string }) =>
    requests.put("/gsts/changeName", body),
};

const ReceiptEntry = {
  add: (
    organisationId: string,
    date: string,
    receivedAccountId: string,
    receivedAmount: number,
    entries: any,
    narration: string,
    year: string
  ) =>
    requests.post("/receipts/add", {
      organisationId,
      date,
      receivedAccountId,
      receivedAmount,
      entries,
      narration,
      year,
    }),
  edit: (
    entryId: string,
    organisationId: string,
    date: string,
    receivedAccountId: string,
    receivedAmount: number,
    entries: any,
    narration: string,
    year: string
  ) =>
    requests.post("/receipts/edit", {
      entryId,
      organisationId,
      date,
      receivedAccountId,
      receivedAmount,
      entries,
      narration,
      year,
    }),
  delete: (organisationId: string, entryIds: string[]) =>
    requests.delete(
      `/receipts/delete?organisationId=${organisationId}${selectedEntryUrl(
        entryIds
      )}`
    ),
  getsingleentrydetails: (organisationId: string, entryId: string) =>
    requests.get(
      `/receipts/getsingleentrydetails?organisationId=${organisationId}&entryId=${entryId}`
    ),
  receiptentrylist: (
    organisationId: string,
    year: string,
    skip: number,
    limit: number,
    download: boolean,
    sortBy: string,
    searchText: string
  ) =>
    download === false
      ? requests.get(
          `/receipts/receiptslist?organisationId=${organisationId}&skip=${skip}&limit=${limit}&year=${year}&sortBy=${sortBy}&download=false&searchText=${searchText}`
        )
      : requests.getBlob(
          `/receipts/receiptslist?organisationId=${organisationId}&year=${year}&skip=${skip}&limit=${limit}&sortBy=${sortBy}&download=${download}&searchText=${searchText}`,
          {
            responseType: "blob",
          }
        ),
  getReceiptEntry: (organisationId: string, entryId: string) =>
    requests.get(
      `/receipts/getoldentrylist?organisationId=${organisationId}&entryId=${entryId}`
    ),
  getTemplatesList: (organisationId: string) =>
    requests.get(`/receipts/gettemplates?organisationId=${organisationId}`),
  getTemplateDetails: (organisationId: string, templateId: string) =>
    requests.get(
      `/receipts/gettemplatedetails?organisationId=${organisationId}&templateId=${templateId}`
    ),

  deleteTemplate: (organisationId: string, templateId: string) =>
    requests.delete(
      `/receipts/template?organisationId=${organisationId}&templateId=${templateId}`
    ),
  editTemplate: (organisationId: string, name: string, templateId: string) =>
    requests.put("/receipts/edittemplatename", {
      organisationId,
      name,
      templateId,
    }),
  saveTemplate: (
    organisationId: string,
    name: string,
    entries: any,
    narration: string,
    receivedAccountId: string,
    receivedAmount: number
  ) =>
    requests.post("/receipts/addtemplate", {
      organisationId,
      name,
      entries,
      narration,
      receivedAccountId,
      receivedAmount,
    }),
  getOldEntry: (organisationId: string, entryId: string, version: number) =>
    requests.get(
      `/receipts/getoldentrydetails?organisationId=${organisationId}&entryId=${entryId}&version=${version}`
    ),
};

const PaymentEntry = {
  add: (
    organisationId: string,
    date: string,
    paidAccountId: string,
    paidAmount: number,
    entries: any,
    narration: string,
    year: string
  ) =>
    requests.post("/payments/add", {
      organisationId,
      date,
      paidAccountId,
      paidAmount,
      entries,
      narration,
      year,
    }),
  edit: (
    entryId: string,
    organisationId: string,
    date: string,
    paidAccountId: string,
    paidAmount: number,
    entries: any,
    narration: string,
    year: string
  ) =>
    requests.post("/payments/edit", {
      entryId,
      organisationId,
      date,
      paidAccountId,
      paidAmount,
      entries,
      narration,
      year,
    }),
  delete: (organisationId: string, entryIds: string[]) =>
    requests.delete(
      `/payments/delete?organisationId=${organisationId}${selectedEntryUrl(
        entryIds
      )}`
    ),
  getsingleentrydetails: (organisationId: string, entryId: string) =>
    requests.get(
      `/payments/getsingleentrydetails?organisationId=${organisationId}&entryId=${entryId}`
    ),
  paymententrylist: (
    organisationId: string,
    year: string,
    skip: number,
    limit: number,
    download: boolean,
    sortBy: string,
    searchText: string
  ) =>
    download === false
      ? requests.get(
          `/payments/paymentslist?organisationId=${organisationId}&skip=${skip}&limit=${limit}&year=${year}&sortBy=${sortBy}&download=false&searchText=${searchText}`
        )
      : requests.getBlob(
          `/payments/paymentslist?organisationId=${organisationId}&year=${year}&skip=${skip}&limit=${limit}&sortBy=${sortBy}&download=${download}&searchText=${searchText}`,
          {
            responseType: "blob",
          }
        ),
  getPaymentEntry: (organisationId: string, entryId: string) =>
    requests.get(
      `/payments/getoldentrylist?organisationId=${organisationId}&entryId=${entryId}`
    ),
  getTemplatesList: (organisationId: string) =>
    requests.get(`/payments/gettemplates?organisationId=${organisationId}`),
  getTemplateDetails: (organisationId: string, templateId: string) =>
    requests.get(
      `/payments/gettemplatedetails?organisationId=${organisationId}&templateId=${templateId}`
    ),

  deleteTemplate: (organisationId: string, templateId: string) =>
    requests.delete(
      `/payments/template?organisationId=${organisationId}&templateId=${templateId}`
    ),
  editTemplate: (organisationId: string, name: string, templateId: string) =>
    requests.put("/payments/edittemplatename", {
      organisationId,
      name,
      templateId,
    }),
  saveTemplate: (
    organisationId: string,
    name: string,
    entries: any,
    narration: string,
    paidAccountId: string,
    paidAmount: number
  ) =>
    requests.post("/payments/addtemplate", {
      organisationId,
      name,
      entries,
      narration,
      paidAccountId,
      paidAmount,
    }),
  getOldEntry: (organisationId: string, entryId: string, version: number) =>
    requests.get(
      `/payments/getoldentrydetails?organisationId=${organisationId}&entryId=${entryId}&version=${version}`
    ),
};

const FundTransfer = {
  add: (
    organisationId: string,
    date: string,
    paidAccountId: string,
    paidAmount: number,
    receivedAccountId: string,
    receivedAmount: number,
    narration: string,
    year: string
  ) =>
    requests.post("/fundtransfer/add", {
      organisationId,
      date,
      paidAccountId,
      paidAmount,
      receivedAccountId,
      receivedAmount,
      narration,
      year,
    }),
  edit: (
    entryId: string,
    organisationId: string,
    date: string,
    paidAccountId: string,
    paidAmount: number,
    receivedAccountId: string,
    receivedAmount: number,
    narration: string,
    year: string
  ) =>
    requests.post("/fundtransfer/edit", {
      entryId,
      organisationId,
      date,
      paidAccountId,
      paidAmount,
      receivedAccountId,
      receivedAmount,
      narration,
      year,
    }),
  delete: (organisationId: string, entryIds: string[]) =>
    requests.delete(
      `/fundtransfer/delete?organisationId=${organisationId}${selectedEntryUrl(
        entryIds
      )}`
    ),
  getsingleentrydetails: (organisationId: string, entryId: string) =>
    requests.get(
      `/fundtransfer/getsingleentrydetails?organisationId=${organisationId}&entryId=${entryId}`
    ),
  list: (
    organisationId: string,
    year: string,
    skip: number,
    limit: number,
    download: boolean,
    sortBy: string,
    searchText: string
  ) =>
    download === false
      ? requests.get(
          `/fundtransfer/list?organisationId=${organisationId}&skip=${skip}&limit=${limit}&year=${year}&sortBy=${sortBy}&download=false&searchText=${searchText}`
        )
      : requests.getBlob(
          `/fundtransfer/list?organisationId=${organisationId}&year=${year}&skip=${skip}&limit=${limit}&sortBy=${sortBy}&download=${download}&searchText=${searchText}`,
          {
            responseType: "blob",
          }
        ),
  getOldEntryList: (organisationId: string, entryId: string) =>
    requests.get(
      `/fundtransfer/getoldentrylist?organisationId=${organisationId}&entryId=${entryId}`
    ),
  getTemplatesList: (organisationId: string) =>
    requests.get(`/fundtransfer/gettemplates?organisationId=${organisationId}`),
  getTemplateDetails: (organisationId: string, templateId: string) =>
    requests.get(
      `/fundtransfer/gettemplatedetails?organisationId=${organisationId}&templateId=${templateId}`
    ),

  deleteTemplate: (organisationId: string, templateId: string) =>
    requests.delete(
      `/fundtransfer/template?organisationId=${organisationId}&templateId=${templateId}`
    ),
  editTemplate: (organisationId: string, name: string, templateId: string) =>
    requests.put("/fundtransfer/edittemplatename", {
      organisationId,
      name,
      templateId,
    }),
  saveTemplate: (
    organisationId: string,
    name: string,
    paidAccountId: string,
    paidAmount: number,
    receivedAccountId: string,
    receivedAmount: number,
    narration: string
  ) =>
    requests.post("/fundtransfer/addtemplate", {
      organisationId,
      name,
      paidAccountId,
      paidAmount,
      receivedAccountId,
      receivedAmount,
      narration,
    }),
  getOldEntry: (organisationId: string, entryId: string, version: number) =>
    requests.get(
      `/fundtransfer/getoldentrydetails?organisationId=${organisationId}&entryId=${entryId}&version=${version}`
    ),
};

const BalanceSheet = {
  balanceentrylist: (
    organisationId: string,
    year: string,
    type: string,
    date?: string
  ) =>
    requests.get(
      `/reports/balancesheet?organisationId=${organisationId}&year=${year}&type=${type}&date=${date}`
    ),
};

const ProfitOrLoss = {
  profitorlossentrylist: (
    organisationId: string,
    year: string,
    type: string,
    startingDate: string,
    endDate: string
  ) =>
    requests.get(
      `/reports/profitloss?organisationId=${organisationId}&year=${year}&type=${type}&startingDate=${startingDate}&endDate=${endDate}`
    ),
};

const Ledger = {
  getLedgerDetails: (
    organisationId: string,
    year: string,
    skip: number,
    limit: number,
    accountId: string,
    type: String,
    download: boolean,
    searchText: String,
    firstDate: String,
    lastDate: String
  ) =>
    download === false
      ? requests.get(
          `/ledger/getLedger?organisationId=${organisationId}&year=${year}&accountId=${accountId}&skip=${skip}&limit=${limit}&type=${type}&download=false&searchText=${searchText}&fromDate=${firstDate}&toDate=${lastDate}`
        )
      : requests.getBlob(
          `/ledger/getLedger?organisationId=${organisationId}&year=${year}&accountId=${accountId}&skip=${skip}&limit=${limit}&type=${type}&download=${download}&searchText=${searchText}&fromDate=${firstDate}&toDate=${lastDate}`,
          {
            responseType: "blob",
          }
        ),
};

const Sales = {
  add: (
    date: string,
    dueDate: string,
    rcmApplicable: boolean,
    invoiceNumber: string,
    cashOrDebtorAccountId: string,
    partyName: string,
    billingAddress: string,
    shippingAddress: string,
    gstin: string,
    pos: string,
    gstPaymentTypeInExportOrSez: string,
    itemDetails: any,
    accountDetails: any,
    notes: string,
    narration: string,
    grossAmount: number,
    cgstAmount: number,
    sgstAmount: number,
    igstAmount: number,
    roundOffAmount: number,
    totalAmount: number,
    organisationId: string,
    year: string
  ) =>
    requests.post("/salesinvoice/add", {
      date,
      dueDate,
      rcmApplicable,
      invoiceNumber,
      cashOrDebtorAccountId,
      partyName,
      billingAddress,
      shippingAddress,
      gstin,
      pos,
      gstPaymentTypeInExportOrSez,
      itemDetails,
      accountDetails,
      notes,
      narration,
      grossAmount,
      cgstAmount,
      sgstAmount,
      igstAmount,
      roundOffAmount,
      totalAmount,
      organisationId,
      year,
    }),
  edit: (
    entryId: string,
    date: string,
    dueDate: string,
    rcmApplicable: boolean,
    invoiceNumber: string,
    cashOrDebtorAccountId: string,
    partyName: string,
    billingAddress: string,
    shippingAddress: string,
    gstin: string,
    pos: string,
    gstPaymentTypeInExportOrSez: string,
    itemDetails: any,
    accountDetails: any,
    notes: string,
    narration: string,
    grossAmount: number,
    cgstAmount: number,
    sgstAmount: number,
    igstAmount: number,
    roundOffAmount: number,
    totalAmount: number,
    organisationId: string,
    year: string
  ) =>
    requests.post("/salesinvoice/edit", {
      entryId,
      date,
      dueDate,
      rcmApplicable,
      invoiceNumber,
      cashOrDebtorAccountId,
      partyName,
      billingAddress,
      shippingAddress,
      gstin,
      pos,
      gstPaymentTypeInExportOrSez,
      itemDetails,
      accountDetails,
      notes,
      narration,
      grossAmount,
      cgstAmount,
      sgstAmount,
      igstAmount,
      roundOffAmount,
      totalAmount,
      organisationId,
      year,
    }),
  salesInvoicelist: (
    organisationId: string,
    year: string,
    skip: number,
    limit: number,
    download: boolean,
    sortBy: string,
    searchText: string
  ) =>
    download === false
      ? requests.get(
          `/salesinvoice/salesinvoicelist?organisationId=${organisationId}&year=${year}&skip=${skip}&limit=${limit}&sortBy=${sortBy}&download=${download}&searchText=${searchText}`
        )
      : requests.getBlob(
          `/salesinvoice/salesinvoicelist?organisationId=${organisationId}&year=${year}&skip=${skip}&limit=${limit}&sortBy=${sortBy}&download=${download}&searchText=${searchText}`,
          {
            responseType: "blob",
          }
        ),
  delete: (organisationId: string, entryIds: string[]) =>
    requests.delete(
      `/salesinvoice/delete?organisationId=${organisationId}${selectedEntryUrl(
        entryIds
      )}`
    ),
  getsingleentrydetails: (organisationId: string, entryId: string) =>
    requests.get(
      `/salesinvoice/getsingleentrydetails?organisationId=${organisationId}&entryId=${entryId}`
    ),
  getSettings: (organisationId: string) =>
    requests.get(
      `/settings/getsalesinvoicesettings?organisationId=${organisationId}`
    ),
  postSettings: (
    organisationId: string,
    showRCM: boolean,
    showDiscountColumn: boolean,
    showShippingAddress: boolean,
    printHSNorSAC: boolean,
    printUnitOfMeasurement: boolean,
    heading: string,
    printing: string,
    placeForSignature: boolean,
    showTransportDetails: boolean,
    showDueDate: boolean,
    printDueDate: boolean,
    notes: any
  ) =>
    requests.post(`/settings/salesinvoice`, {
      organisationId,
      showRCM,
      showDiscountColumn,
      showShippingAddress,
      printHSNorSAC,
      printUnitOfMeasurement,
      heading,
      printing,
      placeForSignature,
      showTransportDetails,
      showDueDate,
      printDueDate,
      notes,
    }),
  getTemplatesList: (organisationId: string) =>
    requests.get(`/salesinvoice/gettemplates?organisationId=${organisationId}`),

  getOldEntry: (organisationId: string, entryId: string, version: number) =>
    requests.get(
      `/salesinvoice/getoldentrydetails?organisationId=${organisationId}&entryId=${entryId}&version=${version}`
    ),

  getTemplateDetails: (organisationId: string, templateId: string) =>
    requests.get(
      `/salesinvoice/gettemplatedetails?organisationId=${organisationId}&templateId=${templateId}`
    ),
  saveTemplate: (
    rcmApplicable: boolean,
    cashOrDebtorAccountId: string,
    partyName: string,
    billingAddress: string,
    shippingAddress: string,
    gstin: string,
    pos: string,
    gstPaymentTypeInExportOrSez: string,
    itemDetails: any,
    accountDetails: any,
    notes: string,
    narration: string,
    grossAmount: number,
    cgstAmount: number,
    sgstAmount: number,
    igstAmount: number,
    roundOffAmount: number,
    totalAmount: number,
    organisationId: string,
    year: string,
    name: string
  ) =>
    requests.post("/salesinvoice/addtemplate", {
      rcmApplicable,
      cashOrDebtorAccountId,
      partyName,
      billingAddress,
      shippingAddress,
      gstin,
      pos,
      gstPaymentTypeInExportOrSez,
      itemDetails,
      accountDetails,
      notes,
      narration,
      grossAmount,
      cgstAmount,
      sgstAmount,
      igstAmount,
      roundOffAmount,
      totalAmount,
      organisationId,
      // year,
      name,
    }),
  editTemplate: (organisationId: string, name: string, templateId: string) =>
    requests.put("/salesinvoice/edittemplatename", {
      organisationId,
      name,
      templateId,
    }),

  deleteTemplate: (organisationId: string, templateId: string) =>
    requests.delete(
      `/salesinvoice/template?organisationId=${organisationId}&templateId=${templateId}`
    ),

  getSalesEntry: (organisationId: string, entryId: string) =>
    requests.get(
      `/salesinvoice/getoldentrylist?organisationId=${organisationId}&entryId=${entryId}`
    ),
};

const Purchases = {
  add: (
    date: string,
    dueDate: string,
    rcmApplicable: boolean,
    invoiceNumber: string,
    cashOrDebtorAccountId: string,
    partyName: string,
    billingAddress: string,
    shippingAddress: string,
    gstin: string,
    pos: string,
    itemDetails: any,
    accountDetails: any,
    narration: string,
    grossAmount: number,
    cgstAmount: number,
    sgstAmount: number,
    igstAmount: number,
    roundOffAmount: number,
    totalAmount: number,
    organisationId: string,
    year: string
  ) =>
    requests.post("/purchases/add", {
      date,
      dueDate,
      rcmApplicable,
      invoiceNumber,
      cashOrDebtorAccountId,
      partyName,
      billingAddress,
      shippingAddress,
      gstin,
      pos,
      itemDetails,
      accountDetails,
      narration,
      grossAmount,
      cgstAmount,
      sgstAmount,
      igstAmount,
      roundOffAmount,
      totalAmount,
      organisationId,
      year,
    }),
  edit: (
    entryId: string,
    date: string,
    dueDate: string,
    rcmApplicable: boolean,
    invoiceNumber: string,
    cashOrDebtorAccountId: string,
    partyName: string,
    billingAddress: string,
    shippingAddress: string,
    gstin: string,
    pos: string,
    itemDetails: any,
    accountDetails: any,
    narration: string,
    grossAmount: number,
    cgstAmount: number,
    sgstAmount: number,
    igstAmount: number,
    roundOffAmount: number,
    totalAmount: number,
    organisationId: string,
    year: string
  ) =>
    requests.post("/purchases/edit", {
      entryId,
      date,
      dueDate,
      rcmApplicable,
      invoiceNumber,
      cashOrDebtorAccountId,
      partyName,
      billingAddress,
      shippingAddress,
      gstin,
      pos,
      itemDetails,
      accountDetails,
      narration,
      grossAmount,
      cgstAmount,
      sgstAmount,
      igstAmount,
      roundOffAmount,
      totalAmount,
      organisationId,
      year,
    }),
  purchaseslist: (
    organisationId: string,
    year: string,
    skip: number,
    limit: number,
    download: boolean,
    sortBy: string,
    searchText: string
  ) =>
    download === false
      ? requests.get(
          `/purchases/purchaseslist?organisationId=${organisationId}&year=${year}&skip=${skip}&limit=${limit}&sortBy=${sortBy}&download=${download}&searchText=${searchText}`
        )
      : requests.getBlob(
          `/purchases/purchaseslist?organisationId=${organisationId}&year=${year}&skip=${skip}&limit=${limit}&sortBy=${sortBy}&download=${download}&searchText=${searchText}`,
          {
            responseType: "blob",
          }
        ),
  delete: (organisationId: string, entryIds: string[]) =>
    requests.delete(
      `/purchases/delete?organisationId=${organisationId}${selectedEntryUrl(
        entryIds
      )}`
    ),
  getsingleentrydetails: (organisationId: string, entryId: string) =>
    requests.get(
      `/purchases/getsingleentrydetails?organisationId=${organisationId}&entryId=${entryId}`
    ),
  getSettings: (organisationId: string) =>
    requests.get(
      `/settings/getpurchasessettings?organisationId=${organisationId}`
    ),
  postSettings: (
    organisationId: string,
    showDiscountColumn: boolean,
    showTransportDetails: boolean,
    showDueDate: boolean
  ) =>
    requests.post(`/settings/purchases`, {
      organisationId,
      showDiscountColumn,
      showTransportDetails,
      showDueDate,
    }),
  getTemplatesList: (organisationId: string) =>
    requests.get(`/purchases/gettemplates?organisationId=${organisationId}`),

  getOldEntry: (organisationId: string, entryId: string, version: number) =>
    requests.get(
      `/purchases/getoldentrydetails?organisationId=${organisationId}&entryId=${entryId}&version=${version}`
    ),

  getTemplateDetails: (organisationId: string, templateId: string) =>
    requests.get(
      `/purchases/gettemplatedetails?organisationId=${organisationId}&templateId=${templateId}`
    ),
  saveTemplate: (
    rcmApplicable: boolean,
    cashOrDebtorAccountId: string,
    partyName: string,
    billingAddress: string,
    shippingAddress: string,
    gstin: string,
    pos: string,
    itemDetails: any,
    accountDetails: any,
    narration: string,
    grossAmount: number,
    cgstAmount: number,
    sgstAmount: number,
    igstAmount: number,
    roundOffAmount: number,
    totalAmount: number,
    organisationId: string,
    year: string,
    name: string
  ) =>
    requests.post("/purchases/addtemplate", {
      rcmApplicable,
      cashOrDebtorAccountId,
      partyName,
      billingAddress,
      shippingAddress,
      gstin,
      pos,
      itemDetails,
      accountDetails,
      narration,
      grossAmount,
      cgstAmount,
      sgstAmount,
      igstAmount,
      roundOffAmount,
      totalAmount,
      organisationId,
      // year,
      name,
    }),
  editTemplate: (organisationId: string, name: string, templateId: string) =>
    requests.put("/purchases/edittemplatename", {
      organisationId,
      name,
      templateId,
    }),

  deleteTemplate: (organisationId: string, templateId: string) =>
    requests.delete(
      `/purchases/template?organisationId=${organisationId}&templateId=${templateId}`
    ),

  getPurchasesEntry: (organisationId: string, entryId: string) =>
    requests.get(
      `/purchases/getoldentrylist?organisationId=${organisationId}&entryId=${entryId}`
    ),
};

const CreditNote = {
  add: (
    type: string,
    date: string,
    dueDate: string,
    rcmApplicable: boolean,
    invoiceNumber: string,
    cashOrDebtorAccountId: string,
    partyName: string,
    billingAddress: string,
    shippingAddress: string,
    gstin: string,
    pos: string,
    gstPaymentTypeInExportOrSez: string,
    itemDetails: any,
    accountDetails: any,
    notes: string,
    narration: string,
    grossAmount: number,
    cgstAmount: number,
    sgstAmount: number,
    igstAmount: number,
    roundOffAmount: number,
    totalAmount: number,
    organisationId: string,
    year: string
  ) =>
    requests.post("/creditnote/add", {
      type,
      date,
      dueDate,
      rcmApplicable,
      invoiceNumber,
      cashOrDebtorAccountId,
      partyName,
      billingAddress,
      shippingAddress,
      gstin,
      pos,
      gstPaymentTypeInExportOrSez,
      itemDetails,
      accountDetails,
      notes,
      narration,
      grossAmount,
      cgstAmount,
      sgstAmount,
      igstAmount,
      roundOffAmount,
      totalAmount,
      organisationId,
      year,
    }),
  edit: (
    type: string,
    entryId: string,
    date: string,
    dueDate: string,
    rcmApplicable: boolean,
    invoiceNumber: string,
    cashOrDebtorAccountId: string,
    partyName: string,
    billingAddress: string,
    shippingAddress: string,
    gstin: string,
    pos: string,
    gstPaymentTypeInExportOrSez: string,
    itemDetails: any,
    accountDetails: any,
    notes: string,
    narration: string,
    grossAmount: number,
    cgstAmount: number,
    sgstAmount: number,
    igstAmount: number,
    roundOffAmount: number,
    totalAmount: number,
    organisationId: string,
    year: string
  ) =>
    requests.post("/creditnote/edit", {
      type,
      entryId,
      date,
      dueDate,
      rcmApplicable,
      invoiceNumber,
      cashOrDebtorAccountId,
      partyName,
      billingAddress,
      shippingAddress,
      gstin,
      pos,
      gstPaymentTypeInExportOrSez,
      itemDetails,
      accountDetails,
      notes,
      narration,
      grossAmount,
      cgstAmount,
      sgstAmount,
      igstAmount,
      roundOffAmount,
      totalAmount,
      organisationId,
      year,
    }),
  list: (
    organisationId: string,
    year: string,
    skip: number,
    limit: number,
    download: boolean,
    sortBy: string,
    searchText: string
  ) =>
    download === false
      ? requests.get(
          `/creditnote/creditnotelist?organisationId=${organisationId}&year=${year}&skip=${skip}&limit=${limit}&sortBy=${sortBy}&download=${download}&searchText=${searchText}`
        )
      : requests.getBlob(
          `/creditnote/creditnotelist?organisationId=${organisationId}&year=${year}&skip=${skip}&limit=${limit}&sortBy=${sortBy}&download=${download}&searchText=${searchText}`,
          {
            responseType: "blob",
          }
        ),
  delete: (organisationId: string, entryIds: string[]) =>
    requests.delete(
      `/creditnote/delete?organisationId=${organisationId}${selectedEntryUrl(
        entryIds
      )}`
    ),
  getsingleentrydetails: (organisationId: string, entryId: string) =>
    requests.get(
      `/creditnote/getsingleentrydetails?organisationId=${organisationId}&entryId=${entryId}`
    ),
  getSettings: (organisationId: string) =>
    requests.get(
      `/settings/getCreditNoteSettings?organisationId=${organisationId}`
    ),
  postSettings: (
    organisationId: string,
    showRCM: boolean,
    showDiscountColumn: boolean,
    showShippingAddress: boolean,
    printHSNorSAC: boolean,
    printUnitOfMeasurement: boolean,
    heading: string,
    printing: string,
    placeForSignature: boolean,
    showTransportDetails: boolean,
    showDueDate: boolean,
    printDueDate: boolean,
    notes: any
  ) =>
    requests.post(`/settings/creditnote`, {
      organisationId,
      showRCM,
      showDiscountColumn,
      showShippingAddress,
      printHSNorSAC,
      printUnitOfMeasurement,
      heading,
      printing,
      placeForSignature,
      showTransportDetails,
      showDueDate,
      printDueDate,
      notes,
    }),
  getTemplatesList: (organisationId: string) =>
    requests.get(`/creditnote/gettemplates?organisationId=${organisationId}`),

  getOldEntry: (organisationId: string, entryId: string, version: number) =>
    requests.get(
      `/creditnote/getoldentrydetails?organisationId=${organisationId}&entryId=${entryId}&version=${version}`
    ),

  getTemplateDetails: (organisationId: string, templateId: string) =>
    requests.get(
      `/creditnote/gettemplatedetails?organisationId=${organisationId}&templateId=${templateId}`
    ),
  saveTemplate: (
    type: string,
    rcmApplicable: boolean,
    cashOrDebtorAccountId: string,
    partyName: string,
    billingAddress: string,
    shippingAddress: string,
    gstin: string,
    pos: string,
    gstPaymentTypeInExportOrSez: string,
    itemDetails: any,
    accountDetails: any,
    notes: string,
    narration: string,
    grossAmount: number,
    cgstAmount: number,
    sgstAmount: number,
    igstAmount: number,
    roundOffAmount: number,
    totalAmount: number,
    organisationId: string,
    year: string,
    name: string
  ) =>
    requests.post("/creditnote/addtemplate", {
      type,
      rcmApplicable,
      cashOrDebtorAccountId,
      partyName,
      billingAddress,
      shippingAddress,
      gstin,
      pos,
      gstPaymentTypeInExportOrSez,
      itemDetails,
      accountDetails,
      notes,
      narration,
      grossAmount,
      cgstAmount,
      sgstAmount,
      igstAmount,
      roundOffAmount,
      totalAmount,
      organisationId,
      // year,
      name,
    }),
  editTemplate: (organisationId: string, name: string, templateId: string) =>
    requests.put("/creditnote/edittemplatename", {
      organisationId,
      name,
      templateId,
    }),

  deleteTemplate: (organisationId: string, templateId: string) =>
    requests.delete(
      `/creditnote/template?organisationId=${organisationId}&templateId=${templateId}`
    ),

  getOldEntryList: (organisationId: string, entryId: string) =>
    requests.get(
      `/creditnote/getoldentrylist?organisationId=${organisationId}&entryId=${entryId}`
    ),
};

const DebitNote = {
  add: (
    type: string,
    date: string,
    dueDate: string,
    rcmApplicable: boolean,
    invoiceNumber: string,
    cashOrDebtorAccountId: string,
    partyName: string,
    billingAddress: string,
    shippingAddress: string,
    gstin: string,
    pos: string,
    gstPaymentTypeInExportOrSez: string,
    itemDetails: any,
    accountDetails: any,
    notes: string,
    narration: string,
    grossAmount: number,
    cgstAmount: number,
    sgstAmount: number,
    igstAmount: number,
    roundOffAmount: number,
    totalAmount: number,
    organisationId: string,
    year: string
  ) =>
    requests.post("/debitnote/add", {
      type,
      date,
      dueDate,
      rcmApplicable,
      invoiceNumber,
      cashOrDebtorAccountId,
      partyName,
      billingAddress,
      shippingAddress,
      gstin,
      pos,
      gstPaymentTypeInExportOrSez,
      itemDetails,
      accountDetails,
      notes,
      narration,
      grossAmount,
      cgstAmount,
      sgstAmount,
      igstAmount,
      roundOffAmount,
      totalAmount,
      organisationId,
      year,
    }),
  edit: (
    type: string,
    entryId: string,
    date: string,
    dueDate: string,
    rcmApplicable: boolean,
    invoiceNumber: string,
    cashOrDebtorAccountId: string,
    partyName: string,
    billingAddress: string,
    shippingAddress: string,
    gstin: string,
    pos: string,
    gstPaymentTypeInExportOrSez: string,
    itemDetails: any,
    accountDetails: any,
    notes: string,
    narration: string,
    grossAmount: number,
    cgstAmount: number,
    sgstAmount: number,
    igstAmount: number,
    roundOffAmount: number,
    totalAmount: number,
    organisationId: string,
    year: string
  ) =>
    requests.post("/debitnote/edit", {
      type,
      entryId,
      date,
      dueDate,
      rcmApplicable,
      invoiceNumber,
      cashOrDebtorAccountId,
      partyName,
      billingAddress,
      shippingAddress,
      gstin,
      pos,
      gstPaymentTypeInExportOrSez,
      itemDetails,
      accountDetails,
      notes,
      narration,
      grossAmount,
      cgstAmount,
      sgstAmount,
      igstAmount,
      roundOffAmount,
      totalAmount,
      organisationId,
      year,
    }),
  list: (
    organisationId: string,
    year: string,
    skip: number,
    limit: number,
    download: boolean,
    sortBy: string,
    searchText: string
  ) =>
    download === false
      ? requests.get(
          `/debitnote/debitnotelist?organisationId=${organisationId}&year=${year}&skip=${skip}&limit=${limit}&sortBy=${sortBy}&download=${download}&searchText=${searchText}`
        )
      : requests.getBlob(
          `/debitnote/debitnotelist?organisationId=${organisationId}&year=${year}&skip=${skip}&limit=${limit}&sortBy=${sortBy}&download=${download}&searchText=${searchText}`,
          {
            responseType: "blob",
          }
        ),
  delete: (organisationId: string, entryIds: string[]) =>
    requests.delete(
      `/debitnote/delete?organisationId=${organisationId}${selectedEntryUrl(
        entryIds
      )}`
    ),
  getsingleentrydetails: (organisationId: string, entryId: string) =>
    requests.get(
      `/debitnote/getsingleentrydetails?organisationId=${organisationId}&entryId=${entryId}`
    ),
  getSettings: (organisationId: string) =>
    requests.get(
      `/settings/getdebitnotesettings?organisationId=${organisationId}`
    ),
  postSettings: (
    organisationId: string,
    showRCM: boolean,
    showDiscountColumn: boolean,
    showShippingAddress: boolean,
    printHSNorSAC: boolean,
    printUnitOfMeasurement: boolean,
    heading: string,
    printing: string,
    placeForSignature: boolean,
    showTransportDetails: boolean,
    showDueDate: boolean,
    printDueDate: boolean,
    notes: any
  ) =>
    requests.post(`/settings/debitnote`, {
      organisationId,
      showRCM,
      showDiscountColumn,
      showShippingAddress,
      printHSNorSAC,
      printUnitOfMeasurement,
      heading,
      printing,
      placeForSignature,
      showTransportDetails,
      showDueDate,
      printDueDate,
      notes,
    }),
  getTemplatesList: (organisationId: string) =>
    requests.get(`/debitnote/gettemplates?organisationId=${organisationId}`),

  getOldEntry: (organisationId: string, entryId: string, version: number) =>
    requests.get(
      `/debitnote/getoldentrydetails?organisationId=${organisationId}&entryId=${entryId}&version=${version}`
    ),

  getTemplateDetails: (organisationId: string, templateId: string) =>
    requests.get(
      `/debitnote/gettemplatedetails?organisationId=${organisationId}&templateId=${templateId}`
    ),
  saveTemplate: (
    type: string,
    rcmApplicable: boolean,
    cashOrDebtorAccountId: string,
    partyName: string,
    billingAddress: string,
    shippingAddress: string,
    gstin: string,
    pos: string,
    gstPaymentTypeInExportOrSez: string,
    itemDetails: any,
    accountDetails: any,
    notes: string,
    narration: string,
    grossAmount: number,
    cgstAmount: number,
    sgstAmount: number,
    igstAmount: number,
    roundOffAmount: number,
    totalAmount: number,
    organisationId: string,
    year: string,
    name: string
  ) =>
    requests.post("/debitnote/addtemplate", {
      type,
      rcmApplicable,
      cashOrDebtorAccountId,
      partyName,
      billingAddress,
      shippingAddress,
      gstin,
      pos,
      gstPaymentTypeInExportOrSez,
      itemDetails,
      accountDetails,
      notes,
      narration,
      grossAmount,
      cgstAmount,
      sgstAmount,
      igstAmount,
      roundOffAmount,
      totalAmount,
      organisationId,
      // year,
      name,
    }),
  editTemplate: (organisationId: string, name: string, templateId: string) =>
    requests.put("/debitnote/edittemplatename", {
      organisationId,
      name,
      templateId,
    }),

  deleteTemplate: (organisationId: string, templateId: string) =>
    requests.delete(
      `/debitnote/template?organisationId=${organisationId}&templateId=${templateId}`
    ),

  getOldEntryList: (organisationId: string, entryId: string) =>
    requests.get(
      `/debitnote/getoldentrylist?organisationId=${organisationId}&entryId=${entryId}`
    ),
};

const Dashboard = {
  getTransactions: (organisationId: string, year: string) =>
    requests.get(
      `/reports/lasttentransactions?organisationId=${organisationId}&year=${year}`
    ),
};

const Returns = {
  getGstr3B: (
    organisationId: string,
    year: string,
    startDate: string,
    endDate: string
  ) =>
    requests.get(
      `/gstr3b/gstr3B?organisationId=${organisationId}&year=${year}&startDate=${startDate}&endDate=${endDate}`
    ),
  getIffTranactions: (
    organisationId: string,
    year: string,
    skip: number,
    limit: number,
    startDate: string,
    endDate: string,
    type: string
  ) =>
    requests.get(
      `/iff/ifftransactions?limit=${limit}&skip=${skip}&organisationId=${organisationId}&year=${year}&startDate=${startDate}&endDate=${endDate}&type=${type}`
    ),
  getIffCount: (
    organisationId: string,
    year: string,
    startDate: string,
    endDate: string
  ) =>
    requests.get(
      `/iff/iffCount?organisationId=${organisationId}&year=${year}&startDate=${startDate}&endDate=${endDate}`
    ),
  getIffJson: (organisationId: string, startDate: string, endDate: string) =>
    requests.get(
      `/iff/iffJson?organisationId=${organisationId}&startDate=${startDate}&endDate=${endDate}`
    ),
  getGstr1OtherThanB2B: (
    organisationId: string,
    year: string,
    skip: number,
    limit: number,
    startDate: string,
    endDate: string,
    type: string
  ) =>
    requests.get(
      `/gstr1/gstr1OtherThanB2B?limit=${limit}&skip=${skip}&organisationId=${organisationId}&year=${year}&startDate=${startDate}&endDate=${endDate}&type=${type}`
    ),
};

const Support = {
  getSupport: (organisationId: string, pageLink: string) =>
    requests.get(
      `/support/supportlinks?organisationId=${organisationId}&pageLink=${pageLink}`
    ),
};

const Misc = {
  editClosingStock: (organisationId: string, accountId: string, data: any) =>
    requests.post(`/misc/editclosingstock`, {
      organisationId,
      accountId,
      data,
    }),
  getClosingStock: (organisationId: string, accountId: string) =>
    requests.get(
      `misc/getmanualclosingstock?organisationId=${organisationId}&accountId=${accountId}`
    ),
  lastInvoiceNumber: (organisationId: string, year: string) =>
    requests.get(
      `misc/lastInvoiceNumber?organisationId=${organisationId}&year=${year}`
    ),
};

let agent = {
  setToken: (_token: string | undefined) => (token = _token),
  Agency,
  Auth,
  Organisation,
  Account,
  Item,
  User,
  Gst,
  JournalEntry,
  Logs,
  ReceiptEntry,
  PaymentEntry,
  FundTransfer,
  Ledger,
  BalanceSheet,
  Sales,
  Purchases,
  CreditNote,
  DebitNote,
  ProfitOrLoss,
  Dashboard,
  Search,
  Returns,
  Support,
  Misc,
  PDF,
};

export default agent;
