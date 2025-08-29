const clearCookie = (res, name, options = {}) => {
  const defaultOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    ...options,
  };

  // Set the cookie with empty value and expired date
  res.cookie(name, "", { ...defaultOptions, maxAge: 0 });
};

export { clearCookie };