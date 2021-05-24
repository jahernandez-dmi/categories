const createReplyMock = () => {
  const send = jest.fn(data => ({ statusCode: 200, body: data }));
  const code = jest.fn().mockReturnValue({ send });

  return {
    callNotFound: jest.fn(),
    send,
    setCookie: jest.fn().mockReturnValue({ code }),
    clearCookie: jest.fn().mockReturnValue({ code }),
    code
  };
};

const Error400 = {
  statusCode: 400,
  body: { statusCode: 400 }
};

const Error404 = {
  statusCode: 404,
  body: { statusCode: 404 }
};
const Error500 = {
  statusCode: 500,
  body: { statusCode: 500 }
};

module.exports = {
  createReplyMock,
  Error400,
  Error404,
  Error500
};
