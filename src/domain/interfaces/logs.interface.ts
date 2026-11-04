export const LogActions = {
  user: {
    create: "CREATE_USER",
    update: "UPDATE_USER",
    delete: "DELETE_USER",
    changePassword: "CHANGE_USER_PASSWORD",
    resetPassword: "RESET_USER_PASSWORD",
    updateSignature: "UPDATE_USER_SIGNATURE",
  },

  delegation: {
    create: "CREATE_DELEGATION",
    update: "UPDATE_DELEGATION",
    delete: "DELETE_DELEGATION",
  },

  guard: {
    create: "CREATE_GUARD",
    update: "UPDATE_GUARD",
    delete: "DELETE_GUARD",
  },

  shift: {
    create: "CREATE_SHIFT",
    update: "UPDATE_SHIFT",
    delete: "DELETE_SHIFT",
  },

  ambulance: {
    create: "CREATE_AMBULANCE",
    update: "UPDATE_AMBULANCE",
    delete: "DELETE_AMBULANCE",

    supply: {
      add: "ADD_AMBULANCE_SUPPLY",
      update: "UPDATE_AMBULANCE_SUPPLY",
      remove: "REMOVE_AMBULANCE_SUPPLY",
    },
  },

  supply: {
    create: "CREATE_SUPPLY",
    update: "UPDATE_SUPPLY",
    delete: "DELETE_SUPPLY",
  },

  checklist: {
    ambulance: {
      create: "CREATE_AMBULANCE_CHECKLIST",
      saveAnswers: "SAVE_AMBULANCE_CHECKLIST_ANSWERS",
      sign: "SIGN_AMBULANCE_CHECKLIST",
      delete: "DELETE_AMBULANCE_CHECKLIST",
    },

    supply: {
      create: "CREATE_SUPPLY_CHECKLIST",
      saveAnswers: "SAVE_SUPPLY_CHECKLIST_ANSWERS",
      sign: "SIGN_SUPPLY_CHECKLIST",
      delete: "DELETE_SUPPLY_CHECKLIST",
    },
  },

  supplyReport: {
    create: "CREATE_SUPPLY_REPORT",
    updateItems: "UPDATE_SUPPLY_REPORT_ITEMS",
    attend: "ATTEND_SUPPLY_REPORT",
  },

  questions: {
    category: {
      create: "CREATE_QUESTION_CATEGORY",
      update: "UPDATE_QUESTION_CATEGORY",
      delete: "DELETE_QUESTION_CATEGORY",
    },

    subcategory: {
      create: "CREATE_QUESTION_SUBCATEGORY",
      update: "UPDATE_QUESTION_SUBCATEGORY",
      delete: "DELETE_QUESTION_SUBCATEGORY",
    },

    question: {
      create: "CREATE_QUESTION",
      update: "UPDATE_QUESTION",
      delete: "DELETE_QUESTION",
    },
  },
} as const;

export const LogEntities = {
  user: "USER",

  delegation: "DELEGATION",

  guard: "GUARD",

  shift: "SHIFT",

  ambulance: "AMBULANCE",
  ambulanceSupply: "AMBULANCE_SUPPLY",

  supply: "SUPPLY",

  ambulanceChecklist: "AMBULANCE_CHECKLIST",
  supplyChecklist: "SUPPLY_CHECKLIST",

  supplyReport: "SUPPLY_REPORT",

  questionCategory: "QUESTION_CATEGORY",
  questionSubcategory: "QUESTION_SUBCATEGORY",
  question: "QUESTION",
} as const;
