import joi from '@hapi/joi';
// import validationData from './validationData';

// const { states, paystackBankNamesAndCodes } = validationData;

const GeneralValidation = {
  /**
   * validate general parameters
   * @param {object} payload - user object
   * @returns {object | boolean} - returns a boolean or an error object
   * @memberof GeneralValidation
   */
  validateParameters(payload) {
    // const bankNames = paystackBankNamesAndCodes.map((item) => item.bankName);
    const schema = {
      email: joi.string().regex(/^[a-zA-Z0-9_.+-]{5,}@(ng|gcn)\.ab-inbev\.com$/)
        .label('Please enter a valid ABI email address'),
      approvalStatus: joi.string().valid('pending', 'approved', 'rejected').label('parameter must be approved/rejected'),
      id: joi.number().positive()
        .label('id parameter must be a positive number'),
      userId: joi.number().positive()
        .label('id parameter must be a positive number'),
      roomId: joi.number().positive()
        .label('id parameter must be a positive number'),
      name: joi.string().min(3).max(30)
        .label('Please enter a valid name \n the field must not be empty and it must be more than 2 letters'),
      plantName: joi.string().min(4).max(25)
        .label('Please enter a valid plant location name'),
      description: joi.string().min(4).max(1005)
        .label('please add a valid plant location description'),
      location: joi.string().min(4).max(1005)
        .label('please add a valid location address'),
      // name: joi.string().label('Please enter a valid room name'),
      roomNumber: joi.number().positive().label('Please provide a valid room number'),
      capacity: joi.number().positive().label('Please provide a valid room capacity'),
      price: joi.number().positive().label('Please provide a valid room price'),
      // description: joi.string().min(10).label('Please provide a valid room description'),
      size: joi.string().label('Please provide a valid room size'),
      roomType: joi.string().valid('flat', 'vip', 'driver cabin', 'single').label('Please provide a valid room room type'),
      plantLocationId: joi.number().positive().label('Please provide a valid plant location'),
      properties: joi.array().label('Please provide a valid room properties'),
    };
    const { error } = joi.validate({ ...payload }, schema);
    if (error) throw error.details[0].context.label;
    return true;
  },

  /**
   * validate order
   * @param {object} payload - user object
   * @returns {object | boolean} - returns a boolean or an error object
   * @memberof GeneralValidation
   */
  vaildatePlantLocation(payload) {
    const schema = {
      plantName: joi.string().min(4).max(25).required()
        .label('Please enter a valid plant location name'),
      description: joi.string().min(4).max(1005)
        .label('please add a valid plant location description'),
      location: joi.string().min(4).max(1005)
        .label('please add a valid location address'),
      properties: joi.array().required().label('Please provide a valid room properties'),
    };
    const { error } = joi.validate({ ...payload }, schema);
    if (error) throw error.details[0].context.label;
    return true;
  },

  /**
   * validate room properties
   * @param {object} payload - user object
   * @returns {object | boolean} - returns a boolean or an error object
   * @memberof GeneralValidation
   */
  vaildateRoomProperties(payload) {
    const schema = {
      name: joi.string().min(4).max(25).required()
        .label('Please enter a valid plant location name'),
      description: joi.string().min(4).max(1005)
        .label('please add a valid plant location description'),
    };
    const { error } = joi.validate({ ...payload }, schema);
    if (error) throw error.details[0].context.label;
    return true;
  },

  /**
   * validate order
   * @param {object} payload - user object
   * @returns {object | boolean} - returns a boolean or an error object
   * @memberof GeneralValidation
   */
  validateBooking(payload) {
    const schema = {
      checkIn: joi.date().required().label('Please input a valid check in date format: yy-mm-dd'),
      checkOut: joi.date().required().label('Please input a valid check out date format: yy-mm-dd'),
      bookingReciept: joi.string().label('Please input a valid booking reciept for payment made'),
      purposeOfVisit: joi.string().label('Please input a valid purpose of visit'),
      description: joi.string().label('Please input a valid booking description'),
      jobRole: joi.string().label('Please input a valid job role'),
    };
    const { error } = joi.validate({ ...payload }, schema);
    if (error) throw error.details[0].context.label;
    return true;
  },

  /**
   * validate room
   * @param {object} payload - user object
   * @returns {object | boolean} - returns a boolean or an error object
   * @memberof GeneralValidation
   */
  validateRoom(payload) {
    const schema = {
      name: joi.string().label('Please enter a valid room name'),
      roomNumber: joi.number().positive().required()
        .label('Please provide a valid room number'),
      capacity: joi.number().positive().label('Please provide a valid room capacity'),
      price: joi.number().positive().label('Please provide a valid room price'),
      description: joi.string().min(10).label('Please provide a valid room description'),
      size: joi.string().label('Please provide a valid room size'),
      roomType: joi.string().valid('flat', 'vip', 'driver cabin', 'single').label('Please provide a valid room room type'),
      plantLocationId: joi.number().positive().required().label('Please provide a valid plant location'),
      properties: joi.array().label('Please provide a valid room properties'),
    };
    const { error } = joi.validate({ ...payload }, schema);
    if (error) throw error.details[0].context.label;
    return true;
  },

  /**
   * validate required email
   * @param {object} payload - user object
   * @returns {object | boolean} - returns a boolean or an error object
   * @memberof GeneralValidation
   */
  validateEmail(payload) {
    const schema = {
      email: joi.string().regex(/^[a-zA-Z0-9_.+-]{5,}@(ng|gcn)\.ab-inbev\.com$/).required()
        .label('Please enter a valid ABI email address'),
    };
    const { error } = joi.validate({ ...payload }, schema);
    if (error) throw error.details[0].context.label;
    return true;
  },

  /**
   * validate required id
   * @param {object} payload - user object
   * @returns {object | boolean} - returns a boolean or an error object
   * @memberof GeneralValidation
   */
  validateId(payload) {
    const schema = {
      id: joi.number().positive().required()
        .label('Please enter a positive number for id parameter'),
    };
    const { error } = joi.validate({ ...payload }, schema);
    if (error) throw error.details[0].context.label;
    return true;
  },

  /**
   * validate images
   * @param {object} payload - user object
   * @returns {object | boolean} - returns a boolean or an error object
   * @memberof GeneralValidation
   */
  validateImages(payload) {
    const schema = {
      file: joi.object({ files: joi.array().single() }).label('Please upload more than 1 image')
    };
    const { error } = joi.validate({ ...payload }, schema);
    if (error) throw error.details[0].context.label;
    return true;
  },

  /**
   * validate user profile data
   * @param {object} payload - user object
   * @returns {object | boolean} - returns an error object or valid boolean
   */
  validateProfile(payload) {
    const schema = {
      vendorId: joi.string().label('Please enter a valid vendor id'),
      name: joi.string().min(3).max(25)
        .label('Please enter a valid firstname \n the field must not be empty and it must be more than 2 letters'),
      gender: joi.string().valid('male', 'female')
        .label('please input a gender (male or female)'),
      birthDate: joi.date().iso().label('Please input a valid date format: yy-mm-dd'),
      // eslint-disable-next-line no-useless-escape
      phoneNumber1: joi.string().regex(/^[0-9+\(\)#\.\s\/ext-]+$/).label('Please input a valid phone number 1'),
      phoneNumber2: joi.string().regex(/^[0-9+\(\)#\.\s\/ext-]+$/).label('Please input a valid phone number 2'),
      email: joi.string().email().label('Please enter a valid email address'),
      companyName: joi.string().min(3).max(50)
        .label('company name has a limit of 50 characters'),
      approvalStatus: joi.string().valid('pending', 'approved', 'rejected').label('parameter must be approved/rejected'),
      discount: joi.number().label('Please add the product discount'),
      companyAddress: joi.string().min(3).max(120)
        .label('company address has a limit of 120 characters'),
      companyDescription: joi.string().min(3).max(500)
        .label('company description has a limit of 300 characters'),
      profileImage: joi.string().uri().label('Please profile Image must be in form of an image URL'),
      companyLogo: joi.string().uri().label('Please company logo  must be in form of an image URL'),
      portfolioUrl: joi.string().label('Please portfolio Url must be in form of a URL'),
      website: joi.string().label('Please website  must be in form of a URL'),
      companyBanner: joi.string().uri().label('Please company banner must be in form of an image URL'),
      companyUrl: joi.string().uri().label('Please company url must be in form of a URL'),
      companyEmail: joi.string().email()
        .label('Please enter a valid company email address'),
      companyTheme: joi.string().regex(/^#[A-Fa-f0-9]{6}$/).label('colour nust be a Hex in format #ffffff'),
      mediaPictures: joi.array().items(joi.string().uri())
        .label('Please upload urls of media images in the right format'),
      companyLocation: joi.string().min(2).max(12)
        .label('Please enter a valid company location'),
      locations: joi.array().items(joi.string())
        .label('Please input a company Location'),
      file: joi.any()
        .label('Please upload an image'),
      // eslint-disable-next-line no-useless-escape
      companyPhoneNumber: joi.string().regex(/^[0-9+\(\)#\.\s\/ext-]+$/).label('Please input a valid phone number'),
    };
    const { error } = joi.validate({ ...payload }, schema);
    if (error) throw error.details[0].context.label;
    return true;
  },

};

export default GeneralValidation;
