const createUser = async (req, res) => {
  try {
    //#1. Lấy ra dữ liệu & validation
    const { email, password, confirmPassword } = req.body;
    const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const isCheckEmail = regexEmail.test(email);
    if (!email || !password || !confirmPassword) {
      return res.status(200).json({
        status: "Error",
        message: "The input is required",
      });
    } else if (!isCheckEmail) {
      return res.status(200).json({
        status: "Error",
        message: "The email is required ....@gmail.com",
      });
    } else if (password !== confirmPassword) {
      return res.status(200).json({
        status: "Error",
        message: "Password don't match!",
      });
    }
    //#2 truyền qua service xử lý logic
    const data = await UserService.createUser(req.body);
    return res.status(200).json({
      message: data,
    });
  } catch (error) {
    return res.status(404).json({
      message: error,
    });
  }
};

module.exports = {
  createUser,
};
