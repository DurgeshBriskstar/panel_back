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


module.exports = {
  categoryFormValidations,
  blogFormValidations
};