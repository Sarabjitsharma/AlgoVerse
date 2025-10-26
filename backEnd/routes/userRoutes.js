router.get("/:clerkId", async (req, res) => {
  const user = await User.findOne({ clerkId: req.params.clerkId });
  res.json(user);
});
