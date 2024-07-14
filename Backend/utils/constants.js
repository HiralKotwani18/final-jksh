module.exports = {
    database: {
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    },
    user: {
      roles: ["Admin", "User", "Librarian"],
    },
    roles: {
      admin: "Admin",
      user: "User",
      librarian: "Librarian"
    }  
}