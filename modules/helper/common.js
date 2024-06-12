const currentTime = () => moment().tz('Asia/Kolkata').format();

const generateRandomUid = () => {
  return (
    "xx-xxx-4xxx-yxxx-xxxxx".replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0,
        v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    })
  );
}

const convertToSlug = async (title, modal, editId = null) => {
  let baseSlug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();

  let slug = baseSlug;
  let counter = 1;

  if (editId) {
    const document = await modal.find({ _id: editId });
    if (document?.length && document[0]?.title === title) {
      return slug;
    }
  }

  while (true) {
    let exist = await modal.countDocuments({ slug });
    if (!exist) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
};

const sendResponse = (res = null, status = true, code = null, data = null, message = null) => {
  let response = {
    status: status,
    code: code,
    data: data,
    message: message,
  }

  return res.status(code).send(response);
}

module.exports = {
  currentTime,
  generateRandomUid,
  convertToSlug,
  sendResponse
};