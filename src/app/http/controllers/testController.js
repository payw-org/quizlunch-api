

exports.index = (req, res) => {
    
  models.query('SELECT * from status', function(err,  rows, fields) {
    if (!err)
    {
      console.log('The solution is: ', rows);
      res.json(rows)
    }
    else
      console.log('Error while performing Query.', err);
  });
    

  };