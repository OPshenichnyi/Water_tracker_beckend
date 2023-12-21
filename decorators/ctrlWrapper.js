// Функція обгортка приймає в себе функцію та обгортає її в try catch
// якщо не виникло помилок то код відпрацює в try
// Якщо виникнуть помилки то викличеться next в catch

const ctrlWrapper = (ctrl) => {
  const func = async (req, res, next) => {
    try {
      await ctrl(req, res, next);
    } catch (error) {
      next(error);
    }
  };
  return func;
};

export default ctrlWrapper;
