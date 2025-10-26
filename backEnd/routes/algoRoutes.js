router.post("/", async (req, res) => {
  try {
    const algo = await Algorithm.create(req.body);
    res.status(201).json(algo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
