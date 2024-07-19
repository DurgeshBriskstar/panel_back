const userFormValidations = (formData = {}) => {
  let errors = {};

  // if (!formData?.firstName) {
  //   errors.firstName = "Title field is required!"
  // }

  return errors;
};

const webFormValidations = (formData = {}) => {
  let errors = {};

  // if (!formData?.firstName) {
  //   errors.firstName = "Title field is required!"
  // }

  return errors;
};

const categoryFormValidations = (formData = {}) => {
  let errors = {};

  if (!formData?.title) {
    errors.title = "Title field is required!"
  }

  return errors;
};

const blogFormValidations = (formData = {}) => {
  let errors = {};

  if (!formData?.title) {
    errors.title = "Title field is required!"
  }

  return errors;
};

const sliderFormValidations = (formData = {}) => {
  let errors = {};

  if (!formData?.title) {
    errors.title = "Title field is required!"
  }

  return errors;
};

const graphicFormValidations = (formData = {}) => {
  let errors = {};

  if (!formData?.title) {
    errors.title = "Title field is required!"
  }

  return errors;
};


module.exports = {
  userFormValidations,
  webFormValidations,
  categoryFormValidations,
  blogFormValidations,
  sliderFormValidations,
  graphicFormValidations,
};