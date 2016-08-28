const express = require('express');
const app = express();

app.get('/:name', (req, res, next) => {

  const options = {
    root: __dirname + '/public/'
  };

  const fileName = req.params.name;
  res.sendFile(fileName, options, (err) => {
    if (err) {
      console.log(err);
      res.status(err.status).end();
    }
    else {
      console.log('Sent:', fileName);
    }
  });

});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
