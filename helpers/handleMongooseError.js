export const handleMongooseError = (error, data, next) => {
  const { name, code } = error;
  const status = name === "MongoServerError" && code === 110 ? 409 : 400;
  error.status = status;
  next();
};
