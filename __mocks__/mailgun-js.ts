export const send = jest.fn()
  // Simulate an error while sending an email twice
  // .mockImplementationOnce((mailData: any, callback) => callback(new Error()))
  .mockImplementationOnce((mailData: any, callback) => callback(new Error()))
  // Simulate a successfully sent mail
  .mockImplementation((mailData: any, callback) => callback(null));

const mailgun = () => {
  return {
    messages: () => {
      return {
        send,
      }
    },
  }
};

export default mailgun;
