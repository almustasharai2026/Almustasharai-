module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const personas = [
    {
      id: 'lawyer',
      name: 'محامي قانوني',
      description: 'متخصص في القانون المدني والجنائي',
      icon: '⚖️'
    },
    {
      id: 'hrexpert',
      name: 'خبير الموارد البشرية',
      description: 'متخصص في قانون العمل والموارد البشرية',
      icon: '👥'
    },
    {
      id: 'taxexpert',
      name: 'خبير الضرائب',
      description: 'متخصص في القانون الضريبي',
      icon: '💰'
    }
  ];

  res.status(200).json({
    success: true,
    personas
  });
};
